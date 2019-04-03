#!/usr/bin/env node
console.time('execution');

const meow = require('meow');
require('dotenv').config();

const cli = meow(
	`
	Usage
	  $ download.js

	Options
	  --purge, -p  Purge all downloads.
	  --all, -p Download all videos at once.

	Examples
	  $ node cli/downloads.js --purge --all
`,
	{
		flags: {
			purge: {
				type: 'boolean',
				alias: 'p'
			},
			all: {
				type: 'boolean',
				alias: 'a'
			}
		}
	}
);

const YouTube = require('simple-youtube-api');

const API = new YouTube(process.env.API_KEY);

const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGO_DSN, {
	useNewUrlParser: true
});

const helpers = require('./helpers');

const titles = [];
const episodes = [];

const downloadVideos = async () => {
	await client.connect();
	const db = client.db(process.env.MONGO_DBNAME);

	if (cli.flags.purge) {
		console.warn('Purging DB...');
		await db.collection('videos').deleteMany({});
	}

	let lastVideo = null;
	let publishedBefore = null;
	let results = false;
	let options = {};
	do {
		lastVideo = await db // eslint-disable-line no-await-in-loop
			.collection('videos')
			.findOne({}, { sort: { $natural: -1 } });
		if (lastVideo !== null) {
			publishedBefore = lastVideo.publishedAt;
			publishedBefore.setSeconds(publishedBefore.getSeconds() - 1);
			publishedBefore = publishedBefore.toISOString();
		}

		options = {
			channelId: 'UCzQUP1qoWDoEbmsQxvdjxgQ',
			order: 'date',
			publishedBefore
		};

		/* eslint-disable no-await-in-loop */
		results = await API.search(null, 10, options);
		for (const video of results) {
			// Skip on last item
			if (video.title === undefined) {
				results = false;
				continue;
			}

			// Skip other than JRE podcasts
			const title = helpers.parseTitle(video.title);
			if (title === false) {
				continue;
			}

			// Skip duplicates
			const id = helpers.getId(title.original);
			if (
				episodes.indexOf(title.episode) > -1 ||
				titles.indexOf(id) > -1
			) {
				continue;
			}
			titles.push(title.original);
			episodes.push(title.episode);

			const { raw } = await API.getVideoByID(video.id, {
				part: 'statistics'
			});
			video.statistics = {
				viewCount: parseInt(raw.statistics.viewCount, 10),
				likeCount: parseInt(raw.statistics.likeCount, 10),
				dislikeCount: parseInt(raw.statistics.dislikeCount, 10),
				favoriteCount: parseInt(raw.statistics.favoriteCount, 10),
				commentCount: parseInt(raw.statistics.commentCount, 10)
			};

			video.title = title;
			await db.collection('videos').insertOne(video);
			console.log(video.title.original);
		}
	} while (results && cli.flags.all);

	client.close();
};

downloadVideos()
	.catch(error => console.error(error))
	.finally(() => {
		console.timeEnd('execution');
		console.log('Videos: ' + titles.length);
		process.exit(22);
	});

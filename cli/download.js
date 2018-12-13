require('dotenv').config();

const YouTube = require('simple-youtube-api');

const API = new YouTube(process.env.API_KEY);

const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGO_DSN, {
	useNewUrlParser: true
});

const helpers = require('./helpers');

const titles = [];
const episodes = [];

const syncData = async () => {
	console.time('execution');
	await client.connect();
	const db = client.db(process.env.MONGO_DBNAME);
	await db.collection('videos').deleteMany({});

	let results = false;
	let publishedBefore = null;
	let options = {};
	do {
		try {
			options = {
				channelId: 'UCzQUP1qoWDoEbmsQxvdjxgQ',
				order: 'date',
				publishedBefore
			};
			/* eslint-disable no-await-in-loop */
			results = await API.search(null, 100, options);
		} catch (error) {
			console.error(error);
			return;
		}
		await Promise.all(
			results.map(async video => {
				// Skip on last item
				if (video.title === undefined) {
					results = false;
					return;
				}

				publishedBefore = video.publishedAt;
				publishedBefore.setSeconds(publishedBefore.getSeconds() - 1);
				publishedBefore = publishedBefore.toISOString();

				// Skip other than JRE podcasts
				const title = helpers.parseTitle(video.title);
				if (title === false) {
					return;
				}

				// Skip duplicates
				const id = helpers.getId(title.original);
				if (
					episodes.indexOf(title.episode) > -1 ||
					titles.indexOf(id) > -1
				) {
					return;
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
				console.log('---');
			})
		);
	} while (results);

	client.close();
	console.timeEnd('execution');
};

syncData();

require('dotenv').config();

const YouTube = require('simple-youtube-api');

const API = new YouTube(process.env.API_KEY);

const {MongoClient} = require('mongodb');

const client = new MongoClient(process.env.MONGO_DSN, {useNewUrlParser: true});

const helpers = require('./helpers');

const syncData = async () => {
	console.time('execution');
	await client.connect();
	const db = client.db(process.env.MONGO_DBNAME);
	db.collection('videos').deleteMany({});

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
		results.forEach(video => {
			if (video.title === undefined) {
				results = false;
			} else {
				const title = helpers.parseTitle(video.title);
				if (title === false) {
					return;
				}
				video.title = title;
				db.collection('videos').insertOne(video);
				console.log(video.title);
				console.log(video.publishedAt);
				console.log('---');
				publishedBefore = video.publishedAt;
				publishedBefore.setSeconds(publishedBefore.getSeconds() - 1);
				publishedBefore = publishedBefore.toISOString();
			}
		});
	} while (results);

	client.close();
	console.timeEnd('execution');
};

syncData();

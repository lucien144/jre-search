console.time('execution');
require('dotenv').config();

const {MongoClient} = require('mongodb');

const client = new MongoClient(process.env.MONGO_DSN, {useNewUrlParser: true});

const helpers = require('./helpers');

const keywords = {};
const hosts = {};
const tags = {};
const titles = [];

(async () => {
	await client.connect();
	const db = client.db(process.env.MONGO_DBNAME);
	const videos = db.collection('videos').find({});
	try {
		// eslint-disable-next-line no-await-in-loop
		while (await videos.hasNext()) {
			// eslint-disable-next-line no-await-in-loop
			const video = await videos.next();

			// 👉 Some episodes are doubled in the list of videos, therefore we need to filter them out.
			if (video.title && titles.filter(val => val.episode === video.title.episode).length === 0) {
				titles.push(video.title.original);
				helpers.parseVideo(video, hosts, keywords, tags);
			}
		}

		// Mongo: Save all dictionaries to collections
		const collections = {hosts, tags, keywords};
		for (const collection in collections) {
			if (!Object.prototype.hasOwnProperty.call(collections, collection)) {
				continue;
			}
			db.collection(collection).deleteMany({});

			for (const id in collections[collection]) {
				if (!Object.prototype.hasOwnProperty.call(collections[collection], id)) {
					continue;
				}
				const host = collections[collection][id];
				db.collection(collection).insertOne(host);
			}
		}
	} finally {
		client.close();
	}
})().catch(err => console.error(err));

console.timeEnd('execution');

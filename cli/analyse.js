console.time('execution');
require('dotenv').config();

const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGO_DSN, {
	useNewUrlParser: true
});

const helpers = require('./helpers');

const keywords = {};
const hosts = {};
const tags = {};
const titles = [];

(async () => {
	await client.connect();
	const db = client.db(process.env.MONGO_DBNAME);
	const videos = db.collection('videos').find({});
	let counter = 0;
	const promiseDeletes = [];
	const promiseUpdates = [];
	const promiseInserts = [];
	try {
		// eslint-disable-next-line no-await-in-loop
		videos.forEach(video => {
			counter++;

			// 👉 Some episodes are doubled in the list of videos, therefore we need to filter them out.
			if (
				video.title &&
				titles.filter(val => val.episode === video.title.episode)
					.length === 0
			) {
				titles.push(video.title.original);
				const dicts = helpers.parseVideo(video, hosts, keywords, tags);
				promiseUpdates.push(
					db.collection('videos').update(
						{ _id: video._id },
						{
							$set: {
								keywords: Object.values(dicts.keywords).map(
									item => item.original
								),
								tags: Object.values(dicts.tags).map(
									item => item.original
								),
								hosts: Object.values(dicts.hosts).map(
									item => item.original
								)
							}
						}
					)
				);
			}
		});

		// Mongo: Save all dictionaries to collections
		const collections = { hosts, tags, keywords };
		for (const collection in collections) {
			if (
				!Object.prototype.hasOwnProperty.call(collections, collection)
			) {
				continue;
			}
			promiseDeletes.push(db.collection(collection).deleteMany({}));

			for (const id in collections[collection]) {
				if (
					!Object.prototype.hasOwnProperty.call(
						collections[collection],
						id
					)
				) {
					continue;
				}
				const doc = collections[collection][id];
				promiseInserts.push(db.collection(collection).insertOne(doc));
			}
		}
		Promise.all(promiseDeletes);
		Promise.all(promiseUpdates);
		Promise.all(promiseInserts);
	} catch (err) {
		console.error(err);
	} finally {
		client.close();
		console.log(counter);
		console.timeEnd('execution');
	}
})().catch(err => console.error(err));

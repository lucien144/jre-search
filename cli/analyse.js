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
	let promiseUpdates = [];
	try {
		// eslint-disable-next-line no-await-in-loop
		while (await videos.hasNext()) {
			// eslint-disable-next-line no-await-in-loop
			const video = await videos.next();
			counter++;

			// 👉 Some episodes are doubled in the list of videos, therefore we need to filter them out.
			if (
				video.title &&
				titles.filter(val => val.episode === video.title.episode)
					.length === 0
			) {
				titles.push(video.title.original);
				helpers.parseVideo(video, hosts, keywords, tags);
				promiseUpdates.push(
					db.collection('videos').updateOne(
						{ _id: video._id },
						{
							$set: {
								hosts: [],
								keywords: [],
								tags: []
							}
						}
					)
				);
			}
		}

		// Cleanup all videos
		await Promise.all([promiseUpdates]);
		promiseUpdates = [];

		// Mongo: Save all dictionaries to collections
		const collections = { hosts, tags, keywords };
		for (const collection in collections) {
			if (
				!Object.prototype.hasOwnProperty.call(collections, collection)
			) {
				continue;
			}
			await db.collection(collection).deleteMany({}); // eslint-disable-line no-await-in-loop

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
				await db.collection(collection).insertOne(doc); // eslint-disable-line no-await-in-loop
				for (const video of doc.videos) {
					const docCopy = doc;
					docCopy.videos = null;
					promiseUpdates.push(
						db.collection('videos').updateOne(
							{ _id: video._id },
							{
								$addToSet: {
									[collection]: docCopy
								}
							}
						)
					);
				}
			}
		}
		Promise.all([promiseUpdates]);
	} catch (err) {
		console.error(err);
	} finally {
		client.close();
		console.log(`Total videos: ${counter}`);
		console.timeEnd('execution');
	}
})().catch(err => console.error(err));

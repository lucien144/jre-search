console.time('execution');
require('dotenv').config();

const {MongoClient} = require('mongodb');

const client = new MongoClient(process.env.MONGO_DSN, {useNewUrlParser: true});

const helpers = require('../helpers');

const keywords = {};
const hosts = {};
const tags = {};
const titles = [];

const parse = video => {
	let {title, description} = video;
	title = helpers.parseTitle(title);

	// Titles.filter(val => val.episode === title.episode).length === 0
	// 👉 Some episodes are doubled in the list of videos, therefore we need to filter them out.
	if (title && titles.filter(val => val.episode === title.episode).length === 0) {
		titles.push(title);
		title.hosts.forEach(host => {
			helpers.saveKeyword(host, hosts, video);
			description = description.replace(host, '');
		});

		description = helpers.parseQuotes(description, keywords);
		description = helpers.parseEntities(description, video, keywords);
		helpers.findNouns(description, keywords, video);
		helpers.findNouns(description, tags, video);
	}
};

(async () => {
	await client.connect();
	const db = client.db(process.env.MONGO_DBNAME);
	const videos = db.collection('videos').find({});
	try {
		// eslint-disable-next-line no-await-in-loop
		while (await videos.hasNext()) {
			// eslint-disable-next-line no-await-in-loop
			const video = await videos.next();
			parse(video);
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

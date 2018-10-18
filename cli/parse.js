console.time('execution');
require('dotenv').config();

const l = console.log;

const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(process.env.MONGO_DSN, {useNewUrlParser: true});

const compendium = require('compendium-js');
const helpers = require('../helpers');

const keywords = {};
const hosts = {};
const tags = {};
const titles = [];

const parseEntities = (description, video) => {
	const anal = compendium.analyse(description);
	try {
		anal[0].entities.forEach(entity => {
			helpers.saveKeyword(entity.raw, keywords, video);
			description = description.replace(entity.raw, '');
		});
	} catch (error) {
		// Console.warn(error);
	}
	return description;
};

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
		description = parseEntities(description, video);

		let noun = '';
		compendium.analyse(description).forEach(anal => {
			anal.tokens.forEach(token => {
				let found = false;
				if (['NN', 'NNS', 'JJ'].indexOf(token.pos) > -1) {
					noun += ' ' + token.raw;
					found = true;
				}
				if (noun !== '' && !found) {
					helpers.saveKeyword(noun, keywords, video);
					helpers.saveKeyword(noun, tags, video);
					noun = '';
				}
			});
		});
	}
};

(async () => {
	await client.connect();
	const db = client.db(process.env.MONGO_DBNAME);
	const videos = db.collection('videos').find({});
	try {
		while(await videos.hasNext()) {
			const video = await videos.next();
			parse(video);
		}

		// Mongo: Save all dictionaries to collections
		const collections = {hosts, tags, keywords};
		for (const collection in collections) {
			if (!collections.hasOwnProperty(collection)) continue;
			db.collection(collection).deleteMany({});

			for (const id in collections[collection]) {
				if (!collections[collection].hasOwnProperty(id)) continue;
				const host = collections[collection][id];
				db.collection(collection).insertOne(host);
			}
		}

	} finally {
		client.close();
	}
})().catch(err => console.error(err));

console.timeEnd('execution');

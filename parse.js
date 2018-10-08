console.time('execution');
require('dotenv').config();

const l = console.log;

const diskdb = require('diskdb');
const compendium = require('compendium-js');
const helpers = require('./helpers');

const db = diskdb.connect('./db', ['videos', 'hosts']);
const videos = db.videos.find();

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

videos.forEach(video => {
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
});

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = process.env.MONGO_DSN;
const dbName = process.env.MONGO_DBNAME;
const client = new MongoClient(url, {useNewUrlParser: true});
// Use connect method to connect to the server
client.connect(err => {
	assert.equal(null, err);
	const db = client.db(dbName);

	// Save the collection
	for (const id in hosts) {
		if (hosts.hasOwnProperty(id)) {
			const host = hosts[id];
			db.collection('hosts').insertOne(host, (err, r) => {
				assert.strictEqual(null, err);
			});
		}
	}
	client.close();
});

console.timeEnd('execution');

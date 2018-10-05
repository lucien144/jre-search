const l = console.log;

const S = require('string');
const diskdb = require('diskdb');
const compendium = require('compendium-js');
const helpers = require('./helpers');

const db = diskdb.connect('./db', ['videos']);
const videos = db.videos.find();

const keywords = {};
const hosts = {};
const tags = {};
const titles = [];


const parseEntities = description => {
	const anal = compendium.analyse(description);
	try {
		anal[0].entities.forEach(entity => {
			helpers.saveKeyword(entity.raw, keywords);
			description = description.replace(entity.raw, '');
		});
	} catch (error) {
		// Console.warn(error);
	}
	return description;
};

const parseQuotes = description => {
	const regex = new RegExp('("(?<title>.*?)")|(\'[^s](?<title2>.*?)\')', 'gms');
	let match;
	while ((match = regex.exec(description)) !== null) {
		const title = match.groups.title || match.groups.title2;
		helpers.saveKeyword(title, keywords);
		description = description.replace(match[0], '');
	}
	return description;
};

videos.forEach(video => {
	let {title, description} = video;
	title = helpers.parseTitle(title);
	if (title && titles.filter(val => val.episode === title.episode).length === 0) {
		titles.push(title);
		title.hosts.forEach(host => {
			helpers.saveKeyword(host, hosts);
			description = description.replace(host, '');
		});

		description = parseQuotes(description);
		description = parseEntities(description);

		let noun = '';
		compendium.analyse(description).forEach(anal => {
			anal.tokens.forEach(token => {
				let found = false;
				if (['NN', 'NNS', 'JJ'].indexOf(token.pos) > -1) {
					noun += ' ' + token.raw;
					found = true;
				}
				if (noun !== '' && !found) {
					helpers.saveKeyword(noun, keywords);
					helpers.saveKeyword(noun, tags);
					noun = '';
				}
			});
		});
	}
});
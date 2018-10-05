const l = console.log;

const S = require('string');
const diskdb = require('diskdb');
const compendium = require('compendium-js');

const db = diskdb.connect('./db', ['videos']);
const videos = db.videos.find();

const keywords = {};
const hosts = {};
const tags = {};
const titles = [];

const getId = title => {
	const id = S(title).trim().s.toLowerCase();
	return id.replace(/[^\w]/gi, '');
};

const saveKeyword = (keyword, pool) => {
	const id = getId(keyword);
	if (pool[id] === undefined) {
		pool[id] = {
			original: keyword,
			count: 1
		};
	} else {
		pool[id].count++;
	}
};

const parseEntities = description => {
	const anal = compendium.analyse(description);
	try {
		anal[0].entities.forEach(entity => {
			saveKeyword(entity.raw, keywords);
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
		saveKeyword(title, keywords);
		description = description.replace(match[0], '');
	}
	return description;
};

const parseTitle = title => {
	const matches = title.match(/^Joe Rogan Experience #(?<episode>\d*)(\s?[-]{0,}\s?)(?<hosts>.*?)(?<part>\s?\(part\s[0-9]{1,}\))?$/i);
	if (matches) {
		return {
			episode: Number(matches.groups.episode),
			hosts: matches.groups.hosts.split(/([,&]+|\sand\s)/).map(el => S(el).trim().s)
		};
	}
	return false;
};

videos.forEach(video => {
	let {title, description} = video;
	title = parseTitle(title);
	if (title && titles.filter(val => val.episode === title.episode).length === 0) {
		titles.push(title);
		title.hosts.forEach(host => {
			saveKeyword(host, hosts);
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
					saveKeyword(noun, keywords);
					saveKeyword(noun, tags);
					noun = '';
				}
			});
		});
	}
});
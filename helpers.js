const S = require('string');

exports.parseTitle = title => {
	const matches = title.match(/^Joe Rogan Experience #(?<episode>\d*)(\s?[-]{0,}\s?)(?<hosts>.*?)(?<part>\s?\(part\s\d{1,}\))?$/i);
	if (matches) {
		return {
			episode: Number(matches.groups.episode),
			hosts: matches.groups.hosts.split(/[,&]+|\sand\s/).map(el => S(el).trim().s)
		};
	}
	return false;
};

/**
 * Really simple webalize function.
 *
 * @param {String} title
 */
exports.getId = title => {
	const id = S(title).trim().s.toLowerCase();
	return id.replace(/[^\w]/gi, '');
};

/**
 * Saves keyword in a dictionary.
 *
 * @param {String} keyword
 * @param {Object} dict
 */
exports.saveKeyword = (keyword, dict) => {
	const id = exports.getId(keyword);
	if (dict[id] === undefined) {
		dict[id] = {
			original: keyword,
			count: 1
		};
	} else {
		dict[id].count++;
	}
};

/**
 * Parse "this is a quote" quotes from a description text.
 * @param {string} description Copy of text.
 * @param {object} dictionary A dictionary to save found quotes to.
 */
exports.parseQuotes = (description, dictionary) => {
	const regex = new RegExp('("(?<title>.*?)")|(\'[^s](?<title2>.*?)\')', 'gms');
	let match;
	while ((match = regex.exec(description)) !== null) {
		const title = match.groups.title || match.groups.title2;
		exports.saveKeyword(title, dictionary);
		description = description.replace(match[0], '');
	}
	return description;
};

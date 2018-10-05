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
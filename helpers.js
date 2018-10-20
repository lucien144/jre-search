const S = require('string');

exports.parseTitle = title => {
	const matches = title.match(/^Joe Rogan Experience #(?<episode>\d*)(\s{0,}-{0,}\s{0,})(?<hosts>.*?)(?<part>\s?\(part\s(\d+|\w+)\))?$/i);
	if (matches) {
		return {
			episode: Number(matches.groups.episode),
			hosts: matches.groups.hosts.split(/[,&]+|\sand\s/).map(el => S(el).trim().s), // eslint-disable-line new-cap
			part: matches.groups.part
		};
	}
	return false;
};

/**
 * Really simple webalize function.
 *
 * @param {string} title - Title of the video
 * @returns {string} - Webalized title string
 */
exports.getId = title => {
	const id = S(title).trim().s.toLowerCase(); // eslint-disable-line new-cap
	return id.replace(/[^\w]/gi, '');
};

/**
 * Saves keyword in a dictionary.
 *
 * @param {string} keyword - Keyword to save.
 * @param {object} dict - Dictionary to save the keyword to to.
 * @param {object} video - Reference video.
 * @returns {undefined}
 */
exports.saveKeyword = (keyword, dict, video) => {
	const id = exports.getId(keyword);
	if (dict[id] === undefined) {
		dict[id] = {
			original: keyword,
			count: 1,
			videos: [video]
		};
	} else {
		dict[id].count++;
		dict[id].videos.push(video);
	}
};

/**
 * Parse "this is a quote" quotes from a description text.
 * @param {string} description - Copy of text.
 * @param {object} dictionary - A dictionary to save found quotes to.
 * @returns {string} - Updated description without parsed keywords.
 */
exports.parseQuotes = (description, dictionary) => {
	const regex = new RegExp('("(?<title>.+?)")|((?=[^\w]|\A)\'(?<title2>.+?)\'(?=[^s]))', 'gms'); // eslint-disable-line no-useless-escape
	let match;
	const matches = [];
	while ((match = regex.exec(description)) !== null) {
		const title = match.groups.title || match.groups.title2;
		exports.saveKeyword(title, dictionary);
		matches.push(match[0]);
	}

	matches.forEach(desc => {
		description = description.replace(desc, '');
	});

	return description;
};

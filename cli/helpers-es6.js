const S = require('string');
const compendium = require('compendium-js');

/**
 * Analyse the video and parse data from it
 *
 * @param {object} video Video object.
 * @param {object} hosts Dictionary with hosts.
 * @param {object} keywords Dictionary with keywords.
 * @param {object} tags Dictionary with tags.
 */
export const parseVideo = (video, hosts, keywords, tags) => {
	let {title, description} = video;

	title.hosts.forEach(host => {
		exports.saveKeyword(host, hosts, video);
		description = description.replace(host, '');
	});

	description = exports.parseQuotes(description, keywords);
	description = exports.parseEntities(description, video, keywords);
	exports.findNouns(description, keywords, video);
	exports.findNouns(description, tags, video);
};

/**
 * Analyse the video title and parse the data from it.
 *
 * @param {string} title Video title.
 * @returns {object} If the analyse is success, contains analysed data.
 * @returns {false} If the analyse fails.
 */
export const parseTitle = title => {
	let matches = title.match(/^Joe Rogan Experience #(?<episode>\d*)(\s{0,}-{0,}\s{0,})(?<hosts>.*?)(?<part>\s?\(part\s(\d+|\w+)\))?$/i);
	if (matches) {
		return {
			original: title,
			episode: Number(matches.groups.episode),
			hosts: matches.groups.hosts.split(/[,&]+|\sand\s/).map(el => S(el).trim().s), // eslint-disable-line new-cap
			part: matches.groups.part
		};
	}

	matches = title.match(/^JRE MMA Show #(?<episode>\d*)(\s{0,}(-|with){0,}\s{0,})(?<hosts>.*?)$/i);
	if (matches) {
		return {
			original: title,
			episode: `MMA${matches.groups.episode}`,
			hosts: matches.groups.hosts.split(/[,&]+|\sand\s/).map(el => S(el).trim().s), // eslint-disable-line new-cap
			part: null
		};
	}

	return false;
};

/**
 * Really simple webalize function.
 *
 * @param {string} title Title of the video
 * @returns {string} Webalized title string
 */
export const getId = title => {
	const id = S(title).trim().s.toLowerCase(); // eslint-disable-line new-cap
	return id.replace(/[^\w]/gi, '');
};

/**
 * Saves keyword in a dictionary.
 *
 * @param {string} keyword Keyword to save.
 * @param {object} dict Dictionary to save the keyword to to.
 * @param {object} video Reference video.
 * @returns {undefined}
 */
export const saveKeyword = (keyword, dict, video) => {
	const id = exports.getId(keyword);
	if (dict[id] === undefined) {
		dict[id] = {
			original: S(keyword).trim().s, // eslint-disable-line new-cap
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
 * @param {string} description Copy of text.
 * @param {object} dictionary A dictionary to save found quotes to.
 * @returns {string} Updated description without parsed keywords.
 */
export const parseQuotes = (description, dictionary) => {
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

/**
 * Analyse entities/keywords from the video description and saves them in the dictionary.
 * @param {string} description Description text.
 * @param {object} video YT video object.
 * @param {object} dictionary Dictionary to save entities/keywords.
 * @returns {string} YT description stripped of entities/keywords for further analyse.
 */
export const parseEntities = (description, video, dictionary) => {
	const anal = compendium.analyse(description);
	try {
		anal[0].entities.forEach(entity => {
			exports.saveKeyword(entity.raw, dictionary, video);
			description = description.replace(entity.raw, '');
		});
	} catch (error) {
		// Console.warn(error);
	}
	return description;
};

export const findNouns = (description, dictionary, video) => {
	let noun = '';
	compendium.analyse(description).forEach(anal => {
		anal.tokens.forEach(token => {
			let found = false;
			if (['NN', 'NNS', 'JJ'].indexOf(token.pos) > -1) {
				noun += ' ' + token.raw;
				found = true;
			}
			if (noun !== '' && !found) {
				exports.saveKeyword(noun, dictionary, video);
				noun = '';
			}
		});
	});
};

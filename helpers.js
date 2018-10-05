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

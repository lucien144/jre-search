const l = console.log;

const S = require('string');
const diskdb = require('diskdb');
const pos = require('pos');

const db = diskdb.connect('./db', ['videos']);
const videos = db.videos.find();

const keywords = {};

videos.forEach(video => {
	const words = new pos.Lexer().lex(video.description);
	const tagger = new pos.Tagger();
	const taggedWords = tagger.tag(words);

	let name = '';
	let tags = [];
	for (const i in taggedWords) {
		if ({}.hasOwnProperty.call(taggedWords, i)) {
			const taggedWord = taggedWords[i];
			const word = taggedWord[0];
			const tag = taggedWord[1];
			let found = false;

			// Foreign Word
			if (tag === 'FW') {
				name = `${name} ${word}`;
				tags.push(tag);
				found = true;
			}

			// Adjective (big, ...)
			if (tag === 'JJ') {
				name = `${name} ${word}`;
				tags.push(tag);
				found = true;
			}

			if (tag === 'NN' || tag === 'NNP' || tag === 'NNPS' || tag === 'NNS') {
				name = `${name} ${word}`;
				tags.push(tag);
				found = true;
			}
			if (!found && name !== '') {
				let id = S(name).trim().s.toLowerCase();
				id = id.replace(/[^\w]/gi, '');
				let val = S(name).trim().s;
				val = val.replace(/[^\w\s]/gi, '');
				if (keywords[id] === undefined) {
					keywords[id] = {
						original: name,
						name: val,
						tags: tags,
						count: 1
					};
				} else {
					keywords[id].count++;
				}
				name = '';
				tags = [];
			}
		}
	}
});

for (const key in keywords) {
	if (keywords[key].count > 10) {
		l(keywords[key]);
	}
}

l(Object.keys(keywords).length);
l(videos.length);

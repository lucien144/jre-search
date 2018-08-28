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
	for (i in taggedWords) {
		const taggedWord = taggedWords[i];
		const word = taggedWord[0];
		const tag = taggedWord[1];
		// Console.log(word + " /" + tag);
		let found = false;
		if (tag === 'JJ') {
			name = `${name} ${word}`;
			found = true;
		}
		if (tag === 'NN' || tag === 'NNP' || tag === 'NNS') {
			name = `${name} ${word}`;
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
					count: 1
				};
			} else {
				keywords[id].count++;
			}
			name = '';
		}
	}
});

// L(keywords);
// l(Object.keys(keywords).length);

for (const key in keywords) {
	if (keywords[key].count > 20) {
		l(keywords[key]);
	}
}

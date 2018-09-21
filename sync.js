require('dotenv').config();

const YouTube = require('simple-youtube-api');

const API = new YouTube(process.env.API_KEY);

const diskdb = require('diskdb');

const db = diskdb.connect('./db', ['videos']);

const syncData = async () => {
	let results = false;
	let publishedBefore = null;
	let options = {};
	do {
		try {
			options = {
				channelId: 'UCzQUP1qoWDoEbmsQxvdjxgQ',
				order: 'date',
				publishedBefore
			};
			/* eslint-disable no-await-in-loop */
			results = await API.search(null, 100, options);
		} catch (error) {
			console.error(error);
			return;
		}
		results.forEach(video => {
			if (video.title === undefined) {
				results = false;
			} else if (/^Joe Rogan Experience #(\d*)(\s?[-]{0,}\s?)(.*)$/i.test(video.title)) {
				db.videos.save(video);
				console.log(video.title);
				console.log(video.publishedAt);
				console.log('---');
				publishedBefore = video.publishedAt;
				publishedBefore.setSeconds(publishedBefore.getSeconds() - 1);
				publishedBefore = publishedBefore.toISOString();
			}
		});
	} while (results);
};

syncData();

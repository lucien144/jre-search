const { sendJson } = require('../helpers.js');

module.exports = function(app, db) {
	app.get('/stats', async (req, res) => {
		const data = {
			videos: {
				count: 0,
				top: []
			},
			hosts: {
				count: 0,
				top: []
			},
			keywords: {
				count: 0,
				top: []
			}
		};
		[
			data.videos.count,
			data.hosts.count,
			data.keywords.count,
			data.videos.top,
			data.hosts.top,
			data.keywords.top
		] = await Promise.all([
			db.collection('videos').countDocuments(),
			db.collection('hosts').countDocuments(),
			db.collection('keywords').countDocuments(),
			db
				.collection('videos')
				.find()
				.sort({ 'statistics.viewCount': -1 })
				.limit(20)
				.toArray(),
			db
				.collection('hosts')
				.find()
				.sort({ count: -1 })
				.limit(20)
				.toArray(),
			db
				.collection('keywords')
				.find()
				.sort({ count: -1 })
				.limit(20)
				.toArray()
		]);
		data.videos.top.map(a => {
			a.raw = null;
			a.thumbnails = null;
			a.channel = null;
			return a;
		});
		data.hosts.top.map(a => {
			a.videos = [];
			return a;
		});
		data.keywords.top.map(a => {
			a.videos = [];
			return a;
		});
		sendJson({ data, res, err: false });
	});
};

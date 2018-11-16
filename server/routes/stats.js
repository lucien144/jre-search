const {sendJson} = require('../helpers.js');

module.exports = function (app, db) {
	app.get('/stats', async (req, res) => {
		const data = {
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
			data.hosts.count,
			data.keywords.count,
			data.hosts.top,
			data.keywords.top
		] = await Promise.all([
			db.collection('hosts').countDocuments(),
			db.collection('keywords').countDocuments(),
			db.collection('hosts').find().sort({count: -1}).limit(20).toArray(),
			db.collection('keywords').find().sort({count: -1}).limit(20).toArray()
		]);
		data.hosts.top.map(a => {
			a.videos = [];
			return a;
		});
		data.keywords.top.map(a => {
			a.videos = [];
			return a;
		});
		sendJson({data, res, err: false});
	});
};

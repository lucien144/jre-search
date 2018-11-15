const {sendJson} = require('../helpers.js');

module.exports = function (app, db) {
	app.get('/stats', async (req, res) => {
		const data = {};
		data.hosts = await db.collection('hosts').countDocuments();
		data.keywords = await db.collection('keywords').countDocuments();
		sendJson({data, res, err: false});
	});
};

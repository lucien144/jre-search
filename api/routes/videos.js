const { fetchCollection, sendJson } = require('../helpers.js');

module.exports = function(app, db) {
	app.get('/videos', async (req, res) => {
		const { page = 1, user_id = '' } = req.query;
		const user = await db.collection('users').findOne({ id: user_id });
		const find = user ? { id: { $nin: user.watched } } : {};
		fetchCollection(db.collection('videos'), res, req, {
			sort: { publishedAt: -1 },
			page,
			find
		});
	});

	app.get('/videos/:id', async (req, res) => {
		const { id } = req.params;
		const data = await db.collection('videos').findOne({ id });
		sendJson({ data, res, req, err: false });
	});
};

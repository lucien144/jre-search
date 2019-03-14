const { fetchCollection, sendJson } = require('../helpers.js');

module.exports = function(app, db) {
	app.get('/videos', (req, res) => {
		const { page = 1 } = req.query;
		fetchCollection(db.collection('videos'), res, req, {
			sort: { publishedAt: -1 },
			page
		});
	});

	app.get('/videos/:id', async (req, res) => {
		const { id } = req.params;
		const data = await db.collection('videos').findOne({ id });
		sendJson({ data, res, req, err: false });
	});
};

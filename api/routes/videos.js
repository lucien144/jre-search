const { fetchCollection } = require('../helpers.js');

module.exports = function(app, db) {
	app.get('/videos', (req, res) => {
		const { page = 1 } = req.query;
		fetchCollection(db.collection('videos'), res, {
			sort: { publishedAt: -1 },
			page
		});
	});
};

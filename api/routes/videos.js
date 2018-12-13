const { fetchCollection } = require('../helpers.js');

module.exports = function(app, db) {
	app.get('/videos', (req, res) => {
		fetchCollection(db.collection('videos'), res, {
			sort: { publishedAt: -1 }
		});
	});
};

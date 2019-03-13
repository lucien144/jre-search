const { ObjectID } = require('mongodb');

const {
	sendJson,
	searchCollection,
	fetchCollection
} = require('../helpers.js');

const limit = 20;

module.exports = function(app, db) {
	app.get('/keywords', (req, res) => {
		const { search, page = 1 } = req.query;

		if (search) {
			searchCollection(db.collection('keywords'), res, req, {
				search,
				page,
				limit
			});
			return;
		}

		fetchCollection(db.collection('keywords'), res, req, { page, limit });
	});

	app.get('/keywords/top', (req, res) => {
		fetchCollection(db.collection('keywords'), res, req, {
			limit: 30,
			sort: { count: -1 }
		});
	});

	app.get('/keywords/:id', async (req, res) => {
		const { id } = req.params;
		const { page = 1 } = req.query;
		const details = { _id: new ObjectID(id) };

		const { videos } = await db.collection('keywords').findOne(details);
		const count = videos.length;

		db.collection('keywords').findOne(details, { projection: { videos: { $slice: [ (page - 1) * limit, limit ] } } }, (err, data) => {
			sendJson({ data, limit, count, page, res, req, err });
		});
	});
};

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
			searchCollection(db.collection('keywords'), res, {
				search,
				page,
				limit
			});
			return;
		}

		fetchCollection(db.collection('keywords'), res, { page, limit });
	});

	app.get('/keywords/top', (req, res) => {
		fetchCollection(db.collection('keywords'), res, {
			limit: 30,
			sort: { count: -1 }
		});
	});

	app.get('/keywords/:id', (req, res) => {
		const { id } = req.params;
		const details = { _id: new ObjectID(id) };
		db.collection('keywords').findOne(details, (err, data) => {
			sendJson({ data, limit, res, err });
		});
	});
};

const {ObjectID} = require('mongodb');

const {sendJson, searchCollection, fetchCollection} = require('../helpers.js');

const limit = 20;

module.exports = function (app, db) {
	app.get('/tags', (req, res) => {
		const {search, page = 1} = req.query;

		if (search) {
			searchCollection(db.collection('tags'), res, {search, page, limit});
			return;
		}

		fetchCollection(db.collection('tags'), res, {page, limit});
	});

	app.get('/tags/:id', (req, res) => {
		const {id} = req.params;
		const details = {_id: new ObjectID(id)};
		db.collection('tags').findOne(details, (err, data) => {
			sendJson({data, limit, res, err});
		});
	});
};

const {ObjectID} = require('mongodb');

const {sendJson, searchCollection, fetchCollection} = require('../helpers.js');

const limit = 20;

module.exports = function (app, db) {
	app.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
		next();
	});

	app.get('/hosts', (req, res) => {
		const {search, page = 1} = req.query;

		if (search) {
			searchCollection(db.collection('hosts'), res, {search, page, limit});
			return;
		}

		fetchCollection(db.collection('hosts'), res, {page, limit});
	});

	app.get('/hosts/:id', (req, res) => {
		const {id} = req.params;
		const details = {_id: new ObjectID(id)};
		db.collection('hosts').findOne(details, (err, data) => {
			sendJson({data, limit, res, err});
		});
	});
};

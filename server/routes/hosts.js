const {ObjectID} = require('mongodb');

const {sendJson, searchCollection} = require('../helpers.js');

const limit = 20;

module.exports = function (app, db) {
	app.get('/hosts', (req, res) => {
		const {search, page = 1} = req.query;

		if (search) {
			searchCollection(db.collection('hosts'), res, {search, page, limit});
			return;
		}

		db.collection('hosts')
			.find()
			.sort({original: 1})
			.skip(limit * (page - 1))
			.limit(limit)
			.toArray(async (err, hosts) => {
				const count = await db.collection('hosts').countDocuments();
				sendJson({data: hosts, count, limit, res, err});
			});
	});

	app.get('/hosts/:id', (req, res) => {
		const {id} = req.params;
		const details = {_id: new ObjectID(id)};
		db.collection('hosts').findOne(details, (err, host) => {
			sendJson({data: host, limit, res, err});
		});
	});
};

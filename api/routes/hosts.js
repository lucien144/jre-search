const { ObjectID } = require('mongodb');

const {
	sendJson,
	searchCollection,
	fetchCollection
} = require('../helpers.js');

const limit = 20;

module.exports = function(app, db) {
	app.get('/hosts', (req, res) => {
		const { search, page = 1 } = req.query;

		if (search) {
			searchCollection(db.collection('hosts'), res, req, {
				search,
				page,
				limit
			});
			return;
		}

		fetchCollection(db.collection('hosts'), res, req, { page, limit });
	});

	app.get('/hosts/top', (req, res) => {
		fetchCollection(db.collection('hosts'), res, req, {
			sort: { count: -1 }
		});
	});

	app.get('/hosts/:id', async (req, res) => {
		const { id } = req.params;
		const { page = 1 } = req.query;
		const details = { _id: new ObjectID(id) };

		const { videos } = await db.collection('hosts').findOne(details);
		const count = videos.length;

		db.collection('hosts').findOne(
			details,
			{ projection: { videos: { $slice: [(page - 1) * limit, limit] } } },
			(err, data) => {
				sendJson({ data, limit, count, page, res, req, err });
			}
		);
	});
};

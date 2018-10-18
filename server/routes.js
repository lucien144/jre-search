const ObjectID = require('mongodb').ObjectID;

module.exports = function (app, db) {
	const response = (err, res, hosts, shrunk = true) => {
		hosts.sort((a, b) => {
			return a.original < b.original ? -1 : (a.original > b.original ? 1 : 0);
		});
		if (shrunk) {
			hosts.map(a => {
				a.videos = [];
				return a;
			});
		}
		if (err) {
			res.send({error: 'An error has occurred'});
		} else {
			res.json(hosts);
		}
	};

	app.get('/hosts', (req, res) => {
		const {search} = req.query;
		if (search) {
			const reg = new RegExp(`^${search}`, 'i');
			db.collection('hosts').find({original: reg}).toArray((err, hosts) => {
				response(err, res, hosts, false);
			});
			return;
		}
		db.collection('hosts').find().toArray((err, hosts) => {
			response(err, res, hosts);
		});
	});

	app.get('/hosts/:id', (req, res) => {
		const id = req.params.id;
		const details = {_id: new ObjectID(id)};
		db.collection('hosts').findOne(details, (err, hosts) => {
			if (err) {
				res.send({error: 'An error has occurred'});
			} else {
				res.json(hosts);
			}
		});
	});
};

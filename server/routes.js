const ObjectID = require('mongodb').ObjectID;

module.exports = function (app, db) {
	app.get('/hosts', (req, res) => {
		db.collection('hosts').find().toArray((err, hosts) => {
			hosts.sort((a, b) => {
				return a.original < b.original ? -1 : (a.original > b.original ? 1 : 0);
			});
			hosts.map(a => {
				a.videos = [];
				return a;
			});
			if (err) {
				res.send({error: 'An error has occurred'});
			} else {
				res.json(hosts);
			}
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

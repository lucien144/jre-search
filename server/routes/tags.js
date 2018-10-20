module.exports = function (app, db) {
	app.get('/tags', (req, res) => {
		const {search} = req.query;
		if (search) {
			const reg = new RegExp(`^${search}`, 'i');
			db.collection('tags').find({original: reg}).toArray((err, tags) => {
				if (err) {
					res.send({error: 'An error has occurred'});
				} else {
					res.json(tags);
				}
			});
			return;
		}
		db.collection('tags').find().toArray((err, tags) => {
			if (err) {
				res.send({error: 'An error has occurred'});
			} else {
				res.json(tags);
			}
		});
	});
};

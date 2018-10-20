module.exports = function (app, db) {
	app.get('/keywords', (req, res) => {
		const {search} = req.query;
		if (search) {
			const reg = new RegExp(`^${search}`, 'i');
			db.collection('keywords').find({original: reg}).toArray((err, keywords) => {
				if (err) {
					res.send({error: 'An error has occurred'});
				} else {
					res.json(keywords);
				}
			});
			return;
		}
		db.collection('keywords').find().toArray((err, keywords) => {
			if (err) {
				res.send({error: 'An error has occurred'});
			} else {
				res.json(keywords);
			}
		});
	});
};

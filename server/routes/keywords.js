const {searchCollection} = require('../helpers.js');

const limit = 20;

module.exports = function (app, db) {
	app.get('/keywords', (req, res) => {
		const {search, page = 1} = req.query;

		if (search) {
			searchCollection(db.collection('keywords'), res, {search, page, limit});
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

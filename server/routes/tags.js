const {searchCollection} = require('../helpers.js');

const limit = 20;

module.exports = function (app, db) {
	app.get('/tags', (req, res) => {
		const {search, page = 1} = req.query;

		if (search) {
			searchCollection(db.collection('tags'), res, {search, page, limit});
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

const {sendJson} = require('../helpers.js');

module.exports = function (app, db) {
	app.get('/users/:id', async (req, res) => {
		const {id} = req.params;
		const data = await db.collection('users').findOne({id});
		sendJson({data, res, err: false});
	});

	app.post('/users/watch', async (req, res) => {
		try {
			const {user, video} = req.body;

			const count = await db.collection('users').find({watched: video}).count();

			if (count) {
				await db.collection('users').findOneAndUpdate(
					{id: user},
					{$pull: {watched: video}}
				);
			} else {
				await db.collection('users').findOneAndUpdate(
					{id: user},
					{$addToSet: {watched: video}},
					{upsert: true, returnNewDocument: true}
				);
			}

			const data = await db.collection('users').findOne({id: user});
			sendJson({data, res, err: false});
		} catch (error) {
			sendJson({data: null, res, err: error});
		}
	});
};

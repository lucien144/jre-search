const { sendJson } = require('../helpers.js');

module.exports = function(app, db) {
	app.get('/users/:id', async (req, res) => {
		const { id } = req.params;
		const data = await db.collection('users').findOne({ id });
		sendJson({ data, res, err: false });
	});

	const usersList = async (req, res, list) => {
		try {
			const { user, video } = req.body;

			const count = await db
				.collection('users')
				.find({ [list]: video })
				.count();

			if (count) {
				await db
					.collection('users')
					.findOneAndUpdate(
						{ id: user },
						{ $pull: { [list]: video } }
					);
			} else {
				await db
					.collection('users')
					.findOneAndUpdate(
						{ id: user },
						{ $addToSet: { [list]: video } },
						{ upsert: true, returnNewDocument: true }
					);
			}

			const data = await db.collection('users').findOne({ id: user });
			sendJson({ data, res, err: false });
		} catch (error) {
			sendJson({ data: null, res, err: error });
		}
	};

	app.post('/users/watch', async (req, res) => {
		usersList(req, res, 'watched');
	});

	app.post('/users/favourite', async (req, res) => {
		usersList(req, res, 'favourites');
	});
};

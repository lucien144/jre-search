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
		const { page = 1, userId = '' } = req.query;

		const aggregation = [{ $match: { _id: new ObjectID(id) } }];
		const user = await db.collection('users').findOne({ id: userId });

		if (user && Array.isArray(user.watched)) {
			aggregation.push({
				$project: {
					videos: {
						$filter: {
							input: "$videos",
							as: "video",
							cond: {
								$not: {
									$in: [
										"$$video.id", user.watched
									]
								}
							}
						}
					}
				}
			});
		}

		const data = await db.collection('hosts').aggregate(aggregation).toArray();
		const count = data[0].videos.length;

		// Slice videos (~ paginate)
		aggregation.push({
			$project: {
				videos: {
					$slice: ["$videos", (page - 1) * limit, limit]
				}
			}
		});

		db.collection('hosts').aggregate(aggregation).toArray((err, data) => {
			if (Array.isArray(data) && data.length > 0) {
				sendJson({ data: data[0], limit, count, page, res, req, err });
			} else {
				sendJson({ data, limit, count, page, res, req, err });
			}
		});
	});
};

exports.searchCollection = (
	collection,
	res,
	req,
	{ search = '', page = 1, limit = 20, shrunk = true }
) => {
	const reg = new RegExp(`${search}`, 'i');
	page = parseInt(page, 10);
	limit = parseInt(limit, 10);
	collection
		.find({ original: reg })
		.sort({ count: -1 })
		.skip(limit * (page - 1))
		.limit(limit)
		.toArray(async (err, data) => {
			const count = await collection.find({ original: reg }).count();
			exports.sendJson({
				data,
				count,
				limit,
				page,
				shrunk,
				res,
				req,
				err
			});
		});
};

exports.fetchCollection = (
	collection,
	res,
	req,
	{ page = 1, limit = 20, shrunk = true, sort = { original: 1 } }
) => {
	page = parseInt(page, 10);
	limit = parseInt(limit, 10);
	collection
		.find()
		.sort(sort)
		.skip(limit * (page - 1))
		.limit(limit)
		.toArray(async (err, data) => {
			const count = await collection.countDocuments();
			exports.sendJson({
				data,
				count,
				limit,
				page,
				shrunk,
				res,
				req,
				err
			});
		});
};

exports.sendJson = ({
	data,
	limit = 20,
	res,
	req,
	err,
	page = 1,
	shrunk = true,
	count = null
}) => {
	if (shrunk && Array.isArray(data)) {
		data.map(a => {
			a.videos = [];
			return a;
		});
	}
	if (err) {
		res.send({
			status: 'error',
			error: err
		});
		return;
	}
	res.json({
		status: 'ok',
		pagination: {
			page: parseInt(page),
			pages: Math.ceil(count / limit),
			count,
			path: req.path
		},
		data
	});
};

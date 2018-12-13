exports.searchCollection = (
	collection,
	res,
	{ search = '', page = 1, limit = 20, shrunk = true }
) => {
	const reg = new RegExp(`${search}`, 'i');
	collection
		.find({ original: reg })
		.sort({ count: -1 })
		.skip(limit * (page - 1))
		.limit(limit)
		.toArray(async (err, data) => {
			const count = await collection.find({ original: reg }).count();
			exports.sendJson({ data, count, limit, shrunk, res, err });
		});
};

exports.fetchCollection = (
	collection,
	res,
	{ page = 1, limit = 20, shrunk = true, sort = { original: 1 } }
) => {
	collection
		.find()
		.sort(sort)
		.skip(limit * (page - 1))
		.limit(limit)
		.toArray(async (err, data) => {
			const count = await collection.countDocuments();
			exports.sendJson({ data, count, limit, shrunk, res, err });
		});
};

exports.sendJson = ({
	data,
	limit = 20,
	res,
	err,
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
		pages: Math.ceil(count / limit),
		count,
		data
	});
};

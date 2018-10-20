module.exports = function (app, db) {
	require('./routes/hosts.js')(app, db);
	require('./routes/keywords.js')(app, db);
	require('./routes/tags.js')(app, db);
};

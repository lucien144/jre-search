require('dotenv').config();
const express = require('express');
const {MongoClient} = require('mongodb');

const client = new MongoClient(process.env.MONGO_DSN, {useNewUrlParser: true});

const app = express();

const port = 8000;

(async () => {
	await client.connect();
	const db = client.db(process.env.MONGO_DBNAME);

	require('./routes.js')(app, db);

	app.listen(port, () => {
		console.log('We are live on ' + port);
	});
})().catch(err => console.error(err));

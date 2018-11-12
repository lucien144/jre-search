require('dotenv').config();
const express = require('express');
const {MongoClient} = require('mongodb');

const client = new MongoClient(process.env.MONGO_DSN, {useNewUrlParser: true});

const app = express();

const port = 8000;

(async () => {
	await client.connect();
	const db = client.db(process.env.MONGO_DBNAME);

	if (process.env.ENVIRONMENT === 'development') {
		app.use((req, res, next) => {
			res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
			res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
			next();
		});
	}

	require('./routes.js')(app, db);

	app.listen(port, () => {
		console.log('We are live on ' + port);
	});
})().catch(err => console.error(err));

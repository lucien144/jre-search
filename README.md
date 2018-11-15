# Joe Rogan Experience podcast on 🚀 🍄
Advanced search for Joe Rogan Experience podcast.

[![Build Status: Linux](https://travis-ci.org/lucien144/jre-search.svg?branch=master)](https://travis-ci.org/lucien144/jre-search)
[![Coverage Status](https://coveralls.io/repos/github/lucien144/jre-search/badge.svg?branch=master)](https://coveralls.io/github/lucien144/jre-search?branch=master)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo)

## Installation

`npm i`

### Create `.env` file in the project's root folder
```
ENVIRONMENT=development
API_KEY=123YourApiKey
MONGO_DSN=mongodb://localhost:27017/
MONGO_DBNAME=jre-search
```

## Commands

| Command | Description |
|---------|-------------|
| `node cli/download.js` | Downloads all JRE videos from YouTube. |
| `node cli/analyse.js` | Analyse the downloaded videos and saves hosts & keywords. |
| `npm run server` | Run the API server. |
| `npm run site` | Run the API server. |
| `npm run coverage` | Upload coverage to Coveralls.io (needs `.coveralls.yml` for local run). |
| `npm run ava` | Run tests only with ava. |
| `npm test` | Run tests with XO lint and code coverage. |

## API

| Endpoint | Description |
|---------|-------------|
| `/hosts?page=N` | List of all hosts along with videos with pagination. |
| `/hosts?search=al` | Search for hosts with name "AL..." |
| `/hosts/:id` | Detail of the host. |
| `/hosts/top` | List of hosts ordered by count. |
| `/stats` | Statistics. |

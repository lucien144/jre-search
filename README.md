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
| `node cli/download.js -p --p` | Purge all videos from DB before the scrape. |
| `node cli/download.js -a --all` | Download all videos in one go. |
| `node cli/analyse.js` | Analyse the downloaded videos and saves hosts & keywords. |
| `npm run server` | Run the API server. |
| `npm run site` | Run the API server. |
| `npm run coverage` | Upload coverage to Coveralls.io (needs `.coveralls.yml` for local run). |
| `npm run ava` | Run tests only with ava. |
| `npm test` | Run tests with XO lint and code coverage. |

## API

| Endpoint | Description | Params |
|---------|--------------|--------|
| `/hosts?page=N` | List of all hosts along with videos. Paginated. | `page` |
| `/hosts?search=al` | Search for hosts with name "AL..." | `search` |
| `/hosts/:id?page=N&user_id=X` | Detail of the host along with his/her videos. | `page` `user_id` - to filter out user's wached videos |
| `/hosts/top` | List of hosts ordered by count. |  |
| `/stats` | Statistics. |  |

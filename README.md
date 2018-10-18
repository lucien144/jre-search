# Joe Rogan Experience podcast on 🚀 🍄
Advanced search for Joe Rogan Experience podcast.

## Installation

`npm i`

### Create `.env` file in the project's root folder
```
API_KEY=123YourApiKey
MONGO_DSN=mongodb://localhost:27017/
MONGO_DBNAME=jre-search
```

## Commands

| Command | Description |
|---------|-------------|
| `node sync.js` | Downloads all JRE videos from YouTube. |
| `node parse.js` | Parse the downloaded videos and saves hosts & keywords. |
| `npm run server` | Run the API server. |
| `npm run test` | Run tests. |

## API

| Endpoint | Description |
|---------|-------------|
| `/hosts/` | List of all hosts along with videos. |
| `/hosts/?search=al` | Search for hosts with name "AL..." |
| `/hosts/:id` | Detail of the host. |
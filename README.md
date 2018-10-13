# jre-search
Advanced search for Joe Rogan Experience podcast.

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
| `/hosts/:id` | Detail of the host. |
# Streaming Ratings Embed

A collection of TamperMonkey userscripts and an MCP server to display IMDB ratings on streaming platforms.

## Features

- **Userscripts**: Add IMDB ratings to Netflix, Amazon Prime, and Disney+.
- **MCP Server**: AI integration for fetching ratings programmatically.

## Setup

1. **Get API Keys**:
   - OMDB API key: [omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx) (free tier available)
   - TMDB API key: [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) (optional, for advanced features)

2. **Configure .env**:

   ```bash
   OMDB_API_KEY=your_omdb_api_key
   TMDB_API_KEY=your_tmdb_api_key
   ```

3. **Install Userscripts**:
   - Install TamperMonkey browser extension.
   - Open each `.user.js` file and copy to TamperMonkey.
   - Scripts will prompt for OMDB API key on first run.

4. **Run MCP Server** (optional):

   ```bash
   cd mcp-server
   npm install
   npm start
   ```

## Files

- `netflix_omdb_ratings.user.js` - Netflix ratings
- `amazon_prime_omdb_ratings.user.js` - Amazon Prime ratings
- `disney_plus_omdb_ratings.user.js` - Disney+ ratings
- `mcp-server/` - Model Context Protocol server
- `.env` - API keys (not committed)

## Usage

Visit supported streaming sites with TamperMonkey enabled. Ratings appear as ⭐ X.X next to titles.

## Contributing

Fork, modify, and submit pull requests.

## License

MIT
# Streaming Ratings MCP Server

A Model Context Protocol (MCP) server that provides IMDB ratings for movies and TV shows.

## Installation

1. Navigate to the mcp-server directory:

   ```bash
   cd mcp-server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Usage

Run the MCP server:

   ```bash
   npm start
   ```

This server provides a tool called `get_imdb_rating` that takes a movie/TV show title and returns its IMDB rating.

## Configuration

The server uses the OMDB API key hardcoded in `index.js`. Update the `apiKey` variable if needed.

## Integration

This MCP server can be integrated with AI models or applications that support the Model Context Protocol to provide real-time IMDB ratings data.
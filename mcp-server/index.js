const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
require('dotenv').config({ path: '../.env' });

class StreamingRatingsServer {
  constructor() {
    this.omdbApiKey = process.env.OMDB_API_KEY;
    if (!this.omdbApiKey || this.omdbApiKey === 'your_omdb_api_key_here') {
      console.error('Please set OMDB_API_KEY in .env file');
      process.exit(1);
    }

    this.server = new Server(
      {
        name: 'streaming-ratings-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_imdb_rating',
            description: 'Get IMDB rating for a movie or TV show title',
            inputSchema: {
              type: 'object',
              properties: {
                title: {
                  type: 'string',
                  description: 'The title of the movie or TV show',
                },
              },
              required: ['title'],
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'get_imdb_rating':
          return await this.getImdbRating(args.title);
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  async getImdbRating(title) {
    try {
      // Clean the title
      const cleanTitle = title.replace(/\s*\([^)]*\)\s*/g, '').trim();

      // OMDB API call
      const url = `https://www.omdbapi.com/?apikey=${this.omdbApiKey}&t=${encodeURIComponent(cleanTitle)}&plot=short&r=json`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.Response === 'True' && data.imdbRating && data.imdbRating !== 'N/A') {
        return {
          content: [
            {
              type: 'text',
              text: `IMDB Rating for "${title}": ${data.imdbRating}`,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: 'text',
              text: `No IMDB rating found for "${title}".`,
            },
          ],
        };
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error fetching rating for "${title}": ${error.message}`,
          },
        ],
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Streaming Ratings MCP Server running...');
  }
}

// Run the server
const server = new StreamingRatingsServer();
server.run().catch(console.error);
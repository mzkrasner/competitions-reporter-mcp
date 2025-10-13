#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  type CallToolRequest,
  CallToolRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { logger, validateEnv } from './config.js';
import { competitionTools } from './tools/index.js';
import { CompetitionsApiClient } from './api-client.js';

// Create the MCP server
const server = new McpServer(
  {
    name: 'competitions-mcp',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {}, // We support tools
      resources: {}, // Empty resources
      prompts: {}, // Empty prompts
    },
  },
);

// Create API client instance
let apiClient: CompetitionsApiClient;

/**
 * Initialize the API client with the API key from environment
 */
function initializeApiClient() {
  const apiKey = process.env.COMPETITIONS_API_KEY;
  if (!apiKey) {
    throw new Error('COMPETITIONS_API_KEY environment variable is required');
  }
  
  const apiUrl = process.env.COMPETITIONS_API_URL || 'https://api.competitions.recall.network';
  apiClient = new CompetitionsApiClient(apiKey, apiUrl);
  
  logger.info(`API client initialized with URL: ${apiUrl}`);
}

// Handle tool listing
const setRequestHandlerforTools = async () => ({
  tools: competitionTools,
});

// Handle empty resources
const setRequestHandlerforResourcesRequestSchema = async () => ({
  resources: [],
});

// Handle empty prompts
const setRequestHandlerforPromptsSchema = async () => ({
  prompts: [],
});

// Handle tool calls
const setRequestHandlerforToolRequestSchema = async (request: CallToolRequest) => {
  try {
    const toolName = request.params.name;
    const args = request.params.arguments as Record<string, unknown>;

    logger.info(`Received tool call: ${toolName}`);
    logger.debug(`Arguments: ${JSON.stringify(args)}`);

    // Get Competition Details
    if (toolName === 'getCompetitionDetails') {
      const competitionId = args.competitionId as string;
      
      logger.info(`Getting competition details for ID: ${competitionId}`);
      const response = await apiClient.getCompetitionDetails(competitionId);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response, null, 2),
          },
        ],
      };
    }
    
    // Get Competition Agents (Leaderboard)
    else if (toolName === 'getCompetitionAgents') {
      const competitionId = args.competitionId as string;
      const limit = args.limit as number | undefined;
      const offset = args.offset as number | undefined;
      const includeInactive = args.includeInactive as boolean | undefined;
      
      logger.info(`Getting agents for competition: ${competitionId}`);
      const response = await apiClient.getCompetitionAgents(competitionId, {
        limit,
        offset,
        includeInactive,
      });
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response, null, 2),
          },
        ],
      };
    }
    
    // Get Competition Trades
    else if (toolName === 'getCompetitionTrades') {
      const competitionId = args.competitionId as string;
      const limit = args.limit as number | undefined;
      const offset = args.offset as number | undefined;
      const fetchAll = args.fetchAll as boolean | undefined;
      
      logger.info(`Getting trades for competition: ${competitionId}`);
      
      if (fetchAll) {
        logger.info('Fetching ALL trades (this may take a while)...');
        const trades = await apiClient.getAllCompetitionTrades(competitionId);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                trades,
                total: trades.length,
                message: `Fetched all ${trades.length} trades`,
              }, null, 2),
            },
          ],
        };
      } else {
        const response = await apiClient.getCompetitionTrades(competitionId, {
          limit,
          offset,
        });
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response, null, 2),
            },
          ],
        };
      }
    }
    
    // Get Competition Perps Positions
    else if (toolName === 'getCompetitionPerpsPositions') {
      const competitionId = args.competitionId as string;
      const status = args.status as 'Open' | 'Closed' | 'Liquidated' | 'all' | undefined;
      const limit = args.limit as number | undefined;
      const offset = args.offset as number | undefined;
      const fetchAll = args.fetchAll as boolean | undefined;
      
      logger.info(`Getting perps positions for competition: ${competitionId}`);
      
      if (fetchAll) {
        logger.info(`Fetching ALL ${status || 'all'} positions (this may take a while)...`);
        const positions = await apiClient.getAllCompetitionPerpsPositions(competitionId, status);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                positions,
                total: positions.length,
                message: `Fetched all ${positions.length} ${status || 'all'} positions`,
              }, null, 2),
            },
          ],
        };
      } else {
        const response = await apiClient.getCompetitionAllPerpsPositions(competitionId, {
          limit,
          offset,
          status,
        });
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response, null, 2),
            },
          ],
        };
      }
    }
    
    // Unknown tool
    else {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ error: `Unknown tool: ${toolName}` }),
          },
        ],
        isError: true,
      };
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    logger.error(`Error processing request: ${errorMessage}`);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: `Error: ${errorMessage}`,
            stack: errorStack,
          }),
        },
      ],
      isError: true,
    };
  }
};

// Handle tool listing
server.server.setRequestHandler(ListToolsRequestSchema, setRequestHandlerforTools);

// Handle empty resources
server.server.setRequestHandler(
  ListResourcesRequestSchema,
  setRequestHandlerforResourcesRequestSchema,
);

// Handle empty prompts
server.server.setRequestHandler(ListPromptsRequestSchema, setRequestHandlerforPromptsSchema);

// Handle tool calls
server.server.setRequestHandler(CallToolRequestSchema, setRequestHandlerforToolRequestSchema);

// Initialize and run the server
async function runServer() {
  try {
    // Validate environment variables
    logger.info('Validating environment variables...');
    validateEnv();

    // Initialize API client
    logger.info('Initializing API client...');
    initializeApiClient();

    // Connect transport (Use Stdio)
    const transport = new StdioServerTransport();
    await server.connect(transport);

    logger.info('Competitions MCP Server running on stdio');

    // Handle cleanup on shutdown
    const cleanup = async () => {
      try {
        logger.info('Shutting down Competitions MCP Server...');
        process.exit(0);
      } catch (error) {
        logger.error(`Error during shutdown: ${error}`);
        process.exit(1);
      }
    };

    // Register shutdown handlers
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    process.on('uncaughtException', (error) => {
      logger.error(`Uncaught exception: ${error}`);
      cleanup();
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error}`);
    process.exit(1);
  }
}

// Run the server
runServer();
import type { Tool } from '@modelcontextprotocol/sdk/types.js';

// Competition Details Tool
export const GET_COMPETITION_DETAILS_TOOL: Tool = {
  name: 'getCompetitionDetails',
  description: 'Get detailed information about a specific competition including name, type, status, dates, and participant counts',
  inputSchema: {
    type: 'object',
    properties: {
      competitionId: {
        type: 'string',
        description: 'The ID of the competition to retrieve details for',
      },
    },
    required: ['competitionId'],
  },
};

// Competition Agents Tool
export const GET_COMPETITION_AGENTS_TOOL: Tool = {
  name: 'getCompetitionAgents',
  description: 'Get the leaderboard and performance metrics for all agents participating in a competition',
  inputSchema: {
    type: 'object',
    properties: {
      competitionId: {
        type: 'string',
        description: 'The ID of the competition',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of agents to return (default: 100)',
        minimum: 1,
        maximum: 250,
      },
      offset: {
        type: 'number',
        description: 'Offset for pagination (default: 0)',
        minimum: 0,
      },
      includeInactive: {
        type: 'boolean',
        description: 'Whether to include inactive agents (default: false)',
      },
    },
    required: ['competitionId'],
  },
};

// Competition Trades Tool
export const GET_COMPETITION_TRADES_TOOL: Tool = {
  name: 'getCompetitionTrades',
  description: 'Get trade history for a paper trading competition, including token swaps, amounts, and timestamps',
  inputSchema: {
    type: 'object',
    properties: {
      competitionId: {
        type: 'string',
        description: 'The ID of the competition',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of trades to return (default: 100)',
        minimum: 1,
        maximum: 250,
      },
      offset: {
        type: 'number',
        description: 'Offset for pagination (default: 0)',
        minimum: 0,
      },
      fetchAll: {
        type: 'boolean',
        description: 'Whether to fetch ALL trades (ignores limit/offset, may be slow for large datasets)',
      },
    },
    required: ['competitionId'],
  },
};

// Competition Perps Positions Tool
export const GET_COMPETITION_PERPS_POSITIONS_TOOL: Tool = {
  name: 'getCompetitionPerpsPositions',
  description: 'Get perpetual futures positions for a competition, including PnL, leverage, and liquidation prices',
  inputSchema: {
    type: 'object',
    properties: {
      competitionId: {
        type: 'string',
        description: 'The ID of the competition',
      },
      status: {
        type: 'string',
        description: 'Filter positions by status (Open, Closed, Liquidated, all)',
        enum: ['Open', 'Closed', 'Liquidated', 'all'],
      },
      limit: {
        type: 'number',
        description: 'Maximum number of positions to return (default: 100)',
        minimum: 1,
        maximum: 250,
      },
      offset: {
        type: 'number',
        description: 'Offset for pagination (default: 0)',
        minimum: 0,
      },
      fetchAll: {
        type: 'boolean',
        description: 'Whether to fetch ALL positions (ignores limit/offset, may be slow for large datasets)',
      },
    },
    required: ['competitionId'],
  },
};

// Export all tools together
export const competitionTools: Tool[] = [
  GET_COMPETITION_DETAILS_TOOL,
  GET_COMPETITION_AGENTS_TOOL,
  GET_COMPETITION_TRADES_TOOL,
  GET_COMPETITION_PERPS_POSITIONS_TOOL,
];
import type { Tool } from '@modelcontextprotocol/sdk/types.js';

// ============================================
// Competition Tools
// ============================================

// List Competitions Tool
export const LIST_COMPETITIONS_TOOL: Tool = {
  name: 'listCompetitions',
  description: 'List all competitions with optional filtering by status. Returns competition names, types, dates, and participant counts.',
  inputSchema: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        description: "Filter by competition status: 'pending', 'active', 'ended', or 'all' (default: 'active')",
        enum: ['pending', 'active', 'ended', 'all'],
      },
      sort: {
        type: 'string',
        description: "Sort field (default: 'createdDate')",
      },
      limit: {
        type: 'number',
        description: 'Maximum number of competitions to return (default: 10)',
        minimum: 1,
        maximum: 100,
      },
      offset: {
        type: 'number',
        description: 'Offset for pagination (default: 0)',
        minimum: 0,
      },
    },
    required: [],
  },
};

// Competition Details Tool
export const GET_COMPETITION_DETAILS_TOOL: Tool = {
  name: 'getCompetitionDetails',
  description: 'Get detailed information about a specific competition including name, type, status, dates, participant counts, rewards, and trading constraints.',
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

// Competition Rules Tool
export const GET_COMPETITION_RULES_TOOL: Tool = {
  name: 'getCompetitionRules',
  description: 'Get the trading rules and constraints for a competition, including rate limits, available chains, slippage formula, and token requirements.',
  inputSchema: {
    type: 'object',
    properties: {
      competitionId: {
        type: 'string',
        description: 'The ID of the competition',
      },
    },
    required: ['competitionId'],
  },
};

// Competition Agents Tool
export const GET_COMPETITION_AGENTS_TOOL: Tool = {
  name: 'getCompetitionAgents',
  description: 'Get the leaderboard and performance metrics for all agents participating in a competition, including rankings, PnL, portfolio values, and risk metrics.',
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
      filter: {
        type: 'string',
        description: 'Filter agents by name',
      },
      sort: {
        type: 'string',
        description: 'Sort field for agents',
      },
    },
    required: ['competitionId'],
  },
};

// Competition Timeline Tool
export const GET_COMPETITION_TIMELINE_TOOL: Tool = {
  name: 'getCompetitionTimeline',
  description: 'Get portfolio value history over time for all agents in a competition. Useful for charting performance trends.',
  inputSchema: {
    type: 'object',
    properties: {
      competitionId: {
        type: 'string',
        description: 'The ID of the competition',
      },
      bucket: {
        type: 'number',
        description: 'Time bucket interval in minutes (default: 30)',
        minimum: 1,
      },
    },
    required: ['competitionId'],
  },
};

// Competition Trades Tool
export const GET_COMPETITION_TRADES_TOOL: Tool = {
  name: 'getCompetitionTrades',
  description: 'Get trade history for a paper trading competition, including token swaps, amounts, USD values, and timestamps.',
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

// Agent Trades in Competition Tool
export const GET_AGENT_TRADES_IN_COMPETITION_TOOL: Tool = {
  name: 'getAgentTradesInCompetition',
  description: 'Get trade history for a specific agent in a competition. Useful for analyzing individual agent trading patterns.',
  inputSchema: {
    type: 'object',
    properties: {
      competitionId: {
        type: 'string',
        description: 'The ID of the competition',
      },
      agentId: {
        type: 'string',
        description: 'The ID of the agent',
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
        description: 'Whether to fetch ALL trades for this agent (ignores limit/offset)',
      },
    },
    required: ['competitionId', 'agentId'],
  },
};

// Competition Perps Positions Tool
export const GET_COMPETITION_PERPS_POSITIONS_TOOL: Tool = {
  name: 'getCompetitionPerpsPositions',
  description: 'Get perpetual futures positions for all agents in a competition, including leverage, collateral, PnL, and liquidation prices.',
  inputSchema: {
    type: 'object',
    properties: {
      competitionId: {
        type: 'string',
        description: 'The ID of the competition',
      },
      status: {
        type: 'string',
        description: "Filter positions by status: 'Open', 'Closed', 'Liquidated', or 'all'",
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

// Agent Perps Positions in Competition Tool
export const GET_AGENT_PERPS_POSITIONS_IN_COMPETITION_TOOL: Tool = {
  name: 'getAgentPerpsPositionsInCompetition',
  description: 'Get perpetual futures positions for a specific agent in a competition.',
  inputSchema: {
    type: 'object',
    properties: {
      competitionId: {
        type: 'string',
        description: 'The ID of the competition',
      },
      agentId: {
        type: 'string',
        description: 'The ID of the agent',
      },
    },
    required: ['competitionId', 'agentId'],
  },
};

// Competition Partners Tool
export const GET_COMPETITION_PARTNERS_TOOL: Tool = {
  name: 'getCompetitionPartners',
  description: 'Get the sponsors/partners associated with a competition.',
  inputSchema: {
    type: 'object',
    properties: {
      competitionId: {
        type: 'string',
        description: 'The ID of the competition',
      },
    },
    required: ['competitionId'],
  },
};

// ============================================
// Global Leaderboard Tools
// ============================================

// Global Leaderboard Tool
export const GET_GLOBAL_LEADERBOARD_TOOL: Tool = {
  name: 'getGlobalLeaderboard',
  description: 'Get the global cross-competition leaderboard showing agent rankings across all competitions.',
  inputSchema: {
    type: 'object',
    properties: {
      type: {
        type: 'string',
        description: "Filter by competition type: 'trading', 'perpetual_futures', or 'spot_live_trading'",
        enum: ['trading', 'perpetual_futures', 'spot_live_trading'],
      },
      arenaId: {
        type: 'string',
        description: 'Filter by arena ID',
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
    },
    required: [],
  },
};

// ============================================
// Agent Tools
// ============================================

// List Agents Tool
export const LIST_AGENTS_TOOL: Tool = {
  name: 'listAgents',
  description: 'List all registered agents with optional filtering and pagination.',
  inputSchema: {
    type: 'object',
    properties: {
      filter: {
        type: 'string',
        description: 'Filter agents by name',
      },
      sort: {
        type: 'string',
        description: 'Sort field for agents',
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
    },
    required: [],
  },
};

// Get Agent Tool
export const GET_AGENT_TOOL: Tool = {
  name: 'getAgent',
  description: 'Get public profile information for a specific agent, including stats and competition history.',
  inputSchema: {
    type: 'object',
    properties: {
      agentId: {
        type: 'string',
        description: 'The ID of the agent',
      },
    },
    required: ['agentId'],
  },
};

// Get Agent Competitions Tool
export const GET_AGENT_COMPETITIONS_TOOL: Tool = {
  name: 'getAgentCompetitions',
  description: 'Get all competitions that a specific agent has participated in, with their performance in each.',
  inputSchema: {
    type: 'object',
    properties: {
      agentId: {
        type: 'string',
        description: 'The ID of the agent',
      },
      status: {
        type: 'string',
        description: "Filter by competition status: 'pending', 'active', 'ended', or 'all'",
        enum: ['pending', 'active', 'ended', 'all'],
      },
      sort: {
        type: 'string',
        description: 'Sort field for competitions',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of competitions to return (default: 100)',
        minimum: 1,
        maximum: 250,
      },
      offset: {
        type: 'number',
        description: 'Offset for pagination (default: 0)',
        minimum: 0,
      },
    },
    required: ['agentId'],
  },
};

// Export all tools together
export const competitionTools: Tool[] = [
  // Competition tools
  LIST_COMPETITIONS_TOOL,
  GET_COMPETITION_DETAILS_TOOL,
  GET_COMPETITION_RULES_TOOL,
  GET_COMPETITION_AGENTS_TOOL,
  GET_COMPETITION_TIMELINE_TOOL,
  GET_COMPETITION_TRADES_TOOL,
  GET_AGENT_TRADES_IN_COMPETITION_TOOL,
  GET_COMPETITION_PERPS_POSITIONS_TOOL,
  GET_AGENT_PERPS_POSITIONS_IN_COMPETITION_TOOL,
  GET_COMPETITION_PARTNERS_TOOL,
  
  // Global leaderboard
  GET_GLOBAL_LEADERBOARD_TOOL,
  
  // Agent tools
  LIST_AGENTS_TOOL,
  GET_AGENT_TOOL,
  GET_AGENT_COMPETITIONS_TOOL,
];
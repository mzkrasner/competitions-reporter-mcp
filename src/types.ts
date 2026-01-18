/**
 * API types for Recall Competitions
 * Synced from js-recall/packages/test-utils/src/types.ts
 */

// Base response type
export interface ApiResponse {
  success: boolean;
  message?: string;
}

// Competition Types
export type CompetitionType = 'trading' | 'perpetual_futures' | 'spot_live_trading';
export type CompetitionStatus = 'pending' | 'active' | 'ended';

// Cross-chain trading type
export type CrossChainTradingType = 'disallowAll' | 'disallowXParent' | 'allow';

// Blockchain types
export type BlockchainType = 'evm' | 'svm';

// Specific chains
export type SpecificChain =
  | 'eth'
  | 'polygon'
  | 'arbitrum'
  | 'optimism'
  | 'avalanche'
  | 'base'
  | 'linea'
  | 'zksync'
  | 'scroll'
  | 'mantle'
  | 'svm';

// Agent metadata structure
export interface AgentMetadata {
  ref?: {
    name?: string;
    version?: string;
    url?: string;
  };
  description?: string;
  social?: {
    name?: string;
    email?: string;
    twitter?: string;
  };
  [key: string]: unknown;
}

// Competition details
export interface Competition {
  id: string;
  name: string;
  description: string | null;
  externalUrl: string | null;
  imageUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  votingStartDate?: string | null;
  votingEndDate?: string | null;
  joinStartDate?: string | null;
  joinEndDate?: string | null;
  status: CompetitionStatus;
  type?: CompetitionType;
  crossChainTradingType: CrossChainTradingType;
  sandboxMode: boolean;
  createdAt: string;
  updatedAt: string;
  maxParticipants?: number | null;
  registeredParticipants: number;
  stats?: {
    totalTrades?: number;
    totalAgents?: number;
    totalVolume?: number;
    totalVotes?: number;
    uniqueTokens?: number;
    totalPositions?: number;
    averageEquity?: number;
  };
  tradingConstraints?: {
    minimumPairAgeHours?: number;
    minimum24hVolumeUsd?: number;
    minimumLiquidityUsd?: number;
    minimumFdvUsd?: number;
    minTradesPerDay?: number | null;
  };
  rewards?: Array<{
    rank: number;
    reward: number;
    agentId: string | null;
  }>;
  votingEnabled?: boolean;
}

// Enhanced competition with agent-specific metrics
export interface EnhancedCompetition extends Competition {
  portfolioValue: number;
  pnl: number;
  pnlPercent: number;
  totalTrades?: number;
  totalPositions?: number;
  competitionType?: string;
  bestPlacement?: {
    rank: number;
    totalAgents: number;
  };
}

// Agent Types
export interface Agent {
  id: string;
  name: string;
  handle?: string;
  description?: string | null;
  imageUrl?: string | null;
  active?: boolean;
  deactivationReason?: string | null;
}

export interface CompetitionAgent extends Agent {
  rank: number;
  score: number;
  portfolioValue: number;
  pnl: number;
  pnlPercent: number;
  change24h: number;
  change24hPercent: number;
  voteCount?: number;
  hasRiskMetrics: boolean;
  calmarRatio?: number | null;
  simpleReturn?: number | null;
  maxDrawdown?: number | null;
  sortinoRatio?: number | null;
}

// Leaderboard Agent (global rankings)
export interface LeaderboardAgent {
  id: string;
  name: string;
  imageUrl?: string;
  metadata?: AgentMetadata;
  rank: number;
  score: number;
  type: CompetitionType;
  numCompetitions: number;
}

// Trade Types
export interface Trade {
  id: string;
  agentId: string;
  agent: Agent;
  competitionId: string;
  fromToken: string;
  toToken: string;
  fromTokenSymbol: string;
  toTokenSymbol: string;
  fromAmount: number;
  toAmount: number;
  tradeAmountUsd: number;
  fromChain?: string;
  toChain?: string;
  fromSpecificChain?: string | null;
  toSpecificChain?: string | null;
  reason?: string;
  log?: string;
  timestamp: string;
  // Spot live specific fields
  tradeType?: 'simulated' | 'spot_live';
  txHash?: string | null;
}

// Perps Position Types
export interface PerpsPosition {
  id: string;
  agentId: string;
  agent?: Agent;
  competitionId: string;
  positionId?: string | null;
  marketId?: string | null;
  marketSymbol?: string | null;
  asset: string;
  isLong: boolean;
  leverage: number | null;
  size: number;
  collateral: number | null;
  averagePrice: number | null;
  markPrice: number;
  liquidationPrice?: number | null;
  unrealizedPnl?: number;
  realizedPnl?: number;
  pnlPercentage?: number | null;
  status: 'Open' | 'Closed' | 'Liquidated';
  openedAt: string;
  closedAt?: string | null;
  timestamp?: string;
}

// Perps position with embedded agent info
export interface PerpsPositionWithAgent extends PerpsPosition {
  agent: {
    id: string;
    name: string;
    imageUrl: string | null;
    description: string | null;
  };
}

// Timeline data point
export interface TimelineDataPoint {
  timestamp: string;
  totalValue: number;
  calmarRatio?: number | null;
  sortinoRatio?: number | null;
  maxDrawdown?: number | null;
  downsideDeviation?: number | null;
  simpleReturn?: number | null;
  annualizedReturn?: number | null;
}

// Agent timeline
export interface AgentTimeline {
  agentId: string;
  agentName: string;
  timeline: TimelineDataPoint[];
}

// Pagination
export interface Pagination {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// ============================================
// API Response Types
// ============================================

// Competition Detail Response
export interface CompetitionDetailResponse extends ApiResponse {
  success: true;
  competition: Competition;
}

// List Competitions Response
export interface CompetitionsListResponse extends ApiResponse {
  success: true;
  competitions: Competition[];
  pagination: Pagination;
}

// Competition Agents Response
export interface CompetitionAgentsResponse extends ApiResponse {
  success: true;
  competitionId?: string;
  agents: CompetitionAgent[];
  registeredParticipants: number;
  maxParticipants?: number | null;
  pagination?: Pagination;
}

// Competition Rules Response
export interface CompetitionRulesResponse extends ApiResponse {
  success: true;
  competition: Competition;
  rules: {
    tradingRules: string[];
    rateLimits: string[];
    availableChains: {
      svm: boolean;
      evm: string[];
    };
    slippageFormula: string;
    tradingConstraints?: {
      minimumPairAgeHours: number;
      minimum24hVolumeUsd: number;
      minimumLiquidityUsd: number;
      minimumFdvUsd: number;
      minTradesPerDay?: number;
    };
  };
}

// Competition Timeline Response
export interface CompetitionTimelineResponse extends ApiResponse {
  success: true;
  competitionId: string;
  timeline: AgentTimeline[];
}

// Trade History Response
export interface TradeHistoryResponse extends ApiResponse {
  success: true;
  trades: Trade[];
  total?: number;
  competition?: Competition;
  pagination?: Pagination;
}

// Competition All Perps Positions Response
export interface CompetitionAllPerpsPositionsResponse extends ApiResponse {
  success: true;
  positions: PerpsPositionWithAgent[];
  pagination?: Pagination;
}

// Agent Perps Positions Response (for specific agent)
export interface AgentPerpsPositionsResponse extends ApiResponse {
  success: true;
  competitionId: string;
  agentId: string;
  positions: PerpsPosition[];
}

// Global Leaderboard Response
export interface GlobalLeaderboardResponse extends ApiResponse {
  success: true;
  agents: LeaderboardAgent[];
  pagination: Pagination;
}

// Agents List Response
export interface AgentsListResponse extends ApiResponse {
  success: true;
  agents: Agent[];
  pagination?: Pagination;
}

// Public Agent Response
export interface PublicAgentResponse extends ApiResponse {
  success: true;
  agent: Agent & {
    ownerId?: string;
    walletAddress?: string;
    email?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    isVerified?: boolean;
    stats?: {
      completedCompetitions: number;
      totalTrades: number;
      totalPositions?: number;
      bestPlacement?: {
        competitionId: string;
        rank: number;
        score: number;
        totalAgents: number;
      };
      bestPnl?: number;
      totalRoi?: number;
    };
  };
}

// Agent Competitions Response
export interface AgentCompetitionsResponse extends ApiResponse {
  success: true;
  competitions: EnhancedCompetition[];
  pagination: Pagination;
}

// Competition Partners Response
export interface CompetitionPartnersResponse extends ApiResponse {
  success: true;
  partners: Array<{
    id: string;
    name: string;
    url: string | null;
    logoUrl: string | null;
    details: string | null;
    position: number;
    competitionPartnerId: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

// ============================================
// Parameter Types
// ============================================

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface TradeFilterParams extends PaginationParams {
  agentId?: string;
}

export interface PerpsPositionFilterParams extends PaginationParams {
  status?: 'Open' | 'Closed' | 'Liquidated' | 'all';
  agentId?: string;
}

export interface CompetitionsFilterParams extends PaginationParams {
  status?: CompetitionStatus | 'all';
  sort?: string;
}

export interface AgentsFilterParams extends PaginationParams {
  filter?: string;
  sort?: string;
}

export interface LeaderboardFilterParams extends PaginationParams {
  type?: CompetitionType;
  arenaId?: string;
}
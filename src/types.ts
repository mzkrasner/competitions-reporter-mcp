/**
 * API types for Recall Competitions
 * Extracted from the js-recall project
 */

// Competition Types
export type CompetitionType = 'trading' | 'perpetual_futures';
export type CompetitionStatus = 'pending' | 'active' | 'ended';

export interface Competition {
  id: string;
  name: string;
  description?: string;
  type: CompetitionType;
  status: CompetitionStatus;
  startDate: string;
  endDate?: string;
  maxParticipants?: number;
  registeredParticipants: number;
  imageUrl?: string;
  externalUrl?: string;
}

// Agent Types
export interface Agent {
  id: string;
  name: string;
  handle?: string;
  description?: string;
  imageUrl?: string;
  active: boolean;
  deactivationReason?: string;
}

export interface CompetitionAgent extends Agent {
  rank: number;
  score: number;
  portfolioValue: number;
  pnl: number;
  pnlPercent: number;
  change24h: number;
  change24hPercent: number;
  hasRiskMetrics: boolean;
  calmarRatio?: number;
  simpleReturn?: number;
  maxDrawdown?: number;
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
  fromSpecificChain?: string;
  toSpecificChain?: string;
  reason?: string;
  log?: string;
  timestamp: string;
}

// Perps Position Types
export interface PerpsPosition {
  id: string;
  agentId: string;
  agent: Agent;
  competitionId: string;
  asset: string;
  isLong: boolean;
  size: number;
  leverage: number;
  collateral: number;
  averagePrice: number;
  markPrice: number;
  unrealizedPnl?: number;
  realizedPnl?: number;
  pnlPercentage?: number;
  liquidationPrice?: number;
  status: 'Open' | 'Closed' | 'Liquidated';
  openedAt: string;
  closedAt?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CompetitionDetailResponse {
  success: boolean;
  competition: Competition;
}

export interface CompetitionAgentsResponse {
  success: boolean;
  agents: CompetitionAgent[];
  registeredParticipants: number;
  maxParticipants?: number;
  pagination?: {
    hasMore: boolean;
    total: number;
    limit: number;
    offset: number;
  };
}

export interface TradeHistoryResponse {
  success: boolean;
  trades: Trade[];
  total: number;
  pagination?: {
    hasMore: boolean;
    total: number;
    limit: number;
    offset: number;
  };
}

export interface CompetitionAllPerpsPositionsResponse {
  success: boolean;
  positions: PerpsPosition[];
  pagination?: {
    hasMore: boolean;
    total: number;
    limit: number;
    offset: number;
  };
}

// Pagination Parameters
export interface PaginationParams {
  limit?: number;
  offset?: number;
}

// Filter Parameters
export interface TradeFilterParams extends PaginationParams {
  agentId?: string;
}

export interface PerpsPositionFilterParams extends PaginationParams {
  status?: 'Open' | 'Closed' | 'Liquidated' | 'all';
  agentId?: string;
}

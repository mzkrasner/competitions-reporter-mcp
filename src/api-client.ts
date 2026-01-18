/**
 * API Client for Recall Competitions
 * Synced with js-recall/packages/test-utils/src/api-client.ts
 */

import {
  CompetitionDetailResponse,
  CompetitionAgentsResponse,
  CompetitionsListResponse,
  CompetitionRulesResponse,
  CompetitionTimelineResponse,
  TradeHistoryResponse,
  CompetitionAllPerpsPositionsResponse,
  AgentPerpsPositionsResponse,
  GlobalLeaderboardResponse,
  AgentsListResponse,
  PublicAgentResponse,
  AgentCompetitionsResponse,
  CompetitionPartnersResponse,
  PaginationParams,
  PerpsPositionFilterParams,
  CompetitionsFilterParams,
  AgentsFilterParams,
  LeaderboardFilterParams,
  CompetitionType,
} from './types.js';

const API_BASE_URL = 'https://api.competitions.recall.network';

export class CompetitionsApiClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string = API_BASE_URL) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  /**
   * Helper method to make authenticated API requests
   */
  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage: string;
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorJson.message || `API request failed: ${response.status}`;
      } catch {
        errorMessage = `API request failed: ${response.status} ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // ============================================
  // Competition Endpoints
  // ============================================

  /**
   * List competitions with optional filtering
   */
  async listCompetitions(
    params?: CompetitionsFilterParams
  ): Promise<CompetitionsListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.status !== undefined) {
      queryParams.append('status', params.status);
    }
    if (params?.sort !== undefined) {
      queryParams.append('sort', params.sort);
    }
    if (params?.limit !== undefined) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.offset !== undefined) {
      queryParams.append('offset', params.offset.toString());
    }

    const queryString = queryParams.toString();
    const url = `/api/competitions${queryString ? `?${queryString}` : ''}`;
    
    return this.request<CompetitionsListResponse>(url);
  }

  /**
   * Get competition details by ID
   */
  async getCompetitionDetails(competitionId: string): Promise<CompetitionDetailResponse> {
    return this.request<CompetitionDetailResponse>(
      `/api/competitions/${competitionId}`
    );
  }

  /**
   * Get competition rules
   */
  async getCompetitionRules(competitionId: string): Promise<CompetitionRulesResponse> {
    return this.request<CompetitionRulesResponse>(
      `/api/competitions/${competitionId}/rules`
    );
  }

  /**
   * Get agents participating in a competition (leaderboard)
   */
  async getCompetitionAgents(
    competitionId: string,
    params?: PaginationParams & { includeInactive?: boolean; filter?: string; sort?: string }
  ): Promise<CompetitionAgentsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.limit !== undefined) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.offset !== undefined) {
      queryParams.append('offset', params.offset.toString());
    }
    if (params?.includeInactive !== undefined) {
      queryParams.append('includeInactive', params.includeInactive.toString());
    }
    if (params?.filter !== undefined) {
      queryParams.append('filter', params.filter);
    }
    if (params?.sort !== undefined) {
      queryParams.append('sort', params.sort);
    }

    const queryString = queryParams.toString();
    const url = `/api/competitions/${competitionId}/agents${queryString ? `?${queryString}` : ''}`;
    
    return this.request<CompetitionAgentsResponse>(url);
  }

  /**
   * Get competition timeline (portfolio value history)
   */
  async getCompetitionTimeline(
    competitionId: string,
    bucket?: number
  ): Promise<CompetitionTimelineResponse> {
    const queryParams = new URLSearchParams();
    
    if (bucket !== undefined) {
      queryParams.append('bucket', bucket.toString());
    }

    const queryString = queryParams.toString();
    const url = `/api/competitions/${competitionId}/timeline${queryString ? `?${queryString}` : ''}`;
    
    return this.request<CompetitionTimelineResponse>(url);
  }

  /**
   * Get trades for a competition
   */
  async getCompetitionTrades(
    competitionId: string,
    params?: PaginationParams
  ): Promise<TradeHistoryResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.limit !== undefined) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.offset !== undefined) {
      queryParams.append('offset', params.offset.toString());
    }

    const queryString = queryParams.toString();
    const url = `/api/competitions/${competitionId}/trades${queryString ? `?${queryString}` : ''}`;
    
    return this.request<TradeHistoryResponse>(url);
  }

  /**
   * Get trades for a specific agent in a competition
   */
  async getAgentTradesInCompetition(
    competitionId: string,
    agentId: string,
    params?: PaginationParams
  ): Promise<TradeHistoryResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.limit !== undefined) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.offset !== undefined) {
      queryParams.append('offset', params.offset.toString());
    }

    const queryString = queryParams.toString();
    const url = `/api/competitions/${competitionId}/agents/${agentId}/trades${queryString ? `?${queryString}` : ''}`;
    
    return this.request<TradeHistoryResponse>(url);
  }

  /**
   * Get all perps positions for a competition
   */
  async getCompetitionAllPerpsPositions(
    competitionId: string,
    params?: PerpsPositionFilterParams
  ): Promise<CompetitionAllPerpsPositionsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.limit !== undefined) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.offset !== undefined) {
      queryParams.append('offset', params.offset.toString());
    }
    if (params?.status !== undefined) {
      queryParams.append('status', params.status);
    }

    const queryString = queryParams.toString();
    const url = `/api/competitions/${competitionId}/perps/all-positions${queryString ? `?${queryString}` : ''}`;
    
    return this.request<CompetitionAllPerpsPositionsResponse>(url);
  }

  /**
   * Get perps positions for a specific agent in a competition
   */
  async getAgentPerpsPositionsInCompetition(
    competitionId: string,
    agentId: string
  ): Promise<AgentPerpsPositionsResponse> {
    return this.request<AgentPerpsPositionsResponse>(
      `/api/competitions/${competitionId}/agents/${agentId}/perps/positions`
    );
  }

  /**
   * Get competition partners/sponsors
   */
  async getCompetitionPartners(competitionId: string): Promise<CompetitionPartnersResponse> {
    return this.request<CompetitionPartnersResponse>(
      `/api/competitions/${competitionId}/partners`
    );
  }

  // ============================================
  // Global Leaderboard Endpoints
  // ============================================

  /**
   * Get global leaderboard (cross-competition rankings)
   */
  async getGlobalLeaderboard(
    params?: LeaderboardFilterParams
  ): Promise<GlobalLeaderboardResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.limit !== undefined) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.offset !== undefined) {
      queryParams.append('offset', params.offset.toString());
    }
    if (params?.type !== undefined) {
      queryParams.append('type', params.type);
    }
    if (params?.arenaId !== undefined) {
      queryParams.append('arenaId', params.arenaId);
    }

    const queryString = queryParams.toString();
    const url = `/api/leaderboard${queryString ? `?${queryString}` : ''}`;
    
    return this.request<GlobalLeaderboardResponse>(url);
  }

  // ============================================
  // Agent Endpoints
  // ============================================

  /**
   * List all agents
   */
  async listAgents(
    params?: AgentsFilterParams
  ): Promise<AgentsListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.limit !== undefined) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.offset !== undefined) {
      queryParams.append('offset', params.offset.toString());
    }
    if (params?.filter !== undefined) {
      queryParams.append('filter', params.filter);
    }
    if (params?.sort !== undefined) {
      queryParams.append('sort', params.sort);
    }

    const queryString = queryParams.toString();
    const url = `/api/agents${queryString ? `?${queryString}` : ''}`;
    
    return this.request<AgentsListResponse>(url);
  }

  /**
   * Get public agent profile
   */
  async getAgent(agentId: string): Promise<PublicAgentResponse> {
    return this.request<PublicAgentResponse>(
      `/api/agents/${agentId}`
    );
  }

  /**
   * Get competitions an agent has participated in
   */
  async getAgentCompetitions(
    agentId: string,
    params?: CompetitionsFilterParams
  ): Promise<AgentCompetitionsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.status !== undefined) {
      queryParams.append('status', params.status);
    }
    if (params?.sort !== undefined) {
      queryParams.append('sort', params.sort);
    }
    if (params?.limit !== undefined) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.offset !== undefined) {
      queryParams.append('offset', params.offset.toString());
    }

    const queryString = queryParams.toString();
    const url = `/api/agents/${agentId}/competitions${queryString ? `?${queryString}` : ''}`;
    
    return this.request<AgentCompetitionsResponse>(url);
  }

  // ============================================
  // Pagination Helpers
  // ============================================

  /**
   * Fetch all items with pagination support
   * Generic helper for endpoints that support pagination
   */
  async fetchAllWithPagination<T extends { pagination?: { hasMore: boolean } }>(
    fetchFunction: (limit: number, offset: number) => Promise<T>,
    extractItems: (response: T) => unknown[],
    limit: number = 100
  ): Promise<unknown[]> {
    let allItems: unknown[] = [];
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const response = await fetchFunction(limit, offset);
      const items = extractItems(response);
      allItems = allItems.concat(items);
      
      hasMore = response.pagination?.hasMore ?? false;
      offset += limit;
    }

    return allItems;
  }

  /**
   * Get ALL trades for a competition (handles pagination automatically)
   */
  async getAllCompetitionTrades(competitionId: string): Promise<TradeHistoryResponse['trades']> {
    const items = await this.fetchAllWithPagination<TradeHistoryResponse>(
      (limit, offset) => this.getCompetitionTrades(competitionId, { limit, offset }),
      (response) => response.trades
    );
    
    return items as TradeHistoryResponse['trades'];
  }

  /**
   * Get ALL trades for a specific agent in a competition (handles pagination automatically)
   */
  async getAllAgentTradesInCompetition(
    competitionId: string,
    agentId: string
  ): Promise<TradeHistoryResponse['trades']> {
    const items = await this.fetchAllWithPagination<TradeHistoryResponse>(
      (limit, offset) => this.getAgentTradesInCompetition(competitionId, agentId, { limit, offset }),
      (response) => response.trades
    );
    
    return items as TradeHistoryResponse['trades'];
  }

  /**
   * Get ALL perps positions for a competition (handles pagination automatically)
   */
  async getAllCompetitionPerpsPositions(
    competitionId: string,
    status?: 'Open' | 'Closed' | 'Liquidated' | 'all'
  ): Promise<CompetitionAllPerpsPositionsResponse['positions']> {
    const items = await this.fetchAllWithPagination<CompetitionAllPerpsPositionsResponse>(
      (limit, offset) => this.getCompetitionAllPerpsPositions(competitionId, { limit, offset, status }),
      (response) => response.positions
    );
    
    return items as CompetitionAllPerpsPositionsResponse['positions'];
  }
}
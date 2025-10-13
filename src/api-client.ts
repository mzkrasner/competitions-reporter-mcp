/**
 * API Client for Recall Competitions
 */

import {
  CompetitionDetailResponse,
  CompetitionAgentsResponse,
  TradeHistoryResponse,
  CompetitionAllPerpsPositionsResponse,
  PaginationParams,
  PerpsPositionFilterParams,
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

  /**
   * Get competition details
   */
  async getCompetitionDetails(competitionId: string): Promise<CompetitionDetailResponse> {
    return this.request<CompetitionDetailResponse>(
      `/api/competitions/${competitionId}`
    );
  }

  /**
   * Get agents participating in a competition
   */
  async getCompetitionAgents(
    competitionId: string,
    params?: PaginationParams & { includeInactive?: boolean }
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

    const queryString = queryParams.toString();
    const url = `/api/competitions/${competitionId}/agents${queryString ? `?${queryString}` : ''}`;
    
    return this.request<CompetitionAgentsResponse>(url);
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

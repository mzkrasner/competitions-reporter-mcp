/**
 * Integration tests for the Competitions API Client
 * 
 * These tests make real API calls to verify the client works correctly.
 * Requires COMPETITIONS_API_KEY environment variable.
 * 
 * Run with: npm run test:integration
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { CompetitionsApiClient } from '../api-client.js';
import { TEST_COMPETITIONS } from './test-data.js';

const API_KEY = process.env.COMPETITIONS_API_KEY;
const hasApiKey = !!API_KEY;

describe.skipIf(!hasApiKey)('CompetitionsApiClient Integration Tests', () => {
  let client: CompetitionsApiClient;

  beforeAll(() => {
    client = new CompetitionsApiClient(API_KEY!);
  });

  // ============================================
  // Competition Listing Tests
  // ============================================

  describe('listCompetitions', () => {
    it('should list active competitions', async () => {
      const response = await client.listCompetitions({ status: 'active', limit: 5 });
      
      expect(response.success).toBe(true);
      expect(response.competitions).toBeDefined();
      expect(Array.isArray(response.competitions)).toBe(true);
      expect(response.pagination).toBeDefined();
    });

    it('should list ended competitions', async () => {
      const response = await client.listCompetitions({ status: 'ended', limit: 5 });
      
      expect(response.success).toBe(true);
      expect(response.competitions).toBeDefined();
      expect(Array.isArray(response.competitions)).toBe(true);
    });

    it('should support pagination', async () => {
      const page1 = await client.listCompetitions({ limit: 2, offset: 0 });
      const page2 = await client.listCompetitions({ limit: 2, offset: 2 });
      
      expect(page1.success).toBe(true);
      expect(page2.success).toBe(true);
      
      // If there are enough competitions, pages should be different
      if (page1.competitions.length > 0 && page2.competitions.length > 0) {
        expect(page1.competitions[0].id).not.toBe(page2.competitions[0].id);
      }
    });
  });

  // ============================================
  // Competition Details Tests
  // ============================================

  describe('getCompetitionDetails', () => {
    it('should get details for a paper trading competition', async () => {
      const response = await client.getCompetitionDetails(TEST_COMPETITIONS.PAPER_TRADING);
      
      expect(response.success).toBe(true);
      expect(response.competition).toBeDefined();
      expect(response.competition.id).toBe(TEST_COMPETITIONS.PAPER_TRADING);
      expect(response.competition.name).toBeDefined();
      expect(response.competition.status).toBeDefined();
      expect(response.competition.type).toBe('trading');
    });

    it('should get details for a spot live trading competition', async () => {
      const response = await client.getCompetitionDetails(TEST_COMPETITIONS.SPOT_LIVE_AERODROME);
      
      expect(response.success).toBe(true);
      expect(response.competition).toBeDefined();
      expect(response.competition.type).toBe('spot_live_trading');
    });

    it('should get details for a perps competition', async () => {
      const response = await client.getCompetitionDetails(TEST_COMPETITIONS.PERPS);
      
      expect(response.success).toBe(true);
      expect(response.competition).toBeDefined();
      expect(response.competition.type).toBe('perpetual_futures');
    });

    it('should include stats in competition details', async () => {
      const response = await client.getCompetitionDetails(TEST_COMPETITIONS.PAPER_TRADING);
      
      expect(response.success).toBe(true);
      expect(response.competition.stats).toBeDefined();
      // Paper trading should have totalTrades
      if (response.competition.type === 'trading') {
        expect(response.competition.stats?.totalTrades).toBeDefined();
      }
    });
  });

  // ============================================
  // Competition Rules Tests
  // ============================================

  describe('getCompetitionRules', () => {
    it('should get rules for a paper trading competition', async () => {
      const response = await client.getCompetitionRules(TEST_COMPETITIONS.PAPER_TRADING);
      
      expect(response.success).toBe(true);
      expect(response.rules).toBeDefined();
      expect(response.rules.tradingRules).toBeDefined();
      expect(Array.isArray(response.rules.tradingRules)).toBe(true);
      expect(response.rules.availableChains).toBeDefined();
    });

    it('should get rules for a spot live trading competition', async () => {
      const response = await client.getCompetitionRules(TEST_COMPETITIONS.SPOT_LIVE_AERODROME);
      
      expect(response.success).toBe(true);
      expect(response.rules).toBeDefined();
    });
  });

  // ============================================
  // Competition Agents (Leaderboard) Tests
  // ============================================

  describe('getCompetitionAgents', () => {
    it('should get leaderboard for a competition', async () => {
      const response = await client.getCompetitionAgents(TEST_COMPETITIONS.PAPER_TRADING, { limit: 10 });
      
      expect(response.success).toBe(true);
      expect(response.agents).toBeDefined();
      expect(Array.isArray(response.agents)).toBe(true);
      expect(response.registeredParticipants).toBeDefined();
    });

    it('should include agent performance metrics', async () => {
      const response = await client.getCompetitionAgents(TEST_COMPETITIONS.PAPER_TRADING, { limit: 5 });
      
      expect(response.success).toBe(true);
      
      if (response.agents.length > 0) {
        const agent = response.agents[0];
        expect(agent.id).toBeDefined();
        expect(agent.name).toBeDefined();
        expect(agent.rank).toBeDefined();
        expect(agent.portfolioValue).toBeDefined();
        expect(agent.pnl).toBeDefined();
        expect(agent.pnlPercent).toBeDefined();
      }
    });

    it('should support pagination', async () => {
      const page1 = await client.getCompetitionAgents(TEST_COMPETITIONS.PAPER_TRADING, { limit: 3, offset: 0 });
      const page2 = await client.getCompetitionAgents(TEST_COMPETITIONS.PAPER_TRADING, { limit: 3, offset: 3 });
      
      expect(page1.success).toBe(true);
      expect(page2.success).toBe(true);
      
      if (page1.agents.length > 0 && page2.agents.length > 0) {
        expect(page1.agents[0].id).not.toBe(page2.agents[0].id);
      }
    });
  });

  // ============================================
  // Competition Timeline Tests
  // ============================================

  describe('getCompetitionTimeline', () => {
    it('should get timeline for a competition', async () => {
      const response = await client.getCompetitionTimeline(TEST_COMPETITIONS.PAPER_TRADING);
      
      expect(response.success).toBe(true);
      expect(response.competitionId).toBe(TEST_COMPETITIONS.PAPER_TRADING);
      expect(response.timeline).toBeDefined();
      expect(Array.isArray(response.timeline)).toBe(true);
    });

    it('should include agent timelines with data points', async () => {
      const response = await client.getCompetitionTimeline(TEST_COMPETITIONS.PAPER_TRADING);
      
      expect(response.success).toBe(true);
      
      if (response.timeline.length > 0) {
        const agentTimeline = response.timeline[0];
        expect(agentTimeline.agentId).toBeDefined();
        expect(agentTimeline.agentName).toBeDefined();
        expect(agentTimeline.timeline).toBeDefined();
        expect(Array.isArray(agentTimeline.timeline)).toBe(true);
        
        if (agentTimeline.timeline.length > 0) {
          const dataPoint = agentTimeline.timeline[0];
          expect(dataPoint.timestamp).toBeDefined();
          expect(dataPoint.totalValue).toBeDefined();
        }
      }
    });

    it('should support bucket parameter', async () => {
      const response = await client.getCompetitionTimeline(TEST_COMPETITIONS.PAPER_TRADING, 60);
      
      expect(response.success).toBe(true);
      expect(response.timeline).toBeDefined();
    });
  });

  // ============================================
  // Competition Trades Tests
  // ============================================

  describe('getCompetitionTrades', () => {
    it('should get trades for a paper trading competition', async () => {
      const response = await client.getCompetitionTrades(TEST_COMPETITIONS.PAPER_TRADING, { limit: 10 });
      
      expect(response.success).toBe(true);
      expect(response.trades).toBeDefined();
      expect(Array.isArray(response.trades)).toBe(true);
    });

    it('should include trade details', async () => {
      const response = await client.getCompetitionTrades(TEST_COMPETITIONS.PAPER_TRADING, { limit: 5 });
      
      expect(response.success).toBe(true);
      
      if (response.trades.length > 0) {
        const trade = response.trades[0];
        expect(trade.id).toBeDefined();
        expect(trade.agentId).toBeDefined();
        expect(trade.fromToken).toBeDefined();
        expect(trade.toToken).toBeDefined();
        expect(trade.fromAmount).toBeDefined();
        expect(trade.toAmount).toBeDefined();
        expect(trade.timestamp).toBeDefined();
      }
    });

    it('should support pagination with offset', async () => {
      const page1 = await client.getCompetitionTrades(TEST_COMPETITIONS.PAPER_TRADING, { limit: 5, offset: 0 });
      const page2 = await client.getCompetitionTrades(TEST_COMPETITIONS.PAPER_TRADING, { limit: 5, offset: 100 });
      
      expect(page1.success).toBe(true);
      expect(page2.success).toBe(true);
      
      // Different offsets should return different trades
      if (page1.trades.length > 0 && page2.trades.length > 0) {
        expect(page1.trades[0].id).not.toBe(page2.trades[0].id);
      }
    });
  });

  // ============================================
  // Agent Trades in Competition Tests
  // ============================================

  describe('getAgentTradesInCompetition', () => {
    it('should get trades for a specific agent', async () => {
      // First get an agent from the competition
      const agentsResponse = await client.getCompetitionAgents(TEST_COMPETITIONS.PAPER_TRADING, { limit: 1 });
      expect(agentsResponse.success).toBe(true);
      
      if (agentsResponse.agents.length > 0) {
        const agentId = agentsResponse.agents[0].id;
        const response = await client.getAgentTradesInCompetition(
          TEST_COMPETITIONS.PAPER_TRADING,
          agentId,
          { limit: 10 }
        );
        
        expect(response.success).toBe(true);
        expect(response.trades).toBeDefined();
        expect(Array.isArray(response.trades)).toBe(true);
        
        // All trades should belong to this agent
        response.trades.forEach(trade => {
          expect(trade.agentId).toBe(agentId);
        });
      }
    });
  });

  // ============================================
  // Perps Positions Tests
  // ============================================

  describe('getCompetitionAllPerpsPositions', () => {
    it('should get positions for a perps competition', async () => {
      const response = await client.getCompetitionAllPerpsPositions(TEST_COMPETITIONS.PERPS, { limit: 10 });
      
      expect(response.success).toBe(true);
      expect(response.positions).toBeDefined();
      expect(Array.isArray(response.positions)).toBe(true);
    });

    it('should filter by status', async () => {
      const openResponse = await client.getCompetitionAllPerpsPositions(
        TEST_COMPETITIONS.PERPS,
        { status: 'Open', limit: 10 }
      );
      
      expect(openResponse.success).toBe(true);
      
      // All positions should be Open
      openResponse.positions.forEach(position => {
        expect(position.status).toBe('Open');
      });
    });

    it('should include position details', async () => {
      const response = await client.getCompetitionAllPerpsPositions(TEST_COMPETITIONS.PERPS, { limit: 5 });
      
      expect(response.success).toBe(true);
      
      if (response.positions.length > 0) {
        const position = response.positions[0];
        expect(position.id).toBeDefined();
        expect(position.agentId).toBeDefined();
        expect(position.asset).toBeDefined();
        expect(position.isLong).toBeDefined();
        expect(position.size).toBeDefined();
        expect(position.markPrice).toBeDefined();
        expect(position.status).toBeDefined();
        expect(position.agent).toBeDefined();
        expect(position.agent.name).toBeDefined();
      }
    });
  });

  // ============================================
  // Agent Perps Positions Tests
  // ============================================

  describe('getAgentPerpsPositionsInCompetition', () => {
    it('should get positions for a specific agent', async () => {
      // First get an agent from the competition
      const agentsResponse = await client.getCompetitionAgents(TEST_COMPETITIONS.PERPS, { limit: 1 });
      expect(agentsResponse.success).toBe(true);
      
      if (agentsResponse.agents.length > 0) {
        const agentId = agentsResponse.agents[0].id;
        const response = await client.getAgentPerpsPositionsInCompetition(
          TEST_COMPETITIONS.PERPS,
          agentId
        );
        
        expect(response.success).toBe(true);
        expect(response.agentId).toBe(agentId);
        expect(response.positions).toBeDefined();
        expect(Array.isArray(response.positions)).toBe(true);
      }
    });
  });

  // ============================================
  // Global Leaderboard Tests
  // ============================================

  describe('getGlobalLeaderboard', () => {
    it('should get global leaderboard', async () => {
      const response = await client.getGlobalLeaderboard({ limit: 10 });
      
      expect(response.success).toBe(true);
      expect(response.agents).toBeDefined();
      expect(Array.isArray(response.agents)).toBe(true);
      expect(response.pagination).toBeDefined();
    });

    it('should filter by competition type', async () => {
      const response = await client.getGlobalLeaderboard({ type: 'trading', limit: 10 });
      
      expect(response.success).toBe(true);
      
      // All agents should be from trading competitions
      response.agents.forEach(agent => {
        expect(agent.type).toBe('trading');
      });
    });

    it('should include agent ranking info', async () => {
      const response = await client.getGlobalLeaderboard({ limit: 5 });
      
      expect(response.success).toBe(true);
      
      if (response.agents.length > 0) {
        const agent = response.agents[0];
        expect(agent.id).toBeDefined();
        expect(agent.name).toBeDefined();
        expect(agent.rank).toBeDefined();
        expect(agent.score).toBeDefined();
        expect(agent.numCompetitions).toBeDefined();
      }
    });
  });

  // ============================================
  // Agent Endpoints Tests
  // ============================================

  describe('listAgents', () => {
    it('should list agents', async () => {
      const response = await client.listAgents({ limit: 10 });
      
      expect(response.success).toBe(true);
      expect(response.agents).toBeDefined();
      expect(Array.isArray(response.agents)).toBe(true);
    });
  });

  describe('getAgent', () => {
    it('should get agent details', async () => {
      // First get an agent ID from a competition
      const agentsResponse = await client.getCompetitionAgents(TEST_COMPETITIONS.PAPER_TRADING, { limit: 1 });
      expect(agentsResponse.success).toBe(true);
      
      if (agentsResponse.agents.length > 0) {
        const agentId = agentsResponse.agents[0].id;
        const response = await client.getAgent(agentId);
        
        expect(response.success).toBe(true);
        expect(response.agent).toBeDefined();
        expect(response.agent.id).toBe(agentId);
        expect(response.agent.name).toBeDefined();
      }
    });
  });

  describe('getAgentCompetitions', () => {
    it('should get competitions for an agent', async () => {
      // First get an agent ID from a competition
      const agentsResponse = await client.getCompetitionAgents(TEST_COMPETITIONS.PAPER_TRADING, { limit: 1 });
      expect(agentsResponse.success).toBe(true);
      
      if (agentsResponse.agents.length > 0) {
        const agentId = agentsResponse.agents[0].id;
        const response = await client.getAgentCompetitions(agentId, { limit: 10 });
        
        expect(response.success).toBe(true);
        expect(response.competitions).toBeDefined();
        expect(Array.isArray(response.competitions)).toBe(true);
        
        // Should include the competition we got the agent from
        const competitionIds = response.competitions.map(c => c.id);
        expect(competitionIds).toContain(TEST_COMPETITIONS.PAPER_TRADING);
      }
    });
  });

  // ============================================
  // Pagination Helper Tests
  // ============================================

  describe('getAllCompetitionTrades', () => {
    it('should fetch all trades with pagination', async () => {
      // Use spot live competition (~1300 trades) to test pagination works correctly
      // This still requires multiple API calls to verify pagination logic
      const allTrades = await client.getAllCompetitionTrades(TEST_COMPETITIONS.SPOT_LIVE_AERODROME);
      
      expect(Array.isArray(allTrades)).toBe(true);
      // Should have more than 100 trades (proves pagination worked)
      expect(allTrades.length).toBeGreaterThan(100);
      
      // Verify we got unique trades (no duplicates from pagination)
      const tradeIds = allTrades.map(t => t.id);
      const uniqueIds = new Set(tradeIds);
      expect(uniqueIds.size).toBe(tradeIds.length);
    }, 60000);
  });

  // ============================================
  // Error Handling Tests
  // ============================================

  describe('Error Handling', () => {
    it('should handle invalid competition ID gracefully', async () => {
      await expect(
        client.getCompetitionDetails('invalid-uuid-format')
      ).rejects.toThrow();
    });

    it('should handle non-existent competition ID', async () => {
      await expect(
        client.getCompetitionDetails('00000000-0000-0000-0000-000000000000')
      ).rejects.toThrow();
    });
  });
});
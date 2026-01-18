/**
 * Test data for integration tests
 * 
 * These are real competition IDs from https://app.recall.network/competitions/
 * 
 * Competition Types:
 * - trading: Paper trading (simulated)
 * - spot_live_trading: Live spot trading with real tokens
 * - perpetual_futures: Perps trading (simulated)
 */

export const TEST_COMPETITIONS = {
  // Spot Live Trading competitions (type: spot_live_trading)
  SPOT_LIVE_AERODROME: '39ba2008-cc5d-4a93-8f8e-1eb47c835462', // Single Asset Trading on Aerodrome
  
  // Paper trading competitions (type: trading)
  PAPER_TRADING: 'd2d43ece-2bda-4e59-85b6-0440c2a43165', // Paper Trading Competition (~30k trades)
  
  // Perps competitions (type: perpetual_futures)
  PERPS: 'f344ef3d-fb13-4607-a4af-34e31109571d', // Perps Trading Competition
} as const;

export type TestCompetitionKey = keyof typeof TEST_COMPETITIONS;

/**
 * Map of competition types to their test IDs
 */
export const COMPETITIONS_BY_TYPE = {
  spot_live_trading: TEST_COMPETITIONS.SPOT_LIVE_AERODROME,
  trading: TEST_COMPETITIONS.PAPER_TRADING,
  perpetual_futures: TEST_COMPETITIONS.PERPS,
} as const;
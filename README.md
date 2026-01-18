# Reporter MCP

A Model Context Protocol (MCP) server that provides access to the Recall Competitions API. This server enables AI agents to retrieve competition data, including details, leaderboards, trades, and perpetual futures positions.

## Features

The Reporter MCP provides comprehensive access to competition data:

- **Competition Management**: List, filter, and get details for trading competitions (paper trading, spot live trading, perpetual futures)
- **Agent Leaderboards**: View rankings and performance metrics for competing agents with PnL, portfolio values, and risk metrics
- **Trade History**: Access paper trading and spot live trading competition trades with full token swap details
- **Perps Positions**: Monitor perpetual futures positions including leverage, collateral, PnL, and liquidation data
- **Global Rankings**: Access cross-competition leaderboards and agent profiles
- **Timeline Data**: Get historical portfolio value snapshots for charting performance

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```

## Required Environment Variables

The Reporter MCP requires the following environment variable:

```
COMPETITIONS_API_KEY=your_api_key_here
```

Optional configuration:

```
COMPETITIONS_API_URL=https://api.competitions.recall.network  # Override default API URL
DEBUG=true  # Enable debug logging
```

### Setting up Environment Variables

Create a `.env` file in the project root:

```bash
COMPETITIONS_API_KEY=your_api_key_here
# Optional
COMPETITIONS_API_URL=https://api.competitions.recall.network
DEBUG=false
```

## Tools

The server exposes 14 MCP tools organized into three categories:

### Competition Tools

| Tool Name | Description | Parameters |
|-----------|-------------|------------|
| `listCompetitions` | List all competitions with optional filtering | `status?`: 'pending' \| 'active' \| 'ended' \| 'all', `sort?`: String, `limit?`: Number (1-100), `offset?`: Number |
| `getCompetitionDetails` | Get detailed information about a specific competition | `competitionId`: String (required) |
| `getCompetitionRules` | Get trading rules and constraints for a competition | `competitionId`: String (required) |
| `getCompetitionAgents` | Get the leaderboard and performance metrics for agents | `competitionId`: String (required), `limit?`: Number (1-250), `offset?`: Number, `includeInactive?`: Boolean, `filter?`: String, `sort?`: String |
| `getCompetitionTimeline` | Get portfolio value history over time for all agents | `competitionId`: String (required), `bucket?`: Number (time interval in minutes) |
| `getCompetitionTrades` | Get trade history for paper/spot live trading competitions | `competitionId`: String (required), `limit?`: Number (1-250), `offset?`: Number, `fetchAll?`: Boolean |
| `getAgentTradesInCompetition` | Get trades for a specific agent in a competition | `competitionId`: String (required), `agentId`: String (required), `limit?`: Number, `offset?`: Number, `fetchAll?`: Boolean |
| `getCompetitionPerpsPositions` | Get perpetual futures positions for a competition | `competitionId`: String (required), `status?`: 'Open' \| 'Closed' \| 'Liquidated' \| 'all', `limit?`: Number (1-250), `offset?`: Number, `fetchAll?`: Boolean |
| `getAgentPerpsPositionsInCompetition` | Get perps positions for a specific agent | `competitionId`: String (required), `agentId`: String (required) |
| `getCompetitionPartners` | Get sponsors/partners for a competition | `competitionId`: String (required) |

### Global Leaderboard Tools

| Tool Name | Description | Parameters |
|-----------|-------------|------------|
| `getGlobalLeaderboard` | Get cross-competition agent rankings | `type?`: 'trading' \| 'perpetual_futures' \| 'spot_live_trading', `arenaId?`: String, `limit?`: Number (1-250), `offset?`: Number |

### Agent Tools

| Tool Name | Description | Parameters |
|-----------|-------------|------------|
| `listAgents` | List all registered agents | `filter?`: String, `sort?`: String, `limit?`: Number (1-250), `offset?`: Number |
| `getAgent` | Get public profile for a specific agent | `agentId`: String (required) |
| `getAgentCompetitions` | Get all competitions an agent has participated in | `agentId`: String (required), `status?`: 'pending' \| 'active' \| 'ended' \| 'all', `sort?`: String, `limit?`: Number, `offset?`: Number |

### Tool Details

#### listCompetitions
Returns a paginated list of competitions with:
- Competition ID, name, description, and type (trading, perpetual_futures, spot_live_trading)
- Status (pending, active, ended)
- Start/end dates and join windows
- Participant counts and limits
- Trading constraints and rewards

#### getCompetitionDetails
Returns comprehensive competition information including:
- Competition name, description, and type
- Status (pending, active, ended)
- Start and end dates
- Maximum and registered participant counts
- Stats (total trades, total agents, total volume)
- Spot live config (for spot_live_trading type)

#### getCompetitionRules
Returns trading rules and constraints:
- Trading rules (token eligibility, trade limits, slippage)
- Rate limits per endpoint
- Available chains (EVM and SVM)
- Slippage formula
- Trading constraints (minimum volume, liquidity, FDV)

#### getCompetitionAgents
Returns ranked list of agents with:
- Portfolio values and PnL (absolute and percentage)
- 24-hour changes
- Risk metrics (Calmar ratio, Sortino ratio, max drawdown)
- Active/inactive status with deactivation reasons

#### getCompetitionTimeline
Returns historical portfolio snapshots:
- Timestamp and total portfolio value per agent
- Risk metrics over time (for perps competitions)
- Configurable time bucket intervals

#### getCompetitionTrades
Returns trade history with:
- Token pairs (from/to symbols and addresses)
- Trade amounts and USD values
- Timestamps and chain information
- Trade reasons and logs
- Agent information

#### getAgentTradesInCompetition
Returns trades for a specific agent:
- Same data as getCompetitionTrades but filtered by agent
- Useful for analyzing individual agent strategies

#### getCompetitionPerpsPositions
Returns perpetual futures positions with:
- Asset, size, and leverage
- Collateral and average/mark prices
- Unrealized and realized PnL
- Liquidation prices
- Position status and timestamps
- Embedded agent information

#### getAgentPerpsPositionsInCompetition
Returns perps positions for a specific agent:
- All positions (open, closed, liquidated) for the agent
- Full position details including PnL history

#### getCompetitionPartners
Returns competition sponsors/partners:
- Partner name, URL, and logo
- Display position and details

#### getGlobalLeaderboard
Returns cross-competition rankings:
- Agent ID, name, and profile info
- Global rank and score
- Number of competitions participated
- Filterable by competition type or arena

#### listAgents
Returns all registered agents:
- Agent ID, name, handle, and description
- Profile image and metadata
- Status and verification info

#### getAgent
Returns detailed agent profile:
- Basic info (name, handle, description, image)
- Owner information
- Stats (completed competitions, total trades, best placement)
- Trophies from past competitions
- Skills and verification status

#### getAgentCompetitions
Returns agent's competition history:
- All competitions with performance metrics
- Portfolio value, PnL, and rankings per competition
- Competition type and status

## Usage

### Running Locally

```bash
# Start the server with environment variables
COMPETITIONS_API_KEY=your_api_key_here npm start
```

### Adding to Cursor

To add this MCP server to Cursor:

1. In Cursor, go to Settings > MCP Servers
2. Click "Add Server"
3. Configure the server with the following settings:
   - **Name**: `Reporter MCP` (or any name you prefer)
   - **Type**: `command`
   - **Command**: `node`
   - **Arguments**: `/path/to/reporter-mcp/dist/index.js` (replace with your actual path)
   - **Environment Variables**:
     - `COMPETITIONS_API_KEY`: Your API key
     - `COMPETITIONS_API_URL`: (optional) API URL if not using production
     - `DEBUG`: (optional) Set to `true` for debug logging
4. Click "Save"

### Using Environment Variables in Cursor Configuration

Configure Cursor via the `.cursor/mcp.json` file in your home directory:

```json
{
  "mcpServers": {
    "reporter-mcp": {
      "command": "node",
      "args": [
        "/path/to/reporter-mcp/dist/index.js"
      ],
      "env": {
        "COMPETITIONS_API_KEY": "your_api_key_here",
        "COMPETITIONS_API_URL": "https://api.competitions.recall.network",
        "DEBUG": "false"
      }
    }
  }
}
```

Using npx:

```json
{
  "mcpServers": {
    "reporter-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "github:mzkrasner/reporter-mcp"
      ],
      "env": {
        "COMPETITIONS_API_KEY": "your_api_key_here",
        "COMPETITIONS_API_URL": "https://api.competitions.recall.network",
        "DEBUG": "false"
      }
    }
  }
}
```

## Example Usage

Once configured, you can use natural language to interact with the competitions API:

### Competition Queries
- "List all active competitions"
- "Get details for competition f344ef3d-fb13-4607-a4af-34e31109571d"
- "Show me the rules for the paper trading competition"
- "Get the timeline data for competition xyz with 60-minute buckets"

### Leaderboard Queries
- "Show me the leaderboard for competition d2d43ece-2bda-4e59-85b6-0440c2a43165"
- "Get the global leaderboard for paper trading competitions"
- "Show the top 10 agents in perpetual futures"

### Trade & Position Queries
- "Get all trades for the paper trading competition"
- "Show trades for agent abc in competition xyz"
- "Show open perps positions for the perpetual futures competition"
- "Get all positions for agent xyz in the perps competition"

### Agent Queries
- "List all agents"
- "Get profile for agent f9231850-39f2-4e4f-b5de-d27a9ea5c180"
- "Show all competitions that agent xyz has participated in"

### Pagination

For large datasets, use pagination parameters:
- `limit`: Number of items to return (max 250)
- `offset`: Starting position for results
- `fetchAll`: Set to `true` to fetch all items (may be slow for large datasets)

## Development

### Building from Source

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev
```

### Running Tests

The project includes integration tests that verify the API client works correctly against the production API.

```bash
# Run unit tests
npm test

# Run integration tests (requires COMPETITIONS_API_KEY)
npm run test:integration

# Watch mode for development
npm run test:watch
```

**Note:** Integration tests require a valid `COMPETITIONS_API_KEY` environment variable. Tests without the key will be skipped gracefully.

### Important Note for Development

When developing the MCP server, use `console.error()` instead of `console.log()` for all debugging and logging statements. The MCP protocol communicates with the client via stdout, so any `console.log()` statements will interfere with this communication.

## Competition Types

The API supports three types of trading competitions:

| Type | Description |
|------|-------------|
| `trading` | Paper trading with simulated token swaps across EVM and SVM chains |
| `perpetual_futures` | Live perpetual futures trading on Hyperliquid |
| `spot_live_trading` | Live on-chain spot trading tracked via RPC/indexer |

## API Documentation

For more details about the Recall Competitions API:
- Production: https://api.competitions.recall.network
- Sandbox: https://api.sandbox.competitions.recall.network
- Web App: https://app.recall.network/competitions

## License

MIT
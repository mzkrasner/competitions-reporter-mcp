# Reporter MCP

A Model Context Protocol (MCP) server that provides access to the Recall Competitions API. This server enables AI agents to retrieve competition data, including details, leaderboards, trades, and perpetual futures positions.

## Features

The Reporter MCP provides comprehensive access to competition data:

- **Competition Details**: Get comprehensive information about competitions including type, status, dates, and participant counts
- **Agent Leaderboards**: View rankings and performance metrics for competing agents with PnL, portfolio values, and risk metrics
- **Trade History**: Access paper trading competition trades with full token swap details, amounts, and timestamps
- **Perps Positions**: Monitor perpetual futures positions including leverage, collateral, PnL, and liquidation data

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

The server exposes the following MCP tools:

| Tool Name | Description | Parameters |
|-----------|-------------|------------|
| `getCompetitionDetails` | Get detailed information about a specific competition | `competitionId`: String (required) |
| `getCompetitionAgents` | Get the leaderboard and performance metrics for agents | `competitionId`: String (required), `limit?`: Number (1-250), `offset?`: Number, `includeInactive?`: Boolean |
| `getCompetitionTrades` | Get trade history for a paper trading competition | `competitionId`: String (required), `limit?`: Number (1-250), `offset?`: Number, `fetchAll?`: Boolean |
| `getCompetitionPerpsPositions` | Get perpetual futures positions for a competition | `competitionId`: String (required), `status?`: String ('Open', 'Closed', 'Liquidated', 'all'), `limit?`: Number (1-250), `offset?`: Number, `fetchAll?`: Boolean |

### Tool Details

#### getCompetitionDetails
Returns comprehensive competition information including:
- Competition name, description, and type
- Status (pending, active, ended)
- Start and end dates
- Maximum and registered participant counts

#### getCompetitionAgents
Returns ranked list of agents with:
- Portfolio values and PnL (absolute and percentage)
- 24-hour changes
- Risk metrics (Calmar ratio, Sharpe ratio, max drawdown)
- Active/inactive status with deactivation reasons

#### getCompetitionTrades
Returns trade history with:
- Token pairs (from/to symbols and addresses)
- Trade amounts and USD values
- Timestamps and chain information
- Trade reasons and logs
- Agent information

#### getCompetitionPerpsPositions
Returns perpetual futures positions with:
- Asset, size, and leverage
- Collateral and average/mark prices
- Unrealized and realized PnL
- Liquidation prices
- Position status and timestamps

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

- "Get details for competition f344ef3d-fb13-4607-a4af-34e31109571d"
- "Show me the leaderboard for competition d2d43ece-2bda-4e59-85b6-0440c2a43165"
- "Get all trades for the paper trading competition"
- "Show open perps positions for the perpetual futures competition"
- "Fetch all positions with status 'Open' for competition xyz"

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

### Important Note for Development

When developing the MCP server, use `console.error()` instead of `console.log()` for all debugging and logging statements. The MCP protocol communicates with the client via stdout, so any `console.log()` statements will interfere with this communication.

## API Documentation

For more details about the Recall Competitions API:
- Production: https://api.competitions.recall.network
- Sandbox: https://api.sandbox.competitions.recall.network

## License

MIT
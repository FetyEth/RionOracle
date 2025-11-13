# Sports Data Integration Guide

## Overview

This guide explains how to integrate The Odds API with RION Oracle nodes to fetch real-time sports data for the prediction market.

## The Odds API Setup

**Plan:** $30/month, 20,000 credits/month
**Features:**
- All sports (NBA, NFL, MLB, NHL, Soccer, etc.)
- All bookmakers (DraftKings, FanDuel, Bet365, etc.)
- All betting markets (Moneyline, Spread, Totals, Props)
- Historical odds data

### API Key Setup

\`\`\`bash
# Add to your .env file
ODDS_API_KEY=your_api_key_here
ODDS_API_BASE_URL=https://api.the-odds-api.com/v4
\`\`\`

## Oracle Node Integration

### 1. Fetch Sports Data

Create a new oracle node script that fetches sports data instead of price data:

\`\`\`javascript
// oracle-node/src/sports-fetcher.js
import fetch from 'node-fetch';

const ODDS_API_KEY = process.env.ODDS_API_KEY;
const BASE_URL = 'https://api.the-odds-api.com/v4';

/**
 * Fetch upcoming NBA games
 */
export async function fetchNBAGames() {
  const response = await fetch(
    `${BASE_URL}/sports/basketball_nba/odds/?apiKey=${ODDS_API_KEY}&regions=us&markets=h2h,spreads,totals&oddsFormat=decimal`
  );
  
  const data = await response.json();
  return data;
}

/**
 * Fetch live scores for a specific game
 */
export async function fetchGameScore(gameId) {
  const response = await fetch(
    `${BASE_URL}/sports/basketball_nba/scores/?apiKey=${ODDS_API_KEY}&daysFrom=1`
  );
  
  const data = await response.json();
  const game = data.find(g => g.id === gameId);
  
  if (!game || !game.completed) {
    return null;
  }
  
  return {
    homeScore: game.scores.find(s => s.name === game.home_team).score,
    awayScore: game.scores.find(s => s.name === game.away_team).score,
    completed: game.completed
  };
}

/**
 * Convert game data to oracle feed format
 */
export function gameToFeedData(game) {
  const feedId = `NBA/${game.home_team}-${game.away_team}`;
  
  // For moneyline: positive = home win, negative = away win, 0 = draw
  const homeOdds = game.bookmakers[0].markets.find(m => m.key === 'h2h').outcomes.find(o => o.name === game.home_team).price;
  const awayOdds = game.bookmakers[0].markets.find(m => m.key === 'h2h').outcomes.find(o => o.name === game.away_team).price;
  
  return {
    feedId,
    matchId: game.id,
    homeTeam: game.home_team,
    awayTeam: game.away_team,
    commenceTime: game.commence_time,
    odds: {
      moneyline: { home: homeOdds, away: awayOdds },
      spread: game.bookmakers[0].markets.find(m => m.key === 'spreads'),
      totals: game.bookmakers[0].markets.find(m => m.key === 'totals')
    }
  };
}
\`\`\`

### 2. Oracle Node Submission

Update your oracle node to submit sports data:

\`\`\`javascript
// oracle-node/src/submit-sports-data.js
import { ethers } from 'ethers';
import { fetchNBAGames, fetchGameScore, gameToFeedData } from './sports-fetcher.js';

const provider = new ethers.JsonRpcProvider(process.env.BNB_TESTNET_RPC);
const wallet = new ethers.Wallet(process.env.COUNCIL_PRIVATE_KEY, provider);

const AGGREGATOR_ADDRESS = process.env.AGGREGATOR_ADDRESS;
const AGGREGATOR_ABI = [...]; // Your Aggregator ABI

const aggregator = new ethers.Contract(AGGREGATOR_ADDRESS, AGGREGATOR_ABI, wallet);

/**
 * Submit game result to oracle
 */
async function submitGameResult(gameId) {
  const score = await fetchGameScore(gameId);
  
  if (!score || !score.completed) {
    console.log('Game not completed yet');
    return;
  }
  
  // Calculate result
  const scoreDiff = score.homeScore - score.awayScore;
  
  // Create report
  const report = {
    feedId: ethers.id(`NBA/${gameId}`),
    observations: [scoreDiff], // Positive = home win, negative = away win
    timestamp: Math.floor(Date.now() / 1000),
    roundId: 1,
    merkleRoot: ethers.ZeroHash,
    signerBitmap: 1,
    aggregateSignature: '0x00' // Sign this in production
  };
  
  // Submit to chain
  const tx = await aggregator.submitReport(report);
  await tx.wait();
  
  console.log(`Submitted result for game ${gameId}: ${scoreDiff}`);
}

/**
 * Monitor games and submit results when completed
 */
async function monitorGames() {
  const games = await fetchNBAGames();
  
  for (const game of games) {
    const gameData = gameToFeedData(game);
    
    // Check if game is completed
    if (new Date(gameData.commenceTime) < new Date()) {
      await submitGameResult(gameData.matchId);
    }
  }
}

// Run every 5 minutes
setInterval(monitorGames, 5 * 60 * 1000);
monitorGames(); // Run immediately
\`\`\`

### 3. Frontend Integration

Update your frontend to fetch from The Odds API:

\`\`\`typescript
// app/predictions/actions.ts
'use server'

const ODDS_API_KEY = process.env.ODDS_API_KEY;

export async function fetchUpcomingGames() {
  const response = await fetch(
    `https://api.the-odds-api.com/v4/sports/basketball_nba/odds/?apiKey=${ODDS_API_KEY}&regions=us&markets=h2h,spreads,totals&oddsFormat=american`,
    { next: { revalidate: 60 } } // Cache for 1 minute
  );
  
  const data = await response.json();
  return data;
}

export async function fetchLiveScores() {
  const response = await fetch(
    `https://api.the-odds-api.com/v4/sports/basketball_nba/scores/?apiKey=${ODDS_API_KEY}&daysFrom=1`,
    { next: { revalidate: 10 } } // Cache for 10 seconds
  );
  
  const data = await response.json();
  return data;
}
\`\`\`

## Deployment Steps

1. **Deploy PredictionMarket Contract**
   \`\`\`bash
   forge script script/DeployPrediction.s.sol --rpc-url $BNB_TESTNET_RPC --broadcast
   \`\`\`

2. **Set up Oracle Nodes**
   - Install dependencies: `npm install`
   - Configure `.env` with API keys
   - Run oracle node: `node src/submit-sports-data.js`

3. **Create Markets**
   \`\`\`javascript
   // Create a market for Lakers vs Warriors
   await predictionMarket.createMarket(
     ethers.id('LAL-GSW-2025-01-15'),
     ethers.id('NBA/LAL-GSW'),
     0, // MONEYLINE
     Math.floor(Date.now() / 1000) + 3600, // Lock 1 hour before game
     0 // No line for moneyline
   );
   \`\`\`

4. **Monitor and Resolve**
   - Oracle nodes automatically submit results when games complete
   - Call `resolveMarket()` to finalize
   - Users claim winnings

## API Rate Limits

**20,000 credits/month = ~667 requests/day**

Optimize usage:
- Cache responses (1-5 minutes)
- Only fetch active games
- Use webhooks if available
- Batch requests when possible

## Testing

Test with The Odds API sandbox:
\`\`\`bash
# Test endpoint
curl "https://api.the-odds-api.com/v4/sports/?apiKey=YOUR_KEY"
\`\`\`

## Production Checklist

- [ ] API key secured in environment variables
- [ ] Oracle nodes running on reliable servers
- [ ] Monitoring and alerts set up
- [ ] Rate limiting implemented
- [ ] Error handling for API failures
- [ ] Backup data sources configured
- [ ] Smart contracts audited
- [ ] Frontend tested with real data

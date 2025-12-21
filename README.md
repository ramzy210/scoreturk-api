# ScoreTurk API Proxy

Vercel serverless functions that proxy requests to API-Football.

## Setup

1. Sign up at https://www.api-football.com/ and get your API key
2. Deploy to Vercel:
   - Go to https://vercel.com
   - Click "Add New" > "Project"
   - Import this repository or upload the folder
   - Add environment variable: `API_FOOTBALL_KEY` = your API key
   - Deploy

## Available Endpoints

- `GET /api/football/live` - Live matches
- `GET /api/football/fixtures?league=203&season=2024` - Fixtures by league
- `GET /api/football/statistics?fixture=123456` - Match statistics
- `GET /api/football/lineups?fixture=123456` - Match lineups
- `GET /api/football/events?fixture=123456` - Match events (goals, cards)
- `GET /api/football/standings?league=203&season=2024` - League standings
- `GET /api/football/leagues?country=Turkey` - Available leagues

## Turkish Süper Lig

League ID: 203
Current Season: 2024

Example: `/api/football/fixtures?league=203&season=2024`

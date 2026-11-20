# Fisustaja

A web app for running fishing competitions, either standalone or linked together into a Cup. It covers the whole race day: signing boats in, weighing the catch, and publishing results and statistics.

I built it for myself, on and off since 2020, mainly to learn Node, MongoDB, JavaScript and Vue. It's definitely not the most efficient or the most clever design, because I wanted to explore different things along the way. In 2026 the frontend was migrated from Vue 2 to Vue 3.5, Vuetify 4 and Vite (see [MIGRATION.md](MIGRATION.md)), and the auth, API and UI were reworked.

The results used as example data come from [savo-karjalacup](https://www.savokarjalacup.com/tulokset/). The app used to run on Render, but it isn't hosted anywhere at the moment.

## Features

- **Competitions and cups**: create competitions with their own fish species, multipliers and schedule, and link them into a cup with cumulative points
- **Signing**: register boats and teams into a competition
- **Weighing**: weigh queue, per-species weight inputs, biggest fish entries and live standings while the weighing is going on
- **Results**: individual and team results, podium, biggest fishes, biggest catches and statistics charts
- **Cup overview**: standings and statistics across all competitions in a cup
- **Sharing**: PDF and CSV export, plus public result pages for competitions and cups marked as public (shareable link or the phone's share sheet)
- **Accounts**: login with httpOnly cookies and login rate limiting; admins create users and see everyone's cups and competitions
- Finnish and English UI, light and dark theme

## Tech stack

|          |                                                                        |
| -------- | ---------------------------------------------------------------------- |
| Frontend | Vue 3.5, Vuetify 4, Pinia, Vue Router, vue-i18n, Chart.js, jsPDF, Vite |
| Backend  | Node.js, Express 4, MongoDB with Mongoose 8, Passport (JWT)            |
| Tests    | Node's built-in test runner (API), Vitest (client helpers)             |

## Getting started

### Requirements

- Node.js 22.18+ or 24.11+ (needed by the client build tools)
- A MongoDB database, either [local](https://www.mongodb.com/docs/manual/installation/) or [MongoDB Atlas](https://www.mongodb.com/docs/atlas/getting-started/)

### Setup

1. Copy [server/template.env](server/template.env) to `server/.env` and fill it in (see the table below).
2. Install dependencies in both the root and the client:

   ```bash
   npm install
   cd client && npm install
   ```

### Development

```bash
npm run dev
```

This runs the API with nodemon on port 5000 and the Vite dev server on http://localhost:8080, which proxies `/api` to the API. You can also run them separately with `npm run server` in the root and `npm run dev` in `client`.

### Production

```bash
npm run build-app   # builds the client into server/public
npm start           # Express serves the API and the built client
```

### Tests and linting

```bash
npm test              # server and client suites
npm run test:server   # API routes only; they run against in-memory stand-ins, no MongoDB needed
cd client && npm run lint
```

### Environment variables

| Variable       | Description                                                                           |
| -------------- | ------------------------------------------------------------------------------------- |
| `MONGODB_URI`  | MongoDB connection string                                                             |
| `DB`           | Database name                                                                         |
| `DEV_DB`       | Second database for testing, used when `TESTING=true`                                 |
| `TESTING`      | `true` to use `DEV_DB` instead of `DB`                                                |
| `SECRET`       | Secret for signing auth tokens                                                        |
| `NODE_ENV`     | `development` or `production` (production sends auth cookies over HTTPS only)         |
| `PORT`         | Optional, defaults to 5000                                                            |
| `TRUST_PROXY`  | Optional, set to `1` behind a reverse proxy so the login limiter sees real client IPs |
| `CORS_ORIGINS` | Optional, comma separated origins allowed to call the API from another site           |

## Project structure

```
client/          Vue app (Vite)
  src/views/       pages
  src/components/  UI split by feature (signing, weighting, results, cup...)
  src/utils/       scoring, standings and statistics helpers, with tests
  src/pdf/         PDF export
  src/locales/     fi / en translations
server/          Express API
  routes/api/      competitions, cups, results, fishes, users
  models/          Mongoose models
  test/            API tests
```

## Post-mortem?

If I would start this project from 0 right now, I would probably use Go for the backend and Svelte or Vue 3 without Vuetify for the frontend. Not because I know those technologies better, but I've heard Go is great for server stuff, and I'd like to learn Go and Svelte (or some other framework than Vue or React) more.

## Todo (if I want to dedicate more time on this)

- Local database for development
- More time on API design
- Remove remaining duplicate code
- Faster first load
- Caching?
- Docker?
- QR code / RFID support for signing and weighing
- Reading weights straight from a USB scale

## License

[MIT](LICENSE)

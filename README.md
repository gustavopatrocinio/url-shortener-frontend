# URL Shortener Frontend

Vue 3 single-page application for managing shortened links. Authenticated users can create, edit, and delete links, copy short URLs, and view click analytics. The app talks to a [Laravel API](https://github.com/gustavopatrocinio/url-shortener-api) over REST with Bearer token authentication (Laravel Sanctum).

## Features

- User registration and login
- Dashboard with a list of the authenticated user's links
- Create and edit links (original URL, optional custom slug, optional expiration)
- Copy short URL to clipboard
- Delete links with confirmation
- Per-link statistics: total clicks and a 7-day line chart

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`) |
| Build tool | [Vite](https://vite.dev/) |
| Routing | [Vue Router](https://router.vuejs.org/) |
| HTTP client | [Axios](https://axios-http.com/) |
| Charts | [Chart.js](https://www.chartjs.org/) + [vue-chartjs](https://vue-chartjs.org/) |
| Unit tests | [Vitest](https://vitest.dev/) + [Vue Test Utils](https://test-utils.vuejs.org/) |
| Linting | ESLint, Oxlint, Prettier |

## Prerequisites

- **Node.js** `^22.18.0` or `>=24.12.0` (see `package.json` → `engines`)
- **npm**
- The **backend API** running locally — this frontend does not work standalone. Clone and start the API first:

  **[url-shortener-api](https://github.com/gustavopatrocinio/url-shortener-api)**

  Follow the setup instructions in that repository (`composer install`, `.env`, migrations, `php artisan serve`, etc.).

## Environment Variables

Copy the example file and adjust values for your machine:

```bash
cp .env.example .env
```

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_URL` | Yes | Base URL for API requests. With the default Laravel `api` route prefix and `php artisan serve`, use `http://127.0.0.1:8000/api`. |
| `VITE_SHORT_URL_BASE` | No | Public base URL used to build short links in the UI when the API does not return `base_url` (e.g. `http://127.0.0.1:8000`). |

Example `.env`:

```env
VITE_API_URL=http://127.0.0.1:8000/api
VITE_SHORT_URL_BASE=http://127.0.0.1:8000
```

> `.env` is gitignored. Only `.env.example` is committed.

## Local Development

1. Start the [backend API](https://github.com/gustavopatrocinio/url-shortener-api) (typically on port `8000`).

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create and configure `.env` (see above).

4. Start the dev server:

   ```bash
   npm run dev
   ```

5. Open the URL printed by Vite (usually `http://localhost:5173`).

Register a user or log in with an existing account. All routes except `/login` and `/register` require a valid token stored in `localStorage`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run test:unit` | Run Vitest unit tests |
| `npm run lint` | Run Oxlint and ESLint |
| `npm run format` | Format source files with Prettier |

## Project Structure

```
src/
├── components/     # Reusable UI (auth forms, link table, chart, etc.)
├── composables/    # Shared composition functions (e.g. clipboard)
├── router/         # Routes and auth navigation guards
├── services/       # Axios client and API modules
├── utils/          # Validation, link/stats helpers
└── views/          # Page-level components
```

## Related Repositories

- **Frontend (this repo):** [github.com/gustavopatrocinio/url-shortener-frontend](https://github.com/gustavopatrocinio/url-shortener-frontend)
- **Backend API:** [github.com/gustavopatrocinio/url-shortener-api](https://github.com/gustavopatrocinio/url-shortener-api)

## License

Private / portfolio project. See repository settings for usage terms.

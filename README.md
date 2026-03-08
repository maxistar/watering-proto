# watering-proto

Angular prototype frontend for the watering dashboard.

## Dashboard Backend Integration

The dashboard reads data from `dropstation/backend-ts`:

- `GET /api/ui/v1/dashboard/plants`
- `GET /api/ui/v1/dashboard/water-tank`
- `POST /api/ui/v1/dashboard/plants/:id/water`

Default API base URL is configured in:

- `src/environments/environment.ts`

## Local Development

1. Start Dropstation database/backend dependencies:

```bash
cd ../dropstation
docker compose up -d db web phpmyadmin
bash scripts/bootstrap-mysql8.sh
```

2. Start TypeScript backend (from `dropstation/backend-ts`):

```bash
cp .env.example .env
npm install
npm run dev
```

3. Start Angular app (from `watering-proto`):

```bash
npm install
npm start
```

4. Ensure CORS in backend is configured to include the Angular origin (`http://localhost:4200` by default via `CORS_ADDITIONAL_ORIGIN`).

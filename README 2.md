# Bloom AR Backend

Node.js + Express API foundation.

## Run
```bash
npm install
npm run dev
```

Runs at http://localhost:3000

## APIs
- GET /api/health
- GET /api/filters
- GET /api/comments
- POST /api/comments
- POST /api/comments/:id/like
- GET /api/stats

This first version persists data in `data/db.json`. It is intentionally simple and can later be migrated to PostgreSQL/MongoDB, authentication, cloud storage, moderation, analytics, and user-created filters.

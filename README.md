# ZUNO — Local Grocery Deals & Savings

ZUNO is a full-stack web app that lets users discover, filter, and save local grocery deals using a React frontend and an Express + SQLite backend.
Many grocery deal sites are cluttered with ads and paywalls.  
ZUNO focuses on a clean, student-friendly interface for browsing and saving local grocery coupons without accounts or subscriptions.

## Features

### Frontend
- Browse trending grocery deals
- Search by product, brand, or store
- Filter by store and category
- Optional South San Jose–only filter
- Save coupons locally (no login required)
- Dashboard to manage saved coupons
- Expandable QR-code placeholder per coupon

### Backend
- REST API built with Express
- SQLite database for coupon storage
- Search and filter queries handled server-side
- Seed script to generate realistic demo data

## Tech Stack

- Frontend: React, Vite, React Router
- Backend: Node.js, Express
- Database: SQLite (better-sqlite3)
- Styling: Custom CSS

## Project Structure

```text
zuno/
├── backend/
│   ├── server.js        # Express API server
│   ├── db.js            # SQLite database setup
│   ├── scripts/
│   │   └── seed.js      # Generates demo coupon data
│   └── zuno.sqlite      # SQLite database file
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # App pages (Search, Dashboard)
│   └── App.jsx
├── public/
└── README.md
```

## Getting Started

### Frontend
```bash
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run seed
npm start
```
## Notes

- Coupon data is generated demo data.
- No real store APIs or scraping are used.
- QR codes are placeholders for UI demonstration.

## Future Improvements

- User authentication and cloud-saved coupons
- Admin dashboard for managing deals
- Real geolocation-based distance filtering
- Deployment to a public URL

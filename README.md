# Value Buds Dashboard

Full-stack dashboard for managing Producers and Products with PostgreSQL.

## Tech Stack

**Backend:** Node.js 20, Fastify, PostgreSQL  
**Frontend:** React 18, Vite, Tailwind CSS

## Quick Start

### Prerequisites
- Node.js v20 (use `nvm install 20 && nvm use 20`)
- PostgreSQL running

### Backend Setup

```bash
cd backend
npm install

# Create .env file
cat > .env << EOF
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=ValuebudsDB
PORT=3001
EOF

# Seed database
npm run seed

# Start server
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Access: `http://localhost:5173`

## Key Features

- **Producers**: View/filter by city, store name. Detail view includes locations, contacts, licenses, media
- **Products**: View/filter by brand, manufacturer. Detail view includes attributes, categories, images, pricing, reviews, stock
- **Pagination**: 10 items per page
- **Search**: By ID for both entities

## API Endpoints

**Backend:** `http://localhost:3001`

```bash
# Producers
GET /producers?city=Calgary&store_name=Test
GET /producers/:id
GET /producers/filters/cities
GET /producers/filters/stores

# Products
GET /products?brand_name=Value%20Buds&manufacturer=Value%20Buds%20Inc
GET /products/:id
GET /products/filters/brands
GET /products/filters/manufacturers

# Health
GET /health
```

## Database Setup

**PostgreSQL:**
```bash
# Install (macOS)
brew install postgresql
brew services start postgresql

# Create database
createdb ValuebudsDB
```

## Common Commands

```bash
# Backend
npm start          # Start server
npm run dev        # Development mode (auto-reload)
npm run seed       # Populate database

# Frontend
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
```

## Troubleshooting

**Port in use:**
```bash
lsof -i :3001    # Find process
kill -9 <PID>    # Kill process
```

**Database issues:**
```bash
dropdb ValuebudsDB && createdb ValuebudsDB && cd backend && npm run seed
```

**Node version issues:**
```bash
nvm install 20 && nvm use 20
```

## Project Structure

```
MiniDashboard/
├── backend/
│   ├── database/         # DB connection & schema
│   ├── models/           # Producers/ and Products/ models
│   ├── routes/           # API endpoints
│   ├── scripts/seed.js   # Seed data
│   └── server.js
└── frontend/
    └── src/
        ├── components/   # DataTable, DetailView
        └── App.jsx
```

## License

ISC

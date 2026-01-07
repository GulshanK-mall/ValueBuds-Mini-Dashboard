# Backend API

Fastify REST API with PostgreSQL.

## Setup

```bash
npm install

# Configure .env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=ValuebudsDB
PORT=3001

# Run
npm run seed    # Populate database
npm start       # Production
npm run dev     # Development (auto-reload)
```

## API Endpoints

Base: `http://localhost:3001`

### Producers

```bash
GET /producers
  ?producer_id=1              # Exact ID
  &city=Calgary               # Filter by city
  &store_name=Test            # Filter by store
  &sortBy=producer            # Sort field
  &sortOrder=DESC             # ASC or DESC

GET /producers/:id            # Full details with locations, contacts, licenses, media
GET /producers/filters/cities # Get available cities
GET /producers/filters/stores # Get available stores
```

### Products

```bash
GET /products
  ?product_id=1               # Exact ID
  &brand_name=Value%20Buds    # Filter by brand
  &manufacturer=Value%20Inc   # Filter by manufacturer
  &sortBy=weight              # Sort field
  &sortOrder=DESC             # ASC or DESC

GET /products/:id             # Full details with attributes, categories, images, etc.
GET /products/filters/brands  # Get available brands
GET /products/filters/manufacturers
```

### Health

```bash
GET /health                   # {"status":"ok"}
```

## Data Models

### Producers
- `producers` (main)
- `Contact` - Contact info
- `License` - Licenses
- `Location` - Physical locations
- `Media` - Social/web links

### Products
- `products` (main)
- `attributes` - Product attributes
- `categories` - Category hierarchy
- `Descriptions` - Descriptions/meta
- `Images` - Product images
- `Options` - Product options
- `Pricing` - Pricing history
- `Reviews` - Review data
- `Stocks` - Stock info

## Database

### PostgreSQL Setup
```bash
# Install
brew install postgresql
brew services start postgresql

# Create database
createdb ValuebudsDB
```

Schema auto-initializes from `database/schema.postgresql.sql`

## Development

### Structure
```
backend/
├── database/
│   ├── db.js                   # PostgreSQL handler
│   └── schema.postgresql.sql  # Database schema
├── models/
│   ├── Producers/              # Producer models
│   └── Products/               # Product models
├── routes/
│   ├── producers.js
│   └── products.js
├── scripts/seed.js
└── server.js
```

### Adding Endpoints

```javascript
// routes/example.js
async function exampleRoutes(fastify, options) {
  fastify.get('/example', async (request, reply) => {
    return { data: [] };
  });
}
export default exampleRoutes;

// server.js
import exampleRoutes from './routes/example.js';
await fastify.register(exampleRoutes);
```

## Troubleshooting

```bash
# Port in use
lsof -i :3001 && kill -9 <PID>

# Reset database
dropdb ValuebudsDB && createdb ValuebudsDB && npm run seed

# Clean install
rm -rf node_modules package-lock.json && npm install
```

## Response Format

```json
// List
{
  "data": [...],
  "count": 10
}

// Single
{
  "data": {...}
}

// Error
{
  "error": "Message"
}
```

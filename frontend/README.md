# Frontend

React + Vite dashboard with Tailwind CSS.

## Setup

```bash
npm install
npm run dev          # http://localhost:3000
```

## Features

- **View Toggle**: Switch between Producers and Products
- **Filters**: 
  - Producers: City, Store Name
  - Products: Brand Name, Manufacturer
- **Search**: By ID
- **Pagination**: 10 items/page
- **Detail View**: Click row for full details
- **Sorting**: Click column headers

## Configuration

Optional `.env`:
```env
VITE_API_BASE=http://localhost:3001
```

Default: Backend proxied via Vite config to `http://localhost:3001`

## Components

### App.jsx
Main container, manages entity type (producers/products) and navigation.

### DataTable.jsx
Table with filters, search, pagination, sorting.

**Props:**
- `entityType`: 'producers' | 'products'
- `onRowClick`: (entity) => void
- `apiBase`: string

### DetailView.jsx
Displays full entity details with all relationships.

**Props:**
- `entity`: object
- `entityType`: 'producers' | 'products'
- `onBack`: () => void
- `apiBase`: string

## API Integration

```javascript
// List
fetch(`/api/${entityType}?city=Calgary`)
// Response: { data: [...], count: number }

// Detail
fetch(`/api/${entityType}/${id}`)
// Response: { data: {...} }

// Filters
fetch(`/api/${entityType}/filters/cities`)
// Response: { data: [...] }
```

## Structure
frontend/
├── src/
│   ├── components/
│   │   ├── DataTable.jsx
│   │   └── DetailView.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── vite.config.js
└── tailwind.config.js

## Build

```bash
npm run build     # Output: dist/
npm run preview   # Preview build
```

## Styling

- **Tailwind CSS**: Utility classes
- **Custom CSS**: `src/index.css` for component styles
- **Responsive**: Mobile-first design

## Troubleshooting

```bash
# Port in use
lsof -i :5173 && kill -9 <PID>

# Clean install
rm -rf node_modules .vite package-lock.json && npm install

# Backend not connecting
# 1. Check backend is running: curl http://localhost:3001/health
# 2. Check vite.config.js proxy settings
# 3. Check browser console for CORS errors
```

## Development

### Adding Filter
```javascript
// DataTable.jsx - Add to endpoints
{ key: 'newFilter', endpoint: 'new-filter' }

// Add filter UI
<select
  value={filters.newFilter || ''}
  onChange={(e) => handleFilterChange('newFilter', e.target.value)}
>
  {filterOptions.newFilter?.map(option => (
    <option key={option} value={option}>{option}</option>
  ))}
</select>
```

### State Management
Using React `useState` and `useEffect`. For complex state, consider Context API or Zustand.

## Performance

- Client-side pagination (10 items)

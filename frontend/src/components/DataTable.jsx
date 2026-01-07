import React, { useState, useEffect, useMemo } from 'react'

const ITEMS_PER_PAGE = 10

function DataTable({ entityType, onRowClick, apiBase }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({})
  const [filterOptions, setFilterOptions] = useState({})
  const [sortBy, setSortBy] = useState('id')
  const [sortOrder, setSortOrder] = useState('ASC')
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const endpoints = entityType === 'producers'
          ? [
              { key: 'cities', endpoint: 'cities' },
              { key: 'stores', endpoint: 'stores' }
            ]
          : [
              { key: 'brands', endpoint: 'brands' },
              { key: 'manufacturers', endpoint: 'manufacturers' }
            ]

        const options = {}
        for (const { key, endpoint } of endpoints) {
          const response = await fetch(`${apiBase}/${entityType}/filters/${endpoint}`)
          
          if (!response.ok) {
            console.error(`Failed to fetch ${endpoint}:`, response.status, response.statusText)
            continue
          }

          const contentType = response.headers.get('content-type')
          if (!contentType || !contentType.includes('application/json')) {
            console.error(`Expected JSON response but received HTML`)
            continue
          }
          
          const result = await response.json()
          options[key] = result.data || []
        }
        setFilterOptions(options)
      } catch (error) {
        console.error('Error fetching filter options:', error)
      }
    }
    fetchFilterOptions()
  }, [entityType, apiBase])

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (searchTerm) {
          if (entityType === 'producers') {
            params.append('producer_id', searchTerm)
          } else {
            params.append('product_id', searchTerm)
          }
        }
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value)
        })

        const response = await fetch(`${apiBase}/${entityType}?${params}`)
        if (!response.ok) {
          console.error(`Failed to fetch ${entityType}:`, response.status, response.statusText)
          setData([])
          return
        }
        
        const contentType = response.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
          console.error(`Expected JSON response but received HTML`)
          setData([])
          return
        }

        const result = await response.json()
        if (result.producer) {
          setData(result.producer || [])
          return
        }
        if (result.product) {
          setData(result.product || [])
          return
        }
        setData(result.data || [])
      } catch (error) {
        console.error('Error fetching data:', error)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchData, 300)
    return () => clearTimeout(debounceTimer)
  }, [entityType, searchTerm, filters, sortBy, sortOrder, apiBase])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filters, sortBy, sortOrder])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(data.length / ITEMS_PER_PAGE))
  const paginatedData = useMemo(() => {
    if (data.length === 0) return []
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return data.slice(start, start + ITEMS_PER_PAGE)
  }, [data, currentPage])
  
  // Ensure currentPage is valid when data changes
  useEffect(() => {
    const calculatedTotalPages = Math.max(1, Math.ceil(data.length / ITEMS_PER_PAGE))
    if (currentPage > calculatedTotalPages && calculatedTotalPages > 0) {
      setCurrentPage(1)
    }
  }, [data.length, currentPage])

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')
    } else {
      setSortBy(field)
      setSortOrder('ASC')
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }))
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setFilters({})
    setCurrentPage(1)
  }

  const getSortIcon = (field) => {
    if (sortBy !== field) return '⇅'
    return sortOrder === 'ASC' ? '↑' : '↓'
  }

  const columns = entityType === 'producers'
    ? [
        { key: 'producer_id', label: 'Producer ID' },
        { key: 'p_id', label: 'P ID' },
        { key: 'producer', label: 'Producer' },
        { key: 'city', label: 'City' },
        { key: 'store_name', label: 'Store' }
      ]
    : [
        { key: 'product_id', label: 'Product ID' },
        { key: 'p_id', label: 'P ID' },
        { key: 'brand_name', label: 'Brand Name' },
        { key: 'manufacturer', label: 'Manufacturer' },
        { key: 'quantity', label: 'Quantity' },
        { key: 'weight', label: 'Weight' }
      ]

  return (
    <div className="data-table-container">
      {/* Filters and Search */}
      <div className="data-table-filters">
        <div className="data-table-search">
          <input
            type="text"
            placeholder="Search by ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="data-table-filter-group">
          {entityType === 'producers' && (
            <>
              <select
                value={filters.city || ''}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="data-table-select"
              >
                <option value="">All Cities</option>
                {filterOptions.cities?.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>

              <select
                value={filters.store_name || ''}
                onChange={(e) => handleFilterChange('store_name', e.target.value)}
                className="data-table-select"
              >
                <option value="">All Stores</option>
                {filterOptions.stores?.map(store_name => (
                  <option key={store_name} value={store_name}>{store_name}</option>
                ))}
              </select>
            </>
          )}

          {entityType === 'products' && (
            <>
              <select
                value={filters.brand_name || ''}
                onChange={(e) => handleFilterChange('brand_name', e.target.value)}
                className="data-table-select"
              >
                <option value="">All Brands</option>
                {filterOptions.brands?.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>

              <select
                value={filters.manufacturer || ''}
                onChange={(e) => handleFilterChange('manufacturer', e.target.value)}
                className="data-table-select"
              >
                <option value="">All Manufacturers</option>
                {filterOptions.manufacturers?.map(manufacturer => (
                  <option key={manufacturer} value={manufacturer}>{manufacturer}</option>
                ))}
              </select>
            </>
          )}

          <button 
            onClick={handleClearFilters}
            className="data-table-clear-button"
          >
            Clear All Filters
          </button>

        </div>
      </div>

      {/* Table */}
      <div className="data-table-wrapper">
        {loading ? (
          <div className="data-table-loading">Loading...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                {columns.map(col => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                  >
                    {col.label} {getSortIcon(col.key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="data-table-empty">
                    No data found
                  </td>
                </tr>
              ) : (
                paginatedData.map(row => (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick(row)}
                  >
                    {columns.map(col => (
                      <td key={col.key}>
                        {col.key === 'price' && row[col.key]
                          ? `$${parseFloat(row[col.key]).toFixed(2)}`
                          : row[col.key] || '-'}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && data.length > 0 && totalPages > 1 && (
        <div className="data-table-pagination">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="data-table-pagination-button"
          >
            Previous
          </button>
          <span className="data-table-pagination-info">
            Page {currentPage} of {totalPages} ({data.length} total items)
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="data-table-pagination-button"
          >
            Next
          </button>
        </div>
      )}
      {!loading && data.length > 0 && totalPages === 1 && (
        <div className="data-table-pagination">
          <span className="data-table-pagination-info">
            Showing all {data.length} items
          </span>
        </div>
      )}
    </div>
  )
}

export default DataTable

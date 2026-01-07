import React, { useState } from 'react'
import DataTable from './components/DataTable'
import DetailView from './components/DetailView'

const API_BASE = import.meta.env.VITE_API_BASE || '/api'

function App() {
  const [selectedEntity, setSelectedEntity] = useState(null)
  const [entityType, setEntityType] = useState('producers') // 'producers' or 'products'

  const handleRowClick = (entity) => {
    setSelectedEntity(entity)
  }

  const handleBack = () => {
    setSelectedEntity(null)
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Value Buds</h1>
        {!selectedEntity && (
          <div className="app-header-buttons">
            <button
              className={`app-header-button ${entityType === 'producers' ? 'active' : 'inactive'}`}
              onClick={() => setEntityType('producers')}
            >
              Producers
            </button>
            <button
              className={`app-header-button ${entityType === 'products' ? 'active' : 'inactive'}`}
              onClick={() => setEntityType('products')}
            >
              Products
            </button>
          </div>
        )}
      </header>

      <main className="app-main">
        {selectedEntity ? (
          <DetailView
            entity={selectedEntity}
            entityType={entityType}
            onBack={handleBack}
            apiBase={API_BASE}
          />
        ) : (
          <DataTable
            entityType={entityType}
            onRowClick={handleRowClick}
            apiBase={API_BASE}
          />
        )}
      </main>
    </div>
  )
}

export default App

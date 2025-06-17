import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            FrozenSaaSApp
          </h1>
          <p className="mt-2 text-gray-600">
            Sistema de Delivery Multi-tenant
          </p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Bem-vindo ao FrozenSaaSApp
              </h2>
              <p className="text-gray-500">
                Sistema em desenvolvimento...
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
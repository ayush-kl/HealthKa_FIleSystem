import React from 'react'
import { useNavigate } from 'react-router-dom'

const InventoryHome: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center h-full">
      <div className="bg-white p-6 rounded-lg shadow-md w-80 space-y-4">
        <h2 className="text-sm font-semibold text-center">
          Inventory Management
        </h2>

        <button
          onClick={() => navigate('/inventory/list')}
          className="w-full py-2 text-sm font-medium text-white bg-pink-500 rounded-md hover:opacity-90"
        >
          Get Inventory
        </button>

        <button
          onClick={() => navigate('/inventory/create')}
          className="w-full py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:opacity-90"
        >
          Create Inventory
        </button>

        {/* NEW BUTTONS */}

        <button
          onClick={() => navigate('/inventory/credit-debit/create')}
          className="w-full py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:opacity-90"
        >
          Create Credit / Debit Note
        </button>

        <button
          onClick={() => navigate('/inventory/credit-debit/search')}
          className="w-full py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:opacity-90"
        >
          Get Credit / Debit Notes
        </button>
      </div>
    </div>
  )
}

export default InventoryHome

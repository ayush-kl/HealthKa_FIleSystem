import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DistributorSearch: React.FC = () => {
  const navigate = useNavigate()
  const [supplierName, setSupplierName] = useState('')

  const handleSearch = async () => {
    const filters = { supplierName }

    // 🔗 Fetch from Electron / DB
    const results = await window.context.getDistributors(filters)

    // 👉 Navigate with fetched data
    navigate('/distributor/list', {
      state: { results }
    })         
  }

  return (
    <div className="min-h-screen flex justify-center items-start p-8">
      <div className="bg-white p-6 rounded-xl shadow-md flex gap-4 w-full max-w-3xl">

        {/* Supplier Name */}
        <input
          placeholder="Supplier Name"
          className="border px-3 py-2 rounded w-full"
          value={supplierName}
          onChange={(e) => setSupplierName(e.target.value)}
        />

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="bg-pink-600 text-white px-6 py-2 rounded"
        >
          Search
        </button>

      </div>
    </div>
  )
}

export default DistributorSearch

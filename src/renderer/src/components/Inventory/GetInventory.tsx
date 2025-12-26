import React, { useState } from 'react'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
const InventorySearch: React.FC = () => {
  const [itemName, setItemName] = useState('')
  const [category, setCategory] = useState('')
  const [items, setItems] = useState<any[]>([])

   const navigate = useNavigate()

  const handleSearch = async () => {
    const data = await window.context.getInventory({
      name: itemName || undefined,
      category: category || undefined
    })

    navigate('/inventory/lists', { state: { items: data } })
  }

  const handleGetAll = async () => {
    const data = await window.context.getInventory()
    navigate('/inventory/lists', { state: { items: data } })
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      {/* Search Bar */}
      <div className="flex items-center gap-3 border p-3 rounded-md">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Item Name"
            value={itemName}
            onChange={e => setItemName(e.target.value)}
            className="w-full pl-8 p-2 text-xs border rounded-md"
          />
        </div>

        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Category"
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full pl-8 p-2 text-xs border rounded-md"
          />
        </div>

        <button
          onClick={handleSearch}
          className="px-5 py-2 text-xs font-medium text-white bg-pink-400 rounded-md hover:opacity-90"
        >
          Search
        </button>
      </div>

      {/* Get All */}
      <button
        onClick={handleGetAll}
        className="mt-2 text-xs text-pink-600 underline"
      >
        GET ALL
      </button>

      {/* Results */}
      <div className="mt-4 space-y-2">
        {items.map(item => (
          <div
            key={item.id}
            className="p-3 border rounded-md text-xs flex justify-between"
          >
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-gray-500">
                {item.category} • {item.batchNo}
              </div>
            </div>

            <div className="text-right">
              <div>Stock: {item.minStock}</div>
              <div className="text-gray-500">{item.unit}</div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-xs text-gray-500 text-center">
            No inventory found
          </div>
        )}
      </div>
    </div>
  )
}

export default InventorySearch

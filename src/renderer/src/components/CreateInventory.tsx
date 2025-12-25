import React, { useState } from 'react'
import { Search } from 'lucide-react'

/* -------------------- Types -------------------- */

interface ItemInfo {
  item_id: string
  item_name: string
  category: string
  batchNo: string
  unit: string
  minStock: number
  rack?: string
  product_type?: string
}

/* -------------------- Dummy Data (Replace with API) -------------------- */

const itemInfo: ItemInfo[] = [
  {
    item_id: 'ITM001',
    item_name: 'Paracetamol 500mg',
    category: 'Medicine',
    batchNo: 'BATCH-001',
    unit: 'Strip',
    minStock: 20,
    rack: 'R1',
    product_type: 'Tablet'
  },
  {
    item_id: 'ITM002',
    item_name: 'Cough Syrup',
    category: 'Medicine',
    batchNo: 'BATCH-014',
    unit: 'Bottle',
    minStock: 10,
    rack: 'R2',
    product_type: 'Liquid'
  }
]

/* -------------------- Component -------------------- */

const Inventory: React.FC = () => {
  const [formData, setFormData] = useState({
    item_name: '',
    item_id: '',
    category: '',
    batchNo: '',
    unit: '',
    minStock: '',
    rack: '',
    product_type: ''
  })

  const [filteredItems, setFilteredItems] = useState<ItemInfo[]>([])
  const [showDropdown, setShowDropdown] = useState(false)

  /* -------------------- Handlers -------------------- */

  const handleItemSearch = (value: string) => {
    setFormData(prev => ({ ...prev, item_name: value }))

    const filtered = itemInfo.filter(item =>
      item.item_name.toLowerCase().includes(value.toLowerCase())
    )

    setFilteredItems(filtered)
    setShowDropdown(true)
  }

  const handleSelectItem = (item: ItemInfo) => {
    setFormData({
      item_name: item.item_name,
      item_id: item.item_id,
      category: item.category,
      batchNo: item.batchNo,
      unit: item.unit,
      minStock: String(item.minStock),
      rack: item.rack || '',
      product_type: item.product_type || ''
    })
    setShowDropdown(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddItem = () => {
    setShowDropdown(false)
    alert('Add Item clicked (open modal here)')
  }

  /* -------------------- UI -------------------- */

  return (
    <div className="max-w-xl p-4 bg-white rounded-lg shadow-sm">
      <h2 className="text-sm font-semibold mb-3">Item Details</h2>

      {/* ---------------- Item Name ---------------- */}
      <div className="mb-3">
        <label className="block text-xs font-medium mb-1">
          Item Name <span className="text-pink-500">*</span>
        </label>

        <div className="relative">
          <input
            type="text"
            name="item_name"
            value={formData.item_name}
            placeholder="Search Item"
            onChange={(e) => handleItemSearch(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            className="w-full p-2 pl-8 text-xs border border-[#FB009C] rounded-md focus:ring-1 focus:ring-[#FB009C]"
          />

          <Search
            size={14}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500"
          />

          {showDropdown && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-[#FB009C] rounded-md shadow-md max-h-40 overflow-y-auto">
              {filteredItems.length > 0 ? (
                filteredItems.map(item => (
                  <div
                    key={item.item_id}
                    className="px-3 py-2 text-xs cursor-pointer hover:bg-pink-50"
                    onClick={() => handleSelectItem(item)}
                  >
                    {item.item_name}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-xs text-gray-500">
                  No items found
                </div>
              )}

              <div
                className="px-3 py-2 text-xs font-medium text-[#FB009C] border-t cursor-pointer hover:bg-pink-50"
                onClick={handleAddItem}
              >
                + Add Item
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ---------------- Item Fields ---------------- */}

      <div className="grid grid-cols-2 gap-3">
        <Input label="Item ID *" name="item_id" value={formData.item_id} disabled />
        <Input label="Category *" name="category" value={formData.category} disabled />
        <Input label="Batch No. *" name="batchNo" value={formData.batchNo} onChange={handleChange} />
        <Input label="Unit *" name="unit" value={formData.unit} disabled />
        <Input label="Minimum Stock *" name="minStock" value={formData.minStock} onChange={handleChange} />
        <Input label="Rack" name="rack" value={formData.rack} onChange={handleChange} />
        <Input label="Product Type" name="product_type" value={formData.product_type} onChange={handleChange} />
      </div>
    </div>
  )
}

/* -------------------- Reusable Input -------------------- */

const Input = ({
  label,
  name,
  value,
  onChange,
  disabled
}: {
  label: string
  name: string
  value: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}) => (
  <div>
    <label className="block text-xs font-medium mb-1">{label}</label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full p-2 text-xs border rounded-md ${
        disabled ? 'bg-gray-100' : ''
      }`}
    />
  </div>
)

export default Inventory

import React, { useState } from 'react'

/* -------------------- Component -------------------- */

const Inventory: React.FC = () => {
  const [formData, setFormData] = useState({
    item_id: '',
    item_name: '',
    category: '',
    batchNo: '',
    unit: '',
    minStock: '',
    rack: '',
    product_type: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveInventory = async () => {
    if (
      !formData.item_id ||
      !formData.item_name ||
      !formData.category ||
      !formData.batchNo ||
      !formData.unit ||
      !formData.minStock
    ) {
      alert('Please fill all required fields')
      return
    }

    try {
      const payload = {
        id: formData.item_id,
        name: formData.item_name,
        category: formData.category,
        batchNo: formData.batchNo,
        unit: formData.unit,
        minStock: Number(formData.minStock),
        rack: formData.rack,
        productType: formData.product_type
      }

      console.log('💾 Saving inventory:', payload)

      await window.context.createInventory(payload)

      alert('Inventory saved successfully')

      setFormData({
        item_id: '',
        item_name: '',
        category: '',
        batchNo: '',
        unit: '',
        minStock: '',
        rack: '',
        product_type: ''
      })
    } catch (err) {
      console.error('❌ Inventory save failed', err)
      alert('Failed to save inventory')
    }
  }

  /* -------------------- UI -------------------- */

  return (
    <div className="max-w-xl p-4 bg-white rounded-lg shadow-sm">
      <h2 className="text-sm font-semibold mb-4">Add / Update Inventory</h2>

      <div className="grid grid-cols-2 gap-3">
        <Input label="Item ID *" name="item_id" value={formData.item_id} onChange={handleChange} />
        <Input label="Item Name *" name="item_name" value={formData.item_name} onChange={handleChange} />
        <Input label="Category *" name="category" value={formData.category} onChange={handleChange} />
        <Input label="Batch No. *" name="batchNo" value={formData.batchNo} onChange={handleChange} />
        <Input label="Unit *" name="unit" value={formData.unit} onChange={handleChange} />
        <Input label="Minimum Stock *" name="minStock" value={formData.minStock} onChange={handleChange} />
        <Input label="Rack" name="rack" value={formData.rack} onChange={handleChange} />
        <Input label="Product Type" name="product_type" value={formData.product_type} onChange={handleChange} />
      </div>

      <button
        onClick={handleSaveInventory}
        className="mt-4 w-full py-2 text-sm font-medium text-white bg-[#FB009C] rounded-md hover:opacity-90"
      >
        Save Inventory
      </button>
    </div>
  )
}

/* -------------------- Reusable Input -------------------- */

const Input = ({
  label,
  name,
  value,
  onChange
}: {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => (
  <div>
    <label className="block text-xs font-medium mb-1">{label}</label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 text-xs border rounded-md focus:ring-1 focus:ring-[#FB009C]"
    />
  </div>
)

export default Inventory

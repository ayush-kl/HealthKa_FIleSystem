import { useLocation } from 'react-router-dom'

const InventoryDetail = () => {
  const { state } = useLocation()
  const item = state?.item

  if (!item) return <div>No data</div>

  return (
    <div className="p-4 text-xs space-y-2">
      <h2 className="font-semibold text-sm">{item.name}</h2>

      <div>Category: {item.category}</div>
      <div>Batch No: {item.batchNo}</div>
      <div>Unit: {item.unit}</div>
      <div>Min Stock: {item.minStock}</div>
      <div>Rack: {item.rack || '-'}</div>
      <div>Type: {item.productType || '-'}</div>
    </div>
  )
}

export default InventoryDetail

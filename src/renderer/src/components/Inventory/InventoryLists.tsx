import { useLocation, useNavigate } from 'react-router-dom'

const InventoryLists = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const items = state?.items || []

  return (
    <div className="p-4 space-y-2">
      {items.map((item: any) => (
        <div
          key={item.id}
          onClick={() =>
            navigate(`/inventory/${item.id}`, { state: { item } })
          }
          className="p-3 border rounded-md text-xs cursor-pointer hover:bg-gray-50"
        >
          <div className="font-medium">{item.name}</div>
          <div className="text-gray-500">
            {item.category} • {item.batchNo}
          </div>
        </div>
      ))}
    </div>
  )
}

export default InventoryLists

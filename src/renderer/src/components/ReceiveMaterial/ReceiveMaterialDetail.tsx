import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const ReceiveMaterialView: React.FC = () => {
  const { state } = useLocation()
  const navigate = useNavigate()

  const receive = state?.receive
  if (!receive) return <div className="p-6">No record selected</div>

  const pd = receive.data?.purchaseDetails?.[0] || {}
  const products = receive.data?.productDetails || []

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 rounded"
      >
        ← Back
      </button>

      <h2 className="text-lg font-semibold mb-4">
        Receive Material Details
      </h2>

      {/* PURCHASE DETAILS */}
      <div className="border p-4 rounded mb-4 bg-gray-50">
        <h3 className="font-semibold mb-2">Purchase Details</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><strong>Receive ID:</strong> {receive.id}</div>
          <div><strong>Purchase ID:</strong> {pd.purchaseId || '-'}</div>
          <div><strong>Payment Status:</strong> {pd.paymentStatus || '-'}</div>
          <div><strong>Delivery Status:</strong> {pd.deliveryStatus || '-'}</div>
          <div><strong>Vendor Name:</strong> {pd.vendorName || '-'}</div>
          <div>
            <strong>Created At:</strong>{' '}
            {receive.createdAt
              ? new Date(receive.createdAt).toLocaleDateString()
              : '-'}
          </div>
        </div>
      </div>

      {/* PRODUCT DETAILS */}
      <div className="border p-4 rounded bg-gray-50">
        <h3 className="font-semibold mb-2">Product Details</h3>

        {products.length > 0 ? (
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Item ID</th>
                <th className="p-2 text-left">Item Name</th>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Unit</th>
                <th className="p-2 text-left">Received Qty</th>
                <th className="p-2 text-left">Batch No</th>
                <th className="p-2 text-left">Price / Qty</th>
                <th className="p-2 text-left">GST (%)</th>
                <th className="p-2 text-left">Remark</th>
              </tr>
            </thead>

            <tbody>
              {products.map((item: any, idx: number) => (
                <tr key={idx} className="border-t">
                  <td className="p-2">{item.itemId || '-'}</td>
                  <td className="p-2">{item.itemName || '-'}</td>
                  <td className="p-2">{item.category || '-'}</td>
                  <td className="p-2">{item.unit || '-'}</td>
                  <td className="p-2">{item.receivedQty || 0}</td>
                  <td className="p-2">{item.batchNo || '-'}</td>
                  <td className="p-2">₹ {item.pricePerQty || 0}</td>
                  <td className="p-2">{item.gst || 0}</td>
                  <td className="p-2">{item.remark || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-2 text-gray-500">No products added</div>
        )}
      </div>
    </div>
  )
}

export default ReceiveMaterialView

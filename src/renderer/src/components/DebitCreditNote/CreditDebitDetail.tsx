import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const CreditDebitNoteView: React.FC = () => {
  const { state } = useLocation()
  const navigate = useNavigate()

  const note = state?.note
  if (!note) return <div className="p-6">No note selected</div>

  const pd = note.data?.purchaseDetails?.[0] || {}
  const items = note.data?.itemDetails || []

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 rounded"
      >
        ← Back
      </button>

      <h2 className="text-lg font-semibold mb-4">
        Credit / Debit Note Details
      </h2>

      {/* PURCHASE DETAILS */}
      <div className="border p-4 rounded mb-4 bg-gray-50">
        <h3 className="font-semibold mb-2">Purchase Details</h3>
        <div className="grid grid-cols-2 gap-2">
          <div><strong>Note ID:</strong> {pd.noteId || '-'}</div>
          <div><strong>Type:</strong> {pd.noteType || '-'}</div>
          <div><strong>Issue Date:</strong> {pd.issueDate || '-'}</div>
          <div><strong>Purchase Order ID:</strong> {pd.purchaseOrderId || '-'}</div>
          <div><strong>Reason:</strong> {pd.reason || '-'}</div>
          <div><strong>Total:</strong> ₹ {pd.total || 0}</div>
          <div><strong>Vendor Name:</strong> {pd.vendorName || '-'}</div>
          <div><strong>Received ID:</strong> {pd.receivedId || '-'}</div>
        </div>
      </div>

      {/* ITEM DETAILS */}
      <div className="border p-4 rounded bg-gray-50">
        <h3 className="font-semibold mb-2">Item Details</h3>
        {items.length > 0 ? (
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Quantity</th>
                <th className="p-2 text-left">Unit</th>
                <th className="p-2 text-left">Price</th>
                <th className="p-2 text-left">Batch No</th>
                <th className="p-2 text-left">Reason</th>
                <th className="p-2 text-left">GST (%)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any, idx: number) => (
                <tr key={idx} className="border-t">
                  <td className="p-2">{item.itemName || '-'}</td>
                  <td className="p-2">{item.quantity || '-'}</td>
                  <td className="p-2">{item.unit || '-'}</td>
                  <td className="p-2">₹ {item.price || 0}</td>
                  <td className="p-2">{item.batchNo || '-'}</td>
                  <td className="p-2">{item.reason || '-'}</td>
                  <td className="p-2">{item.gst || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-2 text-gray-500">No items added</div>
        )}
      </div>
    </div>
  )
}

export default CreditDebitNoteView

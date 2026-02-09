import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const DistributorView: React.FC = () => {
  const { state } = useLocation()
  const navigate = useNavigate()

  const distributor = state?.distributor
  if (!distributor) {
    return <div className="p-6">No distributor selected</div>
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 rounded"
      >
        ← Back
      </button>

      <h2 className="text-lg font-semibold mb-4">
        Distributor Details
      </h2>

      <div className="border p-4 rounded bg-gray-50">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <strong>Supplier Name:</strong>{' '}
            {distributor.supplierName || '-'}
          </div>

          <div>
            <strong>Phone Number:</strong>{' '}
            {distributor.phoneNumber || '-'}
          </div>

          <div>
            <strong>Email:</strong>{' '}
            {distributor.email || '-'}
          </div>

          <div>
            <strong>GST Number:</strong>{' '}
            {distributor.gstNumber || '-'}
          </div>

          <div className="col-span-2">
            <strong>Address:</strong>{' '}
            {distributor.address || '-'}
          </div>

          <div className="col-span-2">
            <strong>Remark:</strong>{' '}
            {distributor.remark || '-'}
          </div>

          <div>
            <strong>Created At:</strong>{' '}
            {distributor.createdAt
              ? new Date(distributor.createdAt).toLocaleDateString()
              : '-'}
          </div>

          <div>
            <strong>Updated At:</strong>{' '}
            {distributor.updatedAt
              ? new Date(distributor.updatedAt).toLocaleDateString()
              : '-'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DistributorView

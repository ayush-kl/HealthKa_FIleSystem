import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const PAGE_SIZE = 5

const DistributorList: React.FC = () => {
  const { state } = useLocation()
  const navigate = useNavigate()

  const distributors: any[] = state?.results || []
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(distributors.length / PAGE_SIZE)
  const paginatedData = distributors.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  )

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-lg font-semibold mb-4">Distributors</h2>

      {/* TABLE */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Supplier Name</th>
              <th className="p-2 text-left">Phone</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Address</th>
              <th className="p-2 text-left">Remark</th>
              <th className="p-2 text-left">Created At</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((dist) => (
                <tr
                  key={dist.id}
                  onClick={() =>
                    navigate('/distributor/view', {
                      state: { distributor: dist }
                    })
                  }
                  className="cursor-pointer hover:bg-pink-50 border-t"
                >
                  <td className="p-2">{dist.supplierName || '-'}</td>
                  <td className="p-2">{dist.phoneNumber || '-'}</td>
                  <td className="p-2">{dist.email || '-'}</td>
                  <td className="p-2">{dist.address || '-'}</td>
                  <td className="p-2">{dist.remark || '-'}</td>
                  <td className="p-2">
                    {dist.createdAt
                      ? new Date(dist.createdAt).toLocaleDateString()
                      : '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4 flex-wrap">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>

          {pageNumbers.map((num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`px-3 py-1 border rounded ${
                page === num ? 'bg-pink-100 font-semibold' : ''
              }`}
            >
              {num}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default DistributorList

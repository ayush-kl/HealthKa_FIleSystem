import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const PAGE_SIZE = 2

const CreditDebitNoteList: React.FC = () => {
  const { state } = useLocation()
  const navigate = useNavigate()

  const notes: any[] = state?.results || []
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(notes.length / PAGE_SIZE)
  const paginatedNotes = notes.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  )

  // Generate page numbers for pagination buttons
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-lg font-semibold mb-4">Credit / Debit Notes</h2>

      {/* TABLE */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Note ID</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Reason</th>
              <th className="p-2 text-right">Total</th>
              <th className="p-2 text-left">Vendor Name</th>
              <th className="p-2 text-left">Created At</th>
            </tr>
          </thead>

          <tbody>
            {paginatedNotes.length > 0 ? (
              paginatedNotes.map(note => {
                const pd = note.data?.purchaseDetails?.[0] || {}

                return (
                  <tr
                    key={note.id}
                    onClick={() =>
                      navigate('/credit-debit-notes/view', {
                        state: { note }
                      })
                    }
                    className="cursor-pointer hover:bg-pink-50 border-t"
                  >
                    <td className="p-2">{pd.noteId || '-'}</td>
                    <td className="p-2">{pd.noteType || '-'}</td>
                    <td className="p-2">{pd.reason || '-'}</td>
                    <td className="p-2 text-right">₹ {pd.total || 0}</td>
                    <td className="p-2">{pd.vendorName || '-'}</td>
                    <td className="p-2">
                      {note.createdAt
                        ? new Date(note.createdAt).toLocaleDateString()
                        : '-'}
                    </td>
                  </tr>
                )
              })
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
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>

          {pageNumbers.map(num => (
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
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default CreditDebitNoteList

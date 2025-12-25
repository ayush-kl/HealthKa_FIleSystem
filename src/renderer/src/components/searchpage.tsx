import React, { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

/* ---------- TYPES ---------- */

interface InvoiceData {
  title: string
  invoiceNo?: string
  date?: string
  patientName?: string
  mobile?: string
  grandTotal?: string
}

/* ---------- COMPONENT ---------- */

const InvoiceSearchPage: React.FC = () => {
  const navigate = useNavigate()

  const [searchId, setSearchId] = useState('')
  const [searchPatient, setSearchPatient] = useState('')
  const [searchMobile, setSearchMobile] = useState('')
  const [searchDate, setSearchDate] = useState('')

  const [invoices, setInvoices] = useState<InvoiceData[]>([])
  const [loading, setLoading] = useState(false)

  /* ---------- FETCH ---------- */

const handleSearch = () => {
  navigate(
    `/invoice-list?date=${searchDate}&invoiceNo=${searchId}&patient=${searchPatient}&mobile=${searchMobile}`
  )
}


  /* ---------- UI ---------- */

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-6xl mx-auto">

        {/* BACK */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-sm mb-4 text-gray-600 hover:text-black"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        <h2 className="text-2xl font-semibold mb-6">Search Invoices</h2>

        {/* FILTERS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <input
            placeholder="Invoice No"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="border p-3 rounded"
          />
          <input
            placeholder="Patient Name"
            value={searchPatient}
            onChange={(e) => setSearchPatient(e.target.value)}
            className="border p-3 rounded"
          />
          <input
            placeholder="Mobile"
            value={searchMobile}
            onChange={(e) => setSearchMobile(e.target.value)}
            className="border p-3 rounded"
          />
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="border p-3 rounded"
          />
        </div>

        <div className="flex justify-center mb-6">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-10 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* RESULTS */}
        {invoices.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Invoice No</th>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Patient</th>
                  <th className="p-2 border">Mobile</th>
                  <th className="p-2 border">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-2 border">{inv.invoiceNo || inv.title}</td>
                    <td className="p-2 border">{inv.date}</td>
                    <td className="p-2 border">{inv.patientName}</td>
                    <td className="p-2 border">{inv.mobile}</td>
                    <td className="p-2 border">₹ {inv.grandTotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && invoices.length === 0 && (
          <p className="text-center text-gray-500 mt-6">
            No invoices to display
          </p>
        )}
      </div>
    </div>
  )
}

export default InvoiceSearchPage


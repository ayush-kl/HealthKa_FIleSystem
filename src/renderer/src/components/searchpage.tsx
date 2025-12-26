import { ArrowLeft, Calendar, Search } from 'lucide-react'
import React, { useState } from 'react'
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

        {/* FILTERS - styled to match provided design */}
        <div className="mb-6 border-2 border-pink-200 rounded-lg p-4">
          <div className="flex gap-4 items-center max-w-full">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-md bg-white"
              />
            </div>

            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Patient Name"
                value={searchPatient}
                onChange={(e) => setSearchPatient(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-md bg-white"
              />
            </div>

            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Phone number"
                value={searchMobile}
                onChange={(e) => setSearchMobile(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-md bg-white"
              />
            </div>

            <div className="w-56 relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-md bg-white"
              />
            </div>

            <div>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
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


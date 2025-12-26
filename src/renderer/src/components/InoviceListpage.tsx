import { ArrowLeft, Edit, FileText, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const InvoiceListPage = () => {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [invoices, setInvoices] = useState<any[]>([])
  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    const date = params.get('date') || ''
    const filters = {
      invoiceNo: params.get('invoiceNo') || '',
      patientname: params.get('patient') || '',
      mobile: params.get('mobile') || ''
    }

    window.context.getInvoices(date, filters).then(setInvoices)
  }, [])

  return (
    <div className="bg-white rounded-lg shadow mt-4 p-2">
      <div className="mb-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm text-gray-600 hover:text-black"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
      </div>
      <div className="mb-3 flex items-center justify-between">
        <div />
        <div className="flex flex-col items-end gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Patient Name"
              className="pl-8 pr-3 py-1 border rounded-md text-sm w-64"
            />
          </div>
          <button className="flex items-center px-3 py-1 bg-white border rounded text-sm text-pink-500">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#E6F3D8' }} className="text-xs text-gray-700 uppercase">
              <th className="py-3 px-4 border-b">BILL ID</th>
              <th className="py-3 px-4 border-b">PATIENT NAME</th>
              <th className="py-3 px-4 border-b">PHONE NUMBER</th>
              <th className="py-3 px-4 border-b">TOTAL AMOUNT</th>
              <th className="py-3 px-4 border-b">PAYMENT STATUS</th>
              <th className="py-3 px-4 border-b">CREATED AT</th>
              <th className="py-3 px-4 border-b">CREATED BY</th>
              <th className="py-3 px-4 border-b">BILL</th>
            </tr>
          </thead>
          <tbody>
            {invoices
              .filter((inv) => {
                if (!search) return true
                const name = inv.data.billPharmacy?.[0]?.patientname || ''
                return name.toLowerCase().includes(search.toLowerCase())
              })
              .map((inv) => (
                <tr
                  key={inv.title}
                  className="cursor-pointer hover:bg-gray-50 border-b"
                  onClick={() => navigate(`/invoice/${inv.title}`)}
                >
                  <td className="py-3 px-4">{inv.data.invoiceNo || 'XXX'}</td>
                  <td className="py-3 px-4">
                    {inv.data.billPharmacy?.[0]?.patientname || 'LOREM IPSUM'}
                  </td>
                  <td className="py-3 px-4">
                    {inv.data.billPharmacy?.[0]?.phoneNumber || '+91XXXXXXXX'}
                  </td>
                  <td className="py-3 px-4">₹ {inv.data.payment?.[0]?.totalbill || 'XXXXX'}</td>
                  <td className="py-3 px-4">{inv.data.payment?.[0]?.status || 'ADVANCE PAID'}</td>
                  <td className="py-3 px-4">{inv.data.date || 'DD-MM-YY'}</td>
                  <td className="py-3 px-4">{inv.data.createdBy || 'LOREM'}</td>
                  <td className="py-3 px-4 text-pink-500">
                    <FileText className="inline-block w-4 h-4" />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* simple pagination (visual only) */}
      <div className="mt-6 flex justify-end items-center gap-3">
        <button className="px-3 py-1 rounded border text-pink-500">Previous</button>
        <div className="px-3 py-1 bg-pink-50 text-pink-500 rounded">1</div>
        <button className="px-3 py-1 rounded border">2</button>
        <button className="px-3 py-1 rounded border">3</button>
        <div className="text-sm text-gray-500 px-2">...</div>
        <button className="px-3 py-1 rounded border">Next</button>
      </div>
    </div>
  )
}

export default InvoiceListPage

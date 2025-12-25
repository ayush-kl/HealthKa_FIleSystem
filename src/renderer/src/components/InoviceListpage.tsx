import { useSearchParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const InvoiceListPage = () => {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [invoices, setInvoices] = useState<any[]>([])

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
    <table className="w-full border">
      <thead>
        <tr>
          <th>Invoice No</th>
          <th>Date</th>
          <th>Patient</th>
          <th>Mobile</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {invoices.map((inv) => (
          <tr
            key={inv.title}
            className="cursor-pointer hover:bg-gray-100"
            onClick={() => navigate(`/invoice/${inv.title}`)}
          >
            <td>{inv.data.invoiceNo}</td>
            <td>{inv.data.date}</td>
            <td>{inv.data.billPharmacy?.[0]?.patientname}</td>
            <td>{inv.data.billPharmacy?.[0]?.phoneNumber}</td>
            <td>₹ {inv.data.payment?.[0]?.totalbill}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default InvoiceListPage

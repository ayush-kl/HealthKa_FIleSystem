import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const InvoiceViewPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [invoice, setInvoice] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setError('Invalid invoice id')
      return
    }

    if (!window.context?.getInvoiceById) {
      setError('API not available')
      return
    }

    window.context
      .getInvoiceById(id)
      .then((res) => {
        if (!res) setError('Invoice not found')
        else setInvoice(res)
      })
      .catch(() => setError('Failed to load invoice'))
  }, [id])

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500">{error}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    )
  }

  if (!invoice) return <p className="p-6">Loading...</p>

  const data = invoice.data
  const patient = data.billPharmacy?.[0]
  const payment = data.payment?.[0]

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-xl shadow">
      {/* Header */}
      <h2 className="text-xl font-bold mb-4">
        Invoice No: {data.invoiceNo}
      </h2>

      {/* Meta */}
      <p className="text-sm mb-4">
        <b>Date:</b> {data.date}
      </p>

      {/* Patient Details */}
      <section className="mb-6">
        <h3 className="font-semibold mb-2">Patient Details</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <p><b>Name:</b> {patient?.patientname}</p>
          <p><b>Phone:</b> {patient?.phoneNumber}</p>
          <p><b>Address:</b> {patient?.address}</p>
          <p><b>Doctor:</b> {patient?.doctorname}</p>
        </div>
      </section>

      {/* Items */}
      <section className="mb-6">
        <h3 className="font-semibold mb-2">Items</h3>
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Item</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">HSN</th>
              <th className="border p-2">Batch</th>
              <th className="border p-2">Expiry</th>
              <th className="border p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.item?.map((it: any, i: number) => (
              <tr key={i}>
                <td className="border p-2">{it.itemName}</td>
                <td className="border p-2">{it.qty}</td>
                <td className="border p-2">{it.hsn}</td>
                <td className="border p-2">{it.batch}</td>
                <td className="border p-2">{it.expiry}</td>
                <td className="border p-2">{it.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Payment Summary */}
      <section>
        <h3 className="font-semibold mb-2">Payment Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <p><b>Total Bill:</b> ₹{payment?.totalbill}</p>
          <p><b>Paid:</b> ₹{payment?.paidAmount}</p>
          <p><b>Discount:</b> ₹{payment?.totalDiscount}</p>
          <p><b>Outstanding:</b> ₹{payment?.outstandingAmt}</p>
          <p><b>Mode:</b> {payment?.paymentMode}</p>
        </div>
      </section>
    </div>
  )
}

export default InvoiceViewPage

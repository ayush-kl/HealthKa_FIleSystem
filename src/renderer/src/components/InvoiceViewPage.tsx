import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const InvoiceViewPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [invoice, setInvoice] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return setError('Invalid invoice ID')
    if (!window.context?.getInvoiceById) return setError('API not available')

    window.context
      .getInvoiceById(id)
      .then((res) => (res ? setInvoice(res) : setError('Invoice not found')))
      .catch(() => setError('Failed to load invoice'))
  }, [id])

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-3 py-1 bg-gray-200 rounded"
        >
          ← Back
        </button>
      </div>
    )
  }

  if (!invoice) return <p className="p-6">Loading...</p>

  const data = invoice.data
  const patient = data.billPharmacy?.[0]
  const payment = data.payment?.[0]

  return (
    <div className="p-6 bg-gray-50 flex justify-center">
      {/* 📄 Outer Full Outline */}
      <div className="w-[820px] bg-white border-[2px] border-black shadow p-4 text-sm">

        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
        >
          ← Back
        </button>

        {/* 🏥 Pharmacy Header */}
        <div className="border border-black p-4 flex justify-between">
          <div className="leading-5 text-sm">
            <h1 className="text-lg font-bold">Demo Pharmacy</h1>
            <p>WADI, DHABA CHOWK, Main Road, Nagpur</p>
            <p>Hingna (Maharashtra), 440023</p>
            <p>Mobile: 1234567890</p>
          </div>
          <div className="text-right text-xs leading-5">
            <p>DL NO 1: 20-MH-ENG-456222</p>
            <p>DL NO 2: 20-MH-ENG-475522</p>
            <p>FSSAI: BG8542517499</p>
            <p>GSTIN: D7F75555XY</p>
          </div>
        </div>

        {/* 🧾 Invoice Title */}
        <div className="border-x border-b border-black py-2 text-center text-lg font-bold">
          Sales Invoice
        </div>

        {/* 👤 Patient & Invoice Info */}
        <div className="border border-black grid grid-cols-2 text-xs p-3 leading-6">
          <div>
            <p><b>Patient name:</b> {patient?.patientname}</p>
            <p><b>Mobile:</b> {patient?.phoneNumber}</p>
            <p><b>Shipping Address:</b> {patient?.address}</p>
            <p><b>Dr name:</b> {patient?.doctorname}</p>
          </div>
          <div className="text-right">
            <p><b>Date:</b> {data.date}</p>
            <p><b>Invoice No:</b> {data.invoiceNo}</p>
          </div>
        </div>

        {/* 📦 Items Table */}
        <table className="w-full border border-black text-xs my-4">
          <thead className="bg-gray-100">
            <tr className="text-center">
              <th className="border border-black p-2">Item</th>
              <th className="border border-black p-2">Quantity</th>
              <th className="border border-black p-2">HSN</th>
              <th className="border border-black p-2">Batch</th>
              <th className="border border-black p-2">MRP(₹)</th>
              <th className="border border-black p-2">GST%</th>
              <th className="border border-black p-2">Discount</th>
              <th className="border border-black p-2">Total(₹)</th>
            </tr>
          </thead>

          <tbody>
            {data.item?.map((it: any, i: number) => (
              <tr key={i} className="text-center">
                <td className="border border-black p-2">{it.itemName}</td>
                <td className="border border-black p-2">{it.qty}</td>
                <td className="border border-black p-2">{it.hsn}</td>
                <td className="border border-black p-2">{it.batch}</td>
                <td className="border border-black p-2">{it.mrp}</td>
                <td className="border border-black p-2">{it.gst}</td>
                <td className="border border-black p-2">{it.discount || 0}</td>
                <td className="border border-black p-2">{it.total}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 📊 GST + Terms + Total */}
        <div className="flex border border-black">

          {/* GST LEFT BOX */}
          <div className="w-1/2 border-r border-black p-3 text-xs">

            <table className="w-full text-center">
              <thead>
                <tr>
                  <th className="border border-black p-1">GST%</th>
                  <th className="border border-black p-1">TAXABLE AMT</th>
                  <th className="border border-black p-1">CGST</th>
                  <th className="border border-black p-1">SGST</th>
                  <th className="border border-black p-1">TOTAL GST</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-1">12%</td>
                  <td className="border border-black p-1">{payment?.taxable}</td>
                  <td className="border border-black p-1">{payment?.cgst}</td>
                  <td className="border border-black p-1">{payment?.sgst}</td>
                  <td className="border border-black p-1">{payment?.gstTotal}</td>
                </tr>
              </tbody>
            </table>

            <p className="mt-3 text-xs font-medium">GET WELL SOON BY DAWA.AI™</p>
            <p className="text-xs">Confirm Medicines from your Doctor before use</p>
          </div>

          {/* AMOUNT BOX RIGHT */}
          <div className="w-1/2 p-3 text-sm border-l border-black">
            <p className="flex justify-between border-b border-black pb-1">
              <span>Sub Total (₹):</span> <b>{payment?.totalbill}</b>
            </p>
            <p className="flex justify-between border-b border-black py-1">
              <span>Add Discount (₹):</span> <b>{payment?.totalDiscount}</b>
            </p>
            <p className="flex justify-between border-b border-black py-2 mt-1 text-lg font-bold">
              <span>Amount(₹):</span> <span>{payment?.paidAmount}</span>
            </p>
            <p className="mt-2"><b>Payment:</b> {payment?.paymentMode}</p>
          </div>
        </div>

        {/* ✍️ Signature */}
        <p className="text-right mt-10 mr-4">
          ______________________________ <br />
          Authorised Signature
        </p>
      </div>
    </div>
  )
}

export default InvoiceViewPage

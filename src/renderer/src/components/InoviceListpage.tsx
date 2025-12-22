import { useLocation, useNavigate } from 'react-router-dom'

const InvoiceListPage = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const invoices = state?.invoices || []

  return (
    <div className="p-6">
      <table className="w-full border">
        <thead>
          <tr>
            <th>Invoice No</th>
            <th>Date</th>
            <th>Patient</th>
            <th>Mobile</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((row: any, i: number) => {
            const data = JSON.parse(row.data)
            return (
              <tr key={i}>
                <td>{data.invoiceNo}</td>
                <td>{data.date}</td>
                <td>{data.billPharmacy?.[0]?.patientname}</td>
                <td>{data.billPharmacy?.[0]?.phoneNumber}</td>
                <td>
                  <button
                    onClick={() =>
                      navigate('/invoice-view', {
                        state: { invoice: data }
                      })
                    }
                    className="text-purple-600"
                  >
                    View
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default InvoiceListPage

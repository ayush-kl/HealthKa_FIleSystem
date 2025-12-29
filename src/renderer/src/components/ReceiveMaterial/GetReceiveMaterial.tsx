import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import { useNavigate } from 'react-router-dom'
import 'react-datepicker/dist/react-datepicker.css'

const ReceiveMaterialSearch: React.FC = () => {
  const navigate = useNavigate()

  const [receiveId, setReceiveId] = useState('')
  const [fromDate, setFromDate] = useState<Date | null>(null)
  const [toDate, setToDate] = useState<Date | null>(null)

  const handleSearch = async () => {
    try {
      const filters = {
        receiveId,
        fromDate: fromDate?.getTime(),
        toDate: toDate?.getTime()
      }

      // 🔗 Fetch from Electron / DB
      const results = await window.context.getReceiveMaterials(filters)

      // 👉 Navigate to list page with data
      navigate('/inventory/receive-material/list', {
        state: { results }
      })
    } catch (err) {
      console.error('❌ Error fetching Receive Materials:', err)
      alert('Failed to fetch Receive Materials')
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-start p-8">
      <div className="bg-white p-6 rounded-xl shadow-md flex gap-4 w-full max-w-4xl">

        {/* RECEIVE ID */}
        <input
          placeholder="Receive ID"
          className="border px-3 py-2 rounded w-full text-sm"
          value={receiveId}
          onChange={(e) => setReceiveId(e.target.value)}
        />

        {/* FROM DATE */}
        <DatePicker
          selected={fromDate}
          onChange={setFromDate}
          placeholderText="from dd-mm-yyyy"
          className="border px-3 py-2 rounded text-sm"
          dateFormat="dd-MM-yyyy"
        />

        {/* TO DATE */}
        <DatePicker
          selected={toDate}
          onChange={setToDate}
          placeholderText="to dd-mm-yyyy"
          className="border px-3 py-2 rounded text-sm"
          dateFormat="dd-MM-yyyy"
        />

        {/* SEARCH BUTTON */}
        <button
          onClick={handleSearch}
          className="bg-pink-600 text-white px-6 py-2 rounded text-sm hover:opacity-90"
        >
          Search
        </button>

      </div>
    </div>
  )
}

export default ReceiveMaterialSearch

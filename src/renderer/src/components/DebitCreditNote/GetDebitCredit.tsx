import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import { useNavigate } from 'react-router-dom'
import 'react-datepicker/dist/react-datepicker.css'

const CreditDebitNoteSearch = () => {
  const navigate = useNavigate()

  const [noteId, setNoteId] = useState('')
  const [fromDate, setFromDate] = useState<Date | null>(null)
  const [toDate, setToDate] = useState<Date | null>(null)

  const handleSearch = async () => {
    const filters = {
      noteId,
      fromDate: fromDate?.getTime(),
      toDate: toDate?.getTime()
    }

    // 🔗 Fetch from Electron / DB
    const results = await window.context.getCreditDebitNotes(filters)

    // 👉 Navigate with fetched data
    navigate('/credit-debit-notes/list', {
      state: { results }
    })
  }

  return (
    <div className="min-h-screen flex justify-center items-start p-8">
      <div className="bg-white p-6 rounded-xl shadow-md flex gap-4 w-full max-w-4xl">

        <input
          placeholder="Note ID"
          className="border px-3 py-2 rounded w-full"
          value={noteId}
          onChange={(e) => setNoteId(e.target.value)}
        />

        <DatePicker
          selected={fromDate}
          onChange={setFromDate}
          placeholderText="from dd-mm-yyyy"
          className="border px-3 py-2 rounded"
          dateFormat="dd-MM-yyyy"
        />

        <DatePicker
          selected={toDate}
          onChange={setToDate}
          placeholderText="to dd-mm-yyyy"
          className="border px-3 py-2 rounded"
          dateFormat="dd-MM-yyyy"
        />

        <button
          onClick={handleSearch}
          className="bg-pink-600 text-white px-6 py-2 rounded"
        >
          Search
        </button>

      </div>
    </div>
  )
}

export default CreditDebitNoteSearch

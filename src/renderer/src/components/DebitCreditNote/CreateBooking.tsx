import React from 'react'
import BookingFormManager, { BookingSection } from '../DynamicBooking'

const CreateCreditDebitNote: React.FC = () => {
  const sections: BookingSection[] = [
    /* ---------------- PURCHASE DETAILS ---------------- */
    {
        id: 'purchaseDetails',
        title: 'Purchase Details',
        allowMultipleEntries: false,
        initialFormState: {
            noteId: '',
            noteType: '',
            issueDate: '',
            purchaseOrderId: '',
            reason: '',
            receivedId: '',
            total: '',
            vendorName: ''
        },
        fields: [
            [
                { id: 'noteId', label: 'Note ID', type: 'text', required: true },
                {
                    id: 'noteType',
                    label: 'Note Type',
                    type: 'select',
                    required: true,
                    options: [
                        { label: 'Debit Note', value: 'Debit' },
                        { label: 'Credit Note', value: 'Credit' }
                    ]
                },
                { id: 'issueDate', label: 'Issue Date', type: 'date' },
                {
                    id: 'purchaseOrderId',
                    label: 'Purchase Order ID',
                    type: 'text',
                    required: true
                },
                { id: 'reason', label: 'Reason', type: 'text' }
            ],
            [
                { id: 'receivedId', label: 'Received ID', type: 'text' },
                { id: 'total', label: 'Total', type: 'number' },
                { id: 'vendorName', label: 'Vendor Name', type: 'text' }
            ]
        ],
        validation: (data) => {
            if (!data.noteId || !data.noteType || !data.purchaseOrderId) {
                return 'Please fill all required Purchase Details'
            }
            return null
        },
        tableColumns: []
    },

    /* ---------------- ITEM DETAILS ---------------- */
    {
        id: 'itemDetails',
        title: 'Item Details',
        allowMultipleEntries: true,
        initialFormState: {
            itemName: '',
            quantity: '',
            unit: '',
            price: '',
            batchNo: '',
            reason: '',
            gst: ''
        },
        fields: [
            [
                { id: 'itemName', label: 'Name', type: 'text', required: true },
                { id: 'quantity', label: 'Quantity', type: 'number' },
                { id: 'unit', label: 'Unit', type: 'text' },
                { id: 'price', label: 'Price', type: 'number' },
                { id: 'batchNo', label: 'Batch No', type: 'text' }
            ],
            [
                { id: 'reason', label: 'Reason', type: 'text' },
                { id: 'gst', label: 'GST (%)', type: 'number' }
            ]
        ],
        validation: (data) => {
            if (!data.itemName) return 'Item name is required'
            return null
        },
        tableColumns: []
    }
  ]

const handleSubmit = async (data: any) => {
  try {
    const isExisting = Boolean(data?.id)

    let noteId = data.id

    // 🆕 CREATE
    if (!isExisting) {
      noteId = await window.context.createCreditDebitNote(data)
    }

    // 📝 WRITE / UPDATE
    await window.context.writeCreditDebitNote(
      noteId,
      JSON.stringify(
        {
          ...data,
          id: noteId,
          updatedAt: new Date().toISOString()
        },
        null,
        2
      )
    )

    alert(
      `Credit / Debit Note ${
        isExisting ? 'updated' : 'created'
      } successfully!`
    )
  } catch (err) {
    console.error('❌ Error saving Credit/Debit Note:', err)
    alert('Failed to save note: ' + (err as Error).message)
  }
}


  return (
    <BookingFormManager
          bookingType="Credit / Debit Note"
          sections={sections}
          onBook={handleSubmit} is_existing_patient={'old'} item_name={''}    />
  )
}



export default CreateCreditDebitNote

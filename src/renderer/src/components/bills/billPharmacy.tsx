/**
 * COMPLETE FIXED InvoiceManager Component
 * File 2: InvoiceManager.tsx (React Component)
 */

import React, { useState } from 'react'
import Logo from '../../../../../resources/icon.png'
import BookingFormManager, { BookingSection } from '../DynamicBooking'

interface InvoiceItem {
  item: string
  quantity: string
  hsn: string
  batch: string
  expiry: string
  mrp: string
  gst: string
  discount: string
  total: string
  checked?: boolean
}

interface InvoiceData {
  date: string
  invoiceNo: string
  companyName: string
  address: string
  city: string
  gstin: string
  dlNumber1: string
  dlNumber2: string
  patientName: string
  mobile: string
  patientAddress: string
  doctorName: string
  items: InvoiceItem[]
  amountPaid: string
  totalDiscount: string
  totalBill: string
  outstandingAmount: string
  paymentStatus: string
  pin: string
  fssai: string
  title?: string
}

const EmptyInvoice: InvoiceData = {
  date: '',
  invoiceNo: '',
  companyName: '',
  address: '',
  city: '',
  gstin: '',
  dlNumber1: '',
  dlNumber2: '',
  patientName: '',
  mobile: '',
  patientAddress: '',
  doctorName: '',
  items: [
    {
      item: '',
      quantity: '',
      hsn: '',
      batch: '',
      expiry: '',
      mrp: '',
      gst: '',
      discount: '',
      total: ''
    }
  ],
  amountPaid: '',
  totalDiscount: '',
  totalBill: '',
  outstandingAmount: '',
  paymentStatus: '',
  pin: '',
  fssai: ''
}

const InvoiceForm = ({
  invoice,
  onChange
}: {
  invoice: InvoiceData
  onChange: (inv: InvoiceData) => void
}) => {
  const handleFieldChange = (field: keyof InvoiceData, value: string) => {
    onChange({ ...invoice, [field]: value })
  }

  // ✅ FIXED: This function now accepts bookingData directly
  const saveInvoice = async (bookingData: any, invoiceId: string) => {
    if (!invoiceId) {
      alert('Invoice file not created')
      return
    }

    try {
      console.log('💾 Saving invoice with booking data:', bookingData)
      
      // Get current date in DD-MM-YYYY format
      const today = new Date()
      const formattedDate = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`
      
      // Add date and invoice number to the data
      const dataToSave = {
        ...bookingData,
        date: formattedDate,
        invoiceNo: `INV-${Date.now()}`
      }

      console.log('📤 Data being sent to database:', dataToSave)

      await window.context.writeInvoice(invoiceId, JSON.stringify(dataToSave, null, 2))
      alert(`Invoice saved successfully!`)
      
      // Reset form
      onChange(EmptyInvoice)
    } catch (err) {
      console.error('❌ Error saving invoice:', err)
      alert('Failed to save invoice: ' + (err as Error).message)
    }
  }

  const supplierSection: BookingSection = {
    id: 'billPharmacy',
    allowMultipleEntries: false,
    title: 'Personal Information',
    fields: [
      [
        {
          id: 'patientname',
          label: 'Patient Name',
          type: 'text',
          placeholder: 'lorem ipsum',
          required: true
        },
        {
          id: 'phoneNumber',
          label: 'Phone Number',
          required: true,
          type: 'text',
          placeholder: '+91 XXXXXXXXXX'
        },
        {
          id: 'address',
          label: 'Address',
          required: true,
          type: 'text',
          placeholder: 'lorem ipsum'
        },
        {
          id: 'doctorname',
          label: 'Doctor Name',
          required: true,
          type: 'text',
          placeholder: 'lorem ipsum'
        }
      ]
    ],
    tableColumns: [
      { id: 'patientname', header: 'Patient Name', accessor: 'patientname' },
      { id: 'phoneNumber', header: 'Phone Number', accessor: 'phoneNumber' },
      { id: 'address', header: 'Address', accessor: 'address' },
      { id: 'doctorname', header: 'Doctor Name', accessor: 'doctorname' }
    ],
    initialFormState: {
      patientname: '',
      phoneNumber: '',
      address: '',
      doctorname: ''
    },
    validation: (formData) => {
      if (!formData.patientname) return 'Patient name is required'
      if (!formData.phoneNumber) return 'Phone Number is required'
      if (!formData.address) return 'Address is required'
      if (!formData.doctorname) return 'Doctor Name is required'
      return null
    }
  }

  const itemSection: BookingSection = {
    id: 'item',
    allowMultipleEntries: true,
    title: 'Item Information',
    fields: [
      [
        {
          id: 'itemName',
          label: 'Item Name',
          type: 'text',
          placeholder: 'Lorem Ipsum',
          required: true
        },
        {
          id: 'qty',
          label: 'Quantity',
          type: 'text',
          placeholder: 'Quantity',
          required: true,
          pattern: '[0-9]*',
          inputMode: 'numeric'
        },
        {
          id: 'hsn',
          label: 'HSN',
          type: 'text',
          placeholder: 'XX',
          required: true
        },
        {
          id: 'batch',
          label: 'Batch',
          type: 'text',
          placeholder: 'XXXXX',
          required: true
        },
        {
          id: 'expiry',
          label: 'Expiry',
          type: 'date',
          placeholder: 'DD-MM-YYYY',
          required: true
        }
      ],
      [
        {
          id: 'mrp',
          label: 'MRP',
          type: 'text',
          placeholder: 'XXX',
          required: true,
          pattern: '[0-9]*',
          inputMode: 'numeric'
        },
        {
          id: 'gst',
          label: 'GST %',
          type: 'text',
          placeholder: 'XX',
          required: true,
          pattern: '[0-9]*',
          inputMode: 'numeric'
        },
        {
          id: 'discount',
          label: 'Discount %',
          type: 'text',
          placeholder: 'XX',
          required: true,
          pattern: '[0-9]*',
          inputMode: 'numeric'
        },
        {
          id: 'total',
          label: 'Total',
          type: 'text',
          placeholder: 'XXX',
          required: true,
          pattern: '[0-9]*',
          inputMode: 'numeric'
        }
      ]
    ],
    tableColumns: [
      { id: 'itemName', header: 'Item Name', accessor: 'itemName' },
      { id: 'qty', header: 'Quantity', accessor: 'qty' },
      { id: 'hsn', header: 'HSN', accessor: 'hsn' },
      { id: 'batch', header: 'Batch', accessor: 'batch' },
      { id: 'expiry', header: 'Expiry', accessor: 'expiry' },
      { id: 'mrp', header: 'MRP', accessor: 'mrp' },
      { id: 'gst', header: 'GST %', accessor: 'gst' },
      { id: 'discount', header: 'Discount %', accessor: 'discount' },
      { id: 'total', header: 'Total', accessor: 'total' }
    ],
    initialFormState: {
      itemName: '',
      qty: '',
      hsn: '',
      batch: '',
      expiry: '',
      mrp: '',
      gst: '',
      discount: '',
      total: ''
    },
    validation: (formData) => {
      if (!formData.itemName) return 'Item name is required'
      if (!formData.qty) return 'Quantity is required'
      if (!formData.hsn) return 'HSN is required'
      if (!formData.batch) return 'Batch is required'
      if (!formData.expiry) return 'Expiry is required'
      if (!formData.mrp) return 'MRP is required'
      if (!formData.gst) return 'GST is required'
      return null
    }
  }

  const paymentSection: BookingSection = {
    id: 'payment',
    allowMultipleEntries: false,
    title: 'Payment Information',
    showMemberToggle: false,
    fields: [
      [
        {
          id: 'paidAmount',
          label: 'Amount Paid',
          type: 'text',
          placeholder: 'Enter amount',
          required: true,
          inputMode: 'numeric',
          pattern: '[0-9]*'
        },
        {
          id: 'paymentMode',
          label: 'Payment Method',
          type: 'select',
          options: [
            { value: '', label: 'Select' },
            { value: 'Cash', label: 'Cash' },
            { value: 'Card', label: 'Card' },
            { value: 'UPI', label: 'UPI' },
            { value: 'Net Banking', label: 'Net Banking' }
          ]
        },
        {
          id: 'totalDiscount',
          label: 'Total Discount',
          type: 'text',
          placeholder: '0',
          required: true,
          inputMode: 'numeric',
          pattern: '[0-9]*'
        },
        {
          id: 'totalbill',
          label: 'Total Bill',
          type: 'text',
          placeholder: '0',
          required: true,
          inputMode: 'numeric',
          pattern: '[0-9]*'
        },
        {
          id: 'outstandingAmt',
          label: 'Outstanding Amount',
          type: 'text',
          placeholder: '0',
          required: true,
          inputMode: 'numeric',
          pattern: '[0-9]*'
        }
      ]
    ],
    tableColumns: [
      { id: 'paidAmount', header: 'Amount Paid', accessor: 'paidAmount' },
      { id: 'paymentMode', header: 'Payment Mode', accessor: 'paymentMode' },
      { id: 'totalDiscount', header: 'Total Discount', accessor: 'totalDiscount' },
      { id: 'totalbill', header: 'Total Bill', accessor: 'totalbill' },
      { id: 'outstandingAmt', header: 'Outstanding Amount', accessor: 'outstandingAmt' }
    ],
    initialFormState: {
      paidAmount: '',
      paymentMode: '',
      totalDiscount: '',
      totalbill: '',
      outstandingAmt: ''
    },
    validation: (formData) => {
      if (!formData.paidAmount) return 'Paid amount is required'
      if (!formData.paymentMode) return 'Payment mode is required'
      return null
    }
  }

  return (
    <div className="border-2 border-gray-300 rounded-md w-full max-w-full p-4 mb-8">
      <div className="text-[10px]">
        <div className="grid grid-cols-3 items-start mb-4">
          <div className="space-y-2">
            <div>
              <p className="text-xs font-semibold">Date:</p>
              <input
                className="border rounded-md text-xs px-1 py-0 h-[20px]"
                value={invoice.date}
                onChange={(e) => handleFieldChange('date', e.target.value)}
              />
            </div>
            <div>
              <p className="text-xs font-semibold">Invoice No:</p>
              <input
                className="border rounded-md text-xs px-1 py-0 h-[20px]"
                value={invoice.invoiceNo}
                onChange={(e) => handleFieldChange('invoiceNo', e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-center items-start">
            <h1 className="text-lg font-bold underline">Sales Invoice</h1>
          </div>
          <div className="flex justify-end items-start">
            <img src={Logo} alt="Logo" width={70} height={70} />
            <span className="font-semibold text-xl ml-2">NEXUS</span>
          </div>
        </div>

        <BookingFormManager
          bookingType="Consultation"
          sections={[supplierSection, itemSection, paymentSection]}
          hideDefaultHeader
          showPatientId={false}
          is_existing_patient="new"
          item_name=""
          saveButtonText="Save Invoice"
          onBook={(bookingData) => {
            console.log('✅ Received booking data from form:', bookingData)
            // Pass the raw bookingData directly - SQLite will handle the mapping
            saveInvoice(bookingData, invoice.title || '')
          }}
        />
      </div>
    </div>
  )
}

const InvoiceManager: React.FC = () => {
  const [invoices, setInvoices] = useState<InvoiceData[]>([])
  const [searchDate, setSearchDate] = useState('')
  const [searchPatient, setSearchPatient] = useState('')
  const [searchMobile, setSearchMobile] = useState('')
  const [loading, setLoading] = useState(false)

  const addNewInvoice = async () => {
    const id = await window.context.createInvoice()
    if (!id) {
      alert('Failed to create invoice ID')
      return
    }

    const newInvoice: InvoiceData = {
      ...EmptyInvoice,
      items: EmptyInvoice.items.map((item) => ({ ...item })),
      title: id
    }

    setInvoices((prev) => [...prev, newInvoice])
  }

  const handleInvoiceChange = (index: number, updatedInvoice: InvoiceData) => {
    const updated = [...invoices]
    updated[index] = updatedInvoice
    setInvoices(updated)
  }

  const getFilteredInvoices = async () => {
    setLoading(true)
    try {
      console.log('🔍 Calling getInvoices with:', { searchDate, searchPatient, searchMobile })
      
      const result = await window.context.getInvoices(searchDate, {
        patientName: searchPatient,
        mobile: searchMobile
      })
      
      console.log('📦 Raw result from API:', result)

      if (!result) {
        console.warn('⚠️ No result returned')
        alert('No invoices found - API returned no data')
        setInvoices([])
        setLoading(false)
        return
      }

      if (!Array.isArray(result)) {
        console.warn('⚠️ Result is not an array:', result)
        alert('Invalid response format from API')
        setInvoices([])
        setLoading(false)
        return
      }

      if (result.length === 0) {
        console.warn('⚠️ Empty array returned')
        alert('No invoices found in storage')
        setInvoices([])
        setLoading(false)
        return
      }

      console.log('✅ Processing', result.length, 'invoice(s)')

      // Map the results to InvoiceData format
      const fetchedInvoices: InvoiceData[] = result.map((entry: any) => {
        console.log('📄 Processing invoice:', entry)
        
        // The data is already formatted by the SQLite handler
        const invoiceData = entry.data
        
        return {
          ...EmptyInvoice,
          ...invoiceData,
          title: entry.title
        }
      })

      console.log('✅ Final mapped invoices:', fetchedInvoices)
      console.log('✅ Total invoices to display:', fetchedInvoices.length)

      if (fetchedInvoices.length === 0) {
        alert('No valid invoices found after processing')
      } else {
        alert(`Successfully loaded ${fetchedInvoices.length} invoice(s)`)
      }

      setInvoices(fetchedInvoices)
    } catch (error: any) {
      console.error('❌ Error fetching invoices:', error)
      console.error('❌ Error stack:', error.stack)
      alert('Failed to fetch invoices: ' + error.message)
      setInvoices([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      {/* Search Inputs */}
      <div className="pt-4 mb-4 space-y-2">
        <div className="flex gap-2">
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="border px-2 py-1 rounded"
            placeholder="Search by date"
          />
          <input
            type="text"
            value={searchPatient}
            onChange={(e) => setSearchPatient(e.target.value)}
            className="border px-2 py-1 rounded"
            placeholder="Search by patient name"
          />
          <input
            type="text"
            value={searchMobile}
            onChange={(e) => setSearchMobile(e.target.value)}
            className="border px-2 py-1 rounded"
            placeholder="Search by mobile"
          />
        </div>

        <button
          onClick={getFilteredInvoices}
          disabled={loading}
          className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-900 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Get Invoices'}
        </button>
      </div>

      <button
        onClick={addNewInvoice}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        + Add New Invoice
      </button>

      {/* Display loaded invoices count */}
      {invoices.length > 0 && (
        <div className="mb-4 text-sm text-gray-600">
          Showing {invoices.length} invoice(s)
        </div>
      )}

      {invoices.map((invoice, idx) => (
        <InvoiceForm
          key={invoice.title || idx}
          invoice={invoice}
          onChange={(inv) => handleInvoiceChange(idx, inv)}
        />
      ))}

      {/* Show message when no invoices */}
      {!loading && invoices.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No invoices to display. Click "Get Invoices" to load saved data or "Add New Invoice" to create one.
        </div>
      )}
    </div>
  )
}

export default InvoiceManager
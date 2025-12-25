/**
 * FINAL FIXED InvoiceManager Component
 * ✅ SOLUTION: Pre-populate allEntries with existing data
 */

import React, { useState, useEffect } from 'react'
import Logo from '../../../../../resources/icon.png'
import BookingFormManager, { BookingSection } from '../DynamicBooking'
import { useNavigate } from 'react-router-dom'




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
  onChange,
  isExisting = false
}: {
  invoice: InvoiceData
  onChange: (inv: InvoiceData) => void
  isExisting?: boolean
}) => {
  const [preloadedData, setPreloadedData] = useState<any>(null)

  // ✅ FIX: Convert InvoiceData to BookingFormManager format
  useEffect(() => {
    if (isExisting && invoice.patientName) {
      console.log('🔄 Pre-loading invoice data:', invoice)
      
      const bookingData = {
        billPharmacy: [
          {
            patientname: invoice.patientName,
            phoneNumber: invoice.mobile,
            address: invoice.patientAddress,
            doctorname: invoice.doctorName
          }
        ],
        item: invoice.items.map(item => ({
          itemName: item.item,
          qty: item.quantity,
          hsn: item.hsn,
          batch: item.batch,
          expiry: item.expiry,
          mrp: item.mrp,
          gst: item.gst,
          discount: item.discount,
          total: item.total
        })),
        payment: [
          {
            paidAmount: invoice.amountPaid,
            paymentMode: invoice.paymentStatus,
            totalDiscount: invoice.totalDiscount,
            totalbill: invoice.totalBill,
            outstandingAmt: invoice.outstandingAmount
          }
        ]
      }
      
      console.log('✅ Converted to booking format:', bookingData)
      setPreloadedData(bookingData)
    } else {
      setPreloadedData(null)
    }
  }, [invoice.title, isExisting])

  const handleFieldChange = (field: keyof InvoiceData, value: string) => {
    onChange({ ...invoice, [field]: value })
  }

  const saveInvoice = async (bookingData: any, invoiceId: string) => {
    if (!invoiceId) {
      alert('Invoice file not created')
      return
    }

    try {
      console.log('💾 Saving invoice with booking data:', bookingData)
      
      const today = new Date()
      const formattedDate = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`
      
      const dataToSave = {
        ...bookingData,
        date: invoice.date || formattedDate,
        invoiceNo: invoice.invoiceNo || `INV-${Date.now()}`
      }

      console.log('📤 Data being sent to database:', dataToSave)

      await window.context.writeInvoice(invoiceId, JSON.stringify(dataToSave, null, 2))
      alert(`Invoice ${isExisting ? 'updated' : 'saved'} successfully!`)
      
      if (!isExisting) {
        onChange(EmptyInvoice)
      }
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

  const formKey = `${invoice.title}-${Date.now()}`

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
            key={formKey}
            bookingType="Consultation"
            sections={[supplierSection, itemSection, paymentSection]}
            hideDefaultHeader
            showPatientId={false}
            is_existing_patient="new"
            item_name=""
              initialData={preloadedData}
            saveButtonText={isExisting ? "Update Invoice" : "Save Invoice"}
            onBook={(bookingData) => {
              console.log('✅ Received booking data from form:', bookingData)
              saveInvoice(bookingData, invoice.title || '')
            }}
          />
        
      </div>
    </div>
  )
}

// ✅ NEW: Wrapper component that handles pre-loaded data
const PreloadedBookingForm = ({
  preloadedData,
  sections,
  isExisting,
  onBook
}: {
  preloadedData: any
  sections: any[]
  isExisting: boolean
  onBook: (data: any) => void
}) => {
  const [initialized, setInitialized] = useState(false)

  // This is a workaround - we render the form, then immediately populate it
  // by triggering the onSave callback with the preloaded data
  useEffect(() => {
    if (!initialized && preloadedData) {
      setInitialized(true)
    }
  }, [preloadedData, initialized])

  return (
    <div>
      <BookingFormManager
        bookingType="Consultation"
        sections={sections}
        hideDefaultHeader
        showPatientId={false}
        is_existing_patient="new"
        item_name=""
        saveButtonText={isExisting ? "Update Invoice" : "Save Invoice"}
        onBook={onBook}
        onSave={(data) => {
          // This gets called when form initializes
          console.log('Form initialized with data:', data)
        }}
      />
    </div>
  )
}

const InvoiceManager: React.FC = () => {
  const [invoices, setInvoices] = useState<InvoiceData[]>([])
  const [searchDate, setSearchDate] = useState('')
  const [searchPatient, setSearchPatient] = useState('')
  const [searchMobile, setSearchMobile] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
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

    setInvoices((prev) => [newInvoice, ...prev])
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

      if (!result || !Array.isArray(result) || result.length === 0) {
        alert('No invoices found')
        setInvoices([])
        setLoading(false)
        return
      }

      const fetchedInvoices: InvoiceData[] = result.map((entry: any) => ({
        ...EmptyInvoice,
        ...entry.data,
        title: entry.title
      }))

      console.log('✅ Loaded invoices:', fetchedInvoices)
      alert(`Successfully loaded ${fetchedInvoices.length} invoice(s)`)
      setInvoices(fetchedInvoices)
    } catch (error: any) {
      console.error('❌ Error fetching invoices:', error)
      alert('Failed to fetch invoices: ' + error.message)
      setInvoices([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
        <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Invoice Manager</h1>

        <button
          onClick={() => navigate('/invoice-search')}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          🔍 Search Invoices
        </button>
      </div>
      <button
  onClick={() => navigate('/inventory')}
  className="mb-4 ml-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
>
  + Create Inventory
</button>

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
          isExisting={!!invoice.patientName}
        />
      ))}

      {!loading && invoices.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No invoices to display. Click "Get Invoices" to load saved data or "Add New Invoice" to create one.
        </div>
      )}
    </div>
  )
}

export default InvoiceManager 
import React from 'react'
import BookingFormManager, { BookingSection } from '../DynamicBooking'

const CreateReceiveMaterial: React.FC = () => {
  const sections: BookingSection[] = [
    /* ---------------- PURCHASE DETAILS ---------------- */
    {
      id: 'purchaseDetails',
      title: 'Purchase Details',
      allowMultipleEntries: false,
      initialFormState: {
        purchaseId: '',
        paymentStatus: '',
        deliveryStatus: '',
        vendorName: ''
      },
      fields: [
        [
          { id: 'purchaseId', label: 'Purchase ID', type: 'text', required: true },
          {
            id: 'paymentStatus',
            label: 'Payment Status',
            type: 'select',
            options: [
              { label: 'Pending', value: 'Pending' },
              { label: 'Paid', value: 'Paid' }
            ]
          },
          {
            id: 'deliveryStatus',
            label: 'Delivery Status',
            type: 'select',
            options: [
              { label: 'Pending', value: 'Pending' },
              { label: 'Delivered', value: 'Delivered' }
            ]
          },
          { id: 'vendorName', label: 'Vendor Name', type: 'text' }
        ]
      ],
      validation: (data) => {
        if (!data.purchaseId) return 'Purchase ID is required'
        return null
      },
      tableColumns: [
        { id: 'purchaseId', header: 'Purchase ID', accessor: 'purchaseId' },
        { id: 'paymentStatus', header: 'Payment Status', accessor: 'paymentStatus' },
        { id: 'deliveryStatus', header: 'Delivery Status', accessor: 'deliveryStatus' },
        { id: 'vendorName', header: 'Vendor Name', accessor: 'vendorName' }
      ]
    },

    /* ---------------- PRODUCT DETAILS ---------------- */
    {
      id: 'productDetails',
      title: 'Product Details',
      allowMultipleEntries: true,
      initialFormState: {
        itemId: '',
        itemName: '',
        category: '',
        unit: '',
        receivedQty: '',
        batchNo: '',
        pricePerQty: '',
        gst: '',
        remark: ''
      },
      fields: [
        [
          { id: 'itemId', label: 'Item ID', type: 'text', required: true },
          { id: 'itemName', label: 'Item Name', type: 'text', required: true },
          { id: 'category', label: 'Category', type: 'text' },
          { id: 'unit', label: 'Unit', type: 'text', required: true },
          { id: 'receivedQty', label: 'Received Quantity', type: 'number', required: true }
        ],
        [
          { id: 'batchNo', label: 'Batch No', type: 'text', required: true },
          { id: 'pricePerQty', label: 'Price Per Quantity', type: 'number', required: true },
          { id: 'gst', label: 'GST (%)', type: 'number', required: true },
          { id: 'remark', label: 'Remark', type: 'text', required: true }
        ]
      ],
      validation: (data) => {
        if (!data.itemId || !data.itemName || !data.receivedQty) {
          return 'Please fill all required Product Details'
        }
        return null
      },
      tableColumns: [
        { id: 'itemId', header: 'Item ID', accessor: 'itemId' },
        { id: 'itemName', header: 'Item Name', accessor: 'itemName' },
        { id: 'category', header: 'Category', accessor: 'category' },
        { id: 'unit', header: 'Unit', accessor: 'unit' },
        { id: 'receivedQty', header: 'Received Qty', accessor: 'receivedQty' },
        { id: 'batchNo', header: 'Batch No', accessor: 'batchNo' },
        { id: 'pricePerQty', header: 'Price / Qty', accessor: 'pricePerQty' },
        { id: 'gst', header: 'GST', accessor: 'gst' },
        { id: 'remark', header: 'Remark', accessor: 'remark' }
      ]
    }
  ]

  /* ---------------- SAVE HANDLER ---------------- */
  const handleSubmit = async (data: any) => {
    try {
      const isExisting = Boolean(data?.id)
      let receiveId = data.id

      if (!isExisting) {
        receiveId = await window.context.createReceiveMaterial(data)
      }

      await window.context.writeReceiveMaterial(
        receiveId,
        JSON.stringify(
          { ...data, id: receiveId, updatedAt: new Date().toISOString() },
          null,
          2
        )
      )

      alert(`Receive Material ${isExisting ? 'updated' : 'created'} successfully!`)
    } catch (err) {
      console.error('❌ Error saving Receive Material:', err)
      alert('Failed to save: ' + (err as Error).message)
    }
  }

  return (
    <BookingFormManager
      bookingType="Receive Material"
      sections={sections}
      onBook={handleSubmit}
      is_existing_patient="old"
      item_name=""
    />
  )
}

export default CreateReceiveMaterial

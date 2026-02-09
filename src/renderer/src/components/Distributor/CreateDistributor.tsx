import React from 'react'
import BookingFormManager, { BookingSection } from '../DynamicBooking'

const CreateDistributor: React.FC = () => {
  const sections: BookingSection[] = [
    /* ---------------- DISTRIBUTOR DETAILS ---------------- */
    {
      id: 'distributorDetails',
      title: 'Distributor Details',
      allowMultipleEntries: false,
      initialFormState: {
        supplierName: '',
        phoneNumber: '',
        email: '',
        address: '',
        remark: ''
      },
      fields: [
        [
          {
            id: 'supplierName',
            label: 'Supplier Name',
            type: 'text',
            required: true
          },
          {
            id: 'phoneNumber',
            label: 'Phone Number',
            type: 'text',
            required: true
          },
          {
            id: 'email',
            label: 'Email',
            type: 'text'
          }
        ],
        [
          {
            id: 'address',
            label: 'Address',
            type: 'text',
            required: true
          },
          {
            id: 'remark',
            label: 'Remark',
            type: 'text'
          }
        ]
      ],
      validation: (data) => {
        if (!data.supplierName) return 'Supplier Name is required'
        if (!data.phoneNumber) return 'Phone Number is required'
        if (!data.address) return 'Address is required'
        return null
      },
      tableColumns: [
        {
          id: 'supplierName',
          header: 'Supplier Name',
          accessor: 'supplierName'
        },
        {
          id: 'phoneNumber',
          header: 'Phone Number',
          accessor: 'phoneNumber'
        },
        {
          id: 'email',
          header: 'Email',
          accessor: 'email'
        },
        {
          id: 'address',
          header: 'Address',
          accessor: 'address'
        },
        {
          id: 'remark',
          header: 'Remark',
          accessor: 'remark'
        }
      ]
    }
  ]

  /* ---------------- SAVE HANDLER ---------------- */
  const handleSubmit = async (data: any) => {
    try {
      const isExisting = Boolean(data?.id)
      let distributorId = data.id

      if (!isExisting) {
        distributorId = await window.context.createDistributor(data)
      }

      await window.context.writeDistributor(
        distributorId,
        JSON.stringify(
          {
            ...data,
            id: distributorId,
            updatedAt: new Date().toISOString()
          },
          null,
          2
        )
      )

      alert(
        `Distributor ${isExisting ? 'updated' : 'created'} successfully!`
      )
    } catch (err) {
      console.error('❌ Error saving Distributor:', err)
      alert('Failed to save: ' + (err as Error).message)
    }
  }

  return (
    <BookingFormManager
      bookingType="Distributor"
      sections={sections}
      onBook={handleSubmit}
      is_existing_patient="old"
      item_name=""
    />
  )
}

export default CreateDistributor

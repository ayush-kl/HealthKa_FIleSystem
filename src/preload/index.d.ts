import {GetBillByNuber,SearchBills, GetBillTemplateByUser, GetBillById,GetAllBills, DeleteBillTemplate,GetCreditDebitNotes,CreateBill,GetBillByNumber,CreateReceiveMaterial,GetAllBillTemplates,SaveBillTemplate,WriteDistributor  ,GetDistributors, GetReceiveMaterialById,CreateDistributor,GetReceiveMaterials,WriteReceiveMaterial, CreateNote, DeleteNote, GetNotes, ReadNote, WriteNote,GetInvoiceById,CreateInventory,GetInventory,GetInventoryById, CreateCreditDebitNote, WriteCreditDebitNote,GetPurchaseOrders,CreatePurchaseOrder,GetPurchaseOrderById,CreateIssueOrder,GetIssueOrders,GetIssueOrderItems,CreateCustomer,CreateCustomers,GetCustomers,GetCustomerById,SearchCustomerByPhone } from '@shared/types'

declare global {
  interface Window {
    // electron: ElectronAPI
    context: {
      locale: string
      getInvoices: GetNotes
      readInvoice: ReadNote
      writeInvoice: WriteNote
      createInvoice: CreateNote
      deleteInvoice: DeleteNote
      getInvoiceById : GetInvoiceById
      createInventory: CreateInventory
      getInventory: GetInventory
      getInventoryById: GetInventoryById
      createCreditDebitNote: CreateCreditDebitNote
      writeCreditDebitNote: WriteCreditDebitNote
      getCreditDebitNotes: GetCreditDebitNotes
      createReceiveMaterial: CreateReceiveMaterial
      writeReceiveMaterial: WriteReceiveMaterial
      getReceiveMaterials: GetReceiveMaterials
      getReceiveMaterialById: GetReceiveMaterialById  
      createDistributor: CreateDistributor
      getDistributors: GetDistributors
      writeDistributor: WriteDistributor  
      createPurchaseOrder: CreatePurchaseOrder
      getPurchaseOrders: GetPurchaseOrders
      getPurchaseOrderById: GetPurchaseOrderById
      createIssueOrder: CreateIssueOrder
      getIssueOrders: GetIssueOrders
      getIssueOrderItems: GetIssueOrderItems
      saveBillTemplate: SaveBillTemplate
      getAllBillTemplates: GetAllBillTemplates
      deleteBillTemplate: DeleteBillTemplate
      getBillTemplateByUser: GetBillTemplateByUser
      createBill: CreateBill
      getAllBills: GetAllBills
      getBillById: GetBillById
      searchBills: SearchBills  
      createCustomer: CreateCustomer
      createCustomers: CreateCustomers
      getCustomers: GetCustomers
      getCustomerById: GetCustomerById
      searchCustomerByPhone: SearchCustomerByPhone
      getBillByNumber: GetBillByNumber
    }
  }
}

import { saveBillTemplate } from '@/lib/billtemplate'
import { writeCreditDebitNote } from '@/lib/creditdebit'
import { getPurchaseOrderById } from '@/lib/purchaseorder'
import { CreateInvoice, DeleteInvoice, GetInvoices, ReadInvoice, WriteInvoice,GetInvoiceById,CreateInventory, GetInventoryById, GetInventory, CreateCreditDebitNote, WriteCreditDebitNote, GetCreditDebitNotes, GetReceiveMaterialById, GetReceiveMaterials, WriteReceiveMaterial,CreateReceiveMaterial, CreateDistributor,GetDistributors,WriteDistributor, CreatePurchaseOrder, GetPurchaseOrders, GetPurchaseOrderById,CreateIssueOrder,GetIssueOrderItems,GetIssueOrders, GetBillTemplateById, DeleteBillTemplate, GetAllBillTemplates, SaveBillTemplate, GetAllBills, GetBillById, SearchBills,SearchCustomerByPhone, GetBillByNumber } from '@shared/types'
import { CreateCustomer, CreateCustomers, GetCustomers, GetCustomerById } from '@shared/types'
import { create } from 'domain'
import { contextBridge, ipcRenderer } from 'electron'
import { get } from 'http'

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

try {
  contextBridge.exposeInMainWorld('context', {
    locale: navigator.language,
    getInvoices: (...args: Parameters<GetInvoices>) => ipcRenderer.invoke('getInvoices', ...args),
    readInvoice: (...args: Parameters<ReadInvoice>) => ipcRenderer.invoke('readInvoice', ...args),
    writeInvoice: (...args: Parameters<WriteInvoice>) => ipcRenderer.invoke('writeInvoice', ...args),
    createInvoice: (...args: Parameters<CreateInvoice>) => ipcRenderer.invoke('createInvoice', ...args),
    deleteInvoice: (...args: Parameters<DeleteInvoice>) => ipcRenderer.invoke('deleteInvoice', ...args),
    getInvoiceById: (...args: Parameters<GetInvoiceById>) => ipcRenderer.invoke('getInvoiceById', ...args),
    createInventory: (...args: Parameters<CreateInventory>) => ipcRenderer.invoke('createInventory', ...args),
    getInventory: (...args: Parameters<GetInventory>) => ipcRenderer.invoke('getInventory', ...args),
    getInventoryById: (...args: Parameters<GetInventoryById>) => ipcRenderer.invoke('getInventoryById', ...args),
    createCreditDebitNote: (...args: Parameters<CreateCreditDebitNote>) => ipcRenderer.invoke('createCreditDebitNote', ...args),
    writeCreditDebitNote: (...args: Parameters<WriteCreditDebitNote>) => ipcRenderer.invoke('writeCreditDebitNote', ...args),
    getCreditDebitNotes: (...args: Parameters<GetCreditDebitNotes>) => ipcRenderer.invoke('getCreditDebitNotes', ...args),
    createReceiveMaterial: (...args: Parameters<CreateReceiveMaterial>) => ipcRenderer.invoke('createReceiveMaterial', ...args),
    writeReceiveMaterial: (...args: Parameters<WriteReceiveMaterial>) => ipcRenderer.invoke('writeReceiveMaterial', ...args),
    getReceiveMaterials: (...args: Parameters<GetReceiveMaterials>) => ipcRenderer.invoke('getReceiveMaterials', ...args),
    getReceiveMaterialById: (...args: Parameters<GetReceiveMaterialById>) => ipcRenderer.invoke('getReceiveMaterialById', ...args),
    createDistributor: (...args: Parameters<CreateDistributor>) => ipcRenderer.invoke('createDistributor', ...args),
    getDistributors: (...args: Parameters<GetDistributors>) => ipcRenderer.invoke('getDistributors', ...args),
    writeDistributor: (...args: Parameters<WriteDistributor>) => ipcRenderer.invoke('writeDistributor', ...args),
    createPurchaseOrder: (...args: Parameters<CreatePurchaseOrder>) => ipcRenderer.invoke('createPurchaseOrder', ...args),
    getPurchaseOrders: (...args: Parameters<GetPurchaseOrders>) => ipcRenderer.invoke('getPurchaseOrders', ...args),
    getPurchaseOrderById: (...args: Parameters<GetPurchaseOrderById>) => ipcRenderer.invoke('getPurchaseOrderById', ...args),
    createIssueOrder: (...args: Parameters<CreateIssueOrder>) => ipcRenderer.invoke('createIssueOrder', ...args),
    getIssueOrders: (...args: Parameters<GetIssueOrders>) => ipcRenderer.invoke('getIssueOrders', ...args),
    getIssueOrderItems: (...args: Parameters<GetIssueOrderItems>) => ipcRenderer.invoke('getIssueOrderItems', ...args), 
   saveBillTemplate: (payload: { templateName: string; config: any }) =>
  ipcRenderer.invoke('saveBillTemplate', payload),

    getAllBillTemplates: (...args: Parameters<GetAllBillTemplates>) => ipcRenderer.invoke('getAllBillTemplates', ...args),
    deleteBillTemplate: (...args: Parameters<DeleteBillTemplate>) => ipcRenderer.invoke('deleteBillTemplate', ...args),
    getBillTemplateByUser: (...args: Parameters<GetBillTemplateById>) => ipcRenderer.invoke('getBillTemplateByUser', ...args),
    createBill: (...args: Parameters<CreateInvoice>) => ipcRenderer.invoke('createBill', ...args),
    getAllBills: (...args: Parameters<GetAllBills>) => ipcRenderer.invoke('getAllBills', ...args),
    getBillById: (...args: Parameters<GetBillById>) => ipcRenderer.invoke('getBillById', ...args),
    searchBills: (...args: Parameters<SearchBills>) => ipcRenderer.invoke('searchBills', ...args),
    createCustomer: (...args: Parameters<CreateCustomer>) => ipcRenderer.invoke('createCustomer', ...args),
    createCustomers: (...args: Parameters<CreateCustomers>) => ipcRenderer.invoke('createCustomers', ...args),
    getCustomers: (...args: Parameters<GetCustomers>) => ipcRenderer.invoke('getCustomers', ...args),
    getCustomerById: (...args: Parameters<GetCustomerById>) => ipcRenderer.invoke('getCustomerById', ...args),
    searchCustomerByPhone: (...args: Parameters<SearchCustomerByPhone>) => ipcRenderer.invoke('searchCustomerByPhone', ...args),
    getBillByNumber: (...args: Parameters<GetBillByNumber>) => ipcRenderer.invoke('getBillByNumber', ...args)
  })
} catch (error) {
  console.error(error)
}


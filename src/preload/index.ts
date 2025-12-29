import { writeCreditDebitNote } from '@/lib/creditdebit'
import { CreateInvoice, DeleteInvoice, GetInvoices, ReadInvoice, WriteInvoice,GetInvoiceById,CreateInventory, GetInventoryById, GetInventory, CreateCreditDebitNote, WriteCreditDebitNote, GetCreditDebitNotes, GetReceiveMaterialById, GetReceiveMaterials, WriteReceiveMaterial,CreateReceiveMaterial } from '@shared/types'
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
    getReceiveMaterialById: (...args: Parameters<GetReceiveMaterialById>) => ipcRenderer.invoke('getReceiveMaterialById', ...args)
  })
} catch (error) {
  console.error(error)
}


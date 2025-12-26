import { CreateInvoice, DeleteInvoice, GetInvoices, ReadInvoice, WriteInvoice,GetInvoiceById,CreateInventory, GetInventoryById, GetInventory } from '@shared/types'
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
    getInventoryById: (...args: Parameters<GetInventoryById>) => ipcRenderer.invoke('getInventoryById', ...args)
  })
} catch (error) {
  console.error(error)
}


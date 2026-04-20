import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, ipcMain, shell } from 'electron'
import path, { join } from 'path'
import icon from '../../resources/icon.png?asset'

/* ---------------- IPC IMPORTS ---------------- */
import {
  createInventory,
  createInvoice,
  deleteInvoice,
  getInventory,
  getInventoryById,
  getInvoiceById,
  getInvoices,
  getUnsyncedInventory,
  getUnsyncedInvoices,
  readInvoice,
  updateInventorySyncStatus,
  updateInvoicesSyncStatus,
  writeInvoice
} from '@/lib'
import {
  getAllBillTemplates,
  getBillTemplateByUser,
  getUnsyncedBillTemplates,
  saveBillTemplate,
  updateBillTemplatesSyncStatus
} from '@/lib/billtemplate'
import {
  CreateCreditDebitNote,
  CreateDistributor,
  CreateInventory,
  CreateInvoice,
  CreateReceiveMaterial,
  DeleteInvoice,
  GetCreditDebitNotes,
  GetDistributors,
  GetInventory,
  GetInventoryById,
  GetInvoiceById,
  GetInvoices,
  GetReceiveMaterialById,
  GetReceiveMaterials,
  ReadInvoice,
  WriteCreditDebitNote,
  WriteDistributor,
  WriteInvoice,
  WriteReceiveMaterial
} from '@shared/types'
import { createIssueOrder, getIssueOrderItems, getIssueOrders, getUnsyncedIssueOrders, updateIssueOrdersSyncStatus } from './lib/issueorder'

import {
  createCreditDebitNote,
  getCreditDebitNotes,
  getUnsyncedCreditDebitNotes,
  updateCreditDebitNotesSyncStatus,
  writeCreditDebitNote
} from './lib/creditdebit'

import {
  createReceiveMaterial,
  getReceiveMaterialById,
  getReceiveMaterials,
  getUnsyncedReceiveMaterials,
  updateReceiveMaterialsSyncStatus,
  writeReceiveMaterial
} from './lib/receiveMaterial'

import {
  createBill,
  getAllBills,
  getBillById,
  getBillByNumber,
  getUnsyncedBills,
  searchBills,
  updateBillsSyncStatus
} from './lib/bill'
import { createCustomer, createCustomers, getCustomerById, getCustomers, getUnsyncedCustomers, searchCustomerByPhone, updateCustomersSyncStatus } from './lib/customers'
import {
  createDistributor,
  getDistributors,
  getUnsyncedDistributors,
  updateDistributorsSyncStatus,
  writeDistributor
} from './lib/distributor'
import { createPurchaseOrder, getPurchaseOrderById, getPurchaseOrders, getUnsyncedPurchaseOrders, updatePurchaseOrdersSyncStatus } from './lib/purchaseorder'

/* ---------------- WINDOW ---------------- */

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    center: true,
    title: 'NoteMark',
    frame: false,
    vibrancy: 'under-window',
    visualEffectState: 'active',
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 15, y: 10 },
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      sandbox: true
    }
  })

  mainWindow.maximize()

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  /* ----------- LOAD REACT ----------- */

  if (is.dev) {
    // ✅ React dev server
  mainWindow.loadURL('http://localhost:8080')
    //  mainWindow.loadFile(
    //   path.join(__dirname, '../../resources/dist/index.html')
    // )
  } else {
    // ✅ React production build
    mainWindow.loadFile(
      path.join(__dirname, '../../resources/dist/index.html')
    )
  }
}

/* ---------------- APP LIFECYCLE ---------------- */

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  /* ---------------- IPC HANDLERS ---------------- */

  ipcMain.handle('getInvoices', (_, ...args: Parameters<GetInvoices>) => getInvoices(...args))
  ipcMain.handle('getInvoiceById', (_, ...args: Parameters<GetInvoiceById>) => getInvoiceById(...args))
  ipcMain.handle('readInvoice', (_, ...args: Parameters<ReadInvoice>) => readInvoice(...args))
  ipcMain.handle('writeInvoice', (_, ...args: Parameters<WriteInvoice>) => writeInvoice(...args))
  ipcMain.handle('createInvoice', (_, ...args: Parameters<CreateInvoice>) => createInvoice(...args))
  ipcMain.handle('deleteInvoice', (_, ...args: Parameters<DeleteInvoice>) => deleteInvoice(...args))

  ipcMain.handle('createInventory', (_, ...args: Parameters<CreateInventory>) => createInventory(...args))
  ipcMain.handle('getInventory', (_, ...args: Parameters<GetInventory>) => getInventory(...args))
  ipcMain.handle('getInventoryById', (_, ...args: Parameters<GetInventoryById>) => getInventoryById(...args))

  ipcMain.handle('getUnsyncedInvoices', () => getUnsyncedInvoices())
  ipcMain.handle('getUnsyncedInventory', () => getUnsyncedInventory())
  ipcMain.handle('updateInvoicesSyncStatus', (_, ids: string[]) => updateInvoicesSyncStatus(ids))
  ipcMain.handle('updateInventorySyncStatus', (_, ids: string[]) => updateInventorySyncStatus(ids))

  ipcMain.handle('createCreditDebitNote', (_, ...args: Parameters<CreateCreditDebitNote>) =>
    createCreditDebitNote(...args)
  )

  ipcMain.handle('writeCreditDebitNote', (_, ...args: Parameters<WriteCreditDebitNote>) =>
    writeCreditDebitNote(...args)
  )

  ipcMain.handle('getUnsyncedCreditDebitNotes', () => getUnsyncedCreditDebitNotes())
  ipcMain.handle('updateCreditDebitNotesSyncStatus', (_, ids: string[]) => updateCreditDebitNotesSyncStatus(ids))

  ipcMain.handle(
  "getCreditDebitNotes",
  (_, args: Parameters<GetCreditDebitNotes>[0]) => {
    const convertedArgs = args
      ? {
          ...args,
          from_date: args.from_date ? Number(args.from_date) : undefined,
          to_date: args.to_date ? Number(args.to_date) : undefined,
        }
      : undefined

    return getCreditDebitNotes(convertedArgs)
  }
)


  ipcMain.handle('createReceiveMaterial', (_, ...args: Parameters<CreateReceiveMaterial>) =>
    createReceiveMaterial(...args)
  )

  ipcMain.handle('writeReceiveMaterial', (_, ...args: Parameters<WriteReceiveMaterial>) =>
    writeReceiveMaterial(...args)
  )

  ipcMain.handle('getUnsyncedReceiveMaterials', () => getUnsyncedReceiveMaterials())
  ipcMain.handle('updateReceiveMaterialsSyncStatus', (_, ids: string[]) => updateReceiveMaterialsSyncStatus(ids))

  ipcMain.handle('getReceiveMaterials', (_, args: Parameters<GetReceiveMaterials>[0]) => {
    const convertedArgs = args
      ? {
          ...args,
          fromDate: args.fromDate ? Number(args.fromDate) : undefined,
          toDate: args.toDate ? Number(args.toDate) : undefined
        }
      : undefined
    return getReceiveMaterials(convertedArgs)
  })

  ipcMain.handle('getReceiveMaterialById', (_, ...args: Parameters<GetReceiveMaterialById>) =>
    getReceiveMaterialById(...args)
  )

  ipcMain.handle('getUnsyncedDistributors', () => getUnsyncedDistributors())
  ipcMain.handle('updateDistributorsSyncStatus', (_, ids: string[]) => updateDistributorsSyncStatus(ids))

  ipcMain.handle('getDistributors', (_, args: Parameters<GetDistributors>[0]) => {
    const convertedArgs = args
      ? {
          ...args,
          distributorId: args.distributorId ? String(args.distributorId) : undefined,
          supplierName: (args as any).name ?? args.supplierName
        }
      : undefined
    return getDistributors(convertedArgs)
  })

  ipcMain.handle('writeDistributor', (_, ...args: Parameters<WriteDistributor>) =>
    writeDistributor(...args)
  )

  ipcMain.handle('createDistributor', (_, ...args: Parameters<CreateDistributor>) =>
    createDistributor(...args)
  )

  ipcMain.handle('getUnsyncedPurchaseOrders', () => getUnsyncedPurchaseOrders())
  ipcMain.handle('updatePurchaseOrdersSyncStatus', (_, ids: string[]) => updatePurchaseOrdersSyncStatus(ids))

  ipcMain.handle('createPurchaseOrder', (_, ...args: any[]) =>
    // @ts-ignore
    createPurchaseOrder(...args)
  )
  ipcMain.handle('getPurchaseOrders', (_, ...args: any[]) =>
    // @ts-ignore
    getPurchaseOrders(...args)
  )
  ipcMain.handle('getPurchaseOrderById', (_, ...args: any[]) =>
    // @ts-ignore
    getPurchaseOrderById(...args)
  )

  ipcMain.handle('getUnsyncedIssueOrders', () => getUnsyncedIssueOrders())
  ipcMain.handle('updateIssueOrdersSyncStatus', (_, ids: string[]) => updateIssueOrdersSyncStatus(ids))

  ipcMain.handle('createIssueOrder', (_, ...args: any[]) =>
    // @ts-ignore
    createIssueOrder(...args)

  )
  ipcMain.handle('getIssueOrders', (_, ...args: any[]) =>
    // @ts-ignore
    getIssueOrders(...args)
  )
 ipcMain.handle('getIssueOrderItems', (_, ...args: any[]) =>
    // @ts-ignore
    getIssueOrderItems(...args)
  )

  ipcMain.handle('getUnsyncedBillTemplates', () => getUnsyncedBillTemplates())
  ipcMain.handle('updateBillTemplatesSyncStatus', (_, ids: string[]) => updateBillTemplatesSyncStatus(ids))

 ipcMain.handle('saveBillTemplate', (_event, payload) => {
  const { templateName, config } = payload
  return saveBillTemplate(templateName, config)
})

  ipcMain.handle('getAllBillTemplates', (_, ...args: any[]) =>
    // @ts-ignore
    getAllBillTemplates(...args)
  )
  ipcMain.handle('deleteBillTemplate', (_, ...args: any[]) =>
    // @ts-ignore
    deleteBillTemplate(...args)
  )
  ipcMain.handle('getBillTemplateByUser', (_, ...args: any[]) =>
    // @ts-ignore
    getBillTemplateByUser(...args)
  )
  ipcMain.handle('createBill', (_, ...args: any[]) =>
    // @ts-ignore
    createBill(...args) 
  )
  ipcMain.handle('searchBills', (_, ...args: any[]) =>
    // @ts-ignore
    searchBills(...args)  
  )
  ipcMain.handle('getBillById', (_, ...args: any[]) =>
    // @ts-ignore
    getBillById(...args)  
  )
  ipcMain.handle('getAllBills', (_, ...args: any[]) =>
    // @ts-ignore
    getAllBills(...args)  
  )

  ipcMain.handle('getUnsyncedBills', () => getUnsyncedBills())
  ipcMain.handle('updateBillsSyncStatus', (_, ids: string[]) => updateBillsSyncStatus(ids))

  ipcMain.handle('createCustomer', (_, ...args: any[]) =>
    // @ts-ignore
    createCustomer(...args)   
  )
  ipcMain.handle('createCustomers', (_, ...args: any[]) =>
    // @ts-ignore   
    createCustomers(...args)   
  )
  ipcMain.handle('getCustomers', (_, ...args: any[]) =>
    // @ts-ignore
    getCustomers(...args)
  )

  ipcMain.handle('getUnsyncedCustomers', () => getUnsyncedCustomers())
  ipcMain.handle('updateCustomersSyncStatus', (_, ids: string[]) => updateCustomersSyncStatus(ids))

  ipcMain.handle('getCustomerById', (_, ...args: any[]) =>
    // @ts-ignore
    getCustomerById(...args)
  )
  ipcMain.handle('searchCustomerByPhone', (_, ...args: any[]) =>
    // @ts-ignore
    searchCustomerByPhone(...args)
  )
  ipcMain.handle('getBillByNumber', (_, ...args: any[]) =>
    // @ts-ignore
    getBillByNumber(...args)
  )
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

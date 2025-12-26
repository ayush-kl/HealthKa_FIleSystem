import { ensureDirSync } from 'fs-extra'
import { dialog, app } from 'electron'
import path from 'path'
import Database from 'better-sqlite3'

/* ----------------------------------
   CONFIG
---------------------------------- */

const appDirectoryName = 'dawaiInvoices'

export const getRootDir = () =>
  path.join(app.getPath('userData'), appDirectoryName)

ensureDirSync(getRootDir())

const dbPath = path.join(getRootDir(), 'invoices.db')

/* ----------------------------------
   DB INIT
---------------------------------- */

export const db = new Database(dbPath)

db.prepare(`
  CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY,
    createdAt INTEGER,
    patientName TEXT,
    mobile TEXT,
    data TEXT
  )
`).run()
db.prepare(`
  CREATE TABLE IF NOT EXISTS Inventory (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    batchNo TEXT NOT NULL,
    unit TEXT NOT NULL,
    minStock INTEGER NOT NULL,
    rack TEXT,
    productType TEXT,
    createdAt INTEGER,
    updatedAt INTEGER
  )
`).run()

/* ----------------------------------
   CREATE INVOICE
---------------------------------- */

export const createInvoice = (data: any = {}) => {
  const id = `invoice-${Date.now()}`
  const createdAt = Date.now()

  db.prepare(`
    INSERT INTO invoices (id, createdAt, patientName, mobile, data)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    id,
    createdAt,
    data.patientName || '',
    data.mobile || '',
    JSON.stringify({ id, createdAt, ...data })
  )

  return id
}

/* ----------------------------------
   UPDATE / WRITE INVOICE
---------------------------------- */

export const writeInvoice = (id: string, content: string) => {
  const parsed = JSON.parse(content)

  db.prepare(`
    UPDATE invoices
    SET data = ?, patientName = ?, mobile = ?, createdAt = ?
    WHERE id = ?
  `).run(
    JSON.stringify(parsed),
    parsed.patientName || '',
    parsed.mobile || '',
    Date.now(),
    id
  )
}

/* ----------------------------------
   READ SINGLE INVOICE
---------------------------------- */

export const readInvoice = (id: string) => {
  const row = db
    .prepare(`SELECT data FROM invoices WHERE id = ?`)
    .get(id)

  return row ? JSON.parse(row.data) : null
}
const normalizeDate = (d?: string) => {
  if (!d) return ''

  // input from date picker → YYYY-MM-DD
  if (d.split('-')[0].length === 4) {
    return d.split('-').reverse().join('-')
  }

  // already DD-MM-YYYY
  return d
}

/* ----------------------------------
   GET INVOICES (FILTERS)
---------------------------------- */
export const getInvoices = (
  date?: string,
  filters?: {
    patientname?: string
    mobile?: string
    invoiceNo?: string
  }
) => {
  const rows = db
    .prepare(`SELECT * FROM invoices ORDER BY createdAt DESC`)
    .all()

  const searchDate = normalizeDate(date)

  const filtered = rows.filter((row: any) => {
    const data = JSON.parse(row.data)

    // ✅ DATE (FIXED)
    if (searchDate && data.date !== searchDate) return false

    // ✅ INVOICE NO
    if (filters?.invoiceNo) {
      if (!data.invoiceNo?.includes(filters.invoiceNo)) return false
    }

    // ✅ PATIENT NAME
    if (filters?.patientname) {
      const name =
        data.billPharmacy?.[0]?.patientname?.toLowerCase() || ''
      if (!name.includes(filters.patientname.toLowerCase())) return false
    }

    // ✅ MOBILE
    if (filters?.mobile) {
      const mobile =
        data.billPharmacy?.[0]?.phoneNumber || ''
      if (!mobile.includes(filters.mobile)) return false
    }

    return true
  })

  return filtered.map((row: any) => ({
    title: row.id,
    lastEditTime: row.createdAt,
    data: JSON.parse(row.data)
  }))
}

export const getInvoiceById = (id: string) => {
  const row = db
    .prepare(`SELECT * FROM invoices WHERE id = ?`)
    .get(id)

  if (!row) return null

  return {
    title: row.id,
    lastEditTime: row.createdAt,
    data: JSON.parse(row.data)
  }
}

/* ----------------------------------
   DELETE INVOICE
---------------------------------- */

export const deleteInvoice = async (id: string) => {
  const { response } = await dialog.showMessageBox({
    type: 'warning',
    title: 'Delete Invoice',
    message: `Are you sure you want to delete invoice "${id}"?`,
    buttons: ['Delete', 'Cancel'],
    defaultId: 1,
    cancelId: 1,
  })

  if (response !== 0) return false

  db.prepare(`DELETE FROM invoices WHERE id = ?`).run(id)
  return true
}
const validateItem = (item: any) => {
  if (
    !item.name ||
    !item.id ||
    !item.category ||
    !item.batchNo ||
    !item.unit ||
    item.minStock === undefined
  ) {
    throw new Error('Missing mandatory item fields')
  }
}

export const createInventory = (inventory: {
  id: string
  name: string
  category: string
  batchNo: string
  unit: string
  minStock: number
  rack?: string
  productType?: string
}) => {
  validateItem(inventory)

  const now = Date.now()

  db.prepare(`
    INSERT INTO Inventory
    (id, name, category, batchNo, unit, minStock, rack, productType, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    inventory.id,
    inventory.name,
    inventory.category,
    inventory.batchNo,
    inventory.unit,
    inventory.minStock,
    inventory.rack || '',
    inventory.productType || '',
    now,
    now
  )

  return inventory.id
}
export const getInventory = (filters?: {
  name?: string
  category?: string
}) => {
  const rows = db
    .prepare(`SELECT * FROM Inventory ORDER BY updatedAt DESC`)
    .all()

  return rows.filter((row: any) => {
    // 🔍 Filter by item name
    if (filters?.name) {
      if (!row.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false
      }
    }

    // 📦 Filter by category
    if (filters?.category) {
      if (!row.category.toLowerCase().includes(filters.category.toLowerCase())) {
        return false
      }
    }

    return true
  }).map((row: any) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    batchNo: row.batchNo,
    unit: row.unit,
    minStock: row.minStock,
    rack: row.rack,
    productType: row.productType,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  }))
}
export const getInventoryById = (id: string) => {
  return db
    .prepare(`SELECT * FROM Inventory WHERE id = ?`)
    .get(id)
}

import Database from 'better-sqlite3'
import { app, dialog } from 'electron'
import { ensureDirSync } from 'fs-extra'
import path from 'path'

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
    data TEXT,
    isSynced BOOLEAN DEFAULT FALSE
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
    updatedAt INTEGER,
    isSynced BOOLEAN DEFAULT FALSE
  )
`).run()

/* ----------------------------------
   CREATE INVOICE
---------------------------------- */
/* ----------------------------------
   CREATE INVOICE TEMPLATE
---------------------------------- */

export const createInvoice = (data: any = {}) => {
  const id = `invoice-${Date.now()}`
  const createdAt = Date.now()

  const payload = {
    id,
    createdAt,
    templateName: data.templateName || '',
    pharmacyEnabled: data.pharmacyEnabled ?? true,
    drugLicenseEnabled: data.drugLicenseEnabled ?? true,
    patientEnabled: data.patientEnabled ?? true,
    itemEnabled: data.itemEnabled ?? true,
    gstEnabled: data.gstEnabled ?? false,
    paymentEnabled: data.paymentEnabled ?? true,
    declarationEnabled: data.declarationEnabled ?? true,

    // 🔥 full config saved safely
    config: data
  }

  db.prepare(`
    INSERT INTO invoices (
      id,
      createdAt,
      templateName,
      data
    )
    VALUES (?, ?, ?, ?)
  `).run(
    id,
    createdAt,
    payload.templateName,
    JSON.stringify(payload)
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
export function getInvoices(filters ?: {
  billId?: string
  patientName?: string
  phoneNumber?: string
  billDate?: string
}) {
  let query = `
    SELECT *
    FROM invoices
    WHERE 1 = 1
  `
  const params: any[] = []

  if (filters?.billId) {
    query += ` AND json_extract(data, '$.bill_number') LIKE ?`
    params.push(`%${filters.billId}%`)
  }

  if (filters?.patientName) {
    query += ` AND patientName LIKE ?`
    params.push(`%${filters.patientName}%`)
  }

  if (filters?.phoneNumber) {
    query += ` AND mobile LIKE ?`
    params.push(`%${filters.phoneNumber}%`)
  }

  if (filters?.billDate) {
    query += ` AND json_extract(data, '$.bill_date') = ?`
    params.push(filters.billDate)
  }

  query += ` ORDER BY createdAt DESC`

  const rows = db.prepare(query).all(...params)

  return rows.map((row: any) => {
    const data = JSON.parse(row.data)

    return {
      id: row.id,
      bill_number: data.bill_number,
      patient_name: row.patientName,
      patient_phone: row.mobile,
      total_amount: data.total_amount,
      payment_status: data.payment_status,
      bill_date: data.bill_date,
      created_at: row.createdAt
    }
  })
}

/* -----------------------------
   GET INVOICE BY ID
-------------------------------- */
export function getInvoiceById(id: string) {
  const row = db
    .prepare(`SELECT * FROM invoices WHERE id = ?`)
    .get(id)

  if (!row) return null

  return {
    id: row.id,
    ...JSON.parse(row.data)
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

export const getUnsyncedInvoices = () => {
  const query = `SELECT * FROM invoices WHERE isSynced = ?`;
  const rows = db.prepare(query).all(0);

  return rows.map((row: any) => {
    const data = JSON.parse(row.data);
    return {
      id: row.id,
      ...data,
      createdAt: row.createdAt,
      data: row.data
    };
  });
};

export const getUnsyncedInventory = () => {
  const query = `SELECT * FROM Inventory WHERE isSynced = ?`;
  const rows = db.prepare(query).all(0);

  return rows.map((row: any) => ({
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
  }));
};

export const updateInvoicesSyncStatus = (ids: string[]) => {
  if (!ids || ids.length === 0) {
    return;
  }
  const placeholders = ids.map(() => '?').join(',');
  const query = `UPDATE invoices SET isSynced = TRUE WHERE id IN (${placeholders})`;
  db.prepare(query).run(...ids);
};

export const updateInventorySyncStatus = (ids: string[]) => {
  if (!ids || ids.length === 0) {
    return;
  }
  const placeholders = ids.map(() => '?').join(',');
  const query = `UPDATE Inventory SET isSynced = TRUE WHERE id IN (${placeholders})`;
  db.prepare(query).run(...ids);
  console.log(`Updated sync status for inventory items: ${ids.join(', ')}`);
};

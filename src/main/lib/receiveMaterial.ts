import { db } from './index'

/* ----------------------------------
   TABLE INIT : RECEIVE MATERIAL
---------------------------------- */
db.prepare(`
  CREATE TABLE IF NOT EXISTS receive_material (
    id TEXT PRIMARY KEY,

    -- Purchase Details
    purchaseId TEXT NOT NULL,
    paymentStatus TEXT,
    deliveryStatus TEXT,
    vendorName TEXT,

    -- Metadata
    createdAt INTEGER,
    updatedAt INTEGER,

    -- Complete structured payload (products, gst, qty, etc.)
    data TEXT
  )
`).run()

/* ----------------------------------
   CREATE RECEIVE MATERIAL
---------------------------------- */
export const createReceiveMaterial = (data: any) => {
  const id = `RM-${Date.now()}`
  const now = Date.now()

  db.prepare(`
    INSERT INTO receive_material (
      id,
      purchaseId,
      paymentStatus,
      deliveryStatus,
      vendorName,
      createdAt,
      updatedAt,
      data
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.purchaseDetails?.purchaseId || '',
    data.purchaseDetails?.paymentStatus || '',
    data.purchaseDetails?.deliveryStatus || '',
    data.purchaseDetails?.vendorName || '',
    now,
    now,
    JSON.stringify(data)
  )

  return id
}

/* ----------------------------------
   UPDATE / WRITE RECEIVE MATERIAL
---------------------------------- */
export const writeReceiveMaterial = (id: string, content: string) => {
  const parsed = JSON.parse(content)

  db.prepare(`
    UPDATE receive_material SET
      purchaseId = ?,
      paymentStatus = ?,
      deliveryStatus = ?,
      vendorName = ?,
      updatedAt = ?,
      data = ?
    WHERE id = ?
  `).run(
    parsed.purchaseDetails?.purchaseId || '',
    parsed.purchaseDetails?.paymentStatus || '',
    parsed.purchaseDetails?.deliveryStatus || '',
    parsed.purchaseDetails?.vendorName || '',
    Date.now(),
    JSON.stringify(parsed),
    id
  )
}

/* ----------------------------------
   GET RECEIVE MATERIAL (FILTERS)
---------------------------------- */
export const getReceiveMaterials = (filters?: {
  purchaseId?: string
  vendorName?: string
  fromDate?: number
  toDate?: number
}) => {
  let query = `SELECT * FROM receive_material WHERE 1=1`
  const params: any[] = []

  if (filters?.purchaseId) {
    query += ` AND purchaseId LIKE ?`
    params.push(`%${filters.purchaseId}%`)
  }

  if (filters?.vendorName) {
    query += ` AND vendorName LIKE ?`
    params.push(`%${filters.vendorName}%`)
  }

  if (filters?.fromDate) {
    query += ` AND createdAt >= ?`
    params.push(filters.fromDate)
  }

  if (filters?.toDate) {
    query += ` AND createdAt <= ?`
    params.push(filters.toDate)
  }

  query += ` ORDER BY createdAt DESC`

  const rows = db.prepare(query).all(...params)

  return rows.map((row: any) => ({
    id: row.id,
    purchaseId: row.purchaseId,
    paymentStatus: row.paymentStatus,
    deliveryStatus: row.deliveryStatus,
    vendorName: row.vendorName,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    data: JSON.parse(row.data)
  }))
}

/* ----------------------------------
   GET SINGLE RECEIVE MATERIAL BY ID
---------------------------------- */
export const getReceiveMaterialById = (id: string) => {
  const row = db
    .prepare(`SELECT * FROM receive_material WHERE id = ?`)
    .get(id)

  if (!row) return null

  return {
    id: row.id,
    purchaseId: row.purchaseId,
    paymentStatus: row.paymentStatus,
    deliveryStatus: row.deliveryStatus,
    vendorName: row.vendorName,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    data: JSON.parse(row.data)
  }
}

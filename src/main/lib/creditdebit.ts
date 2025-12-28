import { db } from './index'

/* ----------------------------------
   TABLE INIT
---------------------------------- */
db.prepare(`
  CREATE TABLE IF NOT EXISTS credit_debit_notes (
    id TEXT PRIMARY KEY,

    -- Purchase Details
    noteType TEXT NOT NULL,
    issueDate INTEGER,
    purchaseOrderId TEXT,
    reason TEXT,
    receivedId TEXT,
    total REAL,
    vendorName TEXT NOT NULL,

    -- Metadata
    createdAt INTEGER,
    updatedAt INTEGER,

    -- Complete structured payload (items, reasons, gst, etc.)
    data TEXT
  )
`).run()

/* ----------------------------------
   CREATE CREDIT / DEBIT NOTE
---------------------------------- */

export const createCreditDebitNote = (data: any) => {
  const id = `CDN-${Date.now()}`
  const now = Date.now()

  db.prepare(`
    INSERT INTO credit_debit_notes (
      id,
      noteType,
      issueDate,
      purchaseOrderId,
      reason,
      receivedId,
      total,
      vendorName,
      createdAt,
      updatedAt,
      data
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.purchaseDetails?.noteType || '',
    data.purchaseDetails?.issueDate
      ? new Date(data.purchaseDetails.issueDate).getTime()
      : null,
    data.purchaseDetails?.purchaseOrderId || '',
    data.purchaseDetails?.reason || '',
    data.purchaseDetails?.receivedId || '',
    Number(data.purchaseDetails?.total || 0),
    data.purchaseDetails?.vendorName || '',
    now,
    now,
    JSON.stringify(data)
  )

  return id
}

/* ----------------------------------
   UPDATE / WRITE CREDIT / DEBIT NOTE
---------------------------------- */

export const writeCreditDebitNote = (id: string, content: string) => {
  const parsed = JSON.parse(content)
   

  db.prepare(`
    UPDATE credit_debit_notes SET
      noteType = ?,
      issueDate = ?,
      purchaseOrderId = ?,
      reason = ?,
      receivedId = ?,
      total = ?,
      vendorName = ?,
      updatedAt = ?,
      data = ?
    WHERE id = ?
  `).run(
    parsed.purchaseDetails?.noteType || '',
    parsed.purchaseDetails?.issueDate
      ? new Date(parsed.purchaseDetails.issueDate).getTime()
      : null,
    parsed.purchaseDetails?.purchaseOrderId || '',
    parsed.purchaseDetails?.reason || '',
    parsed.purchaseDetails?.receivedId || '',
    Number(parsed.purchaseDetails?.total || 0),
    parsed.purchaseDetails?.vendorName || '',
    Date.now(),
    JSON.stringify(parsed),
    id
  )
}

/* ----------------------------------
   GET CREDIT / DEBIT NOTES (FILTERS)
---------------------------------- */

export const getCreditDebitNotes = (filters?: {
  noteId?: string
  vendorName?: string
  fromDate?: number
  toDate?: number
}) => {
  let query = `SELECT * FROM credit_debit_notes WHERE 1=1`
  const params: any[] = []

  if (filters?.noteId) {
    query += ` AND id LIKE ?`
    params.push(`%${filters.noteId}%`)
  }

  if (filters?.vendorName) {
    query += ` AND vendorName LIKE ?`
    params.push(`%${filters.vendorName}%`)
  }

  if (filters?.fromDate) {
    query += ` AND issueDate >= ?`
    params.push(filters.fromDate)
  }

  if (filters?.toDate) {
    query += ` AND issueDate <= ?`
    params.push(filters.toDate)
  }

  query += ` ORDER BY createdAt DESC`

  const rows = db.prepare(query).all(...params)

  return rows.map((row: any) => ({
    id: row.id,
    noteType: row.noteType,
    vendorName: row.vendorName,
    purchaseOrderId: row.purchaseOrderId,
    issueDate: row.issueDate,
    reason: row.reason,
    receivedId: row.receivedId,
    total: row.total,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    data: JSON.parse(row.data)
  }))
}

/* ----------------------------------
   GET SINGLE NOTE BY ID
---------------------------------- */

export const getCreditDebitNoteById = (id: string) => {
  const row = db
    .prepare(`SELECT * FROM credit_debit_notes WHERE id = ?`)
    .get(id)

  if (!row) return null

  return {
    id: row.id,
    noteType: row.noteType,
    vendorName: row.vendorName,
    purchaseOrderId: row.purchaseOrderId,
    issueDate: row.issueDate,
    reason: row.reason,
    receivedId: row.receivedId,
    total: row.total,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    data: JSON.parse(row.data)
  }
}

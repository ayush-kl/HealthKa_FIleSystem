import crypto from "crypto"
import { db } from "./index"

/* ----------------------------------
   TABLE INIT
---------------------------------- */

// ⚠️ IMPORTANT:
// If you already ran the app before,
// DELETE the old invoices.db ONCE
// so this schema is applied cleanly.

db.prepare(`
  CREATE TABLE IF NOT EXISTS credit_debit_notes (
    id TEXT PRIMARY KEY,

    -- Core fields
    noteId TEXT NOT NULL,
    noteType TEXT NOT NULL,
    issueDate INTEGER DEFAULT 0,
    purchaseOrderId TEXT DEFAULT '',
    reason TEXT DEFAULT '',
    receivedId TEXT DEFAULT '',
    total REAL DEFAULT 0,
    vendorName TEXT DEFAULT '',
    isSynced BOOLEAN DEFAULT FALSE,
    -- Metadata
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL,

    -- Full payload
    data TEXT
  )
`).run()

db.prepare(`
  CREATE TABLE IF NOT EXISTS credit_debit_items (
    id TEXT PRIMARY KEY,
    noteDbId TEXT NOT NULL,

    itemName TEXT,
    quantity INTEGER DEFAULT 0,
    unit TEXT,
    price REAL DEFAULT 0,
    batchNo TEXT,
    gst TEXT,
    reason TEXT
  )
`).run()

/* ----------------------------------
   HELPERS
---------------------------------- */

const safeTimestamp = (date?: string) => {
  if (!date) return 0
  const t = new Date(date).getTime()
  return Number.isFinite(t) ? t : 0
}

/* ----------------------------------
   CREATE CREDIT / DEBIT NOTE
---------------------------------- */

export const createCreditDebitNote = (payload: {
  note_id: string
  note_type: string
  issue_date?: string
  purchase_order_id?: string
  reason?: string
  received_id?: string
  total?: number
  vendor_name?: string
  items?: any[]
}) => {
  const id = `CDN-${Date.now()}`
  const now = Date.now()

  db.prepare(`
    INSERT INTO credit_debit_notes (
      id,
      noteId,
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
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    payload.note_id,
    payload.note_type,
    safeTimestamp(payload.issue_date),
    payload.purchase_order_id || '',
    payload.reason || '',
    payload.received_id || '',
    payload.total || 0,
    payload.vendor_name || '',
    now,
    now,
    JSON.stringify(payload)
  )

  if (payload.items?.length) {
    const stmt = db.prepare(`
      INSERT INTO credit_debit_items (
        id,
        noteDbId,
        itemName,
        quantity,
        unit,
        price,
        batchNo,
        gst,
        reason
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    for (const item of payload.items) {
      stmt.run(
        crypto.randomUUID(),
        id,
        item.item_name || '',
        Number(item.quantity || 0),
        item.unit || '',
        Number(item.price || 0),
        item.batch_no || '',
        item.gst || '',
        item.reason || ''
      )
    }
  }

  return id
}

/* ----------------------------------
   GET CREDIT / DEBIT NOTES
---------------------------------- */

export const getCreditDebitNotes = (filters?: {
  note_id?: string
  from_date?: number
  to_date?: number
}) => {
  let query = `SELECT * FROM credit_debit_notes WHERE 1=1`
  const params: any[] = []

  if (filters?.note_id) {
    query += ` AND noteId LIKE ?`
    params.push(`%${filters.note_id}%`)
  }

  if (filters?.from_date) {
    query += ` AND issueDate >= ?`
    params.push(filters.from_date)
  }

  if (filters?.to_date) {
    query += ` AND issueDate <= ?`
    params.push(filters.to_date)
  }

  query += ` ORDER BY createdAt DESC`

  const rows = db.prepare(query).all(...params)

  return rows.map((row: any) => {
    const items = db
      .prepare(`SELECT * FROM credit_debit_items WHERE noteDbId = ?`)
      .all(row.id)

    return {
      id: row.id,
      note_id: row.noteId,
      note_type: row.noteType,
      issue_date: row.issueDate || 0,
      purchase_order_id: row.purchaseOrderId,
      reason: row.reason,
      received_id: row.receivedId,
      total: row.total,
      vendor_name: row.vendorName,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      items: items.map((i: any) => ({
        id: i.id,
        name: i.itemName,
        quantity: i.quantity,
        unit: i.unit,
        price: i.price,
        batchNo: i.batchNo,
        gst: i.gst,
        reason: i.reason
      }))
    }
  })
}

/* ----------------------------------
   UPDATE CREDIT / DEBIT NOTE
---------------------------------- */

export const writeCreditDebitNote = (
  id: string,
  content: string
) => {
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
    parsed.note_type || '',
    safeTimestamp(parsed.issue_date),
    parsed.purchase_order_id || '',
    parsed.reason || '',
    parsed.received_id || '',
    parsed.total || 0,
    parsed.vendor_name || '',
    Date.now(),
    JSON.stringify(parsed),
    id
  )
}

/* ----------------------------------
   DELETE CREDIT / DEBIT NOTE
---------------------------------- */

export const deleteCreditDebitNote = (id: string) => {
  db.prepare(`DELETE FROM credit_debit_notes WHERE id = ?`).run(id)
  db.prepare(`DELETE FROM credit_debit_items WHERE noteDbId = ?`).run(id)
}

export const getUnsyncedCreditDebitNotes = () => {
  const query = `SELECT * FROM credit_debit_notes WHERE isSynced = ?`
  const rows = db.prepare(query).all(0)

  return rows.map((row: any) => {
    const items = db
      .prepare(`SELECT * FROM credit_debit_items WHERE noteDbId = ?`)
      .all(row.id)

    return {
      id: row.id,
      note_id: row.noteId,
      note_type: row.noteType,
      issue_date: row.issueDate || 0,
      purchase_order_id: row.purchaseOrderId,
      reason: row.reason,
      received_id: row.receivedId,
      total: row.total,
      vendor_name: row.vendorName,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      data: row.data,
      items: items.map((i: any) => ({
        id: i.id,
        name: i.itemName,
        quantity: i.quantity,
        unit: i.unit,
        price: i.price,
        batchNo: i.batchNo,
        gst: i.gst,
        reason: i.reason
      }))
    }
  })
}

export const updateCreditDebitNotesSyncStatus = (ids: string[]) => {
  if (!ids || ids.length === 0) {
    return
  }
  const placeholders = ids.map(() => '?').join(',')
  const query = `UPDATE credit_debit_notes SET isSynced = TRUE WHERE id IN (${placeholders})`
  db.prepare(query).run(...ids);
  console.log(`Updated sync status for credit/debit notes: ${ids.join(', ')}`)
}

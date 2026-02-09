import { db } from "./index"

/* ----------------------------------
   TABLE INIT : RECEIVE MATERIAL
---------------------------------- */
db.prepare(`
  CREATE TABLE IF NOT EXISTS receive_material (
    id TEXT PRIMARY KEY,

    -- Order Details (used for search/filter)
    purchaseId TEXT NOT NULL,
    vendorName TEXT NOT NULL,
    paymentStatus TEXT,
    deliveryStatus TEXT,

    -- Metadata
    createdAt INTEGER,
    updatedAt INTEGER,
    isSynced BOOLEAN DEFAULT FALSE,

    -- Full frontend payload (orders + items)
    data TEXT NOT NULL
  )
`).run()

/* ----------------------------------
   CREATE RECEIVE MATERIAL
---------------------------------- */
/**
 * Expects payload EXACTLY as frontend sends:
 * {
 *   orderDetails: [{
 *     purchase_order_id,
 *     vendor_name,
 *     payment_status,
 *     delivery_status
 *   }],
 *   itemDetails: [{
 *     item_id,
 *     item_name,
 *     received_quantity,
 *     category,
 *     unit,
 *     remark
 *   }]
 * }
 */
export const createReceiveMaterial = (payload: any) => {
  if (!payload?.orderDetails?.length) {
    throw new Error("Order details are required")
  }

  if (!payload?.itemDetails?.length) {
    throw new Error("Item details are required")
  }

  const order = payload.orderDetails[0] // frontend allows multiple, backend stores one
  const now = Date.now()
  const id = `RM-${now}`

  db.prepare(`
    INSERT INTO receive_material (
      id,
      purchaseId,
      vendorName,
      paymentStatus,
      deliveryStatus,
      createdAt,
      updatedAt,
      data
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    order.purchase_order_id || "",
    order.vendor_name || "",
    order.payment_status || "Pending",
    order.delivery_status || "Completed",
    now,
    now,
    JSON.stringify(payload)
  )

  return id
}

/* ----------------------------------
   UPDATE / WRITE RECEIVE MATERIAL
---------------------------------- */
/**
 * content = JSON.stringify(payload from frontend)
 */
export const writeReceiveMaterial = (id: string, content: string) => {
  const parsed = JSON.parse(content)

  if (!parsed?.orderDetails?.length) {
    throw new Error("Order details missing")
  }

  const order = parsed.orderDetails[0]

  db.prepare(`
    UPDATE receive_material SET
      purchaseId = ?,
      vendorName = ?,
      paymentStatus = ?,
      deliveryStatus = ?,
      updatedAt = ?,
      data = ?
    WHERE id = ?
  `).run(
    order.purchase_order_id || "",
    order.vendor_name || "",
    order.payment_status || "Pending",
    order.delivery_status || "Completed",
    Date.now(),
    JSON.stringify(parsed),
    id
  )
}

/* ----------------------------------
   GET RECEIVE MATERIALS (FILTERS)
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
    vendorName: row.vendorName,
    paymentStatus: row.paymentStatus,
    deliveryStatus: row.deliveryStatus,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    data: JSON.parse(row.data), // contains orderDetails + itemDetails exactly as frontend
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
    vendorName: row.vendorName,
    paymentStatus: row.paymentStatus,
    deliveryStatus: row.deliveryStatus,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    data: JSON.parse(row.data),
  }
}

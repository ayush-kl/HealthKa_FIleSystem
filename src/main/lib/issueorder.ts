import { db } from "./index"

/* ----------------------------------
   TABLE INIT
---------------------------------- */
db.prepare(`
  CREATE TABLE IF NOT EXISTS issue_orders (
    id TEXT PRIMARY KEY,
    userId TEXT,

    employeeType TEXT NOT NULL,
    employeeName TEXT NOT NULL,
    issueDate INTEGER NOT NULL,
    remark TEXT,

    createdAt INTEGER,
    updatedAt INTEGER,
    isSynced BOOLEAN DEFAULT FALSE,

    data TEXT
  )
`).run()

db.prepare(`
  CREATE TABLE IF NOT EXISTS issue_order_items (
    id TEXT PRIMARY KEY,
    issueOrderId TEXT NOT NULL,

    itemId TEXT NOT NULL,
    itemName TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    remark TEXT,

    createdAt INTEGER,

    FOREIGN KEY (issueOrderId) REFERENCES issue_orders(id)
  )
`).run()

/* ----------------------------------
   CREATE ISSUE ORDER
---------------------------------- */
export const createIssueOrder = (payload: any) => {
  const issueOrderId = `ISSUE-${Date.now()}`
  const now = Date.now()

  db.prepare(`
    INSERT INTO issue_orders (
      id,
      userId,
      employeeType,
      employeeName,
      issueDate,
      remark,
      createdAt,
      updatedAt,
      data
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    issueOrderId,
    payload.user_id || null,
    payload.employee_type,
    payload.employee_name,
    payload.issue_date, // timestamp (number)
    payload.remark || "",
    now,
    now,
    JSON.stringify(payload)
  )

  const itemStmt = db.prepare(`
    INSERT INTO issue_order_items (
      id,
      issueOrderId,
      itemId,
      itemName,
      quantity,
      remark,
      createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  for (const item of payload.items) {
    itemStmt.run(
      `ITEM-${Date.now()}-${Math.random()}`,
      issueOrderId,
      item.item_id,
      item.item_name,
      item.quantity,
      item.remark || "",
      now
    )
  }

  return issueOrderId
}

/* ----------------------------------
   GET ISSUE ORDERS (FILTERS + PAGINATION)
---------------------------------- */
export const getIssueOrders = (filters: {
  issueId?: string
  fromDate?: number
  toDate?: number
  page?: number
  limit?: number
}) => {
  let query = `SELECT * FROM issue_orders WHERE 1=1`
  const params: any[] = []

  if (filters.issueId) {
    query += ` AND id LIKE ?`
    params.push(`%${filters.issueId}%`)
  }

  if (filters.fromDate) {
    query += ` AND issueDate >= ?`
    params.push(filters.fromDate)
  }

  if (filters.toDate) {
    query += ` AND issueDate <= ?`
    params.push(filters.toDate)
  }

  query += ` ORDER BY createdAt DESC`

  const page = filters.page || 1
  const limit = filters.limit || 14
  const offset = (page - 1) * limit

  query += ` LIMIT ? OFFSET ?`
  params.push(limit, offset)

  const rows = db.prepare(query).all(...params)

  const countRow = db
    .prepare(`SELECT COUNT(*) as total FROM issue_orders`)
    .get()

  return {
    data: rows.map((row: any) => ({
      id: row.id,
      employee_type: row.employeeType,
      employee_name: row.employeeName,
      issue_date: row.issueDate,
      remark: row.remark,
      createdAt: row.createdAt
    })),
    total: countRow.total
  }
}

/* ----------------------------------
   GET ISSUE ORDER ITEMS
---------------------------------- */
export const getIssueOrderItems = (issueOrderId: string) => {
  const rows = db.prepare(`
    SELECT * FROM issue_order_items
    WHERE issueOrderId = ?
  `).all(issueOrderId)

  return rows.map((row: any) => ({
    id: row.id,
    item_id: row.itemId,
    item_name: row.itemName,
    quantity: row.quantity,
    remark: row.remark
  }))
}

/* ----------------------------------
   DELETE ISSUE ORDER (OPTIONAL)
---------------------------------- */
export const deleteIssueOrder = (id: string) => {
  db.prepare(`DELETE FROM issue_order_items WHERE issueOrderId = ?`).run(id)
  db.prepare(`DELETE FROM issue_orders WHERE id = ?`).run(id)
}

export const getUnsyncedIssueOrders = () => {
  const query = `SELECT * FROM issue_orders WHERE isSynced = ?`
  const rows = db.prepare(query).all(0)

  return rows.map((row: any) => {
    const items = db
      .prepare(`SELECT * FROM issue_order_items WHERE issueOrderId = ?`)
      .all(row.id)

    return {
      id: row.id,
      employee_type: row.employeeType,
      employee_name: row.employeeName,
      issue_date: row.issueDate,
      remark: row.remark,
      createdAt: row.createdAt,
      data: row.data,
      items: items.map((i: any) => ({
        id: i.id,
        item_id: i.itemId,
        item_name: i.itemName,
        quantity: i.quantity,
        remark: i.remark
      }))
    }
  })
}

export const updateIssueOrdersSyncStatus = (ids: string[]) => {
  if (!ids || ids.length === 0) {
    return
  }
  const placeholders = ids.map(() => "?").join(",")
  const query = `UPDATE issue_orders SET isSynced = TRUE WHERE id IN (${placeholders})`
  db.prepare(query).run(...ids);
  console.log(`Updated sync status for issue orders: ${ids.join(", ")}`)
}

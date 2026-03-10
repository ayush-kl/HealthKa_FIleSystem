// bills.ts
import Database from "better-sqlite3"

/* ----------------------------------
   DB INIT
---------------------------------- */
export const db = new Database("app.db")

/* ----------------------------------
   TABLE INIT
---------------------------------- */
db.prepare(`
  CREATE TABLE IF NOT EXISTS bills (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    isSynced BOOLEAN DEFAULT FALSE,
    billNumber TEXT NOT NULL,
    patientName TEXT NOT NULL,
    patientPhone TEXT,

    billDate TEXT NOT NULL,
    totalAmount REAL NOT NULL,
    paymentStatus TEXT NOT NULL,

    items TEXT NOT NULL,
    templateSnapshot TEXT NOT NULL,

    createdAt INTEGER NOT NULL
  )
`).run()
export interface Bill {
  id: string
  userId: string

  billNumber: string
  patientName: string
  patientPhone: string | null

  billDate: string
  totalAmount: number
  paymentStatus: string

  items: any[]
  templateSnapshot: any

  createdAt: number
}
export const createBill = (data: {
  billNumber: string
  patientName: string
  patientPhone?: string
  billDate?: string
  totalAmount?: number
  paymentStatus?: string
  items: any[]
  templateSnapshot: any
}): string => {
  const userId = "LOCAL_USER"
  const now = Date.now()
  const id = `BILL-${now}`

  const billDate = data.billDate ?? new Date().toISOString()
  const totalAmount = data.totalAmount ?? 0
  const paymentStatus = data.paymentStatus ?? "pending"

  db.prepare(`
    INSERT INTO bills (
      id, userId,
      billNumber, patientName, patientPhone,
      billDate, totalAmount, paymentStatus,
      items, templateSnapshot,
      createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    userId,
    data.billNumber,
    data.patientName,
    data.patientPhone ?? null,
    billDate,
    totalAmount,
    paymentStatus,
    JSON.stringify(data.items),
    JSON.stringify(data.templateSnapshot),
    now
  )

  return id
}

export const getAllBills = (): Bill[] => {
  const rows = db.prepare(`
    SELECT * FROM bills
    ORDER BY createdAt DESC
  `).all() as any[]

  return rows.map(row => ({
    ...row,
    items: JSON.parse(row.items),
    templateSnapshot: JSON.parse(row.templateSnapshot),
  }))
}
export const getBillById = (id: string): Bill | null => {
  const row = db.prepare(`
    SELECT * FROM bills
    WHERE id = ?
  `).get(id) as any

  if (!row) return null

  return {
    ...row,
    items: JSON.parse(row.items),
    templateSnapshot: JSON.parse(row.templateSnapshot),
  }
}
export const searchBills = (filters: {
  billNumber?: string
  patientName?: string
  patientPhone?: string
  billDate?: string
}): Bill[] => {
  let query = `SELECT * FROM bills WHERE userId = ?`
  const params: any[] = ["LOCAL_USER"]

  if (filters.billNumber) {
    query += ` AND billNumber LIKE ?`
    params.push(`%${filters.billNumber}%`)
  }

  if (filters.patientName) {
    query += ` AND patientName LIKE ?`
    params.push(`%${filters.patientName}%`)
  }

  if (filters.patientPhone) {
    query += ` AND patientPhone LIKE ?`
    params.push(`%${filters.patientPhone}%`)
  }

  if (filters.billDate) {
    query += ` AND billDate = ?`
    params.push(filters.billDate)
  }

  query += ` ORDER BY createdAt DESC`

  const rows = db.prepare(query).all(...params) as any[]

  return rows.map(row => ({
    ...row,
    items: JSON.parse(row.items),
    templateSnapshot: JSON.parse(row.templateSnapshot),
  }))
}
export const getBillByNumber = (billNumber: string): Bill | null => {
  const row = db.prepare(`
    SELECT * FROM bills
    WHERE billNumber = ?
    LIMIT 1
  `).get(billNumber) as any

  if (!row) return null

  return {
    ...row,
    items: JSON.parse(row.items),
    templateSnapshot: JSON.parse(row.templateSnapshot),
  }
}
export const deleteBillsOlderThanThreeMonths = (): number => {
  const threeMonthsAgo = new Date()
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

  const cutoffTimestamp = threeMonthsAgo.getTime()

  const result = db.prepare(`
    DELETE FROM bills
    WHERE createdAt < ?
  `).run(cutoffTimestamp)

  console.log(`Deleted ${result.changes} old bills`)

  return result.changes
}

  // const fiveMinutesAgo = Date.now() - (5 * 60 * 1000)

  // const result = db.prepare(`
  //   DELETE FROM bills
  //   WHERE createdAt < ?
  // `).run(fiveMinutesAgo)

  // if (result.changes > 0) {
  //   db.prepare("VACUUM").run() // shrink database file
  // }

  // console.log(`Deleted ${result.changes} bills older than 5 minutes`)
  // return result.changes
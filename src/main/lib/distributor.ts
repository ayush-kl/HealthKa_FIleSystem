import { db } from './index'

/* ----------------------------------
   TABLE INIT
---------------------------------- */
db.prepare(`
  CREATE TABLE IF NOT EXISTS distributors (
    id TEXT PRIMARY KEY,

    -- Distributor Details
    supplierName TEXT NOT NULL,
    phoneNumber TEXT NOT NULL,
    email TEXT,
    address TEXT NOT NULL,
    isSynced BOOLEAN DEFAULT FALSE,
    remark TEXT,

    -- Metadata
    createdAt INTEGER,
    updatedAt INTEGER,

    -- Full payload (future-proofing)
    data TEXT
  )
`).run()

/* ----------------------------------
   CREATE DISTRIBUTOR
---------------------------------- */
export const createDistributor = (data: any) => {
  const id = `DIST-${Date.now()}`
  const now = Date.now()

  db.prepare(`
    INSERT INTO distributors (
      id,
      supplierName,
      phoneNumber,
      email,
      address,
      remark,
      createdAt,
      updatedAt,
      data
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.supplier_name || '',
    data.phone_number || '',
    data.email || '',
    data.address || '',
    data.remark || '',
    now,
    now,
    JSON.stringify(data)
  )

  return id
}
export const writeDistributor = (id: string, content: string) => {
  const parsed = JSON.parse(content)

  db.prepare(`
    UPDATE distributors SET
      supplierName = ?,
      phoneNumber = ?,
      email = ?,
      address = ?,
      remark = ?,
      updatedAt = ?,
      data = ?
    WHERE id = ?
  `).run(
    parsed.supplier_name || '',
    parsed.phone_number || '',
    parsed.email || '',
    parsed.address || '',
    parsed.remark || '',
    Date.now(),
    JSON.stringify(parsed),
    id
  )
}

/* ----------------------------------
   GET DISTRIBUTORS (FILTERS)
---------------------------------- */
export const getDistributors = (filters?: {
  distributorId?: string
  supplier_name?: string
  phone_number?: string
}) => {
  let query = `SELECT * FROM distributors WHERE 1=1`
  const params: any[] = []

  if (filters?.distributorId) {
    query += ` AND id LIKE ?`
    params.push(`%${filters.distributorId}%`)
  }

  if (filters?.supplier_name) {
    query += ` AND supplierName LIKE ?`
    params.push(`%${filters.supplier_name}%`)
  }

  if (filters?.phone_number) {
    query += ` AND phoneNumber LIKE ?`
    params.push(`%${filters.phone_number}%`)
  }

  query += ` ORDER BY createdAt DESC`

  const rows = db.prepare(query).all(...params)

  // ⬇️ map DB → UI
  return rows.map((row: any) => ({
    id: row.id,
    supplier_name: row.supplierName,
    phone_number: row.phoneNumber,
    email: row.email,
    address: row.address,
    remark: row.remark,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  }))
}

/* ----------------------------------
   GET SINGLE DISTRIBUTOR BY ID
---------------------------------- */

/* ----------------------------------
   DELETE DISTRIBUTOR (OPTIONAL)
---------------------------------- */
export const deleteDistributor = (id: string) => {
  db.prepare(`DELETE FROM distributors WHERE id = ?`).run(id)
}

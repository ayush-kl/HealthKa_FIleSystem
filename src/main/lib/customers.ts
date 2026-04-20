import { db } from "./index"

/* ----------------------------------
   TABLE INIT
---------------------------------- */

// ⚠️ IMPORTANT:
// If you already ran the app before,
// DELETE the old database file ONCE
// so this schema is applied cleanly.

db.prepare(`
  CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,

    -- Core fields
    firstName TEXT NOT NULL,
    lastName TEXT DEFAULT '',
    phone TEXT NOT NULL,
    age INTEGER DEFAULT 0,
    gender TEXT DEFAULT '',
    address TEXT DEFAULT '',
    isSynced BOOLEAN DEFAULT FALSE,

    -- Metadata
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL,

    -- Full payload
    data TEXT
  )
`).run()

// Create indexes for faster searches
db.prepare(`
  CREATE INDEX IF NOT EXISTS idx_customers_phone 
  ON customers(phone)
`).run()

db.prepare(`
  CREATE INDEX IF NOT EXISTS idx_customers_name 
  ON customers(firstName, lastName)
`).run()

/* ----------------------------------
   HELPERS
---------------------------------- */

const normalizePhone = (phone: string) => {
  // Remove all non-numeric characters for consistent storage
  return phone.replace(/\D/g, '')
}

/* ----------------------------------
   CREATE CUSTOMER
---------------------------------- */

export const createCustomer = (payload: {
  name: string
  gender: string
  age?: string | number
  contactNumber: string
  address?: string
}) => {
  const id = `CUST-${Date.now()}`
  const now = Date.now()

  // Split name into first and last
  const nameParts = payload.name.trim().split(/\s+/)
  const firstName = nameParts[0] || ''
  const lastName = nameParts.slice(1).join(' ') || ''

  db.prepare(`
    INSERT INTO customers (
      id,
      firstName,
      lastName,
      phone,
      age,
      gender,
      address,
      createdAt,
      updatedAt,
      data
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    firstName,
    lastName,
    normalizePhone(payload.contactNumber),
    payload.age ? Number(payload.age) : 0,
    payload.gender,
    payload.address || '',
    now,
    now,
    JSON.stringify(payload)
  )

  return id
}

/* ----------------------------------
   CREATE MULTIPLE CUSTOMERS (BATCH)
---------------------------------- */

export const createCustomers = (customers: Array<{
  name: string
  gender: string
  age?: string | number
  contactNumber: string
  address?: string
}>) => {
  const now = Date.now()
  const ids: string[] = []

  const stmt = db.prepare(`
    INSERT INTO customers (
      id,
      firstName,
      lastName,
      phone,
      age,
      gender,
      address,
      createdAt,
      updatedAt,
      data
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  for (let i = 0; i < customers.length; i++) {
    const customer = customers[i]
    const id = `CUST-${now + i}`
    
    // Split name into first and last
    const nameParts = customer.name.trim().split(/\s+/)
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    stmt.run(
      id,
      firstName,
      lastName,
      normalizePhone(customer.contactNumber),
      customer.age ? Number(customer.age) : 0,
      customer.gender,
      customer.address || '',
      now,
      now,
      JSON.stringify(customer)
    )

    ids.push(id)
  }

  return ids
}

/* ----------------------------------
   GET CUSTOMERS
---------------------------------- */

export const getCustomers = (filters?: {
  name?: string
  phone?: string
  gender?: string
  from_date?: number
  to_date?: number
}) => {
  let query = `SELECT * FROM customers WHERE 1=1`
  const params: any[] = []

  if (filters?.name) {
    query += ` AND (firstName LIKE ? OR lastName LIKE ?)`
    params.push(`%${filters.name}%`, `%${filters.name}%`)
  }

  if (filters?.phone) {
    const normalized = normalizePhone(filters.phone)
    query += ` AND phone LIKE ?`
    params.push(`%${normalized}%`)
  }

  if (filters?.gender) {
    query += ` AND gender = ?`
    params.push(filters.gender)
  }

  if (filters?.from_date) {
    query += ` AND createdAt >= ?`
    params.push(filters.from_date)
  }

  if (filters?.to_date) {
    query += ` AND createdAt <= ?`
    params.push(filters.to_date)
  }

  query += ` ORDER BY createdAt DESC`

  const rows = db.prepare(query).all(...params)

  return rows.map((row: any) => ({
    id: row.id,
    first_name: row.firstName,
    last_name: row.lastName,
    phone: row.phone,
    age: row.age,
    gender: row.gender,
    address: row.address,
    created_at: new Date(row.createdAt).toISOString(),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  }))
}

/* ----------------------------------
   GET CUSTOMER BY ID
---------------------------------- */

export const getCustomerById = (id: string) => {
  const row = db
    .prepare(`SELECT * FROM customers WHERE id = ?`)
    .get(id) as any

  if (!row) return null

  return {
    id: row.id,
    first_name: row.firstName,
    last_name: row.lastName,
    phone: row.phone,
    age: row.age,
    gender: row.gender,
    address: row.address,
    created_at: new Date(row.createdAt).toISOString(),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  }
}

/* ----------------------------------
   UPDATE CUSTOMER
---------------------------------- */

export const updateCustomer = (
  id: string,
  payload: {
    name?: string
    gender?: string
    age?: string | number
    contactNumber?: string
    address?: string
  }
) => {
  const existing = getCustomerById(id)
  if (!existing) {
    throw new Error(`Customer with id ${id} not found`)
  }

  let firstName = existing.first_name
  let lastName = existing.last_name

  if (payload.name) {
    const nameParts = payload.name.trim().split(/\s+/)
    firstName = nameParts[0] || ''
    lastName = nameParts.slice(1).join(' ') || ''
  }

  const updated = {
    firstName,
    lastName,
    phone: payload.contactNumber ? normalizePhone(payload.contactNumber) : existing.phone,
    age: payload.age ? Number(payload.age) : existing.age,
    gender: payload.gender || existing.gender,
    address: payload.address !== undefined ? payload.address : existing.address
  }

  db.prepare(`
    UPDATE customers SET
      firstName = ?,
      lastName = ?,
      phone = ?,
      age = ?,
      gender = ?,
      address = ?,
      updatedAt = ?,
      data = ?
    WHERE id = ?
  `).run(
    updated.firstName,
    updated.lastName,
    updated.phone,
    updated.age,
    updated.gender,
    updated.address,
    Date.now(),
    JSON.stringify(updated),
    id
  )

  return id
}
// db/customers.ts
export const searchCustomerByPhone = (phone: string) => {
  return db
    .prepare(`
      SELECT 
        id,
        firstName || ' ' || lastName AS name,
        phone,
        age,
        gender,
        address
      FROM customers
      WHERE phone LIKE ?
      LIMIT 5
    `)
    .all(`${phone}%`);
};



/* ----------------------------------
   DELETE CUSTOMER
---------------------------------- */

export const deleteCustomer = (id: string) => {
  const result = db.prepare(`DELETE FROM customers WHERE id = ?`).run(id)
  return result.changes > 0
}

export const getUnsyncedCustomers = () => {
  const query = `SELECT * FROM customers WHERE isSynced = ?`;
  const rows = db.prepare(query).all(0);

  return rows.map((row: any) => ({
    id: row.id,
    first_name: row.firstName,
    last_name: row.lastName,
    phone: row.phone,
    age: row.age,
    gender: row.gender,
    address: row.address,
    created_at: new Date(row.createdAt).toISOString(),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    data: row.data
  }));
};

export const updateCustomersSyncStatus = (ids: string[]) => {
  if (!ids || ids.length === 0) {
    return;
  }
  const placeholders = ids.map(() => '?').join(',');
  const query = `UPDATE customers SET isSynced = TRUE WHERE id IN (${placeholders})`;
  db.prepare(query).run(...ids);
  console.log(`Updated sync status for customers: ${ids.join(', ')}`);
};
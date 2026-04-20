import { db } from './index'

/* -------------------------------------------------
   TABLE CREATION
-------------------------------------------------- */
db.prepare(`
  CREATE TABLE IF NOT EXISTS purchase_orders (
    id TEXT PRIMARY KEY,

    supplier_name TEXT NOT NULL,
    supplier_id TEXT,

    requisition_date TEXT,
    expected_date TEXT,

    payment_status TEXT,
    status TEXT,

    data TEXT,                -- full payload (items, remarks, etc.)

    created_at INTEGER,
    updated_at INTEGER,

    isSynced BOOLEAN DEFAULT FALSE
  )
`).run()

/* -------------------------------------------------
   TYPES
-------------------------------------------------- */
export interface PurchaseOrderItem {
  item_id: string
  item_name: string
  quantity: number
  category: string
  unit: string
  remark?: string
}

export interface CreatePurchaseOrderInput {
  supplier_name: string
  supplier_id?: string

  requisition_date: string
  expected_date: string

  payment_status: "Pending" | "Paid" | "Partial"

  items: PurchaseOrderItem[]
}


export interface PurchaseOrderFilter {
  purchase_order_no?: string
  supplier_name?: string
  fromDate?: string
  toDate?: string
}

/* -------------------------------------------------
   CREATE PURCHASE ORDER
-------------------------------------------------- */
export const createPurchaseOrder = (data: CreatePurchaseOrderInput) => {
  const id = `PO-${Date.now()}`
  const now = Date.now()

  db.prepare(`
    INSERT INTO purchase_orders (
      id,
      supplier_name,
      supplier_id,
      requisition_date,
      expected_date,
      payment_status,
      status,
      data,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.supplier_name,
    data.supplier_id ?? null,
    data.requisition_date,
    data.expected_date,
    data.payment_status,
    "ACTIVE",
    JSON.stringify({
      items: data.items,
    }),
    now,
    now
  )

  return { id }
}

/* -------------------------------------------------
   GET PURCHASE ORDERS (SEARCH / LIST)
-------------------------------------------------- */
export const getPurchaseOrders = ({
  fromDate,
  toDate,
}: {
  fromDate?: string;
  toDate?: string;
}) => {
  let query = `
    SELECT * FROM purchase_orders
    WHERE 1 = 1
  `;

  const params: any[] = [];

  if (fromDate) {
    query += ` AND expected_date >= ?`;
    params.push(fromDate);
  }

  if (toDate) {
    query += ` AND expected_date <= ?`;
    params.push(toDate);
  }

  query += ` ORDER BY created_at DESC`;

  const rows = db.prepare(query).all(...params);

  return rows.map((row) => ({
    ...row,
    data: row.data ? JSON.parse(row.data) : {},
  }));
};

/* -------------------------------------------------
   GET SINGLE PURCHASE ORDER (VIEW DETAILS)
-------------------------------------------------- */
export const getPurchaseOrderById = (id: string) => {
  const row: any = db
    .prepare(`SELECT * FROM purchase_orders WHERE id = ?`)
    .get(id)

  if (!row) return null

  return {
    ...row,
    data: row.data ? JSON.parse(row.data) : null,
  }
}

export const getUnsyncedPurchaseOrders = () => {
  const query = `SELECT * FROM purchase_orders WHERE isSynced = ?`;
  const rows = db.prepare(query).all(0);

  return rows.map((row: any) => ({
    ...row,
    data: row.data ? JSON.parse(row.data) : {},
  }));
};

export const updatePurchaseOrdersSyncStatus = (ids: string[]) => {
  if (!ids || ids.length === 0) {
    return;
  }
  const placeholders = ids.map(() => '?').join(',');
  const query = `UPDATE purchase_orders SET isSynced = TRUE WHERE id IN (${placeholders})`;
  db.prepare(query).run(...ids);
  console.log(`Updated sync status for purchase orders: ${ids.join(', ')}`);
};

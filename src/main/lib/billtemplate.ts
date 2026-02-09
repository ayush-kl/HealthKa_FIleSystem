// billTemplates.ts
import Database from "better-sqlite3"

/* ----------------------------------
   DB INIT
---------------------------------- */
export const db = new Database("app.db")

/* ----------------------------------
   TABLE INIT
---------------------------------- */
db.prepare(`
  CREATE TABLE IF NOT EXISTS bill_templates (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    isSynced BOOLEAN DEFAULT FALSE,
    templateName TEXT NOT NULL,
    config TEXT NOT NULL,

    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL
  )
`).run()

/* ----------------------------------
   TYPES
---------------------------------- */
export interface BillTemplate {
  id: string
  userId: string
  templateName: string
  config: any
  createdAt: number
  updatedAt: number
}

/* ----------------------------------
   SAVE (CREATE / UPDATE)
---------------------------------- */
export const saveBillTemplate = (
  templateName: string,
  config: any
): string => {
  const userId = "LOCAL_USER"
  const now = Date.now()

  const existing = db.prepare(`
    SELECT id FROM bill_templates
    WHERE userId = ?
  `).get(userId) as { id: string } | undefined

  if (existing) {
    db.prepare(`
      UPDATE bill_templates
      SET templateName = ?, config = ?, updatedAt = ?
      WHERE userId = ?
    `).run(
      templateName,
      JSON.stringify(config),
      now,
      userId
    )

    return existing.id
  }

  const id = `BT-${now}`

  db.prepare(`
    INSERT INTO bill_templates (
      id, userId, templateName, config, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    id,
    userId,
    templateName,
    JSON.stringify(config),
    now,
    now
  )

  return id
}

/* ----------------------------------
   GET TEMPLATE BY USER
---------------------------------- */
export const getBillTemplateByUser = (
  userId: string
): BillTemplate | null => {
  const row = db.prepare(`
    SELECT * FROM bill_templates
    WHERE userId = ?
    ORDER BY updatedAt DESC
    LIMIT 1
  `).get(userId) as any

  if (!row) return null

  return {
    ...row,
    config: JSON.parse(row.config),
  }
}

/* ----------------------------------
   GET TEMPLATE BY ID
---------------------------------- */
export const getBillTemplateById = (
  id: string
): BillTemplate | null => {
  const row = db.prepare(`
    SELECT * FROM bill_templates
    WHERE id = ?
  `).get(id) as any

  if (!row) return null

  return {
    ...row,
    config: JSON.parse(row.config),
  }
}

/* ----------------------------------
   GET ALL TEMPLATES
---------------------------------- */
export const getAllBillTemplates = (): BillTemplate[] => {
  const rows = db.prepare(`
    SELECT * FROM bill_templates
    ORDER BY updatedAt DESC
  `).all() as any[]

  return rows.map(row => ({
    ...row,
    config: JSON.parse(row.config),
  }))
}

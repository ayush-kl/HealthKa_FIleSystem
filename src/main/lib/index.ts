import { ensureDirSync } from 'fs-extra'
import { dialog } from 'electron'
import { homedir } from 'os'
import path from 'path'
import sqlite3 from 'sqlite3'

/* ----------------------------------
   CONFIG
---------------------------------- */

const appDirectoryName = 'dawaiInvoices'
export const getRootDir = () => path.join(homedir(), appDirectoryName)

ensureDirSync(getRootDir())

const dbPath = path.join(getRootDir(), 'invoices.db')

/* ----------------------------------
   DB INIT
---------------------------------- */

export const db = new sqlite3.Database(dbPath)

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY,
      createdAt INTEGER,
      patientName TEXT,
      mobile TEXT,
      data TEXT
    )
  `)
})

/* ----------------------------------
   CREATE INVOICE
---------------------------------- */

export const createInvoice = (data: any = {}) =>
  new Promise<string>((resolve, reject) => {
    const id = `invoice-${Date.now()}`
    const createdAt = Date.now()

    db.run(
      `
      INSERT INTO invoices (id, createdAt, patientName, mobile, data)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        id,
        createdAt,
        data.patientName || '',
        data.mobile || '',
        JSON.stringify({ id, createdAt, ...data }),
      ],
      (err) => {
        if (err) reject(err)
        else resolve(id)
      }
    )
  })

/* ----------------------------------
   UPDATE / WRITE INVOICE
---------------------------------- */

export const writeInvoice = (id: string, content: string) =>
  new Promise<void>((resolve, reject) => {
    const parsed = JSON.parse(content)

    db.run(
      `
      UPDATE invoices
      SET data = ?, patientName = ?, mobile = ?, createdAt = ?
      WHERE id = ?
      `,
      [
        JSON.stringify(parsed),
        parsed.patientName || '',
        parsed.mobile || '',
        Date.now(),
        id,
      ],
      (err) => {
        if (err) reject(err)
        else resolve()
      }
    )
  })

/* ----------------------------------
   READ SINGLE INVOICE
---------------------------------- */

export const readInvoice = (id: string) =>
  new Promise<any | null>((resolve, reject) => {
    db.get(
      `SELECT data FROM invoices WHERE id = ?`,
      [id],
      (err, row: any) => {
        if (err) reject(err)
        else resolve(row ? JSON.parse(row.data) : null)
      }
    )
  })

/* ----------------------------------
   GET INVOICES (FILTERS)
---------------------------------- */

export const getInvoices = (
  filters?: { patientName?: string; mobile?: string }
) =>
  new Promise<{ title: string; lastEditTime: number; data: any }[]>(
    (resolve, reject) => {
      let query = `SELECT * FROM invoices WHERE 1=1`
      const params: any[] = []

      if (filters?.patientName) {
        query += ` AND patientName LIKE ?`
        params.push(`%${filters.patientName}%`)
      }

      if (filters?.mobile) {
        query += ` AND mobile LIKE ?`
        params.push(`%${filters.mobile}%`)
      }

      query += ` ORDER BY createdAt DESC`

      db.all(query, params, (err, rows: any[]) => {
        if (err) reject(err)
        else
          resolve(
            rows.map((row) => ({
              title: row.id,
              lastEditTime: row.createdAt,
              data: JSON.parse(row.data),
            }))
          )
      })
    }
  )

/* ----------------------------------
   DELETE INVOICE
---------------------------------- */

export const deleteInvoice = async (id: string) => {
  const { response } = await dialog.showMessageBox({
    type: 'warning',
    title: 'Delete Invoice',
    message: `Are you sure you want to delete invoice "${id}"?`,
    buttons: ['Delete', 'Cancel'],
    defaultId: 1,
    cancelId: 1,
  })

  if (response !== 0) return false

  return new Promise<boolean>((resolve, reject) => {
    db.run(`DELETE FROM invoices WHERE id = ?`, [id], (err) => {
      if (err) reject(err)
      else resolve(true)
    })
  })
}

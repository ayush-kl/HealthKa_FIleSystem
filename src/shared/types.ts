import { NoteContent, NoteInfo } from './models'

export type GetInvoices = () => Promise<NoteInfo[]>
export type GetInvoiceById = (
  title: NoteInfo['title']
) => Promise<NoteContent | null>
export type ReadInvoice = (title: NoteInfo['title']) => Promise<NoteContent>
export type WriteInvoice = (title: NoteInfo['title'], content: NoteContent) => Promise<void>
export type CreateInvoice = () => Promise<NoteInfo['title'] | false>
export type CreateInventory = (payload: any) => Promise<void>
export type DeleteInvoice = (title: NoteInfo['title']) => Promise<boolean>
export type GetInventory = (filters?: {
  name?: string
  category?: string
}) => Promise<any[]>

export type GetInventoryById = (
  id: string
) => Promise<any | null>

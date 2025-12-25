import { CreateNote, DeleteNote, GetNotes, ReadNote, WriteNote,GetInvoiceById } from '@shared/types'

declare global {
  interface Window {
    // electron: ElectronAPI
    context: {
      locale: string
      getInvoices: GetNotes
      readInvoice: ReadNote
      writeInvoice: WriteNote
      createInvoice: CreateNote
      deleteInvoice: DeleteNote
      getInvoiceById : GetInvoiceById
    }
  }
}

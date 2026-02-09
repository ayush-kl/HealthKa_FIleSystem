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
export type CreateCreditDebitNote = (payload: any) => Promise<void>
export type GetInventory = (filters?: {
  name?: string
  category?: string
}) => Promise<any[]>

export type GetInventoryById = (
  id: string
) => Promise<any | null>
export type WriteCreditDebitNote = (id: string, payload: any) => Promise<void>
export type GetCreditDebitNotes = (filters?: {
  to_date: any
  from_date: any
  noteId?: string
  fromDate?: string
  toDate?: string
}) => Promise<any[]>
export type GetReceiveMaterialById = (
  id: string
) => Promise<any | null>  
export type CreateReceiveMaterial = (payload: any) => Promise<string>
export type WriteReceiveMaterial = (id: string, payload: any) => Promise<void>
export type GetReceiveMaterials = (filters?: {
  materialId?: string
  fromDate?: string
  toDate?: string
}) => Promise<any[]>
/* ----------------------------------
   Distrutor
---------------------------------- */   
export type CreateDistributor = (payload: any) => Promise<void>
export type GetDistributors = (filters?: {
  supplierName: any
  distributorId?: string
  name?: string
}) => Promise<any[]>
export type WriteDistributor = (id: string, payload: any) => Promise<void>
export type DeleteDistributor = (id: string) => Promise<void>
export type CreatePurchaseOrder = (payload: any) => Promise<void>
export type GetPurchaseOrders = (filters?: {
  purchase_order_no?: string
  supplier_name?: string
  fromDate?: string
  toDate?: string
}) => Promise<any[]>
export type GetPurchaseOrderById = (
  id: string
) => Promise<any | null>
export type CreateIssueOrder = (payload: any) => Promise<string>
export type GetIssueOrders = (filters?: {
  issueId?: string
  fromDate?: number
  toDate?: number
}) => Promise<any[]>
export type GetIssueOrderItems = (issueOrderId: string) => Promise<any[]>
export type SaveBillTemplate = (payload: any) => Promise<void>
export type GetAllBillTemplates = () => Promise<any[]>     
export type DeleteBillTemplate = (id: string) => Promise<void>    
export type GetBillTemplateById = (id: string) => Promise<any | null>
export type CreateBill = (data: {
  billNumber: string
  patientName: string
  patientPhone?: string
  billDate: string
  totalAmount: number 
  paymentStatus: string
  items: any[]
  templateSnapshot: any
}) => Promise<string>
export type GetAllBills = (filters?: {
  billNumber?: string
  patientName?: string
  fromDate?: number
  toDate?: number
}) => Promise<any[]>
export type GetBillById = (id: string) => Promise<any | null>
export type SearchBills = (query: string) => Promise<any[]>
export type CreateCustomer = (payload: any) => Promise<void>
export type CreateCustomers = (payload: any[]) => Promise<void>
export type GetCustomers = (filters?: {
  name?: string
  phone?: string
}) => Promise<any[]>  
export type GetCustomerById = (
  id: string
) => Promise<any | null>
export type SearchCustomerByPhone = (
  phone: string
) => Promise<any[]>
export type GetBillByNumber = (
  billNumber: string
) => Promise<any | null>
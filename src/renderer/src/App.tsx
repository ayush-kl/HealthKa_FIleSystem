import InvoiceManager from './components/bills/billPharmacy'
import { HashRouter, Routes, Route } from 'react-router-dom'
import InvoiceSearchPage from './components/searchpage'
import InvoiceListPage from './components/InoviceListpage'
import InvoiceViewPage from './components/InvoiceViewPage'
import Inventory from './components/Inventory/CreateInventory'
import InventoryHome from './components/Inventory/InventoryHome'
import InventorySearch from './components/Inventory/GetInventory'
import InventoryLists from './components/Inventory/InventoryLists'
import InventoryDetail from './components/Inventory/InventoryDetail'
import CreateCreditDebitNote from './components/DebitCreditNote/CreateBooking'
import CreditDebitNoteSearch from './components/DebitCreditNote/GetDebitCredit'
import CreditDebitNoteList from './components/DebitCreditNote/DebitCreditNoteList'
import CreditDebitNoteView from './components/DebitCreditNote/CreditDebitDetail'
import CreateReceiveMaterial from './components/ReceiveMaterial/CreateReceiveMaterial'
import ReceiveMaterialSearch from './components/ReceiveMaterial/GetReceiveMaterial'
import ReceiveMaterialView from './components/ReceiveMaterial/ReceiveMaterialDetail'
import ReceiveMaterialList from './components/ReceiveMaterial/ReceiveMaterialList'
const App = () => {
  return (
  
        <HashRouter>
      <Routes>
        <Route path="/" element={<InvoiceManager />} />
        <Route path="/invoice-search" element={<InvoiceSearchPage />} />
        <Route path="/invoice-list" element={<InvoiceListPage />} />
              <Route path="/invoice/:id" element={<InvoiceViewPage />} />
             <Route path="/inventory" element={<InventoryHome />} />
        <Route path="/inventory/list" element={<InventorySearch />} />
        <Route path="/inventory/lists" element={<InventoryLists />} />
<Route path="/inventory/create" element={<Inventory />} />
 <Route path="/inventory/:id" element={<InventoryDetail />} />
 <Route
  path="/inventory/credit-debit/create"
  element={<CreateCreditDebitNote />}
  
/>
<Route path="/inventory/credit-debit/search" element={<CreditDebitNoteSearch />} />
<Route path="/credit-debit-notes/list" element={<CreditDebitNoteList />} />
<Route path="/credit-debit-notes/view" element={<CreditDebitNoteView />} />
 <Route
        path="/inventory/receive-material/create"
        element={<CreateReceiveMaterial />}
      />
      <Route
  path="/inventory/receive-material/search"
  element={<ReceiveMaterialSearch />}
/>
<Route
  path="/inventory/receive-material/view"
  element={<ReceiveMaterialView />}
/>
<Route
  path="/inventory/receive-material/list"
  element={<ReceiveMaterialList />}
/>


      </Routes>


    </HashRouter>
    
  )
}

export default App

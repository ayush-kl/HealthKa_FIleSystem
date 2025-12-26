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
      </Routes>

    </HashRouter>
    
  )
}

export default App

import InvoiceManager from './components/bills/billPharmacy'
import { HashRouter, Routes, Route } from 'react-router-dom'
import InvoiceSearchPage from './components/searchpage'
import InvoiceListPage from './components/InoviceListpage'
import InvoiceViewPage from './components/InvoiceViewPage'
import Inventory from './components/CreateInventory'

const App = () => {
  return (
  
        <HashRouter>
      <Routes>
        <Route path="/" element={<InvoiceManager />} />
        <Route path="/invoice-search" element={<InvoiceSearchPage />} />
        <Route path="/invoice-list" element={<InvoiceListPage />} />
              <Route path="/invoice/:id" element={<InvoiceViewPage />} />
             <Route path="/inventory" element={<Inventory />} />

      </Routes>

    </HashRouter>
    
  )
}

export default App

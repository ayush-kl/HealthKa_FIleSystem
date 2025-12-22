import InvoiceManager from './components/bills/billPharmacy'
import { HashRouter, Routes, Route } from 'react-router-dom'
import InvoiceSearchPage from './components/searchpage'
import InvoiceListPage from './components/InoviceListpage'

const App = () => {
  return (
  
        <HashRouter>
      <Routes>
        <Route path="/" element={<InvoiceManager />} />
        <Route path="/invoice-search" element={<InvoiceSearchPage />} />
        <Route path="/invoice-list" element={<InvoiceListPage />} />
      </Routes>
    </HashRouter>
    
  )
}

export default App

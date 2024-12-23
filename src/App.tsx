import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { AuthProvider } from './providers/AuthProvider'
import { MessageProvider } from './providers/MessageProvider'
import { LoginPage } from './pages/LoginPage'
import { Products } from './pages/Products'
import { Clients } from './pages/Clients'
import { Sales } from './pages/Sales'
import { Purchases } from './pages/Purchases'
import { Categories } from './pages/Categories'
import { Suppliers } from './pages/Suppliers'
import { Stores } from './pages/Stores'
import { Users } from './pages/Users'

function App() {
  return (
    <AuthProvider>
      <MessageProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<LoginPage />} />
            <Route path='/productos' element={<Products />} />
            <Route path='/clientos' element={<Clients />} />
            <Route path='/ventas' element={<Sales />} />
            <Route path='/compreas' element={<Purchases />} />
            <Route path='/categorias' element={<Categories />} />
            <Route path='/proveedores' element={<Suppliers />} />
            <Route path='/depositos' element={<Stores />} />
            <Route path='/usuarios' element={<Users />} />
          </Routes>
        </BrowserRouter>
      </MessageProvider>
    </AuthProvider>
  )
}

export default App
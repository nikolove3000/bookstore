import { BrowserRouter, Router, Route, Routes } from 'react-router-dom' 
import { AuthProvider } from './context/AuthContext'
import LoginPage from './page/LoginPage'
import HomePage from './page/HomePage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
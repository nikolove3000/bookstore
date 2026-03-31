import { BrowserRouter, Router, Route, Routes } from 'react-router-dom' 
import { AuthProvider } from './context/AuthContext'
import LoginPage from './page/LoginPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
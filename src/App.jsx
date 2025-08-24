import React from 'react'
import { MemoryRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'
import { CartProvider } from './contexts/CartContext.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import Header from './components/Header.jsx'
import ThemeDiceButton from './components/ThemeDiceButton.jsx'
import LogoutFab from './components/LogoutFab.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Vault from './pages/Vault.jsx'
import Subscriptions from './pages/Subscriptions.jsx'
import Payment from './pages/Payment.jsx'

const Page = ({children}) => (
  <div className="min-h-dvh page-bg">
    <ThemeDiceButton />
    <LogoutFab />
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10">{children}</div>
  </div>
)

const PrivateRoute = ({children}) => {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

export default function App(){
  return (
    <Router initialEntries={['/login']}> 
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <Page>
              <Header />
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/vault" element={<PrivateRoute><Vault /></PrivateRoute>} />
                <Route path="/subscriptions" element={<PrivateRoute><Subscriptions /></PrivateRoute>} />
                <Route path="/pay" element={<PrivateRoute><Payment /></PrivateRoute>} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </Page>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}

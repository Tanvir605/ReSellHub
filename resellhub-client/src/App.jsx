// frontend/src/App.jsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { Toaster } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

// Layout - ✅ সব ছোট হাতের অক্ষরে (lowercase)
import Navbar from './components/Layout/Navbar.jsx'
import Footer from './components/Layout/Footer.jsx'

// Pages
import Homepage from './components/Homepage/Homepage.jsx'
import ProductList from './components/Products/ProductList.jsx'
import ProductDetails from './components/Products/ProductDetails.jsx'
import AddProduct from './components/Products/AddProduct.jsx'
import EditProduct from './components/Products/EditProduct.jsx'

// Auth
import Login from './components/Auth/Login.jsx'
import Register from './components/Auth/Register.jsx'

// Dashboard
import BuyerDashboard from './components/Dashboard/BuyerDashboard.jsx'
import SellerDashboard from './components/Dashboard/SellerDashboard.jsx'

// Orders
import BuyerOrders from './components/Orders/BuyerOrders.jsx'
import BuyNow from './components/Orders/BuyNow.jsx'

// Chat
import ChatList from './components/Chat/ChatList.jsx'
import ChatWindow from './components/Chat/ChatWindow.jsx'

// Common
import LoadingSpinner from './components/Common/LoadingSpinner.jsx'

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" />
  if (role && user.role !== role) return <Navigate to="/" />
  return children
}

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    {children}
  </motion.div>
)

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}>
          <Navbar />
          <main style={{
            flex: 1,
            padding: '20px',
            maxWidth: '1400px',
            margin: '0 auto',
            width: '100%',
            marginTop: '20px'
          }}>
            <AnimatePresence mode="wait">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<PageTransition><Homepage /></PageTransition>} />
                <Route path="/products" element={<PageTransition><ProductList /></PageTransition>} />
                <Route path="/product/:id" element={<PageTransition><ProductDetails /></PageTransition>} />
                <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
                <Route path="/register" element={<PageTransition><Register /></PageTransition>} />

                {/* Buyer Routes */}
                <Route path="/dashboard/buyer" element={
                  <PrivateRoute role="buyer">
                    <PageTransition><BuyerDashboard /></PageTransition>
                  </PrivateRoute>
                } />
                <Route path="/orders/buyer" element={
                  <PrivateRoute role="buyer">
                    <PageTransition><BuyerOrders /></PageTransition>
                  </PrivateRoute>
                } />
                <Route path="/buy-now/:productId" element={
                  <PrivateRoute role="buyer">
                    <PageTransition><BuyNow /></PageTransition>
                  </PrivateRoute>
                } />

                {/* Seller Routes */}
                <Route path="/dashboard/seller" element={
                  <PrivateRoute role="seller">
                    <PageTransition><SellerDashboard /></PageTransition>
                  </PrivateRoute>
                } />
                <Route path="/add-product" element={
                  <PrivateRoute role="seller">
                    <PageTransition><AddProduct /></PageTransition>
                  </PrivateRoute>
                } />
                <Route path="/edit-product/:id" element={
                  <PrivateRoute role="seller">
                    <PageTransition><EditProduct /></PageTransition>
                  </PrivateRoute>
                } />

                {/* Chat Routes */}
                <Route path="/chats" element={
                  <PrivateRoute>
                    <PageTransition><ChatList /></PageTransition>
                  </PrivateRoute>
                } />
                <Route path="/chat/:chatId" element={
                  <PrivateRoute>
                    <PageTransition><ChatWindow /></PageTransition>
                  </PrivateRoute>
                } />
                <Route path="/chat/new/:productId/:sellerId" element={
                  <PrivateRoute>
                    <PageTransition><ChatWindow /></PageTransition>
                  </PrivateRoute>
                } />
                <Route path="/chat/:productId/:sellerId" element={
                  <PrivateRoute>
                    <PageTransition><ChatWindow /></PageTransition>
                  </PrivateRoute>
                } />
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '16px 20px',
                color: '#333',
                fontWeight: '500',
              },
              success: { style: { borderLeft: '4px solid #4CAF50' } },
              error: { style: { borderLeft: '4px solid #f44336' } },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
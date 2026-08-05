// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const AuthContext = createContext()

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

console.log('API URL:', API_URL) // ডিবাগ করার জন্য

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchProfile()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/profile`)
      setUser(response.data.user)
    } catch (error) {
      console.error('Fetch profile error:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password })
      const { token, user } = response.data
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setToken(token)
      setUser(user)
      toast.success('Welcome back! 🎉')
      return { success: true }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
      return { success: false, error: error.response?.data?.message }
    }
  }

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData)
      const { token, user } = response.data
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setToken(token)
      setUser(user)
      toast.success('Account created successfully! 🎉')
      return { success: true }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
      return { success: false, error: error.response?.data?.message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setToken(null)
    setUser(null)
    toast.success('Logged out successfully')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
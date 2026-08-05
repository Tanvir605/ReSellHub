// frontend/src/components/Auth/Register.jsx
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import {
  Box, Container, Paper, Typography, TextField, Button,
  Divider, Alert, CircularProgress, IconButton, MenuItem
} from '@mui/material'
import { Visibility, VisibilityOff, Storefront } from '@mui/icons-material'
import { motion } from 'framer-motion'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer',
    phone: '',
    location: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    const { confirmPassword, ...registerData } = formData
    const result = await register(registerData)
    setLoading(false)

    if (result.success) {
      navigate('/')
    } else {
      setError(result.error || 'Registration failed. Please try again.')
    }
  }

  return (
    <Container maxWidth="sm">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={0} sx={{
          mt: 4,
          p: 5,
          borderRadius: '24px',
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.08)'
        }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Storefront sx={{ fontSize: 48, color: '#667eea', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#333' }}>
              Create Account 🚀
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Join ReSellHub and start selling today
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
              InputProps={{ sx: { borderRadius: '12px' } }}
            />

            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
              InputProps={{ sx: { borderRadius: '12px' } }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
              InputProps={{
                sx: { borderRadius: '12px' },
                endAdornment: (
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )
              }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
              InputProps={{ sx: { borderRadius: '12px' } }}
            />

            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              sx={{ mb: 2 }}
              InputProps={{ sx: { borderRadius: '12px' } }}
            />

            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              sx={{ mb: 2 }}
              InputProps={{ sx: { borderRadius: '12px' } }}
            />

            <TextField
              fullWidth
              select
              label="I want to"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
              InputProps={{ sx: { borderRadius: '12px' } }}
            >
              <MenuItem value="buyer">Buy Items</MenuItem>
              <MenuItem value="seller">Sell Items</MenuItem>
            </TextField>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: '50px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                boxShadow: '0 4px 15px rgba(102,126,234,0.3)',
                fontSize: '16px',
                fontWeight: 600,
                '&:hover': {
                  boxShadow: '0 8px 25px rgba(102,126,234,0.4)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
            </Button>
          </form>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">OR</Typography>
          </Divider>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link to="/login" style={{ 
                color: '#667eea', 
                fontWeight: 600, 
                textDecoration: 'none' 
              }}>
                Sign In
              </Link>
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  )
}

export default Register
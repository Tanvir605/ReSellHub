// frontend/src/components/Auth/Login.jsx
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { 
  Box, Container, Paper, Typography, TextField, Button, 
  Divider, Alert, CircularProgress, IconButton 
} from '@mui/material'
import { Visibility, VisibilityOff, Storefront } from '@mui/icons-material'
import { motion } from 'framer-motion'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    const result = await login(email, password)
    setLoading(false)
    
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error || 'Login failed. Please try again.')
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
          mt: 8,
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
              Welcome Back! 👋
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to continue to ReSellHub
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
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 3 }}
              InputProps={{ sx: { borderRadius: '12px' } }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </form>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">OR</Typography>
          </Divider>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link to="/register" style={{ 
                color: '#667eea', 
                fontWeight: 600, 
                textDecoration: 'none' 
              }}>
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  )
}

export default Login
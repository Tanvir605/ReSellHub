// frontend/src/components/Orders/BuyNow.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Container, Paper, Typography, TextField, Button,
  Grid, Divider, Alert, CircularProgress, Chip,
  IconButton
} from '@mui/material'
import { 
  Storefront, LocationOn, Phone, CheckCircle, 
  Close, ShoppingCart 
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

const BuyNow = ({ product, onClose }) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    quantity: 1,
    shippingAddress: user?.location || '',
    phone: user?.phone || '',
    notes: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const orderData = {
        productId: product._id,
        quantity: formData.quantity,
        shippingAddress: formData.shippingAddress,
        phone: formData.phone,
        notes: formData.notes
      }

      const response = await api.post('/orders', orderData)
      toast.success('Order placed successfully! 🎉')
      
      // Create chat for buyer and seller
      await api.post('/chats', {
        productId: product._id,
        sellerId: product.sellerId
      })

      onClose()
      navigate('/orders/buyer')
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to place order')
      toast.error(error.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3
        }}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Buy Now 🛒
          </Typography>
          <IconButton onClick={onClose} sx={{ color: '#94a3b8' }}>
            <Close />
          </IconButton>
        </Box>

        {/* Product Summary */}
        <Box sx={{ 
          p: 2, 
          bgcolor: '#f8fafc', 
          borderRadius: '12px', 
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Box sx={{ 
            width: 60, 
            height: 60, 
            borderRadius: '8px', 
            overflow: 'hidden',
            bgcolor: '#e2e8f0',
            flexShrink: 0
          }}>
            <img 
              src={product.images?.[0] || 'https://via.placeholder.com/60x60'} 
              alt={product.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
          <Box>
            <Typography variant="body1" fontWeight={600}>
              {product.title}
            </Typography>
            <Typography variant="h6" sx={{ color: '#4f46e5', fontWeight: 700 }}>
              ৳{product.price}
            </Typography>
            <Chip label={product.condition} size="small" sx={{ fontSize: '0.6rem' }} />
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                required
                inputProps={{ min: 1, max: 10 }}
                InputProps={{ sx: { borderRadius: '12px' } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Shipping Address *"
                name="shippingAddress"
                value={formData.shippingAddress}
                onChange={handleChange}
                required
                placeholder="House #, Road #, Area, City"
                InputProps={{
                  startAdornment: <LocationOn sx={{ mr: 1, color: '#4f46e5' }} />,
                  sx: { borderRadius: '12px' }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number *"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+880 17XX-XXXXXX"
                InputProps={{
                  startAdornment: <Phone sx={{ mr: 1, color: '#4f46e5' }} />,
                  sx: { borderRadius: '12px' }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Additional Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any special instructions..."
                InputProps={{ sx: { borderRadius: '12px' } }}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1" color="text.secondary">Total Amount</Typography>
                <Typography variant="h6" fontWeight={700} color="#4f46e5">
                  ৳{product.price * formData.quantity}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.8,
                  borderRadius: '50px',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  boxShadow: '0 8px 25px rgba(245,158,11,0.3)',
                  '&:hover': {
                    boxShadow: '0 12px 35px rgba(245,158,11,0.4)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Order'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </motion.div>
    </Container>
  )
}

export default BuyNow
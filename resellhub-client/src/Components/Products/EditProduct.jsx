// frontend/src/components/Products/EditProduct.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../../utils/api'
import {
  Box, Container, Paper, Typography, TextField, Button,
  MenuItem, Alert, CircularProgress, Grid, Chip
} from '@mui/material'
import {
  Storefront, Description, PriceChange, LocationOn, 
  Category, Favorite, CheckCircle, ArrowBack
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import EditIcon from '@mui/icons-material/Edit'

const EditProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    location: '',
    status: 'available'
  })

  const categories = ['Electronics', 'Fashion', 'Furniture', 'Books', 'Vehicles', 'Sports', 'Toys', 'Art', 'Other']
  const conditions = ['New', 'Like New', 'Excellent', 'Good', 'Fair']
  const statuses = ['available', 'sold']

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`)
      const product = response.data.product
      setFormData({
        title: product.title || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        condition: product.condition || '',
        location: product.location || '',
        status: product.status || 'available'
      })
    } catch (error) {
      setError('Failed to load product')
      toast.error('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await api.put(`/products/${id}`, formData)
      toast.success('Product updated successfully! 🎉')
      navigate('/dashboard/seller')
    } catch (error) {
      console.error('Error:', error)
      setError(error.response?.data?.message || 'Failed to update product')
      toast.error(error.response?.data?.message || 'Failed to update product')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#4f46e5' }} />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, sm: 5 } }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          component={Link}
          to="/dashboard/seller"
          startIcon={<ArrowBack />}
          sx={{ mb: 3, color: '#4f46e5', fontWeight: 600 }}
        >
          Back to Dashboard
        </Button>

        <Paper 
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{
              width: 64,
              height: 64,
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 8px 25px rgba(79,70,229,0.3)',
            }}>
              <EditIcon sx={{ fontSize: 32, color: '#fff' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
              Edit Product ✏️
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Update your product details
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Title *"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: <Storefront sx={{ mr: 1.5, color: '#4f46e5' }} />,
                    sx: { borderRadius: '12px' }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description *"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: <Description sx={{ mr: 1.5, color: '#4f46e5', mt: 1 }} />,
                    sx: { borderRadius: '12px', alignItems: 'flex-start' }
                  }}
                />
              </Grid>

              {/* ✅ Price - BDT */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price (BDT) *"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: <PriceChange sx={{ mr: 1.5, color: '#4f46e5' }} />,
                    sx: { borderRadius: '12px' }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Category *"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  SelectProps={{
                    MenuProps: {
                      PaperProps: { sx: { maxHeight: 200 } }
                    }
                  }}
                  InputProps={{
                    startAdornment: <Category sx={{ mr: 1.5, color: '#4f46e5' }} />,
                    sx: { borderRadius: '12px' }
                  }}
                >
                  {categories.map(cat => (
                    <MenuItem key={cat} value={cat} sx={{ py: 1 }}>{cat}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Condition *"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                  SelectProps={{
                    MenuProps: {
                      PaperProps: { sx: { maxHeight: 200 } }
                    }
                  }}
                  InputProps={{
                    startAdornment: <Favorite sx={{ mr: 1.5, color: '#4f46e5' }} />,
                    sx: { borderRadius: '12px' }
                  }}
                >
                  {conditions.map(cond => (
                    <MenuItem key={cond} value={cond} sx={{ py: 1 }}>{cond}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Dhaka, Bangladesh"
                  InputProps={{
                    startAdornment: <LocationOn sx={{ mr: 1.5, color: '#4f46e5' }} />,
                    sx: { borderRadius: '12px' }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: { sx: { maxHeight: 200 } }
                    }
                  }}
                  InputProps={{
                    startAdornment: <CheckCircle sx={{ mr: 1.5, color: '#4f46e5' }} />,
                    sx: { borderRadius: '12px' }
                  }}
                >
                  {statuses.map(status => (
                    <MenuItem key={status} value={status} sx={{ py: 1 }}>
                      {status === 'available' ? '🟢 Available' : '🔴 Sold'}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={submitting}
                  sx={{
                    py: 2,
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    boxShadow: '0 8px 25px rgba(79,70,229,0.3)',
                    '&:hover': {
                      boxShadow: '0 12px 30px rgba(79,70,229,0.45)',
                      transform: 'translateY(-2px)'
                    },
                    '&:disabled': {
                      background: '#cbd5e1'
                    }
                  }}
                >
                  {submitting ? (
                    <CircularProgress size={26} color="inherit" />
                  ) : (
                    <>
                      <CheckCircle sx={{ mr: 1, fontSize: 22 }} />
                      Update Product
                    </>
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </motion.div>
    </Container>
  )
}

export default EditProduct
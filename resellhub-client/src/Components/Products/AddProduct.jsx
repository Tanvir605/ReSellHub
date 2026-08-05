// frontend/src/components/Products/AddProduct.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import {
  Box, Container, Paper, Typography, TextField, Button,
  MenuItem, Alert, CircularProgress, Grid, Chip,
  IconButton, Divider, Card, CardMedia
} from '@mui/material'
import {
  CloudUpload, Delete, Storefront, Description, 
  PriceChange, LocationOn, Category, Favorite, CheckCircle
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

const AddProduct = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    location: ''
  })

  const categories = ['Electronics', 'Fashion', 'Furniture', 'Books', 'Vehicles', 'Sports', 'Toys', 'Art', 'Other']
  const conditions = ['New', 'Like New', 'Excellent', 'Good', 'Fair']

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + images.length > 5) {
      toast.error('Maximum 5 images allowed')
      return
    }

    const previews = files.map(file => URL.createObjectURL(file))
    setImagePreviews([...imagePreviews, ...previews])
    setImages([...images, ...files])
  }

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    setImages(newImages)
    setImagePreviews(newPreviews)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const formDataWithImages = new FormData()
      formDataWithImages.append('title', formData.title)
      formDataWithImages.append('description', formData.description)
      formDataWithImages.append('price', formData.price)
      formDataWithImages.append('category', formData.category)
      formDataWithImages.append('condition', formData.condition)
      formDataWithImages.append('location', formData.location || '')
      
      images.forEach(file => {
        formDataWithImages.append('images', file)
      })

      await api.post('/products', formDataWithImages, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      toast.success('Product listed successfully! 🎉')
      navigate('/dashboard/seller')
    } catch (error) {
      console.error('Error:', error)
      setError(error.response?.data?.message || 'Failed to list product')
      toast.error(error.response?.data?.message || 'Failed to list product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, sm: 5 } }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
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
          {/* Header */}
          <Box sx={{ 
            textAlign: 'center', 
            mb: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <Box sx={{
              width: 64,
              height: 64,
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 25px rgba(79,70,229,0.3)',
              mb: 2
            }}>
              <Storefront sx={{ fontSize: 32, color: '#fff' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
              List Your Product
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fill in the details to sell your item
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Title */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Title *"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., iPhone 13 Pro Max 256GB"
                  InputProps={{
                    startAdornment: <Storefront sx={{ mr: 1.5, color: '#4f46e5' }} />,
                    sx: { borderRadius: '12px' }
                  }}
                />
              </Grid>

              {/* Description */}
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
                  placeholder="Describe your product's features and condition..."
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

              {/* ✅ Category - Full Width Fix */}
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
                      PaperProps: {
                        sx: { maxHeight: 200 }
                      }
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

              {/* ✅ Condition - Full Width Fix */}
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
                      PaperProps: {
                        sx: { maxHeight: 200 }
                      }
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

              {/* Location */}
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

              {/* Image Upload */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>
                  <Chip label="📸 Upload Images" sx={{ fontWeight: 600 }} />
                </Divider>

                <Box sx={{
                  border: '2px dashed #818cf8',
                  borderRadius: '16px',
                  p: 4,
                  textAlign: 'center',
                  background: 'rgba(99, 102, 241, 0.03)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    background: 'rgba(99, 102, 241, 0.08)',
                    borderColor: '#4f46e5'
                  }
                }}>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" style={{ cursor: 'pointer', width: '100%', display: 'block' }}>
                    <CloudUpload sx={{ fontSize: 48, color: '#4f46e5', mb: 1 }} />
                    <Typography variant="h6" fontWeight={600} color="#334155">
                      Click to upload images
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      PNG, JPG up to 5MB (Max 5 images)
                    </Typography>
                  </label>
                </Box>

                {imagePreviews.length > 0 && (
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    mt: 3, 
                    flexWrap: 'wrap'
                  }}>
                    <AnimatePresence>
                      {imagePreviews.map((preview, index) => (
                        <motion.div
                          key={preview}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          style={{ position: 'relative' }}
                        >
                          <Card sx={{
                            width: 100,
                            height: 100,
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                            border: '2px solid #e2e8f0'
                          }}>
                            <CardMedia
                              component="img"
                              image={preview}
                              alt={`Preview ${index + 1}`}
                              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => removeImage(index)}
                              sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                background: 'rgba(239, 68, 68, 0.9)',
                                color: '#fff',
                                '&:hover': { background: '#dc2626' },
                                width: 26,
                                height: 26
                              }}
                            >
                              <Delete sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </Box>
                )}
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading || images.length === 0}
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
                  {loading ? (
                    <CircularProgress size={26} color="inherit" />
                  ) : (
                    <>
                      <CheckCircle sx={{ mr: 1, fontSize: 22 }} />
                      List Product Now
                    </>
                  )}
                </Button>
                {images.length === 0 && !loading && (
                  <Typography variant="caption" color="error" sx={{ 
                    display: 'block', 
                    textAlign: 'center', 
                    mt: 1.5,
                    fontWeight: 500
                  }}>
                    * Please upload at least 1 image
                  </Typography>
                )}
              </Grid>
            </Grid>
          </form>
        </Paper>
      </motion.div>
    </Container>
  )
}

export default AddProduct
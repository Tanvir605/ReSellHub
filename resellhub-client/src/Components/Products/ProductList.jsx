// frontend/src/components/Products/ProductList.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import {
  Box, Container, Typography, Grid, Card, CardMedia, CardContent,
  CardActions, Button, Chip, TextField, MenuItem, Pagination,
  IconButton, InputAdornment
} from '@mui/material'
import { Search, LocationOn, Favorite, FavoriteBorder } from '@mui/icons-material'
import { motion } from 'framer-motion'
import LoadingSpinner from '../Common/LoadingSpinner'

// ❌ এই লাইনটি সম্পূর্ণ ডিলিট করুন - আর process.env ব্যবহার করবেন না
// আমরা api.js ব্যবহার করছি, এখানে আলাদা করে API_URL দরকার নেই

const ProductList = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [favorites, setFavorites] = useState([])

  const categoriesList = ['all', 'Electronics', 'Fashion', 'Furniture', 'Books', 'Vehicles', 'Sports']

  useEffect(() => {
    fetchProducts()
  }, [page, category, sortBy, search])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await api.get('/products', {
        params: { page, limit: 8, category, sortBy, search }
      })
      setProducts(response.data.products || [])
      setTotalPages(response.data.pagination?.totalPages || 1)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  if (loading && products.length === 0) {
    return <LoadingSpinner size="large" text="Loading amazing products..." />
  }

  return (
    <Container maxWidth="xl">
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h3" sx={{ 
            fontWeight: 800,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}>
            Discover Amazing Deals 🛍️
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Find the best second-hand items near you
          </Typography>
        </motion.div>
      </Box>

      {/* Search & Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                sx: { borderRadius: '12px', background: 'white' }
              }}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              sx={{ background: 'white', borderRadius: '12px' }}
            >
              {categoriesList.map(cat => (
                <MenuItem key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              select
              label="Sort By"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              sx={{ background: 'white', borderRadius: '12px' }}
            >
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="price-low">Price: Low to High</MenuItem>
              <MenuItem value="price-high">Price: High to Low</MenuItem>
              <MenuItem value="oldest">Oldest First</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={1}>
            <Button
              fullWidth
              variant="contained"
              onClick={fetchProducts}
              sx={{
                height: '100%',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                '&:hover': { transform: 'scale(1.02)' }
              }}
            >
              <Search />
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Products Grid */}
      {loading ? (
        <LoadingSpinner text="Loading products..." />
      ) : products.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="text.secondary">
            No products found 😕
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filters
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {products.map((product, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card sx={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.12)'
                    }
                  }}>
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={product.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
                        alt={product.title}
                      />
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          background: 'rgba(255,255,255,0.9)',
                          '&:hover': { background: 'white' }
                        }}
                        onClick={() => toggleFavorite(product._id)}
                      >
                        {favorites.includes(product._id) ? (
                          <Favorite color="error" />
                        ) : (
                          <FavoriteBorder />
                        )}
                      </IconButton>
                      {product.condition && (
                        <Chip
                          label={product.condition}
                          size="small"
                          sx={{
                            position: 'absolute',
                            bottom: 8,
                            left: 8,
                            background: 'rgba(255,255,255,0.9)',
                            fontWeight: 600
                          }}
                        />
                      )}
                    </Box>

                    <CardContent>
                      <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 600,
                          color: '#333',
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {product.title}
                        </Typography>
                      </Link>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {product.description?.substring(0, 60)}...
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <LocationOn sx={{ fontSize: 16, color: '#667eea', mr: 0.5 }} />
                        <Typography variant="caption" color="text.secondary">
                          {product.location || 'Location not specified'}
                        </Typography>
                      </Box>
                      <Typography variant="h5" sx={{ 
                        mt: 1,
                        fontWeight: 700,
                        color: '#667eea'
                      }}>
                        ৳{product.price}
                      </Typography>
                    </CardContent>

                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button
                        component={Link}
                        to={`/product/${product._id}`}
                        fullWidth
                        variant="contained"
                        sx={{
                          borderRadius: '50px',
                          background: 'linear-gradient(135deg, #667eea, #764ba2)',
                          '&:hover': { transform: 'scale(1.02)' }
                        }}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: '12px',
                    '&.Mui-selected': {
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      color: 'white'
                    }
                  }
                }}
              />
            </Box>
          )}
        </>
      )}
    </Container>
  )
}

export default ProductList
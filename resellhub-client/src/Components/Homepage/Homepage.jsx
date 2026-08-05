// frontend/src/components/Homepage/Homepage.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Box, Container, Typography, Button, Grid, Chip,
  Avatar, Paper, Stack, TextField, InputAdornment,
  Rating
} from '@mui/material'
import {
  Search, LocationOn, Star, ArrowForward,
  TrendingUp, Security, Support, Speed,
  Storefront, ShoppingBag, Favorite, Phone,
  PersonAdd, Apple, Google, VerifiedUser
} from '@mui/icons-material'
import api from '../../utils/api'
import LoadingSpinner from '../Common/LoadingSpinner'
import ProductCard from '../Products/ProductCard'
import CategoryCard from './CategoryCard'

const Homepage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products', {
        params: { page: 1, limit: 12, sortBy: 'newest' }
      })
      setProducts(response.data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  // ============================================
  // SECTION 1: HERO SECTION
  // ============================================
  const HeroSection = () => (
    <Box sx={{
      position: 'relative',
      borderRadius: { xs: '16px', md: '28px' },
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)',
      p: { xs: 3, sm: 5, md: 7 },
      mb: 5,
      minHeight: { xs: '420px', sm: '480px', md: '560px' },
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      boxShadow: '0 20px 60px rgba(79, 70, 229, 0.25)',
    }}>
      <Box sx={{ position: 'relative', zIndex: 2, maxWidth: '650px', width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Chip 
            label="🔥 Trending Now" 
            sx={{ 
              mb: 2, 
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              fontWeight: 700,
              backdropFilter: 'blur(10px)',
              px: 2,
              fontSize: '0.8rem'
            }} 
          />
          
          <Typography 
            variant="h1" 
            sx={{ 
              color: 'white', 
              fontWeight: 900,
              fontSize: { xs: '2rem', sm: '2.8rem', md: '4rem' },
              lineHeight: 1.08,
              mb: 2,
              letterSpacing: '-1px'
            }}
          >
            Find Your Perfect <br />
            <span style={{ 
              background: 'linear-gradient(135deg, #fcd34d, #f59e0b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Second-Hand
            </span> Treasure
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255,255,255,0.9)', 
              mb: 4, 
              fontWeight: 400,
              fontSize: { xs: '0.9rem', sm: '1.05rem' },
              maxWidth: '500px'
            }}
          >
            Discover amazing deals on pre-loved items. Sell what you don't need, buy what you love.
          </Typography>
          


          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={{ xs: 2, sm: 4 }} 
            sx={{ mt: 4 }}
          >
            <Box>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>10K+</Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>Happy Users</Typography>
            </Box>
            <Box>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>5K+</Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>Items Sold</Typography>
            </Box>
            <Box>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>99%</Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>Satisfaction</Typography>
            </Box>
          </Stack>
        </motion.div>
      </Box>
    </Box>
  )

  // ============================================
  // SECTION 2: FEATURES
  // ============================================
  const FeaturesSection = () => {
    const features = [
      { icon: <Security sx={{ fontSize: 40 }} />, title: 'Secure Transactions', desc: 'Safe and secure payment methods', color: '#4f46e5' },
      { icon: <Speed sx={{ fontSize: 40 }} />, title: 'Fast & Easy', desc: 'List your items in minutes', color: '#7c3aed' },
      { icon: <Support sx={{ fontSize: 40 }} />, title: '24/7 Support', desc: 'We are here to help you', color: '#a855f7' },
      { icon: <TrendingUp sx={{ fontSize: 40 }} />, title: 'Best Prices', desc: 'Get the best value for your items', color: '#d946ef' },
    ]

    return (
      <Box sx={{ mb: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 800,
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: { xs: '1.8rem', sm: '2.5rem' }
          }}>
            Why Choose ReSellHub?
          </Typography>
          <Typography variant="body1" color="text.secondary">We make buying and selling simple and secure</Typography>
        </Box>

        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Paper sx={{ 
                  p: 3.5, 
                  textAlign: 'center',
                  borderRadius: '20px',
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(20px)',
                  height: '100%',
                  transition: 'all 0.4s ease',
                  border: '1px solid rgba(255,255,255,0.6)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 16px 40px rgba(79,70,229,0.12)',
                  }
                }}>
                  <Box sx={{ color: feature.color, mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{feature.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{feature.desc}</Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    )
  }

  // ============================================
  // SECTION 3: ALL PRODUCTS
  // ============================================
  const ProductsSection = () => (
    <Box sx={{ mb: 6 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexWrap: 'wrap',
        gap: 1
      }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
            🔥 All Products
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Browse all available items from our sellers
          </Typography>
        </Box>
        <Button 
          component={Link} 
          to="/products"
          endIcon={<ArrowForward />}
          sx={{ 
            color: '#4f46e5',
            fontWeight: 600,
            '&:hover': { transform: 'translateX(5px)' }
          }}
        >
          View All
        </Button>
      </Box>

      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((_, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <ProductCard loading={true} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {products.slice(0, 8).map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )

  // ============================================
  // SECTION 4: CATEGORIES
  // ============================================
  const CategoriesSection = () => {
    const categories = [
      { name: 'Electronics', icon: '📱' },
      { name: 'Fashion', icon: '👗' },
      { name: 'Furniture', icon: '🪑' },
      { name: 'Books', icon: '📚' },
      { name: 'Vehicles', icon: '🚗' },
      { name: 'Sports', icon: '⚽' },
      { name: 'Toys', icon: '🧸' },
      { name: 'Art', icon: '🎨' },
    ]

    return (
      <Box sx={{ mb: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
            Popular Categories 📂
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Browse items by category and find what you're looking for
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {categories.map((category, index) => (
            <Grid item xs={6} sm={4} md={3} key={category.name}>
              <CategoryCard category={category} index={index} />
            </Grid>
          ))}
        </Grid>
      </Box>
    )
  }

  // ============================================
  // SECTION 5: HOW IT WORKS
  // ============================================
  const HowItWorksSection = () => {
    const steps = [
      { step: '1', title: 'Create Account', desc: 'Sign up as a buyer or seller in seconds', icon: <PersonAdd sx={{ fontSize: 40 }} /> },
      { step: '2', title: 'List or Browse', desc: 'List your items or find what you need', icon: <Search sx={{ fontSize: 40 }} /> },
      { step: '3', title: 'Connect & Deal', desc: 'Chat with buyers/sellers and make a deal', icon: <Phone sx={{ fontSize: 40 }} /> },
    ]

    return (
      <Box sx={{ mb: 6, py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
            How It Works 🚀
          </Typography>
          <Typography variant="body1" color="text.secondary">Get started in 3 simple steps</Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {steps.map((step, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Paper sx={{
                  p: 4,
                  textAlign: 'center',
                  borderRadius: '24px',
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.6)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.06)'
                  }
                }}>
                  <Box sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '1.5rem',
                    boxShadow: '0 8px 25px rgba(79,70,229,0.25)'
                  }}>
                    {step.step}
                  </Box>
                  <Box sx={{ color: '#4f46e5', mb: 2 }}>{step.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{step.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{step.desc}</Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    )
  }

  // ============================================
  // SECTION 6: TESTIMONIALS
  // ============================================
  const TestimonialsSection = () => {
    const testimonials = [
      { name: 'Rahul Sharma', role: 'Seller', text: 'ReSellHub helped me sell my old laptop in just 2 days! Amazing platform.', avatar: 'R', rating: 5 },
      { name: 'Priya Patel', role: 'Buyer', text: 'Found a great deal on furniture. The quality was exactly as described.', avatar: 'P', rating: 5 },
      { name: 'Amit Kumar', role: 'Both', text: 'Best second-hand marketplace in India. Highly recommended!', avatar: 'A', rating: 5 },
    ]

    return (
      <Box sx={{ mb: 6, py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
            What Our Users Say ⭐
          </Typography>
          <Typography variant="body1" color="text.secondary">Join thousands of satisfied users</Typography>
        </Box>

        <Grid container spacing={3}>
          {testimonials.map((test, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Paper sx={{
                  p: 3.5,
                  borderRadius: '20px',
                  background: 'rgba(255,255,255,0.85)',
                  backdropFilter: 'blur(20px)',
                  height: '100%',
                  border: '1px solid rgba(255,255,255,0.6)',
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ width: 48, height: 48, mr: 2, bgcolor: '#4f46e5' }}>
                      {test.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>{test.name}</Typography>
                      <Chip label={test.role} size="small" sx={{ fontSize: '0.6rem', bgcolor: '#4f46e5', color: 'white', height: 18 }} />
                    </Box>
                  </Box>
                  <Rating value={test.rating} readOnly size="small" sx={{ mb: 1 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    "{test.text}"
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    )
  }

  // ============================================
  // RENDER ALL
  // ============================================
  return (
    <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 3 } }}>
      <HeroSection />
      <FeaturesSection />
      <ProductsSection />
      <CategoriesSection />
      <HowItWorksSection />
      <TestimonialsSection />
    </Container>
  )
}

export default Homepage
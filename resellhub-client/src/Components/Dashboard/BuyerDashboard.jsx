// frontend/src/components/Dashboard/BuyerDashboard.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import {
  Box, Container, Typography, Grid, Card, CardContent,
  Button, Chip, Paper, Avatar, CircularProgress,
  Divider, List, ListItem, ListItemText, ListItemAvatar
} from '@mui/material'
import { 
  ShoppingBag, Favorite, Star, TrendingUp, 
  Storefront, ShoppingCart, Chat, Visibility,
  CheckCircle, Pending, LocalShipping, DoneAll
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import LoadingSpinner from '../Common/LoadingSpinner'

const BuyerDashboard = () => {
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch buyer stats
      const statsRes = await api.get('/dashboard/buyer/stats')
      setStats(statsRes.data)

      // Fetch buyer orders
      const ordersRes = await api.get('/orders/buyer')
      setOrders(ordersRes.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  // Order status icons
  const getStatusIcon = (status) => {
    const icons = {
      pending: <Pending sx={{ color: '#f59e0b' }} />,
      confirmed: <CheckCircle sx={{ color: '#3b82f6' }} />,
      shipped: <LocalShipping sx={{ color: '#8b5cf6' }} />,
      delivered: <DoneAll sx={{ color: '#10b981' }} />,
      cancelled: <Pending sx={{ color: '#ef4444' }} />
    }
    return icons[status] || <Pending />
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      confirmed: '#3b82f6',
      shipped: '#8b5cf6',
      delivered: '#10b981',
      cancelled: '#ef4444'
    }
    return colors[status] || '#6b7280'
  }

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    }
    return labels[status] || status
  }

  if (loading) return <LoadingSpinner size="large" />

  // Order Statistics
  const totalOrders = orders.length
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length
  const totalSpent = orders
    .filter(o => o.status === 'delivered' || o.status === 'confirmed' || o.status === 'shipped')
    .reduce((sum, o) => sum + o.totalAmount, 0)

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
          My Dashboard 👋
        </Typography>

        {/* ========== STATS CARDS ========== */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: '16px', 
              p: 2.5, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              borderLeft: '4px solid #4f46e5'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#4f46e5' }}><ShoppingBag /></Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>{totalOrders}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Orders</Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: '16px', 
              p: 2.5, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              borderLeft: '4px solid #f59e0b'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#f59e0b' }}><Pending /></Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>{pendingOrders}</Typography>
                  <Typography variant="body2" color="text.secondary">Pending Orders</Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: '16px', 
              p: 2.5, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              borderLeft: '4px solid #10b981'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#10b981' }}><DoneAll /></Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>{deliveredOrders}</Typography>
                  <Typography variant="body2" color="text.secondary">Delivered</Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: '16px', 
              p: 2.5, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              borderLeft: '4px solid #4f46e5'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#4f46e5' }}><TrendingUp /></Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>৳{totalSpent.toLocaleString()}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Spent</Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* ========== RECENT ORDERS ========== */}
        <Paper sx={{ p: 3, borderRadius: '16px' }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 3,
            flexWrap: 'wrap',
            gap: 1
          }}>
            <Typography variant="h6" fontWeight={600}>
              Recent Orders 📦
            </Typography>
            {orders.length > 0 && (
              <Button
                component={Link}
                to="/orders/buyer"
                variant="outlined"
                size="small"
                sx={{ borderRadius: '50px' }}
              >
                View All Orders
              </Button>
            )}
          </Box>

          {orders.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Storefront sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                No orders yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Start shopping and place your first order!
              </Typography>
              <Button
                component={Link}
                to="/"
                variant="contained"
                sx={{
                  borderRadius: '50px',
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)'
                }}
              >
                Browse Products
              </Button>
            </Box>
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <Grid container spacing={2}>
                {orders.slice(0, 5).map((order) => (
                  <Grid item xs={12} key={order._id}>
                    <Paper sx={{ 
                      p: 2, 
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 2,
                      '&:hover': { 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                        bgcolor: '#f8fafc'
                      }
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 200 }}>
                        <Box sx={{ 
                          width: 50, 
                          height: 50, 
                          borderRadius: '8px', 
                          overflow: 'hidden',
                          bgcolor: '#f1f5f9',
                          flexShrink: 0
                        }}>
                          <img 
                            src={order.productImage || 'https://via.placeholder.com/50x50'} 
                            alt={order.productTitle}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/50x50/4f46e5/ffffff?text=No'
                            }}
                          />
                        </Box>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {order.productTitle}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ৳{order.totalAmount} • Qty: {order.quantity}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            Order #{order._id.slice(-6)}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <Chip
                          icon={getStatusIcon(order.status)}
                          label={getStatusLabel(order.status)}
                          size="small"
                          sx={{
                            bgcolor: `${getStatusColor(order.status)}15`,
                            color: getStatusColor(order.status),
                            fontWeight: 600,
                            fontSize: '0.65rem'
                          }}
                        />
                        
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            component={Link}
                            to={`/chat/${order.productId}/${order.sellerId}`}
                            size="small"
                            variant="outlined"
                            startIcon={<Chat />}
                            sx={{ 
                              borderRadius: '50px', 
                              textTransform: 'none',
                              fontSize: '0.7rem'
                            }}
                          >
                            Chat
                          </Button>
                          <Button
                            component={Link}
                            to={`/product/${order.productId}`}
                            size="small"
                            variant="outlined"
                            startIcon={<Visibility />}
                            sx={{ 
                              borderRadius: '50px', 
                              textTransform: 'none',
                              fontSize: '0.7rem'
                            }}
                          >
                            View
                          </Button>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Paper>

        {/* ========== RECOMMENDED PRODUCTS ========== */}
        {stats?.recentProducts && stats.recentProducts.length > 0 && (
          <Paper sx={{ mt: 4, p: 3, borderRadius: '16px' }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Recommended for You 💡
            </Typography>
            <Grid container spacing={2}>
              {stats.recentProducts.slice(0, 4).map((product) => (
                <Grid item xs={6} sm={4} md={3} key={product._id}>
                  <Card sx={{ 
                    borderRadius: '12px', 
                    overflow: 'hidden',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }
                  }}>
                    <Box sx={{ height: 120, overflow: 'hidden' }}>
                      <img 
                        src={product.images?.[0] || 'https://via.placeholder.com/200x120'}
                        alt={product.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/200x120/4f46e5/ffffff?text=No'
                        }}
                      />
                    </Box>
                    <CardContent sx={{ p: 1.5 }}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {product.title}
                      </Typography>
                      <Typography variant="body2" fontWeight={700} color="#4f46e5">
                        ৳{product.price}
                      </Typography>
                      <Button
                        component={Link}
                        to={`/product/${product._id}`}
                        size="small"
                        fullWidth
                        sx={{
                          mt: 1,
                          borderRadius: '50px',
                          fontSize: '0.65rem',
                          background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                          color: 'white',
                          '&:hover': { opacity: 0.9 }
                        }}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}
      </motion.div>
    </Container>
  )
}

export default BuyerDashboard
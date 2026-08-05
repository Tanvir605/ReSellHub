// frontend/src/components/Orders/BuyerOrders.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Box, Container, Typography, Grid, Card, CardContent,
  Chip, Button, Paper, Avatar, CircularProgress,
  Divider, Stepper, Step, StepLabel
} from '@mui/material'
import { Storefront, LocationOn, Phone, Chat, CheckCircle } from '@mui/icons-material'
import { motion } from 'framer-motion'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const BuyerOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/buyer')
      setOrders(response.data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
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

  const getStatusSteps = (status) => {
    const steps = ['Pending', 'Confirmed', 'Shipped', 'Delivered']
    const statusMap = {
      pending: 0,
      confirmed: 1,
      shipped: 2,
      delivered: 3
    }
    return statusMap[status] || 0
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#4f46e5' }} />
      </Box>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
        My Orders 📦
      </Typography>

      {orders.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '20px' }}>
          <Storefront sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
          <Typography variant="h5" color="text.secondary">
            No orders yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
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
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} key={order._id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card sx={{ borderRadius: '16px', overflow: 'hidden' }}>
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: `${getStatusColor(order.status)}10`,
                    borderBottom: `2px solid ${getStatusColor(order.status)}`
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: '#4f46e5', width: 40, height: 40 }}>
                          <Storefront sx={{ fontSize: 20 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight={600}>
                            Order #{order._id.slice(-6)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={order.status.toUpperCase()}
                        sx={{
                          bgcolor: getStatusColor(order.status),
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '0.7rem'
                        }}
                      />
                    </Box>
                  </Box>

                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={8}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Box sx={{ 
                            width: 80, 
                            height: 80, 
                            borderRadius: '8px', 
                            overflow: 'hidden',
                            bgcolor: '#f1f5f9',
                            flexShrink: 0
                          }}>
                            <img 
                              src={order.productImage || 'https://via.placeholder.com/80x80'}
                              alt={order.productTitle}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </Box>
                          <Box>
                            <Typography variant="h6" fontWeight={600}>
                              {order.productTitle}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Quantity: {order.quantity} × ৳{order.productPrice}
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#4f46e5', fontWeight: 700, mt: 1 }}>
                              ৳{order.totalAmount}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            <LocationOn sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                            {order.shippingAddress}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <Phone sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                            {order.phone}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Stepper 
                            activeStep={getStatusSteps(order.status)} 
                            alternativeLabel
                            sx={{ '& .MuiStepLabel-label': { fontSize: '0.65rem' } }}
                          >
                            {['Pending', 'Confirmed', 'Shipped', 'Delivered'].map((label) => (
                              <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                              </Step>
                            ))}
                          </Stepper>

                          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                            <Button
                              component={Link}
                              to={`/chat/${order.productId}/${order.sellerId}`}
                              variant="outlined"
                              startIcon={<Chat />}
                              fullWidth
                              sx={{ borderRadius: '50px' }}
                            >
                              Chat with Seller
                            </Button>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}

export default BuyerOrders
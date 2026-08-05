// frontend/src/components/Dashboard/SellerDashboard.jsx
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import {
  Box, Container, Typography, Grid, Card,
  Button, Chip, Paper, Avatar, Dialog,
  DialogTitle, DialogContent, DialogActions,
  CircularProgress, Select, MenuItem, FormControl,
  InputLabel, Badge
} from '@mui/material'
import {
  Storefront, TrendingUp, AttachMoney, ShoppingCart,
  Edit, Delete, Visibility, Add, Chat,
  Pending, CheckCircle, LocalShipping, DoneAll
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import LoadingSpinner from '../Common/LoadingSpinner'

const SellerDashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, productsRes, ordersRes] = await Promise.all([
        api.get('/dashboard/seller/stats'),
        api.get('/products/seller/my-products'),
        api.get('/orders/seller')
      ])
      setStats(statsRes.data)
      setProducts(productsRes.data || [])
      setOrders(ordersRes.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingStatus(true)
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus })
      toast.success('Order status updated!')
      fetchData()
    } catch (error) {
      toast.error('Failed to update status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleDeleteClick = (product) => {
    setSelectedProduct(product)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return
    setDeleting(true)
    try {
      await api.delete(`/products/${selectedProduct._id}`)
      toast.success('Product deleted successfully!')
      setProducts(products.filter(p => p._id !== selectedProduct._id))
      setDeleteDialogOpen(false)
      setSelectedProduct(null)
      const statsRes = await api.get('/dashboard/seller/stats')
      setStats(statsRes.data)
    } catch (error) {
      toast.error('Failed to delete product')
    } finally {
      setDeleting(false)
    }
  }

  const handleEdit = (productId) => {
    navigate(`/edit-product/${productId}`)
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

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Pending sx={{ fontSize: 16 }} />,
      confirmed: <CheckCircle sx={{ fontSize: 16 }} />,
      shipped: <LocalShipping sx={{ fontSize: 16 }} />,
      delivered: <DoneAll sx={{ fontSize: 16 }} />
    }
    return icons[status] || <Pending />
  }

  if (loading) return <LoadingSpinner size="large" />

  const totalOrders = orders.length
  const pendingOrders = orders.filter(o => o.status === 'pending').length

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Seller Dashboard 📊
          </Typography>
          <Button
            component={Link}
            to="/add-product"
            variant="contained"
            startIcon={<Add />}
            sx={{
              borderRadius: '50px',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              boxShadow: '0 4px 15px rgba(79,70,229,0.3)',
              '&:hover': { boxShadow: '0 8px 25px rgba(79,70,229,0.4)' }
            }}
          >
            Add New Product
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: '16px', p: 2.5, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#4f46e5' }}><Storefront /></Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>{stats?.stats?.totalListings || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Listings</Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: '16px', p: 2.5, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#10b981' }}><ShoppingCart /></Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>{stats?.stats?.activeListings || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">Active Listings</Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: '16px', p: 2.5, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#f59e0b' }}><AttachMoney /></Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>{stats?.stats?.soldListings || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">Sold Items</Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: '16px', p: 2.5, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#ef4444' }}><TrendingUp /></Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>৳{stats?.stats?.totalRevenue || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Revenue</Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* ========== ORDERS SECTION ========== */}
        {orders.length > 0 && (
          <Paper sx={{ mt: 4, p: 3, borderRadius: '16px' }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
              flexWrap: 'wrap',
              gap: 1
            }}>
              <Typography variant="h6" fontWeight={600}>
                Orders <Badge badgeContent={pendingOrders} color="warning" sx={{ ml: 1 }} />
              </Typography>
            </Box>

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
                      borderLeft: `4px solid ${getStatusColor(order.status)}`,
                      '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }
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
                            Buyer: {order.buyerName || 'Customer'} • Order #{order._id.slice(-6)}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <Chip
                          icon={getStatusIcon(order.status)}
                          label={order.status.toUpperCase()}
                          size="small"
                          sx={{
                            bgcolor: `${getStatusColor(order.status)}15`,
                            color: getStatusColor(order.status),
                            fontWeight: 600,
                            fontSize: '0.65rem'
                          }}
                        />

                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <InputLabel>Status</InputLabel>
                          <Select
                            value={order.status}
                            label="Status"
                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                            disabled={updatingStatus || order.status === 'delivered' || order.status === 'cancelled'}
                            sx={{
                              borderRadius: '50px',
                              fontSize: '0.8rem',
                              opacity: order.status === 'delivered' || order.status === 'cancelled' ? 0.7 : 1
                            }}
                          >
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="confirmed">Confirmed</MenuItem>
                            <MenuItem value="shipped">Shipped</MenuItem>
                            <MenuItem value="delivered">Delivered</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                          </Select>
                        </FormControl>

                        {/* ✅ FIX: order থেকে chatId বের করা */}
                        <Button
                          component={Link}
                          to={`/chats`}
                          size="small"
                          variant="outlined"
                          startIcon={<Chat />}
                          sx={{ borderRadius: '50px', textTransform: 'none', fontSize: '0.7rem' }}
                        >
                          Chat
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Paper>
        )}

        {/* Products List */}
        <Paper sx={{ mt: 4, p: 3, borderRadius: '16px' }}>
          <Typography variant="h6" fontWeight={600} mb={3}>
            Your Products ({products.length})
          </Typography>

          {products.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">No products listed yet.</Typography>
              <Button
                component={Link}
                to="/add-product"
                variant="outlined"
                sx={{ mt: 2, borderRadius: '50px' }}
              >
                List Your First Product
              </Button>
            </Box>
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <Grid container spacing={2}>
                {products.map((product) => (
                  <Grid item xs={12} key={product._id}>
                    <Paper sx={{
                      p: 2,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 2,
                      '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }
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
                            src={product.images?.[0] || 'https://via.placeholder.com/50x50'}
                            alt={product.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Box>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {product.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ৳{product.price} • {product.category}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={product.status}
                          size="small"
                          color={product.status === 'available' ? 'success' : 'default'}
                          sx={{ fontSize: '0.65rem' }}
                        />
                        <Button
                          component={Link}
                          to={`/product/${product._id}`}
                          size="small"
                          variant="outlined"
                          startIcon={<Visibility />}
                          sx={{ borderRadius: '50px', textTransform: 'none', fontSize: '0.7rem' }}
                        >
                          View
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Edit />}
                          onClick={() => handleEdit(product._id)}
                          sx={{
                            borderRadius: '50px',
                            textTransform: 'none',
                            borderColor: '#4f46e5',
                            color: '#4f46e5',
                            fontSize: '0.7rem'
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Delete />}
                          onClick={() => handleDeleteClick(product)}
                          sx={{
                            borderRadius: '50px',
                            textTransform: 'none',
                            borderColor: '#ef4444',
                            color: '#ef4444',
                            fontSize: '0.7rem'
                          }}
                        >
                          Delete
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Paper>
      </motion.div>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#ef4444' }}>
          Delete Product?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete "{selectedProduct?.title}"?
            <br />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              This action cannot be undone.
            </Typography>
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ borderRadius: '50px' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            disabled={deleting}
            sx={{
              borderRadius: '50px',
              background: '#ef4444',
              '&:hover': { background: '#dc2626' }
            }}
          >
            {deleting ? <CircularProgress size={20} color="inherit" /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default SellerDashboard
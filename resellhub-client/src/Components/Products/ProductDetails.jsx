// frontend/src/components/Products/ProductDetails.jsx
import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import {
  Box, Container, Grid, Typography, Card, CardMedia,
  Chip, Button, Divider, Avatar, Paper,
  Alert, CircularProgress, IconButton, Rating,
  Skeleton, Dialog, DialogContent
} from '@mui/material'
import {
  LocationOn, Phone, Email, ArrowBack,
  Favorite, FavoriteBorder, Star, Share,
  WhatsApp, Telegram, ContentCopy, Check,
  VerifiedUser, Storefront, AccessTime,
  ShoppingCart, Chat, FlashOn
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import BuyNow from '../Orders/BuyNow'

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [favorite, setFavorite] = useState(false)
  const [copied, setCopied] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [buyNowOpen, setBuyNowOpen] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/products/${id}`)
      setProduct(response.data.product)
    } catch (error) {
      setError('Product not found')
    } finally {
      setLoading(false)
    }
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/600x500/4f46e5/ffffff?text=No+Image'
    if (imagePath.startsWith('http')) return imagePath
    return `http://localhost:5000${imagePath}`
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleBuyNow = () => {
    if (!user) {
      toast.error('Please login to buy this product')
      navigate('/login')
      return
    }
    if (user.role === 'seller') {
      toast.error('Sellers cannot buy products')
      return
    }
    setBuyNowOpen(true)
  }

  const handleChat = () => {
    if (!user) {
      toast.error('Please login to chat with seller')
      navigate('/login')
      return
    }
    navigate(`/chat/new/${product._id}/${product.sellerId}`)
  }

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rounded" height={400} sx={{ borderRadius: '20px' }} />
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              {[1, 2, 3, 4].map((_, i) => (
                <Skeleton key={i} variant="rounded" width={80} height={80} sx={{ borderRadius: '12px' }} />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" height={40} width="80%" />
            <Skeleton variant="text" height={30} width="40%" sx={{ mt: 1 }} />
            <Skeleton variant="text" height={50} width="30%" sx={{ mt: 2 }} />
            <Skeleton variant="text" height={20} width="60%" sx={{ mt: 2 }} />
            <Skeleton variant="rounded" height={100} sx={{ mt: 3 }} />
            <Skeleton variant="rounded" height={80} sx={{ mt: 3 }} />
            <Skeleton variant="rounded" height={50} sx={{ mt: 3 }} />
          </Grid>
        </Grid>
      </Container>
    )
  }

  if (error || !product) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '24px' }}>
          <Typography variant="h4" sx={{ mb: 2 }}>😕 Product Not Found</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            The product you're looking for doesn't exist or has been removed.
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="contained"
            startIcon={<ArrowBack />}
            sx={{
              borderRadius: '50px',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              px: 4
            }}
          >
            Back to Home
          </Button>
        </Paper>
      </Container>
    )
  }

  const images = product.images?.length > 0
    ? product.images.map(img => getImageUrl(img))
    : ['https://via.placeholder.com/600x500/4f46e5/ffffff?text=No+Image']

  const isOwner = user?.id === product.sellerId
  const isAvailable = product.status === 'available'

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      <Button
        component={Link}
        to="/"
        startIcon={<ArrowBack />}
        sx={{
          mb: 3,
          color: '#4f46e5',
          fontWeight: 600,
          '&:hover': { background: 'rgba(79,70,229,0.08)' }
        }}
      >
        Back to Products
      </Button>

      <Grid container spacing={4}>
        {/* LEFT: IMAGES */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
              position: 'relative',
              height: { xs: 300, sm: 400, md: 450 }
            }}>
              <AnimatePresence mode='wait'>
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  style={{ height: '100%', width: '100%' }}
                >
                  <CardMedia
                    component="img"
                    image={images[selectedImage]}
                    alt={product.title}
                    sx={{
                      height: '100%',
                      width: '100%',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/600x500/4f46e5/ffffff?text=No+Image'
                    }}
                  />
                </motion.div>
              </AnimatePresence>

              <Chip
                label={product.status === 'available' ? 'Available' : 'Sold'}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  background: product.status === 'available' ? '#10b981' : '#ef4444',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.75rem'
                }}
              />
            </Card>

            {images.length > 1 && (
              <Box sx={{
                display: 'flex',
                gap: 1.5,
                mt: 2,
                overflowX: 'auto',
                pb: 1,
                '&::-webkit-scrollbar': { height: 4 },
                '&::-webkit-scrollbar-thumb': { background: '#4f46e5', borderRadius: '10px' }
              }}>
                {images.map((img, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Box
                      onClick={() => setSelectedImage(index)}
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '12px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: selectedImage === index ? '3px solid #4f46e5' : '2px solid #e2e8f0',
                        transition: 'all 0.3s ease',
                        flexShrink: 0,
                        '&:hover': { borderColor: '#4f46e5' }
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={img}
                        alt={`Thumbnail ${index + 1}`}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/80x80/4f46e5/ffffff?text=No'
                        }}
                      />
                    </Box>
                  </motion.div>
                ))}
              </Box>
            )}
          </motion.div>
        </Grid>

        {/* RIGHT: PRODUCT INFO */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                  color: '#1e293b',
                  flex: 1,
                  mr: 2
                }}
              >
                {product.title}
              </Typography>
              <IconButton
                onClick={() => setFavorite(!favorite)}
                sx={{
                  background: favorite ? 'rgba(239,68,68,0.1)' : 'rgba(0,0,0,0.04)',
                  '&:hover': { background: favorite ? 'rgba(239,68,68,0.2)' : 'rgba(0,0,0,0.08)' },
                  width: 48,
                  height: 48
                }}
              >
                {favorite ? <Favorite color="error" /> : <FavoriteBorder />}
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
              <Chip
                label={product.condition || 'Good'}
                sx={{
                  fontWeight: 600,
                  bgcolor: '#4f46e5',
                  color: 'white',
                  fontSize: '0.75rem'
                }}
              />
              <Chip
                label={product.category || 'Other'}
                variant="outlined"
                sx={{ fontWeight: 600, fontSize: '0.75rem' }}
              />
              <Chip
                icon={<AccessTime sx={{ fontSize: 14 }} />}
                label={`Posted ${new Date(product.createdAt).toLocaleDateString()}`}
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            </Box>

            <Typography
              variant="h2"
              sx={{
                mt: 2,
                fontWeight: 900,
                color: '#4f46e5',
                fontSize: { xs: '2rem', sm: '2.8rem' }
              }}
            >
              ৳{product.price?.toLocaleString()}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
              <LocationOn sx={{ color: '#4f46e5', fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary">
                {product.location || 'Location not specified'}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
              <Rating value={4.5} readOnly size="small" precision={0.5} />
              <Typography variant="body2" color="text.secondary">
                (120 reviews)
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <VerifiedUser sx={{ fontSize: 16, color: '#10b981' }} />
                <Typography variant="caption" color="success.main" fontWeight={600}>
                  Verified Seller
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: '1rem' }}>
              Description
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                whiteSpace: 'pre-wrap',
                lineHeight: 1.8,
                fontSize: '0.95rem'
              }}
            >
              {product.description}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: '1rem' }}>
              Seller Information
            </Typography>
            <Paper sx={{
              p: 2.5,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(79,70,229,0.04), rgba(124,58,237,0.04))',
              border: '1px solid rgba(79,70,229,0.08)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: '#4f46e5',
                    fontWeight: 700,
                    fontSize: '1.2rem'
                  }}
                >
                  {product.sellerName?.charAt(0).toUpperCase() || 'S'}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                    {product.sellerName || 'Seller'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Star sx={{ color: '#f59e0b', fontSize: 16 }} />
                    <Typography variant="body2" color="text.secondary">
                      4.8 (120 reviews)
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Member since 2024
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderRadius: '50px',
                    borderColor: '#4f46e5',
                    color: '#4f46e5',
                    textTransform: 'none',
                    '&:hover': { background: '#4f46e5', color: 'white' }
                  }}
                >
                  View Profile
                </Button>
              </Box>
            </Paper>

            {/* ✅ ACTION BUTTONS - Fixed as per user role */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
              <Grid container spacing={2}>
                {/* ✅ Buyer + Product Available → Buy Now */}
                {!isOwner && isAvailable && user?.role === 'buyer' && (
                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={<FlashOn />}
                      onClick={handleBuyNow}
                      sx={{
                        py: 1.8,
                        borderRadius: '50px',
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        fontSize: '1rem',
                        fontWeight: 700,
                        boxShadow: '0 8px 25px rgba(245,158,11,0.3)',
                        '&:hover': {
                          boxShadow: '0 12px 35px rgba(245,158,11,0.4)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      Buy Now
                    </Button>
                  </Grid>
                )}

                {/* ✅ Only Buyer (Not Owner) → Chat with Seller */}
                {!isOwner && user?.role === 'buyer' && (
                  <Grid item xs={12} sm={isAvailable ? 6 : 12}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      startIcon={<Chat />}
                      onClick={handleChat}
                      sx={{
                        py: 1.8,
                        borderRadius: '50px',
                        borderColor: '#4f46e5',
                        color: '#4f46e5',
                        fontSize: '1rem',
                        fontWeight: 600,
                        '&:hover': {
                          background: 'rgba(79,70,229,0.08)',
                          borderColor: '#4f46e5'
                        }
                      }}
                    >
                      Chat with Seller
                    </Button>
                  </Grid>
                )}

                {/* ✅ Owner (Seller) → View Chats */}
                {isOwner && (
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      startIcon={<Chat />}
                      component={Link}
                      to="/chats"
                      sx={{
                        py: 1.8,
                        borderRadius: '50px',
                        borderColor: '#4f46e5',
                        color: '#4f46e5',
                        fontSize: '1rem',
                        fontWeight: 600,
                        '&:hover': {
                          background: 'rgba(79,70,229,0.08)',
                          borderColor: '#4f46e5'
                        }
                      }}
                    >
                      View Chats
                    </Button>
                  </Grid>
                )}

                {/* ✅ Guest (Not Logged In) → Login to Chat */}
                {!user && (
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      startIcon={<Chat />}
                      onClick={() => {
                        toast.error('Please login to chat with seller')
                        navigate('/login')
                      }}
                      sx={{
                        py: 1.8,
                        borderRadius: '50px',
                        borderColor: '#4f46e5',
                        color: '#4f46e5',
                        fontSize: '1rem',
                        fontWeight: 600,
                        '&:hover': {
                          background: 'rgba(79,70,229,0.08)',
                          borderColor: '#4f46e5'
                        }
                      }}
                    >
                      Login to Chat
                    </Button>
                  </Grid>
                )}
              </Grid>

              {/* Share Buttons - সবাই দেখতে পারবে */}
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                <IconButton
                  onClick={handleCopyLink}
                  sx={{
                    borderRadius: '50px',
                    border: '1px solid #e2e8f0',
                    px: 2,
                    '&:hover': { background: 'rgba(79,70,229,0.08)' }
                  }}
                >
                  {copied ? <Check sx={{ color: '#10b981' }} /> : <ContentCopy />}
                  <Typography variant="caption" sx={{ ml: 0.5 }}>
                    {copied ? 'Copied!' : 'Share'}
                  </Typography>
                </IconButton>
                <IconButton
                  sx={{
                    borderRadius: '50px',
                    border: '1px solid #e2e8f0',
                    '&:hover': { background: '#25D36610', borderColor: '#25D366' }
                  }}
                >
                  <WhatsApp sx={{ color: '#25D366' }} />
                </IconButton>
                <IconButton
                  sx={{
                    borderRadius: '50px',
                    border: '1px solid #e2e8f0',
                    '&:hover': { background: '#0088cc10', borderColor: '#0088cc' }
                  }}
                >
                  <Telegram sx={{ color: '#0088cc' }} />
                </IconButton>
              </Box>
            </Box>

            {/* Safe Shopping Badge */}
            <Paper sx={{
              mt: 3,
              p: 2,
              borderRadius: '12px',
              background: 'rgba(16,185,129,0.06)',
              border: '1px solid rgba(16,185,129,0.12)',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <Storefront sx={{ color: '#10b981' }} />
              <Box>
                <Typography variant="body2" fontWeight={600} color="#065f46">
                  Safe Shopping Guarantee
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  All transactions are secure and verified
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>

      {/* Buy Now Modal */}
      <Dialog
        open={buyNowOpen}
        onClose={() => setBuyNowOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '20px', overflow: 'hidden' } }}
      >
        <DialogContent sx={{ p: 0 }}>
          <BuyNow
            product={product}
            onClose={() => setBuyNowOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Container>
  )
}

export default ProductDetails
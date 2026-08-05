// frontend/src/components/Products/ProductCard.jsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Card, CardMedia, CardContent, Typography, Box, Chip,
  Button, CardActions, IconButton, Skeleton
} from '@mui/material'
import { LocationOn, Favorite, FavoriteBorder } from '@mui/icons-material'
import { motion } from 'framer-motion'

const ProductCard = ({ product, loading }) => {
  const [isFavorite, setIsFavorite] = useState(false)

  if (loading) {
    return (
      <Card sx={{ borderRadius: '16px', overflow: 'hidden', height: '100%' }}>
        <Skeleton variant="rectangular" height={220} />
        <CardContent>
          <Skeleton variant="text" height={30} />
          <Skeleton variant="text" height={20} />
          <Skeleton variant="text" width="60%" />
        </CardContent>
      </Card>
    )
  }

  const imageUrl = product?.images?.[0] 
    ? product.images[0]
    : 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=400'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8 }}
      style={{ height: '100%' }}
    >
      <Card sx={{
        borderRadius: '16px',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        '&:hover': {
          boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
        }
      }}>
        <Box sx={{ 
          position: 'relative', 
          height: 220,
          bgcolor: '#f1f5f9',
          overflow: 'hidden'
        }}>
          <CardMedia
            component="img"
            image={imageUrl}
            alt={product?.title || 'Product'}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'scale(1.05)' }
            }}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=400'
            }}
          />
          
          {product?.condition && (
            <Chip
              label={product.condition}
              size="small"
              sx={{
                position: 'absolute',
                bottom: 10,
                left: 10,
                background: 'rgba(255,255,255,0.95)',
                fontWeight: 700,
                fontSize: '0.7rem',
                backdropFilter: 'blur(10px)',
              }}
            />
          )}
          
          <IconButton
            size="small"
            onClick={() => setIsFavorite(!isFavorite)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
              '&:hover': { background: 'white' },
              width: 32,
              height: 32
            }}
          >
            {isFavorite ? (
              <Favorite sx={{ color: '#ef4444', fontSize: 18 }} />
            ) : (
              <FavoriteBorder sx={{ fontSize: 18 }} />
            )}
          </IconButton>

          {/* ✅ BDT Taka */}
          <Chip
            label={`৳${product?.price?.toLocaleString() || 0}`}
            size="small"
            sx={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.85rem',
              px: 1.5
            }}
          />
        </Box>

        <CardContent sx={{ flex: 1, pb: 1, pt: 1.5 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: '#1e293b',
              fontSize: '0.95rem',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 0.5
            }}
          >
            {product?.title || 'Product Title'}
          </Typography>
          
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontSize: '0.8rem',
              minHeight: '38px',
              lineHeight: 1.4
            }}
          >
            {product?.description?.substring(0, 80) || 'No description available'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, gap: 0.5 }}>
            <LocationOn sx={{ fontSize: 14, color: '#4f46e5' }} />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
              {product?.location || 'Location not specified'}
            </Typography>
          </Box>
        </CardContent>

        <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
          <Button
            component={Link}
            to={`/product/${product?._id}`}
            fullWidth
            variant="contained"
            size="small"
            sx={{
              borderRadius: '50px',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              textTransform: 'none',
              fontSize: '0.8rem',
              fontWeight: 600,
              py: 0.8,
              '&:hover': {
                boxShadow: '0 8px 25px rgba(79,70,229,0.3)',
              }
            }}
          >
            View Details
          </Button>
        </CardActions>
      </Card>
    </motion.div>
  )
}

export default ProductCard
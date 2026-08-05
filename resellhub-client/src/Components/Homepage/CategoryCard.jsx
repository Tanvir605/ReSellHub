// frontend/src/components/Homepage/CategoryCard.jsx
import React from 'react'
import { Paper, Typography, Box } from '@mui/material'
import { motion } from 'framer-motion'

const CategoryCard = ({ category, index }) => {
  const colors = {
    Electronics: '#4f46e5',
    Fashion: '#ec4899',
    Furniture: '#8b5cf6',
    Books: '#f59e0b',
    Vehicles: '#06b6d4',
    Sports: '#10b981',
    Toys: '#f472b6',
    Art: '#a855f7'
  }

  const bgColors = {
    Electronics: '#4f46e520',
    Fashion: '#ec489920',
    Furniture: '#8b5cf620',
    Books: '#f59e0b20',
    Vehicles: '#06b6d420',
    Sports: '#10b98120',
    Toys: '#f472b620',
    Art: '#a855f720'
  }

  const color = colors[category.name] || '#4f46e5'
  const bgColor = bgColors[category.name] || '#4f46e520'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          textAlign: 'center',
          borderRadius: '16px',
          background: bgColor,
          border: '2px solid transparent',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          height: '100%',
          minHeight: { xs: '100px', sm: '120px' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {
            borderColor: color,
            boxShadow: `0 8px 30px ${color}25`,
            background: `${color}10`
          }
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '2.2rem', sm: '3rem' },
            mb: 0.5,
            lineHeight: 1
          }}
        >
          {category.icon}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            fontSize: { xs: '0.8rem', sm: '0.95rem' },
            color: '#1e293b'
          }}
        >
          {category.name}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontSize: '0.65rem',
            display: { xs: 'none', sm: 'block' }
          }}
        >
          {category.count || 'Browse items'}
        </Typography>
      </Paper>
    </motion.div>
  )
}

export default CategoryCard
// frontend/src/components/Common/LoadingSpinner.jsx
import React from 'react'
import { CircularProgress, Box, Typography } from '@mui/material'

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizes = {
    small: 24,
    medium: 40,
    large: 60
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      py: 4,
      minHeight: '200px'
    }}>
      <CircularProgress 
        size={sizes[size] || 40}
        sx={{ 
          color: '#667eea',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          }
        }}
      />
      {text && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {text}
        </Typography>
      )}
    </Box>
  )
}

// ✅ এখানে default export আছে কিনা চেক করুন
export default LoadingSpinner
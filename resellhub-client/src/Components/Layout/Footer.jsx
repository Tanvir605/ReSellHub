// frontend/src/components/Layout/Footer.jsx
import React from 'react'
import { Box, Container, Grid, Typography, Link, IconButton, Divider, TextField, Button } from '@mui/material'
import { 
  Facebook, Twitter, Instagram, LinkedIn, YouTube,
  Storefront, Phone, Email, LocationOn, Send,
  WhatsApp, Telegram
} from '@mui/icons-material'

const Footer = () => {
  return (
    <Box component="footer" sx={{
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255,255,255,0.3)',
      mt: 'auto',
      py: 6
    }}>
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Storefront sx={{ color: '#667eea', mr: 1, fontSize: 32 }} />
              <Typography variant="h4" sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                ReSellHub
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 400 }}>
              India's trusted second-hand marketplace. 
              Buy and sell pre-owned items with confidence. 
              Join thousands of happy users.
            </Typography>
            
            {/* Social Icons */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <IconButton sx={{ 
                color: '#667eea',
                background: 'rgba(102,126,234,0.1)',
                '&:hover': { background: 'rgba(102,126,234,0.2)', transform: 'translateY(-3px)' }
              }}>
                <Facebook />
              </IconButton>
              <IconButton sx={{ 
                color: '#667eea',
                background: 'rgba(102,126,234,0.1)',
                '&:hover': { background: 'rgba(102,126,234,0.2)', transform: 'translateY(-3px)' }
              }}>
                <Twitter />
              </IconButton>
              <IconButton sx={{ 
                color: '#667eea',
                background: 'rgba(102,126,234,0.1)',
                '&:hover': { background: 'rgba(102,126,234,0.2)', transform: 'translateY(-3px)' }
              }}>
                <Instagram />
              </IconButton>
              <IconButton sx={{ 
                color: '#667eea',
                background: 'rgba(102,126,234,0.1)',
                '&:hover': { background: 'rgba(102,126,234,0.2)', transform: 'translateY(-3px)' }
              }}>
                <LinkedIn />
              </IconButton>
              <IconButton sx={{ 
                color: '#667eea',
                background: 'rgba(102,126,234,0.1)',
                '&:hover': { background: 'rgba(102,126,234,0.2)', transform: 'translateY(-3px)' }
              }}>
                <YouTube />
              </IconButton>
              <IconButton sx={{ 
                color: '#25D366',
                background: 'rgba(37,211,102,0.1)',
                '&:hover': { background: 'rgba(37,211,102,0.2)', transform: 'translateY(-3px)' }
              }}>
                <WhatsApp />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#333' }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Link href="#" color="text.secondary" sx={{ 
                textDecoration: 'none', 
                '&:hover': { color: '#667eea', transform: 'translateX(5px)' },
                transition: 'all 0.3s ease'
              }}>
                Browse Products
              </Link>
              <Link href="#" color="text.secondary" sx={{ 
                textDecoration: 'none', 
                '&:hover': { color: '#667eea', transform: 'translateX(5px)' },
                transition: 'all 0.3s ease'
              }}>
                Sell Now
              </Link>
              <Link href="#" color="text.secondary" sx={{ 
                textDecoration: 'none', 
                '&:hover': { color: '#667eea', transform: 'translateX(5px)' },
                transition: 'all 0.3s ease'
              }}>
                How it Works
              </Link>
              <Link href="#" color="text.secondary" sx={{ 
                textDecoration: 'none', 
                '&:hover': { color: '#667eea', transform: 'translateX(5px)' },
                transition: 'all 0.3s ease'
              }}>
                Categories
              </Link>
              <Link href="#" color="text.secondary" sx={{ 
                textDecoration: 'none', 
                '&:hover': { color: '#667eea', transform: 'translateX(5px)' },
                transition: 'all 0.3s ease'
              }}>
                New Arrivals
              </Link>
            </Box>
          </Grid>

          {/* Support */}
          <Grid item xs={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#333' }}>
              Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Link href="#" color="text.secondary" sx={{ 
                textDecoration: 'none', 
                '&:hover': { color: '#667eea', transform: 'translateX(5px)' },
                transition: 'all 0.3s ease'
              }}>
                Help Center
              </Link>
              <Link href="#" color="text.secondary" sx={{ 
                textDecoration: 'none', 
                '&:hover': { color: '#667eea', transform: 'translateX(5px)' },
                transition: 'all 0.3s ease'
              }}>
                Privacy Policy
              </Link>
              <Link href="#" color="text.secondary" sx={{ 
                textDecoration: 'none', 
                '&:hover': { color: '#667eea', transform: 'translateX(5px)' },
                transition: 'all 0.3s ease'
              }}>
                Terms & Conditions
              </Link>
              <Link href="#" color="text.secondary" sx={{ 
                textDecoration: 'none', 
                '&:hover': { color: '#667eea', transform: 'translateX(5px)' },
                transition: 'all 0.3s ease'
              }}>
                FAQ
              </Link>
              <Link href="#" color="text.secondary" sx={{ 
                textDecoration: 'none', 
                '&:hover': { color: '#667eea', transform: 'translateX(5px)' },
                transition: 'all 0.3s ease'
              }}>
                Return Policy
              </Link>
            </Box>
          </Grid>

          {/* Contact & Newsletter */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#333' }}>
              Contact & Newsletter
            </Typography>
            
            {/* Contact Info */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <LocationOn sx={{ color: '#667eea' }} />
                <Typography variant="body2" color="text.secondary">
                  Dattapara, Dhaka
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Phone sx={{ color: '#667eea' }} />
                <Typography variant="body2" color="text.secondary">
                  +8801714974421
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Email sx={{ color: '#667eea' }} />
                <Typography variant="body2" color="text.secondary">
                  support@resellhub.com
                </Typography>
              </Box>
            </Box>

            {/* Newsletter */}
            <Box sx={{ 
              background: 'rgba(102,126,234,0.05)',
              borderRadius: '16px',
              p: 2
            }}>
              <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
                Subscribe to our Newsletter
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  placeholder="Your email"
                  sx={{ 
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      background: 'white'
                    }
                  }}
                />
                <Button 
                  variant="contained"
                  sx={{
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    minWidth: 'auto',
                    px: 2,
                    '&:hover': { transform: 'scale(1.05)' }
                  }}
                >
                  <Send />
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} ReSellHub. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link href="#" color="text.secondary" sx={{ textDecoration: 'none', fontSize: '14px' }}>
              Privacy
            </Link>
            <Link href="#" color="text.secondary" sx={{ textDecoration: 'none', fontSize: '14px' }}>
              Terms
            </Link>
            <Link href="#" color="text.secondary" sx={{ textDecoration: 'none', fontSize: '14px' }}>
              Sitemap
            </Link>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Made with ❤️ in BD
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
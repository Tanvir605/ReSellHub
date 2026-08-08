import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AppBar, Toolbar, Typography, Button, Box, Container,
  Avatar, Menu, MenuItem, IconButton, Badge, Chip, Divider,
  Drawer, List, ListItem, ListItemText, ListItemIcon
} from '@mui/material'
import {
  Storefront, ShoppingBag, AddBox, Dashboard,
  Logout, Person, Notifications, Favorite, Menu as MenuIcon,
  Home, Search, Info, Phone, Login as LoginIcon,
  PersonAdd, Close,
  ShoppingCart,
  Chat
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleMenu = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen)

  const handleLogout = () => {
    logout()
    navigate('/login')
    handleClose()
  }
  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Browse Products', icon: <Search />, path: '/products' },
    ...(user?.role === 'seller' ? [{ text: 'Sell', icon: <AddBox />, path: '/add-product' }] : []),
    ...(user ? [{ text: 'Dashboard', icon: <Dashboard />, path: `/dashboard/${user.role}` }] : []),
    ...(user ? [{ text: 'Messages', icon: <Chat />, path: '/chats' }] : []),
  ]

  const drawer = (
    <Box sx={{ width: 280, p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#667eea' }}>
          ReSellHub
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <Close />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            onClick={handleDrawerToggle}
            sx={{ borderRadius: '12px', mb: 1 }}
          >
            <ListItemIcon sx={{ color: '#667eea' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        {!user && (
          <>
            <ListItem button component={Link} to="/login" onClick={handleDrawerToggle} sx={{ borderRadius: '12px', mb: 1 }}>
              <ListItemIcon sx={{ color: '#667eea' }}><LoginIcon /></ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button component={Link} to="/register" onClick={handleDrawerToggle} sx={{ borderRadius: '12px', mb: 1 }}>
              <ListItemIcon sx={{ color: '#667eea' }}><PersonAdd /></ListItemIcon>
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  )

  return (
    <>
      <AppBar position="sticky" sx={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.3)',
        boxShadow: '0 4px 30px rgba(0,0,0,0.08)',
      }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>

            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ display: { xs: 'block', md: 'none' }, mr: 1 }}
              >
                <MenuIcon sx={{ color: '#667eea' }} />
              </IconButton>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                  <Storefront sx={{ color: '#667eea', mr: 1, fontSize: 32 }} />
                  <Typography variant="h5" sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: { xs: 'none', sm: 'block' }
                  }}>
                    ReSellHub
                  </Typography>
                </Link>
              </motion.div>
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              <Button
                component={Link}
                to="/"
                sx={{
                  color: '#555',
                  fontWeight: 500,
                  borderRadius: '12px',
                  '&:hover': { background: 'rgba(102,126,234,0.1)' }
                }}
              >
                Home
              </Button>
              <Button
                component={Link}
                to="/products"
                sx={{
                  color: '#555',
                  fontWeight: 500,
                  borderRadius: '12px',
                  '&:hover': { background: 'rgba(102,126,234,0.1)' }
                }}
              >
                Browse
              </Button>
              {user?.role === 'seller' && (
                <Button component={Link} to="/add-product" sx={{
                  color: '#555',
                  fontWeight: 500,
                  borderRadius: '12px',
                  '&:hover': { background: 'rgba(102,126,234,0.1)' }
                }}>
                  Sell
                </Button>
              )}
              {user && (
                <Button component={Link} to={`/dashboard/${user.role}`} sx={{
                  color: '#555',
                  fontWeight: 500,
                  borderRadius: '12px'
                }}>
                  Dashboard
                </Button>
              )}
            </Box>

            {/* Right Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {user ? (
                <>
                  <IconButton sx={{ color: '#555' }}>
                    <Badge badgeContent={0} color="primary">
                      <Favorite />
                    </Badge>
                  </IconButton>
                  <IconButton sx={{ color: '#555' }}>
                    <Badge badgeContent={0} color="primary">
                      <Notifications />
                    </Badge>
                  </IconButton>

                  <Button onClick={handleMenu} sx={{
                    textTransform: 'none',
                    color: '#333',
                    borderRadius: '50px',
                    px: 1,
                    '&:hover': { background: 'rgba(102,126,234,0.08)' }
                  }}>
                    <Avatar sx={{
                      width: 40, height: 40,
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      boxShadow: '0 4px 15px rgba(102,126,234,0.3)'
                    }}>
                      {user.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}>
                      <Typography variant="body2" fontWeight={600}>{user.name}</Typography>
                      <Chip label={user.role} size="small" sx={{
                        height: 18, fontSize: '10px', fontWeight: 700,
                        background: user.role === 'seller'
                          ? 'linear-gradient(135deg, #667eea, #764ba2)'
                          : 'linear-gradient(135deg, #4facfe, #00f2fe)',
                        color: 'white'
                      }} />
                    </Box>
                  </Button>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        minWidth: 220,
                        borderRadius: '16px',
                        background: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
                        p: 1
                      }
                    }}
                  >
                    <MenuItem component={Link} to={`/dashboard/${user.role}`} onClick={handleClose} sx={{ borderRadius: '10px' }}>
                      <Dashboard sx={{ mr: 2, color: '#667eea' }} /> Dashboard
                    </MenuItem>
                    {user.role === 'seller' && (
                      <MenuItem component={Link} to="/add-product" onClick={handleClose} sx={{ borderRadius: '10px' }}>
                        <AddBox sx={{ mr: 2, color: '#667eea' }} /> Add Product
                      </MenuItem>
                    )}
                    <MenuItem component={Link} to="/orders/buyer" onClick={handleClose}>
                      <ShoppingCart sx={{ mr: 2, color: '#667eea' }} /> My Orders
                    </MenuItem>
                    <MenuItem component={Link} to="/chats" onClick={handleClose}>
                      <Chat sx={{ mr: 2, color: '#667eea' }} /> Messages
                    </MenuItem>
                    <Divider sx={{ my: 1 }} />
                    <MenuItem onClick={handleLogout} sx={{
                      borderRadius: '10px',
                      color: '#f44336',
                      '&:hover': { background: 'rgba(244,67,54,0.08)' }
                    }}>
                      <Logout sx={{ mr: 2 }} /> Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button component={Link} to="/login" variant="outlined" sx={{
                    borderRadius: '50px',
                    borderColor: '#667eea',
                    color: '#667eea',
                    px: 3,
                    '&:hover': {
                      borderColor: '#764ba2',
                      background: 'rgba(102,126,234,0.05)',
                      transform: 'translateY(-2px)'
                    }
                  }}>
                    Login
                  </Button>
                  <Button component={Link} to="/register" variant="contained" sx={{
                    borderRadius: '50px',
                    px: 3,
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    boxShadow: '0 4px 15px rgba(102,126,234,0.3)',
                    '&:hover': {
                      boxShadow: '0 8px 25px rgba(102,126,234,0.4)',
                      transform: 'translateY(-2px)'
                    }
                  }}>
                    Get Started
                  </Button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        PaperProps={{ sx: { background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)' } }}
      >
        {drawer}
      </Drawer>
    </>
  )
}

export default Navbar
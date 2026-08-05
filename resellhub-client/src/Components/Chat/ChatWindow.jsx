// frontend/src/components/Chat/ChatWindow.jsx
import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Box, Container, Paper, Typography, TextField, Button,
  Avatar, List, ListItem, CircularProgress, Chip,
  Alert, IconButton
} from '@mui/material'
import { 
  Send, ArrowBack, Chat
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

const ChatWindow = () => {
  const { chatId, productId, sellerId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [chat, setChat] = useState(null)
  const [product, setProduct] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [buyerName, setBuyerName] = useState('Buyer')
  const [sellerName, setSellerName] = useState('Seller')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (chatId || (productId && sellerId)) {
      fetchChatAndProduct()
    }
  }, [chatId, productId, sellerId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchChatAndProduct = async () => {
    setLoading(true)
    setError('')
    try {
      let chatData

      if (chatId) {
        // ✅ Existing chat - chatId দিয়ে fetch
        const chatRes = await api.get(`/chats/${chatId}`)
        chatData = chatRes.data
        console.log('✅ Chat loaded by chatId:', chatData)
      } else if (productId && sellerId) {
        // ✅ New chat - productId এবং sellerId দিয়ে create or get
        const chatRes = await api.post('/chats', { 
          productId, 
          sellerId 
        })
        chatData = chatRes.data
        console.log('✅ Chat loaded by productId/sellerId:', chatData)
      } else {
        throw new Error('Invalid chat parameters')
      }

      setChat(chatData)
      
      // ✅ পুরো messages array সেট করো
      const allMessages = chatData.messages || []
      setMessages(allMessages)
      console.log('📝 Total Messages:', allMessages.length)

      // Product details fetch
      const productRes = await api.get(`/products/${chatData.productId}`)
      setProduct(productRes.data.product)
      setSellerName(productRes.data.product.sellerName || 'Seller')

      // Buyer name set
      if (chatData.buyerId !== user?.id) {
        try {
          const buyerRes = await api.get(`/users/${chatData.buyerId}`)
          setBuyerName(buyerRes.data?.name || 'Buyer')
        } catch {
          setBuyerName('Buyer')
        }
      } else {
        setBuyerName(user?.name || 'You')
      }

      // Mark messages as read
      if (chatData._id) {
        await markAsRead(chatData._id)
      }
    } catch (error) {
      console.error('❌ Error:', error)
      setError('Failed to load chat')
      toast.error('Failed to load chat')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (chatId) => {
    try {
      await api.put(`/chats/${chatId}/read`)
    } catch (error) {
      console.error('Error marking messages as read:', error)
    }
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return
    if (!chat?._id) {
      toast.error('Chat not initialized')
      return
    }

    setSending(true)
    try {
      const response = await api.post(`/chats/${chat._id}/messages`, {
        message: newMessage.trim()
      })
      
      const newMsg = response.data.message || response.data
      console.log('📝 New Message Sent:', newMsg)
      
      // ✅ নতুন message যোগ করো
      setMessages(prev => [...prev, newMsg])
      setNewMessage('')
      scrollToBottom()
    } catch (error) {
      console.error('❌ Error sending message:', error)
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const getSenderName = (senderId) => {
    if (senderId === user?.id) return 'You'
    if (chat?.buyerId === senderId) return buyerName
    if (chat?.sellerId === senderId) return sellerName
    return 'User'
  }

  const getSenderType = (senderId) => {
    if (senderId === user?.id) return 'you'
    if (chat?.buyerId === senderId) return 'buyer'
    if (chat?.sellerId === senderId) return 'seller'
    return 'other'
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress sx={{ color: '#4f46e5' }} />
      </Box>
    )
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: '12px' }}>
          {error}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3, height: '80vh' }}>
      <Paper sx={{ 
        borderRadius: '20px', 
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 8px 40px rgba(0,0,0,0.06)'
      }}>
        {/* Header */}
        <Box sx={{
          p: 2,
          bgcolor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexShrink: 0
        }}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          
          {product && (
            <>
              <Box sx={{ 
                width: 44, 
                height: 44, 
                borderRadius: '8px', 
                overflow: 'hidden',
                bgcolor: '#e2e8f0',
                flexShrink: 0
              }}>
                <img 
                  src={product.images?.[0] || 'https://via.placeholder.com/44x44'}
                  alt={product.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body1" fontWeight={600} noWrap>
                  {product.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ৳{product.price} • {product.condition}
                </Typography>
              </Box>
              <Chip
                label={product.status === 'available' ? 'Available' : 'Sold'}
                color={product.status === 'available' ? 'success' : 'default'}
                size="small"
              />
            </>
          )}
        </Box>

        {/* Messages - সব messages দেখাবে */}
        <Box sx={{ 
          flex: 1, 
          overflowY: 'auto', 
          p: 2,
          bgcolor: '#f8fafc',
          minHeight: 0
        }}>
          {messages.length === 0 ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#94a3b8',
              gap: 1
            }}>
              <Chat sx={{ fontSize: 48, opacity: 0.3 }} />
              <Typography variant="body1" fontWeight={500}>
                No messages yet
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Start chatting about this product
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              <AnimatePresence>
                {messages.map((msg, index) => {
                  const isOwn = msg.senderId === user?.id
                  const senderName = getSenderName(msg.senderId)
                  const senderType = getSenderType(msg.senderId)
                  
                  let bgColor = 'white'
                  let textColor = '#1e293b'
                  let nameColor = '#64748b'
                  
                  if (isOwn) {
                    bgColor = '#4f46e5'
                    textColor = 'white'
                    nameColor = '#818cf8'
                  } else if (senderType === 'buyer') {
                    bgColor = '#ecfdf5'
                    textColor = '#065f46'
                    nameColor = '#10b981'
                  } else if (senderType === 'seller') {
                    bgColor = '#eff6ff'
                    textColor = '#1e40af'
                    nameColor = '#3b82f6'
                  }
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ListItem sx={{ 
                        flexDirection: 'column',
                        alignItems: isOwn ? 'flex-end' : 'flex-start',
                        px: 1,
                        py: 0.5
                      }}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontWeight: 700,
                            color: nameColor,
                            mb: 0.3,
                            px: 1,
                            fontSize: '0.7rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}
                        >
                          {senderName}
                          {isOwn && ' (You)'}
                          {!isOwn && senderType === 'buyer' && ' (Buyer)'}
                          {!isOwn && senderType === 'seller' && ' (Seller)'}
                        </Typography>
                        
                        <Box sx={{
                          maxWidth: '75%',
                          bgcolor: bgColor,
                          color: textColor,
                          p: 1.5,
                          borderRadius: '12px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                          wordWrap: 'break-word',
                          borderBottomRightRadius: isOwn ? '4px' : '12px',
                          borderBottomLeftRadius: isOwn ? '12px' : '4px',
                          border: !isOwn ? '1px solid #e2e8f0' : 'none'
                        }}>
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                            {msg.message}
                          </Typography>
                          <Typography variant="caption" sx={{
                            display: 'block',
                            textAlign: 'right',
                            mt: 0.5,
                            opacity: 0.7,
                            fontSize: '0.6rem'
                          }}>
                            {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}
                          </Typography>
                        </Box>
                      </ListItem>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </List>
          )}
        </Box>

        {/* Input */}
        <Box sx={{
          p: 2,
          bgcolor: 'white',
          borderTop: '1px solid #e2e8f0',
          flexShrink: 0
        }}>
          <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={sending}
              InputProps={{
                sx: { borderRadius: '50px' }
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={sending || !newMessage.trim()}
              sx={{
                borderRadius: '50px',
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                minWidth: 'auto',
                px: 3,
                '&:hover': { transform: 'scale(1.02)' }
              }}
            >
              {sending ? <CircularProgress size={22} color="inherit" /> : <Send />}
            </Button>
          </form>
        </Box>
      </Paper>
    </Container>
  )
}

export default ChatWindow
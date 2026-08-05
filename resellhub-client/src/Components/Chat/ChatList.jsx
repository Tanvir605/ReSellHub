// frontend/src/components/Chat/ChatList.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Box, Container, Typography, Paper, List, ListItem,
  ListItemAvatar, Avatar, ListItemText, Badge, Chip,
  CircularProgress, Divider
} from '@mui/material'
import { Chat } from '@mui/icons-material'
import { motion } from 'framer-motion'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

const ChatList = () => {
  const { user } = useAuth()
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChats()
  }, [])

  const fetchChats = async () => {
    try {
      const response = await api.get('/chats')
      console.log('📥 Chats Response:', response.data)
      
      // Group unique chats by productId
      const chatMap = new Map()
      response.data.forEach(chat => {
        const key = chat.productId
        if (!chatMap.has(key) || chat.updatedAt > chatMap.get(key).updatedAt) {
          chatMap.set(key, chat)
        }
      })
      
      const uniqueChats = Array.from(chatMap.values())
      setChats(uniqueChats)
    } catch (error) {
      console.error('❌ Error fetching chats:', error)
      toast.error('Failed to load chats')
    } finally {
      setLoading(false)
    }
  }

  const getOtherUserName = (chat) => {
    if (!user) return 'User'
    const isBuyer = chat.buyerId === user?.id
    if (isBuyer) {
      return chat.sellerName || chat.otherUser?.name || 'Seller'
    } else {
      return chat.buyerName || chat.otherUser?.name || 'Buyer'
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#4f46e5' }} />
      </Box>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
        Messages 💬
      </Typography>

      {chats.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '20px' }}>
          <Chat sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
          <Typography variant="h5" color="text.secondary">
            No messages yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start chatting with sellers about their products
          </Typography>
        </Paper>
      ) : (
        <Paper sx={{ borderRadius: '16px', overflow: 'hidden' }}>
          <List>
            {chats.map((chat, index) => {
              const otherName = getOtherUserName(chat)
              const lastMessage = chat.messages && chat.messages.length > 0 
                ? chat.messages[chat.messages.length - 1] 
                : null
              const unreadCount = chat.messages?.filter(
                msg => msg.senderId !== user?.id && !msg.read
              ).length || 0
              const productTitle = chat.product?.title || 'Unknown Product'

              return (
                <motion.div
                  key={chat._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ListItem
                    component={Link}
                    to={`/chat/${chat._id}`}
                    button
                    sx={{
                      py: 2,
                      px: 3,
                      '&:hover': { bgcolor: '#f8fafc' }
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        color="primary"
                        variant="dot"
                        invisible={unreadCount === 0}
                      >
                        <Avatar sx={{ bgcolor: '#4f46e5' }}>
                          {otherName?.charAt(0).toUpperCase() || 'U'}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body1" fontWeight={600}>
                            {otherName}
                          </Typography>
                          {unreadCount > 0 && (
                            <Chip
                              label={unreadCount}
                              size="small"
                              sx={{
                                bgcolor: '#4f46e5',
                                color: 'white',
                                fontWeight: 700,
                                height: 20,
                                fontSize: '0.65rem'
                              }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {productTitle}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {lastMessage 
                              ? `${lastMessage.senderId === user?.id ? 'You: ' : ''}${lastMessage.message?.substring(0, 40)}` 
                              : 'No messages yet'}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < chats.length - 1 && <Divider />}
                </motion.div>
              )
            })}
          </List>
        </Paper>
      )}
    </Container>
  )
}

export default ChatList
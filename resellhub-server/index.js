// backend/index.js - COMPLETE BACKEND WITH IMGBB
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============ MIDDLEWARE ============
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============ STATIC FILES ============
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============ DATABASE CONNECTION ============
let db;
let client;

const connectDB = async () => {
  try {
    client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/resellhub');
    await client.connect();
    db = client.db(process.env.MONGODB_NAME || 'resellhub');
    console.log('✅ MongoDB connected successfully');
    
    // Create indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('products').createIndex({ title: 'text', description: 'text' });
    await db.collection('products').createIndex({ sellerId: 1 });
    await db.collection('products').createIndex({ category: 1 });
    await db.collection('products').createIndex({ status: 1 });
    
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// ============ MULTER SETUP ============
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'), false);
    }
  }
});

// ============ IMGBB UPLOAD FUNCTION ============
const uploadToImgBB = async (imagePath) => {
  try {
    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath));
    
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      formData,
      {
        headers: {
          ...formData.getHeaders()
        },
        timeout: 30000
      }
    );
    
    return response.data.data.url;
  } catch (error) {
    console.error('ImgBB upload error:', error.response?.data || error.message);
    return null;
  }
};

// ============ AUTH MIDDLEWARE ============
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = user;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Access denied. Need ' + role + ' role' });
    }
    next();
  };
};

// ============ AUTH ROUTES ============

// REGISTER
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, location } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      name, email, password: hashedPassword,
      role: role || 'buyer', phone: phone || '', location: location || '',
      createdAt: new Date(), isVerified: false, profileImage: '', rating: 0, totalSales: 0
    };
    const result = await db.collection('users').insertOne(userData);
    const token = jwt.sign({ userId: result.insertedId }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '7d' });
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: result.insertedId, name: userData.name, email: userData.email, role: userData.role }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message });
  }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '7d' });
    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, location: user.location }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET PROFILE
app.get('/api/auth/profile', auth, async (req, res) => {
  try {
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(req.userId) },
      { projection: { password: 0 } }
    );
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE PROFILE
app.put('/api/auth/profile', auth, async (req, res) => {
  try {
    const { name, phone, location, profileImage } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (location) updateData.location = location;
    if (profileImage) updateData.profileImage = profileImage;
    updateData.updatedAt = new Date();
    await db.collection('users').updateOne(
      { _id: new ObjectId(req.userId) },
      { $set: updateData }
    );
    const updatedUser = await db.collection('users').findOne(
      { _id: new ObjectId(req.userId) },
      { projection: { password: 0 } }
    );
    res.json({ message: 'Profile updated', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET USER BY ID
app.get('/api/users/:userId', auth, async (req, res) => {
  try {
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(req.params.userId) },
      { projection: { password: 0, email: 0 } }
    )
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// ============ PRODUCT ROUTES ============

// GET ALL PRODUCTS
app.get('/api/products', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, minPrice, maxPrice, search, status = 'available', sortBy = 'newest' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = { status: status };
    if (category && category !== 'all') query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    let sortOption = { createdAt: -1 };
    if (sortBy === 'price-low') sortOption = { price: 1 };
    if (sortBy === 'price-high') sortOption = { price: -1 };
    if (sortBy === 'oldest') sortOption = { createdAt: 1 };
    const products = await db.collection('products').find(query).sort(sortOption).skip(skip).limit(parseInt(limit)).toArray();
    for (let product of products) {
      const seller = await db.collection('users').findOne(
        { _id: new ObjectId(product.sellerId) },
        { projection: { name: 1, email: 1, rating: 1 } }
      );
      product.seller = seller;
    }
    const total = await db.collection('products').countDocuments(query);
    res.json({
      products,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET PRODUCT BY ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await db.collection('products').findOne({ _id: new ObjectId(req.params.id) });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const seller = await db.collection('users').findOne(
      { _id: new ObjectId(product.sellerId) },
      { projection: { name: 1, email: 1, phone: 1, location: 1, rating: 1, profileImage: 1 } }
    );
    product.seller = seller;
    const similarProducts = await db.collection('products')
      .find({ category: product.category, _id: { $ne: new ObjectId(req.params.id) }, status: 'available' })
      .limit(4).toArray();
    res.json({ product, similarProducts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ CREATE PRODUCT WITH IMGBB ============
app.post('/api/products', auth, requireRole('seller'), upload.array('images', 5), async (req, res) => {
  try {
    const { title, description, price, category, condition, location } = req.body;

    if (!title || !description || !price || !category || !condition) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Upload images to ImgBB
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      console.log(`📸 Uploading ${req.files.length} images to ImgBB...`);
      for (const file of req.files) {
        const imageUrl = await uploadToImgBB(file.path);
        if (imageUrl) {
          imageUrls.push(imageUrl);
          console.log(`✅ Uploaded: ${imageUrl}`);
        } else {
          console.log(`❌ Failed to upload: ${file.filename}`);
        }
        // Delete local file after upload
        try {
          fs.unlinkSync(file.path);
        } catch (err) {
          console.error('Error deleting file:', err);
        }
      }
    }

    if (imageUrls.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    const productData = {
      title,
      description,
      price: parseFloat(price),
      category,
      condition,
      location: location || req.user.location || '',
      images: imageUrls,  // ImgBB URLs
      sellerId: new ObjectId(req.userId),
      sellerName: req.user.name,
      status: 'available',
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('products').insertOne(productData);
    const product = { ...productData, _id: result.insertedId };

    res.status(201).json({
      message: 'Product listed successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET SELLER'S PRODUCTS
app.get('/api/products/seller/my-products', auth, requireRole('seller'), async (req, res) => {
  try {
    const products = await db.collection('products')
      .find({ sellerId: new ObjectId(req.userId) })
      .sort({ createdAt: -1 })
      .toArray();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE PRODUCT
app.put('/api/products/:id', auth, requireRole('seller'), async (req, res) => {
  try {
    const product = await db.collection('products').findOne({ _id: new ObjectId(req.params.id) });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.sellerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const { title, description, price, category, condition, location, status } = req.body;
    const updateData = { updatedAt: new Date() };
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (price) updateData.price = parseFloat(price);
    if (category) updateData.category = category;
    if (condition) updateData.condition = condition;
    if (location) updateData.location = location;
    if (status) updateData.status = status;
    await db.collection('products').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );
    const updatedProduct = await db.collection('products').findOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE PRODUCT
app.delete('/api/products/:id', auth, requireRole('seller'), async (req, res) => {
  try {
    const product = await db.collection('products').findOne({ _id: new ObjectId(req.params.id) });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.sellerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await db.collection('products').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ CATEGORIES ROUTE ============
app.get('/api/categories', async (req, res) => {
  try {
    const categories = ['Electronics', 'Fashion', 'Furniture', 'Books', 'Vehicles', 'Real Estate', 'Sports', 'Toys', 'Art & Collectibles', 'Other'];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ DASHBOARD STATS ============

app.get('/api/dashboard/buyer/stats', auth, requireRole('buyer'), async (req, res) => {
  try {
    const totalProducts = await db.collection('products').countDocuments({ status: 'available' });
    const recentProducts = await db.collection('products').find({ status: 'available' }).sort({ createdAt: -1 }).limit(6).toArray();
    res.json({ totalProducts, recentProducts, categories: await db.collection('products').distinct('category') });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/dashboard/seller/stats', auth, requireRole('seller'), async (req, res) => {
  try {
    const sellerId = new ObjectId(req.userId);

    const totalListings = await db.collection('products').countDocuments({ sellerId });
    const activeListings = await db.collection('products').countDocuments({ 
      sellerId, 
      status: 'available' 
    });
    const soldListings = await db.collection('products').countDocuments({ 
      sellerId, 
      status: 'sold' 
    });

    // ✅ Revenue Calculation - শুধু 'delivered' status এর order থেকে
    const deliveredOrders = await db.collection('orders')
      .find({ 
        sellerId: sellerId, 
        status: 'delivered' 
      })
      .toArray();
    
    const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Get recent listings
    const recentListings = await db.collection('products')
      .find({ sellerId })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    res.json({
      stats: {
        totalListings,
        activeListings,
        soldListings,
        totalRevenue: totalRevenue  // ✅ এখানে revenue যোগ করো
      },
      recentListings
    });
  } catch (error) {
    console.error('❌ Get seller stats error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============ ROOT ROUTES ============
app.get('/', (req, res) => {
  res.json({
    name: 'ReSellHub API',
    version: '1.0.0',
    status: '🟢 Server is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: db ? 'connected' : 'disconnected'
  });
});

// ============ ORDER ROUTES ============

// CREATE ORDER (Buyer)
app.post('/api/orders', auth, requireRole('buyer'), async (req, res) => {
  try {
    const { productId, quantity, shippingAddress, phone, notes } = req.body;

    // Get product details
    const product = await db.collection('products').findOne({
      _id: new ObjectId(productId)
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.status !== 'available') {
      return res.status(400).json({ message: 'Product is not available' });
    }

    const totalAmount = product.price * (quantity || 1);

    const orderData = {
      buyerId: new ObjectId(req.userId),
      sellerId: product.sellerId,
      productId: new ObjectId(productId),
      productTitle: product.title,
      productPrice: product.price,
      productImage: product.images?.[0] || '',
      quantity: quantity || 1,
      totalAmount: totalAmount,
      status: 'pending',
      shippingAddress: shippingAddress || req.user.location || '',
      phone: phone || req.user.phone || '',
      notes: notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('orders').insertOne(orderData);

    // Update product status to 'sold'
    await db.collection('products').updateOne(
      { _id: new ObjectId(productId) },
      { $set: { status: 'sold', updatedAt: new Date() } }
    );

    res.status(201).json({
      message: 'Order placed successfully',
      order: { ...orderData, _id: result.insertedId }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET BUYER'S ORDERS
app.get('/api/orders/buyer', auth, requireRole('buyer'), async (req, res) => {
  try {
    const orders = await db.collection('orders')
      .find({ buyerId: new ObjectId(req.userId) })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET SELLER'S ORDERS
app.get('/api/orders/seller', auth, requireRole('seller'), async (req, res) => {
  try {
    const orders = await db.collection('orders')
      .find({ sellerId: new ObjectId(req.userId) })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE ORDER STATUS (Seller)
app.put('/api/orders/:orderId/status', auth, requireRole('seller'), async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.orderId;

    const order = await db.collection('orders').findOne({
      _id: new ObjectId(orderId),
      sellerId: new ObjectId(req.userId)
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found or unauthorized' });
    }

    // ✅ যদি আগে থেকে Delivered হয়ে থাকে, তাহলে আর Change করা যাবে না
    if (order.status === 'delivered') {
      return res.status(400).json({ 
        message: 'Order is already delivered. Status cannot be changed.' 
      });
    }

    // ✅ যদি Cancelled হয়ে থাকে, তাহলে আর Change করা যাবে না
    if (order.status === 'cancelled') {
      return res.status(400).json({ 
        message: 'Order is cancelled. Status cannot be changed.' 
      });
    }

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // ✅ Delivered থেকে অন্য কোনো status এ যেতে পারবে না
    if (order.status === 'delivered' && status !== 'delivered') {
      return res.status(400).json({ 
        message: 'Cannot change status of delivered order' 
      });
    }

    await db.collection('orders').updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { status, updatedAt: new Date() } }
    );

    // ✅ যদি status 'delivered' হয়, তাহলে product status 'sold' করুন
    if (status === 'delivered') {
      await db.collection('products').updateOne(
        { _id: order.productId },
        { $set: { status: 'sold', updatedAt: new Date() } }
      );
    }

    // ✅ যদি status 'cancelled' হয়, তাহলে product status 'available' করুন
    if (status === 'cancelled') {
      await db.collection('products').updateOne(
        { _id: order.productId },
        { $set: { status: 'available', updatedAt: new Date() } }
      );
    }

    res.json({ 
      message: 'Order status updated successfully',
      status: status 
    });
  } catch (error) {
    console.error('❌ Update order status error:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET ORDER DETAILS
app.get('/api/orders/:orderId', auth, async (req, res) => {
  try {
    const order = await db.collection('orders').findOne({
      _id: new ObjectId(req.params.orderId)
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is buyer or seller
    if (order.buyerId.toString() !== req.userId && order.sellerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE OR GET CHAT - ✅ FIXED
app.post('/api/chats', auth, async (req, res) => {
  try {
    const { productId, sellerId } = req.body;
    const buyerId = req.userId;

    console.log('📝 Chat Request:', { productId, sellerId, buyerId, userId: req.userId });

    // ✅ Check if chat already exists (both buyer and seller same chat)
    let chat = await db.collection('chats').findOne({
      productId: new ObjectId(productId),
      $or: [
        { buyerId: new ObjectId(buyerId), sellerId: new ObjectId(sellerId) },
        { buyerId: new ObjectId(sellerId), sellerId: new ObjectId(buyerId) }
      ]
    });

    console.log('🔍 Existing Chat:', chat);

    if (!chat) {
      const chatData = {
        productId: new ObjectId(productId),
        buyerId: new ObjectId(buyerId),
        sellerId: new ObjectId(sellerId),
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const result = await db.collection('chats').insertOne(chatData);
      chat = { ...chatData, _id: result.insertedId };
      console.log('✅ New Chat Created:', chat._id);
    } else {
      console.log('✅ Existing Chat Found:', chat._id);
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error('❌ Chat error:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET CHAT BY ID - ✅ FIXED
app.get('/api/chats/:chatId', auth, async (req, res) => {
  try {
    const chatId = req.params.chatId;
    console.log('📥 Fetching Chat:', chatId, 'User:', req.userId);

    const chat = await db.collection('chats').findOne({
      _id: new ObjectId(chatId)
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // ✅ Check if user is buyer or seller
    if (chat.buyerId.toString() !== req.userId && chat.sellerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    console.log(`📤 Chat Found: ${chat._id}, Messages: ${chat.messages?.length || 0}`);

    res.json(chat);
  } catch (error) {
    console.error('❌ Get chat error:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET ALL CHATS FOR USER - ✅ FIXED
app.get('/api/chats', auth, async (req, res) => {
  try {
    console.log('📥 Fetching all chats for user:', req.userId);

    const chats = await db.collection('chats')
      .find({
        $or: [
          { buyerId: new ObjectId(req.userId) },
          { sellerId: new ObjectId(req.userId) }
        ]
      })
      .sort({ updatedAt: -1 })
      .toArray();

    console.log(`📤 Chats Found: ${chats.length}`);

    // Get product details and user info for each chat
    const enrichedChats = await Promise.all(chats.map(async (chat) => {
      // Get product
      const product = await db.collection('products').findOne({
        _id: chat.productId
      });
      
      // ✅ Get buyer info
      const buyer = await db.collection('users').findOne(
        { _id: chat.buyerId },
        { projection: { name: 1, email: 1, profileImage: 1 } }
      );
      
      // ✅ Get seller info
      const seller = await db.collection('users').findOne(
        { _id: chat.sellerId },
        { projection: { name: 1, email: 1, profileImage: 1 } }
      );
      
      // ✅ Determine other user
      const isBuyer = chat.buyerId.toString() === req.userId;
      const otherUser = isBuyer ? seller : buyer;
      
      // Count unread messages
      const unreadCount = chat.messages?.filter(
        msg => msg.senderId.toString() !== req.userId && !msg.read
      ).length || 0;

      // Get last message
      const lastMessage = chat.messages?.length > 0 
        ? chat.messages[chat.messages.length - 1] 
        : null;

      return {
        ...chat,
        product,
        buyerName: buyer?.name || 'Buyer',
        sellerName: seller?.name || 'Seller',
        otherUser: otherUser || { name: isBuyer ? 'Seller' : 'Buyer' },
        unreadCount,
        lastMessage
      };
    }));

    res.json(enrichedChats);
  } catch (error) {
    console.error('❌ Get chats error:', error);
    res.status(500).json({ message: error.message });
  }
});
// SEND MESSAGE - ✅ FIXED
app.post('/api/chats/:chatId/messages', auth, async (req, res) => {
  try {
    const { message } = req.body;
    const chatId = req.params.chatId;

    console.log('📝 Sending message:', { chatId, message, userId: req.userId });

    if (!message || message.trim() === '') {
      return res.status(400).json({ message: 'Message is required' });
    }

    const chat = await db.collection('chats').findOne({
      _id: new ObjectId(chatId)
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // ✅ Check if user is buyer or seller
    if (chat.buyerId.toString() !== req.userId && chat.sellerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const senderType = chat.buyerId.toString() === req.userId ? 'buyer' : 'seller';

    const newMessage = {
      senderId: new ObjectId(req.userId),
      senderType: senderType,
      message: message.trim(),
      timestamp: new Date(),
      read: false
    };

    console.log('💬 New Message:', newMessage);

    const result = await db.collection('chats').updateOne(
      { _id: new ObjectId(chatId) },
      {
        $push: { messages: newMessage },
        $set: { updatedAt: new Date() }
      }
    );

    console.log('✅ Message saved:', result.modifiedCount);

    // ✅ Return the updated chat with new message
    const updatedChat = await db.collection('chats').findOne({
      _id: new ObjectId(chatId)
    });

    res.status(201).json({
      message: newMessage,
      chat: updatedChat
    });
  } catch (error) {
    console.error('❌ Send message error:', error);
    res.status(500).json({ message: error.message });
  }
});

// MARK MESSAGES AS READ - ✅ FIXED
app.put('/api/chats/:chatId/read', auth, async (req, res) => {
  try {
    const chatId = req.params.chatId;

    console.log('📖 Marking messages as read:', chatId, 'User:', req.userId);

    const result = await db.collection('chats').updateOne(
      { 
        _id: new ObjectId(chatId),
        'messages.senderId': { $ne: new ObjectId(req.userId) }
      },
      {
        $set: { 'messages.$[].read': true }
      }
    );

    console.log('✅ Messages marked as read:', result.modifiedCount);

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('❌ Mark read error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============ START SERVER ============
connectDB().then(() => {
  const fs = require('fs');
  if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
  }
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📋 API Endpoints:`);
    console.log(`   POST   /api/auth/register - Register`);
    console.log(`   POST   /api/auth/login - Login`);
    console.log(`   GET    /api/products - Get all products`);
    console.log(`   POST   /api/products - Create product (with ImgBB upload)`);
    console.log(`   GET    /api/products/:id - Get product by ID`);
    console.log(`   PUT    /api/products/:id - Update product`);
    console.log(`   DELETE /api/products/:id - Delete product`);
  });
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

process.on('SIGINT', async () => {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
  process.exit(0);
});
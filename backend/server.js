const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'your-secret-key-change-this-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve your HTML/CSS/JS files

// In-memory storage (replace with a real database like MongoDB or MySQL in production)
let users = [];
let products = [
  {
    id: 1,
    name: "Smartphone",
    price: 599,
    description: "Latest smartphone with amazing features",
    image: "smartphone.jpg",
    category: "electronics",
    stock: 50
  },
  {
    id: 2,
    name: "Laptop",
    price: 999,
    description: "High-performance laptop for work and gaming",
    image: "laptop.jpg",
    category: "electronics",
    stock: 30
  },
  {
    id: 3,
    name: "T-Shirt",
    price: 25,
    description: "Comfortable cotton t-shirt",
    image: "tshirt.jpg",
    category: "clothing",
    stock: 100
  }
];
let orders = [];
let nextProductId = 4;
let nextOrderId = 1;

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// AUTH ROUTES

// Register user
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: users.length + 1,
      username,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };

    users.push(newUser);

    // Generate token
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: newUser.id, username, email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login user
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PRODUCT ROUTES

// Get all products
app.get('/api/products', (req, res) => {
  const { category, search } = req.query;
  let filteredProducts = products;

  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }

  if (search) {
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.json(filteredProducts);
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

// Add new product (admin only - simplified)
app.post('/api/products', authenticateToken, (req, res) => {
  const { name, price, description, image, category, stock } = req.body;

  const newProduct = {
    id: nextProductId++,
    name,
    price: parseFloat(price),
    description,
    image,
    category,
    stock: parseInt(stock)
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Update product
app.put('/api/products/:id', authenticateToken, (req, res) => {
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const { name, price, description, image, category, stock } = req.body;
  products[productIndex] = {
    ...products[productIndex],
    name,
    price: parseFloat(price),
    description,
    image,
    category,
    stock: parseInt(stock)
  };

  res.json(products[productIndex]);
});

// Delete product
app.delete('/api/products/:id', authenticateToken, (req, res) => {
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  products.splice(productIndex, 1);
  res.json({ message: 'Product deleted successfully' });
});

// ORDER ROUTES

// Create order
app.post('/api/orders', authenticateToken, (req, res) => {
  try {
    const { items, shippingAddress, totalAmount } = req.body;

    // Validate stock
    for (let item of items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) {
        return res.status(400).json({ message: `Product ${item.productId} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
    }

    // Update stock
    for (let item of items) {
      const productIndex = products.findIndex(p => p.id === item.productId);
      products[productIndex].stock -= item.quantity;
    }

    const newOrder = {
      id: nextOrderId++,
      userId: req.user.id,
      items,
      shippingAddress,
      totalAmount,
      status: 'pending',
      createdAt: new Date()
    };

    orders.push(newOrder);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user orders
app.get('/api/orders', authenticateToken, (req, res) => {
  const userOrders = orders.filter(o => o.userId === req.user.id);
  res.json(userOrders);
});

// Get single order
app.get('/api/orders/:id', authenticateToken, (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id) && o.userId === req.user.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  res.json(order);
});

// CART ROUTES (simple in-memory cart)
let carts = {}; // userId: [items]

// Get cart
app.get('/api/cart', authenticateToken, (req, res) => {
  const cart = carts[req.user.id] || [];
  res.json(cart);
});

// Add to cart
app.post('/api/cart', authenticateToken, (req, res) => {
  const { productId, quantity } = req.body;
  
  if (!carts[req.user.id]) {
    carts[req.user.id] = [];
  }

  const existingItem = carts[req.user.id].find(item => item.productId === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    carts[req.user.id].push({ productId, quantity });
  }

  res.json({ message: 'Item added to cart', cart: carts[req.user.id] });
});

// Remove from cart
app.delete('/api/cart/:productId', authenticateToken, (req, res) => {
  if (carts[req.user.id]) {
    carts[req.user.id] = carts[req.user.id].filter(item => 
      item.productId !== parseInt(req.params.productId)
    );
  }
  res.json({ message: 'Item removed from cart' });
});

// Clear cart
app.delete('/api/cart', authenticateToken, (req, res) => {
  carts[req.user.id] = [];
  res.json({ message: 'Cart cleared' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('\nAPI Endpoints:');
  console.log('POST /api/register - Register new user');
  console.log('POST /api/login - Login user');
  console.log('GET /api/products - Get all products');
  console.log('POST /api/products - Add new product (requires auth)');
  console.log('GET /api/cart - Get user cart (requires auth)');
  console.log('POST /api/cart - Add to cart (requires auth)');
  console.log('POST /api/orders - Create order (requires auth)');
  console.log('GET /api/orders - Get user orders (requires auth)');
});
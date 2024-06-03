// server.js
const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const app = express();
const PORT = 3000;

// Middleware pour gérer les requêtes JSON
app.use(express.json());

// Connexion à la base de données
mongoose.connect('mongodb://localhost:27017/webshop', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
// Ajoutez vos routes ici

app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post('/api/cart', async (req, res) => {
  const { productId } = req.body;
  let cart = await Cart.findOne();
  if (!cart) {
    cart = new Cart({ products: [] });
  }
  const productInCart = cart.products.find((p) => p.productId === productId);
  if (productInCart) {
    productInCart.quantity += 1;
  } else {
    cart.products.push({ productId, quantity: 1 });
  }
  await cart.save();
  res.json(cart);
});

app.get('/api/cart', async (req, res) => {
  const cart = await Cart.findOne();
  res.json(cart);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
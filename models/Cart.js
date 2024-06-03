const mongoose = require('mongoose');

// Définir le schéma du produit dans le panier
const cartItemSchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});

// Définir le schéma du panier
const cartSchema = new mongoose.Schema({
  products: [cartItemSchema],
});

// Méthode pour ajouter un produit au panier
cartSchema.methods.addToCart = function(productId) {
  const cart = this;
  const productIndex = cart.products.findIndex(item => item.productId === productId);
  
  if (productIndex >= 0) {
    cart.products[productIndex].quantity += 1;
  } else {
    cart.products.push({ productId, quantity: 1 });
  }
  return cart.save();
};

// Méthode pour supprimer un produit du panier
cartSchema.methods.removeFromCart = function(productId) {
  const cart = this;
  const productIndex = cart.products.findIndex(item => item.productId === productId);

  if (productIndex >= 0) {
    if (cart.products[productIndex].quantity > 1) {
      cart.products[productIndex].quantity -= 1;
    } else {
      cart.products.splice(productIndex, 1);
    }
  }
  return cart.save();
};

// Méthode pour obtenir le prix total
cartSchema.methods.getTotalPrice = async function() {
  const cart = this;
  let totalPrice = 0;
  for (const item of cart.products) {
    const product = await mongoose.model('Product').findOne({ id: item.productId });
    totalPrice += product.price * item.quantity;
  }
  return totalPrice;
};

// Méthode pour obtenir le nombre total de produits
cartSchema.methods.getTotalQuantity = function() {
  return this.products.reduce((total, item) => total + item.quantity, 0);
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;

class Product {
    constructor(id = "", name = "", desc = "", price = 0) {
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.price = price;
    }
}

class Stock {
    constructor() {
        this.list_product = [];
        this.init();
    }

    get_list_product() {
        return this.list_product;
    }

    get_prod_by_id(id) {
        for (var i = 0; i < this.list_product.length; i++) {
            if (this.list_product[i].id == id) {
                return this.list_product[i];
            }
        }
        return null;
    }

    init() {
        this.list_product.push(new Product(1, "Germinal 1", "description germinal 1", 10));
        this.list_product.push(new Product(2, "Germinal 2", "description germinal 2", 20));
        this.list_product.push(new Product(3, "Germinal 3", "description germinal 3", 30));
        this.list_product.push(new Product(4, "Germinal 4", "description germinal 4", 40));
        this.list_product.push(new Product(5, "Germinal 5", "description germinal 5", 50));
        this.list_product.push(new Product(6, "Germinal 6", "description germinal 6", 60));
        this.list_product.push(new Product(7, "Germinal 7", "description germinal 7", 70));
        this.list_product.push(new Product(8, "Germinal 8", "description germinal 8", 80));
        this.list_product.push(new Product(9, "Germinal 9", "description germinal 9", 90));
        this.list_product.push(new Product(10, "Germinal 10", "description germinal 10", 100));
        this.list_product.push(new Product(11, "Germinal 11", "description germinal 11", 110));
    }
}

class Cart {
    constructor() {
        this.list_cart = {};
    }

    get_list_cart() {
        return this.list_cart;
    }

    addInCart(id) {
        if (this.list_cart[id]) {
            this.addExistedElem(id);
        } else {
            this.addNew(id);
        }
    }

    removeFromCart(id) {
        if (this.list_cart[id]) {
            if (this.list_cart[id] == 1) {
                delete this.list_cart[id];
            } else {
                this.subExistedElem(id);
            }
        }
    }

    addNew(id) {
        this.list_cart[id] = 1;
    }

    addExistedElem(id) {
        this.list_cart[id]++;
    }

    subExistedElem(id) {
        this.list_cart[id]--;
    }

    get_nbr_product() {
        let total = 0;
        for (const el in this.list_cart) {
            total += this.list_cart[el];
        }
        return total;
    }

    get_total_price(stk) {
        let total = 0;
        for (const el in this.list_cart) {
            let prd = stk.get_prod_by_id(el);
            if (prd) {
                total += this.list_cart[el] * prd.price;
            }
        }
        return total;
    }
}

export { Product, Stock, Cart };

// manager.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/products';

class ProductService {
  static async getAllProducts() {
    try {
      const response = await axios.get(BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Ajoutez d'autres méthodes pour effectuer des opérations CRUD sur les produits
}

export default ProductService;


const mongoose = require('mongoose');

// Définir le schéma du produit
const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  desc: String,
  price: Number,
});

const Product = mongoose.model('Product', productSchema);

// Définir le schéma du panier
const cartSchema = new mongoose.Schema({
  products: [
    {
      productId: Number,
      quantity: Number,
    },
  ],
});

const Cart = mongoose.model('Cart', cartSchema);

// Initialiser la base de données avec des produits factices
const initProducts = async () => {
  const products = [
    { id: 1, name: 'Germinal 1', desc: 'description germinal 1', price: 10 },
    { id: 2, name: 'Germinal 2', desc: 'description germinal 2', price: 20 },
    { id: 3, name: 'Germinal 3', desc: 'description germinal 3', price: 30 },
    { id: 4, name: 'Germinal 4', desc: 'description germinal 4', price: 40 },
    { id: 5, name: 'Germinal 5', desc: 'description germinal 5', price: 50 },
    { id: 6, name: 'Germinal 6', desc: 'description germinal 6', price: 60 },
    { id: 7, name: 'Germinal 7', desc: 'description germinal 7', price: 70 },
    { id: 8, name: 'Germinal 8', desc: 'description germinal 8', price: 80 },
    { id: 9, name: 'Germinal 9', desc: 'description germinal 9', price: 90 },
    { id: 10, name: 'Germinal 10', desc: 'description germinal 10', price: 100 },
  ];

  await Product.insertMany(products);
  console.log('Products initialized');
};

// Initialiser la base de données
const initDB = async () => {
  await mongoose.connect('mongodb://localhost:27017/webshop', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const count = await Product.countDocuments();
  if (count === 0) {
    await initProducts();
  }
};

initDB();

module.exports = {
  Product,
  Cart,
};

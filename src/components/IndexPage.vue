<template>
  <div class="IndexPage">
    <br>
    <div class="row">
      <!-- Product list -->
      <div class="col-md-9">
        <div class="row gx-4 gy-4 row-cols-3">
          <div class="col" v-for="(product, id) in list_products" :key="id">
            <div class="p-3 border bg-light">
              <h5>{{ product.name }}</h5>
              <p>{{ product.desc }}</p>
              <p>{{ product.price }}</p>
              <button type="button" class="btn btn-success btn-sm" @click="add_to_cart(product.id)">Ajouter au panier</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Cart -->
      <div class="col-6 col-md-3">
        <div class="col">
          <div class="p-3 border bg-success">
            <h5>Cart</h5>
          </div>
        </div>
        <div class="row gx-4 row-cols-1">
          <div class="col" v-for="(value, id) in list_cart" :key="id">
            <div class="p-3 border bg-light">
              {{ get_info_product(id) }}
              <h5>{{ desc_product.name }}</h5>
              <h6>Quantity: {{ value }}</h6>
              <button type="button" class="btn btn-danger btn-sm" @click="remove_from_cart(id)">Supprimer</button>
            </div>
          </div>

          <!-- Show total -->
          <div class="col">
            <div class="p-3 border bg-success">
              <h5>Total: {{ total_price }}</h5>
              <h6>Nombre de produits: {{ nbr_product }}</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Stock, Cart } from '../../manager';

export default {
  name: 'IndexPage',
  data() {
    return {
      list_products: [],
      list_cart: [],
      desc_product: {},
      total_price: 0,
      nbr_product: 0,
    };
  },
  async created() {
    const response = await fetch('/api/products');
    const products = await response.json();
    this.list_products = products;
    this.update_cart();
  },
  methods: {
    async add_to_cart(id) {
      await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: id }),
      });
      this.update_cart();
    },
    async update_cart() {
      const response = await fetch('/api/cart');
      const cart = await response.json();
      this.list_cart = cart.products.reduce((acc, item) => {
        acc[item.productId] = item.quantity;
        return acc;
      }, {});
      this.update_total();
    },
    get_info_product(id) {
      this.desc_product = this.list_products.find(product => product.id === id) || {};
    },
    update_total() {
      this.total_price = 0;
      this.nbr_product = 0;
      for (const [id, quantity] of Object.entries(this.list_cart)) {
        const product = this.list_products.find(p => p.id === parseInt(id));
        if (product) {
          this.total_price += product.price * quantity;
          this.nbr_product += quantity;
        }
      }
    },
    async remove_from_cart(id) {

      this.update_cart();
      this.update_total();
    }
  }
};
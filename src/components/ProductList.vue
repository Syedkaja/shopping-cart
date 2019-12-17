<template>
  <div>
    <h1>Products List</h1>
    <img v-if="loading" src="https://i.imgur.com/JfPpwOA.gif" alt />
    <ul v-else>
      <li v-for="product in products">
        {{product.title}} - {{product.price | currency}} - {{product.inventory}}
        <button
          :disabled="!productIsInStock(product)"
          @click="addProductToCart(product)"
        >Add to Cart</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      loading: false
    };
  },
  computed: {
    ...mapState({
      products: state => state.products
    }),
    ...mapGetters({
      productIsInStock: "productIsInStock"
    })
  },
  // computed: {
  //   products() {
  //     // return this.$store.getters.availableProducts; //now we can access state from store in all the component
  //     return this.$store.state.products;
  //   },
  //   productIsInStock() {
  //     return this.$store.getters.productIsInStock;
  //   }
  // },
  created() {
    this.loading = true;
    // this.$store.dispatch("fetchProducts").then(() => (this.loading = false));
    this.fetchProducts().then(() => {
      this.loading = false;
    });
  },
  methods: {
    ...mapActions({
      fetchProducts: "fetchProducts",
      addProductToCart: "addProductToCart"
    })
    // addProductToCart(product) {
    //   this.$store.dispatch("addProductToCart", product);
    // }
  }
};
</script>

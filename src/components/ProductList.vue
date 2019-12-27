<template>
  <div>
    <h1>Products List</h1>
    <Button :text="'Add Product'" :onClick="this.showModal"/>
    <Dropdown :category="this.category" :changeCategory="this.onChange" />
    <SearchBar :keySearch="this.query" />
    <img v-if="loading" src="https://i.imgur.com/JfPpwOA.gif" alt />
    <table v-else>
      <thead>
        <td>Product Name</td>
        <td>Price</td>
        <td>Stock</td>
        <td>Add to Cart</td>
      </thead>
      <tr v-for="product in filteredItems">
        <td>{{product.title}}</td>
        <td>{{product.price | currency}}</td>
        <td>{{product.inventory}}</td>
        <td><button
          :disabled="!productIsInStock(product)"
          @click="addProductToCart(product)"
        >Add</button></td>
      </tr>
    </table>
    <Modal v-if="openModal" @close="openModal = false">
      <h3 slot="header">Add Product</h3>

      <div slot="body">
        <div class="form-group">
          <label for="name">Product Name</label>
          <input type="text" class="form-control" id="name">
        </div>
        <div class="form-group">
          <label for="price">Price</label>
          <input type="text" class="form-control" id="price">
        </div>
        <div class="form-group">
          <label for="price">Inventory</label>
          <input type="number" class="form-control" id="inventory">
        </div>
      </div>
    </Modal>
    <!-- <ul v-else>
      <li v-for="product in filteredItems">
        {{product.title}} - {{product.price | currency}} - {{product.inventory}}
        <button
          :disabled="!productIsInStock(product)"
          @click="addProductToCart(product)"
        >Add to Cart</button>
      </li>
    </ul> -->
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import SearchBar from "./SearchBar";
import Dropdown from "./Dropdown";
import Button from "./Button";
import Modal from "./Modal";
export default {
  data() {
    return {
      loading: false,
      query: "",
      openModal: false,
      category: ["All", "Electronics", "Apparels", "Cosmetics"]
    };
  },
  components: {
    SearchBar,
    Dropdown,
    Button,
    Modal
  },
  computed: {
    ...mapState({
      products: state => state.products
    }),
    ...mapGetters({
      productIsInStock: "productIsInStock",
      filteredItems: "fetchFilteredProducts"
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
    showModal() {
      this.openModal = true;
    },
    ...mapActions({
      fetchProducts: "fetchProducts",
      addProductToCart: "addProductToCart",
      onChange: "fetchProductsCategory"
    })    
    // addProductToCart(product) {
    //   this.$store.dispatch("addProductToCart", product);
    // }
  }
};
</script>
<style>
  table, thead, tr, td{
    border: 1px solid #d2d2d2;
    margin: 20px auto;
    width: 800px;
  }
  table>thead>td{
    font-weight: 600;
  }
  .modal-body > div > .form-group{
    margin: 15px 0px;
    text-align: right;
  }
</style>
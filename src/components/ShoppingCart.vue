<template>
  <div>
    <h1>Shopping Cart</h1>
    <ul v-for="product in products">
      <li>
        {{product.title}} - {{product.price | currency}} - {{product.quantity}}
        <button
          @click="removeProductFromCart(product)"
        >Remove</button>
      </li>
    </ul>
    <p>Total : {{total | currency}}</p>
    <button @click="checkout">Checkout</button>
    <p v-if="setCheckoutStatus">{{setCheckoutStatus}}</p>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  computed: {
    ...mapGetters({
      products: "cartProducts",
      total: "cartTotal"
    }),

    ...mapState({
      setCheckoutStatus: "setCheckoutStatus"
    })

    // products() {
    //   return this.$store.getters.cartProducts;
    // },
    // total() {
    //   return this.$store.getters.cartTotal;
    // }
  },
  methods: {
    ...mapActions(["checkout", "removeProductFromCart"])
  }
};
</script>

import Vuex from "vuex"
import Vue from "vue"
import shop from "@/api/shop"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    products: [],
    //holds {id, quantity}
    cart: [],
    setCheckoutStatus: null
  },

  getters: { // = computed properties
    availableProducts(state, getters) {
      return state.products.filter(product => product.inventory > 0)
    },
    cartProducts(state) {
      return state.cart.map(cartItem => {
        const product = state.products.find(product => product.id === cartItem.id)
        return {
          title: product.title,
          price: product.price,
          quantity: cartItem.quantity
        }
      })
    },
    cartTotal(state, getters) {
      let total = 0;
      getters.cartProducts.forEach(product => {
        total += product.price * product.quantity
      })

      return total

      // simplify the above code using reduce function
      // return getters.cartProducts.reduce((total, product) => total + product.price * product.quantity, 0)
    },
    productIsInStock() {
      return (product) => {
        return product.inventory > 0
      }
    }
  },

  actions: {

    //make the apicall
    //run functions in mutations

    fetchProducts({
      commit
    }) {
      return new Promise((resolve, reject) => {
        shop.getProducts(products => {
          commit("setProducts", products);
          resolve()
        });
      })
    },

    addProductToCart({
      state,
      getters,
      commit
    }, product) {
      if (getters.productIsInStock(product)) {
        const cartItem = state.cart.find(item => item.id === product.id)
        if (!cartItem) {
          //push product to cart
          commit('pushProductTocart', product.id);
        } else {
          // increment quantity
          commit('incrementItemQuantity', cartItem);
        }
        commit('decrementProductInventory', product);
      }

    },

    checkout({
      state,
      commit
    }) {
      shop.buyProducts(
        state.cart,
        () => {
          commit('emptyCart')
          commit('setCheckoutStatus', 'success')
        },
        () => {
          commit('setCheckoutStatus', 'Failed')
        }
      )
    }
  },

  mutations: {
    //updateProducts //update state functions here
    setProducts(state, products) {
      state.products = products;
    },
    pushProductTocart(state, productId) {
      state.cart.push({
        id: productId,
        quantity: 1
      })
    },
    incrementItemQuantity(state, cartItem) {
      cartItem.quantity++;
    },
    decrementProductInventory(state, product) {
      product.inventory--;
    },
    setCheckoutStatus(state, status) {
      state.setCheckoutStatus = status;
    },
    emptyCart(state) {
      state.cart = [];
    }
  }

})

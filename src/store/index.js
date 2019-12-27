import Vuex from "vuex"
import Vue from "vue"
import shop from "@/api/shop"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    products: [],
    //holds {id, quantity}
    filteredProducts: [],
    cart: [],
    setCheckoutStatus: null
  },

  getters: { // = computed properties
    availableProducts(state, getters) {
      return state.products.filter(product => product.inventory > 0)
    },

    fetchFilteredProducts(state) {
      return state.filteredProducts;
    },
    cartProducts(state) {
      return state.cart.map(cartItem => {
        const product = state.products.find(product => product.id === cartItem.id)
        return {
          id: product.id,
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

    fetchProductsCategory({state, commit}) {
      let dropdownFilterArray = [];          
      if(event.target.value === "All") {
        dropdownFilterArray = state.products;
        commit('dropdownFilter', dropdownFilterArray);
      } else {
        dropdownFilterArray = state.products.filter(product => product.category === event.target.value)
        commit('dropdownFilter', dropdownFilterArray);
      }         
    },

    filterKeyInProducts({state, commit, getters}) {
      const key = event.target.value;
      key.toLowerCase().trim();
      let searchFilterArray = [];      
      if(!key.length) {
        searchFilterArray = state.products;
        commit('searchProducts', searchFilterArray);
      } else {
        searchFilterArray = state.filteredProducts.filter(item => item.title.toLowerCase().indexOf(key) > -1);
        commit('searchProducts', searchFilterArray);
      }
        
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

    removeProductFromCart({
      state,
      getters,
      commit
    }, product) {
      const cartItem = state.cart.find(item => item.id === product.id)
      const cartProduct = state.products.find(item => item.id === cartItem.id)
      if (cartItem.quantity > 1) {
        commit('decrementItemQuantity', cartItem)
      } else {
        commit('removeCartItem', cartItem)
      }
      commit('incrementProductInventory', cartProduct);

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
      state.filteredProducts = products;
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
    },
    removeCartItem(state, cartItem) {
      state.cart.splice(cartItem)
    },
    decrementItemQuantity(state, cartItem) {
      cartItem.quantity--;
    },
    incrementProductInventory(state, cartProduct) {
      cartProduct.inventory++;
    },
    searchProducts(state, searchFilterArray){
        state.filteredProducts = searchFilterArray
    },
    dropdownFilter(state, dropdownFilterArray) {
        state.filteredProducts = dropdownFilterArray;
    }
  }

})

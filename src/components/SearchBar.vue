<template>
<input type=text :value="keySearch" v-on:keyup="filterKeyInProducts" >
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";
export default {
    props:{
        keySearch: String
    },
     methods: {

        ...mapActions({
      filterKeyInProducts: "filterKeyInProducts"
    })
             
     }
}
</script>
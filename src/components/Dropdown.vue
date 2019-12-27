<template>
    <select  @change="changeCategory()">
        <option v-for="item in category" :value="item" :key="item">{{item}}</option>
    </select>
</template>

<script>
export default {
    props: {
        category: Array,
        changeCategory: Function
    }
}
</script>
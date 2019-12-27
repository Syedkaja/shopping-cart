<template>
    <button @click="onClick()">{{text}}</button>
</template>

<script>
export default {
    props: {
        text: String,
        onClick: Function
    }
}
</script>
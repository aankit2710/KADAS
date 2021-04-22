<template>
  <div
    class="input__button"
    @click="send"
  >
    Send
  </div>
</template>

<script>

  export default {
    name: 'InputButton',
    methods: {
      send (event) {
        console.log(event)
        this.$emit('newOwnMessage')
      },
    },
  }
</script>

<style>

</style>

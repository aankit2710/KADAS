<template>
  <div class="input__field">
    <v-file-input
    v-model="files"
    color="deep-purple accent-4"
    multiple
    prepend-icon="mdi-paperclip"
    @input="$emit('input', $event.target.value)"
      @keyup.enter.prevent="send"
  >
    <template v-slot:selection="{ index, text }">
      <v-chip
        v-if="index < 2"
        color="deep-purple accent-4"
        dark
        label
        small
        display:none
      >
        {{ text }}
      </v-chip>
    </template>
  </v-file-input>
    <input
      :value="value"
      type="text"
      name="message"
      underlined
      aria-placeholder="Type message..."
      placeholder="Type message..."
      autofocus
      @input="$emit('input', $event.target.value)"
      @keyup.enter.prevent="send"
    >
    <br>
  </div>
</template>

<script>
  export default {
    name: 'InputField',
    props: {
      value: {
        type: String,
        default: '',
        required: false,
      },
    },
    methods: {
    },
  }
</script>

<style>

</style>

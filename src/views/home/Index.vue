<template>
  <div id="app">
    <v-app id="inspire">
      <v-parallax
        dark
        height="664"
        src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            class="text-center"
            cols="12"
          >
            <v-card
              width="400"
              class="mx-auto my-auto"
            >
              <v-card-title
                class="#4ebc2a white--text"
              >
                <h1
                  class="display-1"
                >
                  Login
                </h1>
              </v-card-title>
              <v-card-text>
                <v-form
                  id="signup-form"
                  lazy-validation
                  @submit.prevent="processForm"
                >
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    type="email"
                    label="Email"
                    prepend-icon="mdi-account-circle"
                    required
                  />
                  <v-text-field
                    v-model="password"
                    :type="showpassword?'text' : 'password'"
                    label="password"
                    required
                    prepend-icon="mdi-lock"
                    append-icon="mdi-eye-off"
                    @click:append="showpassword = !showpassword"
                  />
                  <v-checkbox
                    v-model="checkbox"
                    label="Do you want to save passowrd ?"
                  />
                  <v-card-actions>
                    <v-btn
                      color="#4ebc2a"
                      type="submit"
                    >
                      Login
                    </v-btn>
                    <v-spacer/>
                    <v-btn
                      color="#4ebc2a"
                    >
                      Forgot Password
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-parallax>
    </v-app>
  </div>
</template>

<script>
  import LoadSections from '@/mixins/load-sections'

  const axios = require('axios')
  export default {
    el: '#signup-form',
    name: 'HelloWorld',
    mixins: [
      LoadSections([]),
    ],
    data: () => ({
      showpassword: false,
      items: [
        {
          src: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
        },
      ],
    }),
    method: {
      checkform() {
        this.$refs.form.validate()
      },
      processForm: function () {
        console.log({password: this.password, email: this.email})
        alert('Processing!')
      },
    },
    mounted() {
      axios({
        method: 'post',
        url: 'https://school.kfundi.com/api/login',
        data: {
          email: this.email,
          password: 'secret',
        },
      })
    },
  }
</script>

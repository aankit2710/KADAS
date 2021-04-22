<template>
  <base-section id="affiliates" space="0" class="grey lighten-4">
    <v-container fluid style="margin:0px;margin-top:0px;padding:0px">
      <v-parallax dark height="664" src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg">
        <v-card height="250" class="overflow-hidden mx-auto my-auto" width="400">
          <v-overlay
            absolute="true"
            :value="showOverlay"
          >
            <v-progress-circular
              indeterminate
              color="#4ebc2a"
            ></v-progress-circular>
          </v-overlay>
          <div class="text-center">
            <v-form ref="form" v-model="valid" class="ml-auto mr-auto" style="width:80%" lazy-validation>
              <v-text-field v-model="email" :rules="emailRules" type="email" label="Email"
                            prepend-icon="mdi-account-circle" required/>
              <v-text-field v-model="password" :type="showpassword?'text' : 'password'" label="password"
                            required prepend-icon="mdi-lock" append-icon="mdi-eye-off"
                            @click:append="showpassword = !showpassword"
              />
              <v-checkbox v-model="checkbox" label="Do you want to save passowrd ?"/>
              <v-btn :disabled="!valid" color="#4ebc2a" class="mr-4" @click="post_login">
                Submit
              </v-btn>
              <v-btn color="#4ebc2a" class="mr-4" @click="reset">
                Reset Form
              </v-btn>
            </v-form>
          </div>
        </v-card>
      </v-parallax>
    </v-container>
  </base-section>
</template>
<script>

  const axios = require('axios').default;

  export default {
    data() {
      return {
        valid: false,
        nameRules: [
          v => !!v || 'Name is required',
          v => v.length <= 10 || 'Name must be less than 10 characters',
        ],
        email: '',
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+/.test(v) || 'E-mail must be valid',
        ],
        showpassword: false,
        checkbox: false,
        password: '',
        showOverlay: false
      }
    },
    computed: {
      bg() {
        return this.background ? 'https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg' : undefined
      },
    },
    methods: {
      post_login() {
        this.showOverlay = true
        axios.post('https://school.kfundi.com/api/login', {
          email: this.email,
          password: this.password
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }).then(res => {
          this.showOverlay = false
          console.log(res);
          const sessionData = {
            token: res.data.data.token,
            user: res.data.data.user
          }
          this.$store.commit('updateSessionData', sessionData)
          this.$router.push({name: "Dashboard"})

        }, error => {
          this.showOverlay = false
          console.log(error);
        });
        this.$refs.form.validate()
      },
      reset() {
        this.$refs.form.reset()
      },
      resetValidation() {
        this.$refs.form.resetValidation()
      },
    },
    beforeCreate() {
      if (this.$store.state.sessionData.length) {
        this.$router.push({name: 'Dashboard'});
      }
    }
  }
</script>

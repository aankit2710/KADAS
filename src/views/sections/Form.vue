<template>
  <base-section
    id="affiliates"
    space="36"
    class="grey lighten-4"
  >
    <v-container
      fluid
      style="margin:0px;margin-top:13px;padding:0px"
    >
      <v-card
        height="600"
        class="overflow-hidden"
      >
        <div
          class="text-center"
        >
          <v-form
            ref="form"
            v-model="valid"
            class="ml-auto mr-auto"
            style="width:80%"
            lazy-validation
          >
            <v-row>
              <v-col
                cols="12"
                md="12"
              >
                <v-text-field
                  v-model="email"
                  :rules="emailRules"
                  label="E-mail"
                  prepend-icon="mdi-email"
                  required
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="firstname"
                  :rules="nameRules"
                  :counter="10"
                  label="First name"
                  prepend-icon="mdi-account"
                  required
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="lastname"
                  :rules="nameRules"
                  :counter="10"
                  label="Last name"
                  prepend-icon="mdi-account"
                  required
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="fullname"
                  :rules="nameRules"
                  label="Full Name"
                  prepend-icon="mdi-account"
                  required
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="username"
                  :rules="nameRules"
                  label="Username"
                  prepend-icon="mdi-account"
                  required
                />
              </v-col>
              <v-col
                cols="12"
                md="12"
              >
                <v-text-field
                  v-model="phone"
                  :rules="phoneRules"
                  label="Phone Number"
                  prepend-icon="mdi-account"
                  required
                />
              </v-col>
              <v-col
                cols="12"
                md="4"
              >
                <v-text-field
                  v-model="app"
                  label="App Version"
                  prepend-icon="mdi-account"
                  required
                />
              </v-col>
              <v-col
                cols="12"
                md="4"
              >
                <v-text-field
                  type="date"
                  label="Date of Birth"
                  prepend-icon="mdi-account"
                  required
                />
              </v-col>
              <v-col
                cols="12"
                md="4"
              >
                <v-text-field
                  label="Gender"
                  prepend-icon="mdi-account"
                  required
                />
              </v-col>
            </v-row>
            <v-checkbox
              v-model="checkbox"
              :rules="[v => !!v || 'You must agree to continue!']"
              label="Do you agree?"
              required
            />
            <v-btn
              :disabled="!valid"
              color="#4ebc2a"
              class="mr-4"
              @click="validate"
            >
              Submit
            </v-btn>

            <v-btn
              color="#4ebc2a"
              class="mr-4"
              @click="reset"
            >
              Reset Form
            </v-btn>
          </v-form>
        </div>
      </v-card>
    </v-container>
  </base-section>
</template>
<script>
  export default {
    data () {
      return {
        valid: false,
        firstname: '',
        lastname: '',
        nameRules: [
          v => !!v || 'Name is required',
          v => v.length <= 10 || 'Name must be less than 10 characters',
        ],
        email: '',
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+/.test(v) || 'E-mail must be valid',
        ],
      }
    },
    computed: {
      bg () {
        return this.background ? 'https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg' : undefined
      },
    },
    methods: {
      validate () {
        this.$refs.form.validate()
      },
      reset () {
        this.$refs.form.reset()
      },
      resetValidation () {
        this.$refs.form.resetValidation()
      },
    },
  }
</script>

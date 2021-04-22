<template>
  <base-section
    id="affiliates"
    space="36"
    class="grey lighten-3"
  >
    <v-container
      class="mr-auto"
      style="width:80%"
    >
      <v-card
        color="grey lighten-5"
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
              class="mb-0"
            >
              <h1>
                Update Your Profile
              </h1>
            </v-col>
            <v-col
              cols="12"
              md="12"
            >
              <v-file-input
    v-model="files"
    label="Update Image"
    multiple
    prepend-icon="mdi-paperclip"
    required
  >
    <template v-slot:selection="{ text }">
      <v-chip
        small
        label
        color="#4ebc2a"
      >
        {{ text }}
      </v-chip>
    </template>
  </v-file-input>
            </v-col>
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
              md="12"
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
              md="12"
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
                v-model="JobTitle"
                :rules="nameRules"
                label="JobTitle"
                prepend-icon="mdi-account"
                required
              />
            </v-col>
            <v-col
              cols="12"
              md="12"
            >
              <v-text-field
                v-model="phonenumber"
                :rules="phonenumberRules"
                label="Phone Number"
                prepend-icon="mdi-account"
                required
              />
            </v-col>
            <v-col
              cols="12"
              md="12"
            >
              <v-select
                v-model="app"
                :items="appversion"
                menu-props="auto"
                label="Type of Package"
                hide-details
                prepend-icon="mdi-account-multiple"
              />
            </v-col>
            <v-col
              cols="12"
              md="12"
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
              md="12"
            >
              <v-select
                v-model="gender"
                :items="gender"
                menu-props="auto"
                label="Gender"
                hide-details
                prepend-icon="mdi-account-multiple"
              />
            </v-col>
           
            <v-col
              cols="12"
              md="12"
            >
              <v-text-field
                v-model="nationalid"
                :rules="nationalidRules"
                label="National ID"
                prepend-icon="mdi-account"
                required
              />
            </v-col>
            <v-col
              cols="12"
              md="12"
            >
              <v-text-field
                v-model="nationaltype"
                :rules="nationaltypeRules"
                label="National Type"
                prepend-icon="mdi-account"
                required
              />
            </v-col>
            <v-col
              cols="12"
              md="12"
            >
              <v-text-field
                v-model="address"
                :rules="addressRules"
                label="Address"
                prepend-icon="mdi-account"
                required
              />
            </v-col>
            <v-col
              cols="12"
              md="12"
            >
              <v-select
                v-model="highestqualification"
                :items="highestqualification"
                menu-props="auto"
                label="Highest Qualifications"
                hide-details
                prepend-icon="mdi-account-multiple"
              />
            </v-col>
            <v-col
              cols="12"
              md="12"
            >
              <v-select
                v-model="typeofemployement"
                :items="typeofemployement"
                menu-props="auto"
                label="Type of Employement"
                hide-details
                prepend-icon="mdi-account"
              />
            </v-col>
            <v-col
              cols="12"
              md="12"
            >
              <v-text-field
                v-model="refid"
                :rules="refidRules"
                label="Ref ID"
                prepend-icon="mdi-account"
                required
              />
            </v-col>
            <v-col
              cols="12"
              md="12"
            >
              <v-text-field
                type="date"
                label="Hired at"
                prepend-icon="mdi-account"
                required
              />
            </v-col>
            <v-col
              cols="12"
              md="12"
            >
              <v-select
                v-model="department"
                :items="department"
                menu-props="auto"
                label="Department"
                hide-details
                prepend-icon="mdi-account-multiple"
              />
            </v-col>
            
            <v-col
              cols="12"
              md="12"
            >
              <v-text-field
                v-model="comment"
                :rules="commentRules"
                label="Comment"
                prepend-icon="mdi-account"
                required
              />
            </v-col>
          </v-row>
          <v-btn
            color="#4ebc2a"
            class="mr-4 mb-4"
            @click="validate"
          >
            Save
          </v-btn>
        </v-form>
      </v-card>
    </v-container>
  </base-section>
</template>

<script>
  const axios = require('axios')
  export default {
    name: 'SectionAffiliates',
    data() {
      return {
        dialog: false,
        gender: ['Male', 'Female', 'Other'],
        appversion: ['PRO', 'BASIC'],
        highestqualification: [],
        typeofemployement: ['Full-time','Part-time','Substitute','Contract'],
        department: ['HR', 'Accounts'],
        jobtitle: ['test'],
        date: new Date().toISOString().substr(0, 10),
        menu1: false,
        menu2: false,
        menu3: false,
        menu4: false,
        menu5: false,
        menu6: false,
        menu7: false,
        menu8: false,
        userData: null
      }
    },

    mounted () {
      this.getUserInfo()
    },

    

    methods: {
      reset() {
        this.$refs.form.reset()
      },
      resetValidation() {
        this.$refs.form.resetValidation()
      },

      getUserInfo () {
        const userId = this.$store.state.sessionData[1].user.id
        const jwt = this.$store.state.sessionData[0].token
        const url = `https://school.kfundi.com/api/users/${userId}`
        axios.get(url, {
          headers: {
            Authorization: 'Bearer ' + jwt
          }
        })
        .then((res) => {
          this.userData = res.data.data
        })
        .catch((e) => {
          // ToDo: Add snackbar with error message
          console.log('Couldn\'t fetch data due to: ', e)
          this.circularLoader = false
        })
      }
    },
  }

</script>

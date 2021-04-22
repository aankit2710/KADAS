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

              <v-avatar
                v-model='userAvatar'
                size="72px"
                class="mt-3 mb-5"
              >
                <img
                  v-if="userAvatar"
                  alt="Avatar"
                  :src="userAvatar"
                >
                <v-icon
                  size="72"
                  v-else
                  :color="orange"
                >mdi-account</v-icon>
              </v-avatar>

              <h1>
                Update Company Settings
              </h1>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="companySettings.name"
                :rules="nameRules"
                :counter="10"
                label="Name"
                prepend-icon="mdi-account"
                required
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="companySettings.email"
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
                v-model="companySettings.website"
                :rules="website"
                :counter="10"
                label="Website"
                prepend-icon="mdi-account"
                required
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="companySettings.address"
                :rules="address"
                label="Address"
                prepend-icon="mdi-account"
                required
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="companySettings.city"
                :rules="city"
                label="City"
                prepend-icon="mdi-map"
                required
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="companySettings.country"
                :rules="country"
                label="Country"
                prepend-icon="mdi-account"
                required
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-select
                v-model="companySettings.selectedTimezone"
                :items="timezone"
                menu-props="auto"
                label="timezone"
                hide-details
                prepend-icon="mdi-account-multiple"
                single-line
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="companySettings.zipcode"
                label="zipcode"
                prepend-icon="mdi-account"
                required
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="companySettings.telephone"
                :rules="telephone"
                label="Telephone"
                prepend-icon="mdi-phone"
                required
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="companySettings.mobile"
                :rules="mobile"
                label="Mobile"
                prepend-icon="mdi-phone"
                required
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="companySettings.fieldofbussiness"
                :rules="fieldofbussiness"
                label="Name of Institution"
                prepend-icon="mdi-file"
                required
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-select
                v-model="companySettings.selectedLanguage"
                :items="language"
                menu-props="auto"
                label="Language"
                hide-details
                prepend-icon="mdi-account-multiple"
                single-line
              />
            </v-col>
               <v-col
              cols="12"
              md="6"
            >
              <v-select
                v-model="companySettings.typeofinstitution"
                :items="typeOfInstitution"
                menu-props="auto"
                label="Type of Institution"
                hide-details
                prepend-icon="mdi-account-multiple"
                single-line
              />
            </v-col>
          </v-row>
          <v-btn
            color="#4ebc2a"
            class="mr-4 mb-4"
            @click="updateCompanySettings()"
          >
            Save
          </v-btn>
        </v-form>
      </v-card>
      <v-card
        color="grey lighten-5"
        class="mt-5"
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
                Update Attendance Settings
              </h1>
            </v-col>
            <v-col
              cols="12"
              md="12"
            >
              <v-select
                v-model="e1"
                :items="weekstart"
                menu-props="auto"
                label="Week Start ?"
                hide-details
                prepend-icon="mdi-account-multiple"
                single-line
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-menu
                v-model="menu1"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="starttime"
                    label="Work Start Time"
                    prepend-inner-icon="mdi-clock"
                    readonly
                    v-on="on"
                  />
                </template>
                <v-time-picker
                  v-model="starttime"
                  @input="menu1 = false"
                />
              </v-menu>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-menu
                v-model="menu2"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="endtime"
                    label="Work End Time"
                    prepend-inner-icon="mdi-clock"
                    readonly
                    v-on="on"
                  />
                </template>
                <v-time-picker
                  v-model="endtime"
                  @input="menu2 = false"
                />
              </v-menu>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-menu
                v-model="menu3"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="overtimestarttime"
                    label="Overtime Start Time"
                    prepend-inner-icon="mdi-clock"
                    readonly
                    v-on="on"
                  />
                </template>
                <v-time-picker
                  v-model="overtimestarttime"
                  @input="menu3 = false"
                />
              </v-menu>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-menu
                v-model="menu4"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="doubleratrstarttime"
                    label="Double Rate Start Time"
                    prepend-inner-icon="mdi-clock"
                    readonly
                    v-on="on"
                  />
                </template>
                <v-time-picker
                  v-model="doubleratrstarttime"
                  @input="menu4 = false"
                />
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
           
            <v-col
              cols="12"
              md="6"
            >                
            
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
            
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-menu
                v-model="menu7"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="breakstarttime"
                    label="Break Start Time"
                    prepend-inner-icon="mdi-clock"
                    readonly
                    v-on="on"
                  />
                </template>
                <v-time-picker
                  v-model="breakstarttime"
                  @input="menu7 = false"
                />
              </v-menu>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-menu
                v-model="menu8"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="breakendtime"
                    label="Break End Time"
                    prepend-inner-icon="mdi-clock"
                    readonly
                    v-on="on"
                  />
                </template>
                <v-time-picker
                  v-model="breakendtime"
                  @input="menu8 = false"
                />
              </v-menu>
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
      <v-card
        color="grey lighten-5"
        class="mt-5"
      >
        <v-form
          ref="form"
          v-model="valid"
          class="ml-auto mr-auto"
          style="width:80%"
          lazy-validation
        >
          
        
        </v-form>
      </v-card>
    </v-container>
  </base-section>
</template>

<script>
  const axios = require('axios')
  export default {
    // name: 'SectionAffiliates',
    data() {
      return {
        userAvatar: '',
        companySettings: {
          name: '',
          email: '',
          website: '',
          address: '',
          city: '',
          country: '',
          selectedTimezone: '',
          zipcode: '',
          telephone: '',
          mobile: '',
          fieldofbussiness: '',
          selectedLanguage: '',
          typeofinstitution : ''
        },
        dialog: false,
        timezone: ['SouthAfica', 'American'],
        language: ['English', 'French','Arabic'],
        typeOfInstitution : ['School', 'University'],
        weekstart: ['Saturday', 'Sunday', 'Monday'],
        date: new Date().toISOString().substr(0, 10),
        menu1: false,
        menu2: false,
        menu3: false,
        menu4: false,
        menu5: false,
        menu6: false,
        menu7: false,
        menu8: false,
        userData: null,
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
      updateCompanySettings () {
        // Post data to api
        // On hold, because POST request isn't working right now
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
          const data = res.data.data
          this.userAvatar = data.employee.avatar
          this.companySettings.name = data.full_name
          this.companySettings.email = data.email
          this.companySettings.website = ''
          this.companySettings.address = data.employee.address
          this.companySettings.city = ''
          this.companySettings.country = ''
          this.companySettings.selectedTimezone = ''
          this.companySettings.zipcode = ''
          this.companySettings.telephone = data.employee.phone
          this.companySettings.mobile = data.employee.mobile_number
          this.companySettings.fieldofbussiness = ''
          this.companySettings.selectedLanguage = ''
          this.companySettings.typeofinstitution = ''

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

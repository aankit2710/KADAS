<template>
  <base-section
    id="affiliates"
    space="36"
    class="grey lighten-4"
  >
    <v-container
    class="mr-auto"
    style="width:80%"
    >
      <base-section-heading
      title="Manage Files"
      />
          <v-card
            class="pa-2 text-center"
            color="transparent"
            style="box-shadow:none"
          >
          <v-card-text>
            <v-row>
              <v-col
              cols="8"
              >
                <v-label>Select Class</v-label>
                <v-select
                  v-model="classto"
                  :items="classe"
                  menu-props="auto"
                  label="Class"
                  hide-details
                  prepend-inner-icon="mdi-account-multiple"
                  single-line
                ></v-select>
              </v-col>
              <v-col
                cols="4"
              >  
      
       <v-btn
                color="#4ebc2a"
                class="mr-4"
                @click="selected"
            >
                View Files
            </v-btn>
      
              </v-col>
            </v-row>
        </v-card-text>
        
            
        </v-card>
        <v-card
            color="grey lighten-4"
            flat
            height="100px"
        >
        </v-card>
    </v-container>
  </base-section>
</template>

<script>
  export default {
    name: 'SectionAffiliates',
    data () {
      return {
        showLoader: false,
        classe: [
          '1',
          '2',
          '3'
        ],
      }
    },
    methods: {
      selected() {
        this.$router.push({name: "Managefiles"})
      }
    },
  }

</script>

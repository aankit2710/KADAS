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
      title="Manage Lesson"
      />
          <v-card
            class="pa-2 text-center"
            color="transparent"
            style="box-shadow:none"
          >
            <v-btn
      :disabled="!valid"
      color="#4ebc2a"
      class="mr-4"
      @click="validate"
    >
      Export to Pdf
    </v-btn>
    <v-btn
      :disabled="!valid"
      color="#4ebc2a"
      class="mr-4"
      @click="validate"
    >
      Export to Pdf
    </v-btn>
          </v-card>
          <v-card
    color="grey lighten-4"
    flat
    height="100px"
  >
    <v-toolbar>

      <v-toolbar-title>Lesson</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-text-field
        hide-details
        append-icon="mdi-magnify"
        single-line
        placeholder="Search"
        class="pr-2 mr-2"
      ></v-text-field>
      <v-dialog
      v-model="dialog"
      persistent
      max-width="500px"
      >
      <template
      v-slot:activator="{ on }"
      >
        <v-btn
        color="#4ebc2a"
        dark
        v-on="on"
        >ADD</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Add Lesson</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
              cols="12"
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
                    v-model="streamstarttime"
                    label="Stream Start Time"
                    prepend-inner-icon="mdi-clock"
                    readonly
                    v-on="on"
                  />
                </template>
                <v-time-picker
                  v-model="streamstarttime"
                  @input="menu3 = false"
                />
              </v-menu>
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
                    v-model="streamendtime"
                    label="Stream End Time"
                    prepend-inner-icon="mdi-clock"
                    readonly
                    v-on="on"
                  />
                </template>
                <v-time-picker
                  v-model="streamendtime"
                  @input="menu2 = false"
                />
              </v-menu>
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
                v-model="date"
                label="Date of Stream"
                prepend-inner-icon="mdi-calendar"
                readonly
                v-on="on"
                ></v-text-field>
                </template>
                <v-date-picker
                v-model="date"
                @input="menu1 = false"
                ></v-date-picker>
                </v-menu>
                <v-textarea
                class="mx-2"
                label="For"
                rows="1"
                prepend-inner-icon="mdi-comment-processing"
                required
                ></v-textarea>
                <v-textarea
                class="mx-2"
                label="By"
                rows="1"
                prepend-inner-icon="mdi-account-multiple"
                required
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
          color="#4ebc2a darken-1"
          text
          @click="dialog = false"
          >Close</v-btn>
          <v-btn
          color="#4ebc2a"
          dark
          @click="dialog = false"
          >Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog1"
      persistent
      max-width="500px"
      >
      <template
      v-slot:activator="{ on }"
      >
        <v-btn
        class="ml-3"
        color="#4ebc2a"
        dark

        v-on="on"

        >UPLOAD CSV</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">UPLOAD CSV</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
              cols="12"
              >
                <v-file-input
                  v-model="courseCsv"
                  label="Upload CSV File"
                  multiple
                  prepend-icon="mdi-paperclip"


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
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
          color="#4ebc2a darken-1"
          text
          @click="dialog1 = false"
          >Close</v-btn>
          <v-btn
          color="#4ebc2a"
          dark
          @click="uploadCsvFile()"
          >Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </v-toolbar>
    <v-divider></v-divider>
    <v-data-table
    :headers="headers"
    :items="content"
    :items-per-page="5"
    class="elevation-1"
  ></v-data-table>
  </v-card>
    </v-container>
    <v-snackbar v-model="snackbar" :color="color" absolute centered elevation="24" bottom>
        {{ text }}
        <v-btn color="primary" @click="snackbar = false">Close</v-btn>
      </v-snackbar>
  </base-section>
</template>

<script>
const axios = require("axios");
  export default {
    name: 'SectionAffiliates',
    data () {
      return {
        dialog: false,
        dialog1: false,
        snackbar:false,
        color:'',
        headers: [
          {
            text: 'Student',
            align: 'start',
            sortable: false,
            value: 'student',
          },
          { text: 'Start', value: 'start' },
          { text: 'End', value: 'end' },
          { text: 'Reason', value: 'reason' },
          { text: 'Cancel', value: 'cancel' },
          { text: 'Action', value: 'action' },
        ],
        content: [
          {
          },
        ],
        date: new Date().toISOString().substr(0, 10),
        menu1: false,
        menu2: false,
        menu3: false,
        courseCsv:'',
        text:'',
        formData: new FormData(),
      }
    },
    created(){
      this.getStreamData();
    },
    methods:{
      uploadCsvFile(){
      const jwt = this.$store.state.sessionData[0].token
        const url = `https://school.kfundi.com/api/import/courses`
        this.formData.append('courses', this.courseCsv);
        axios.post(url,this.formData,
        {
          headers: {
            Authorization: 'Bearer ' + jwt
          }
        }
        ).then(res => {
          console.log(res);
          this.text='File upload successfully';
          this.color='green';
          this.snackbar=true;
          this.dialog1=false;
        }).catch( ()=>{
          console.log("exception occured");
          this.text='File upload failed';
          this.color='error';
          this.snackbar=true;
        })
    },
      getStreamData(){
        const jwt = this.$store.state.sessionData[0].token;
      const url = "https://school.kfundi.com/api/overtimes";
      axios.get(url,
         {
          headers: {
            Authorization: "Bearer " + jwt
          }
        }
      ).then(res =>{
        console.log(res.data);
      }).catch(() =>{
        console.log('exception occured');
      })
      }
    }
  }

</script>

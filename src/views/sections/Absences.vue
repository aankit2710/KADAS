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
      title="Manage Absences"
      />
          <v-card
            class="pa-2 text-center"
            color="transparent"
            style="box-shadow:none"
          >
            <v-btn
      color="#4ebc2a"
      class="mr-4"
      @click="exportAsPDF()"
    >
      Export to Pdf
    </v-btn>
    <v-btn>
      <export-excel
        :data="absences"
        :fields="json_fields"
        worksheet="Absences"
        name="absences.xls">

        Export as Excel
      </export-excel>
    </v-btn>
          </v-card>
          <v-card
    color="grey lighten-4"
    flat
    height="100px"
  >
    <v-toolbar>

      <v-toolbar-title>Absence</v-toolbar-title>

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
          <span class="headline">Add Absence</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
              cols="12"
              >
                <v-menu
                v-model="menu2"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
                >
                <template v-slot:activator="{ on }">
                <v-text-field
                v-model="start_date"
                label="Start Date"
                prepend-inner-icon="mdi-calendar"
                readonly
                v-on="on"
                ></v-text-field>
                </template>
                <v-date-picker
                v-model="start_date"
                @input="menu2 = false"
                ></v-date-picker>
                </v-menu>

                <v-menu
                v-model="menu1"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                  <v-text-field
                  v-model="end_date"
                  label="End Date"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  v-on="on"
                  ></v-text-field>
                  </template>
                  <v-date-picker
                  v-model="end_date"
                  @input="menu2 = false"
                  ></v-date-picker>
                </v-menu>

                <v-textarea
                  class="mx-2"
                  label="Reason"
                  v-model='reason'
                  rows="2"
                  prepend-inner-icon="mdi-comment-processing"
                  required
                ></v-textarea>

                <v-select
                  v-model="note"
                  :items="pay"
                  menu-props="auto"
                  label="Note"
                  hide-details
                  prepend-inner-icon="mdi-account-multiple"
                  single-line
                ></v-select>
                <v-file-input
    v-model="files"
    label="Doctor's Note"
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
            v-if='!sendUpdateReq'
            color="#4ebc2a"
            dark
            @click="saveNewAbsences()"
          >Save</v-btn>

          <v-btn
            v-if='sendUpdateReq'
            color="#4ebc2a"
            dark
            @click="sendUpdateAbsenceRequest()"
          >Update</v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>
    </v-toolbar>
    <v-divider></v-divider>
    <v-data-table
    :headers="headers"
    :loading='this.showLoader'
    loading-text='Loading absences...'
    :items="absences"
    :v-model='absences'
    :items-per-page="5"
    class="elevation-1"
  >
    <template v-slot:item.url="{ item }">
      <a v-if='item.url' :href='item.url' target='_blank'>view</a>
    </template>

    <template v-slot:item.contact="{ item }">
      <v-icon
        class='mx-2'
        small
        @click="shoWContactInfo(item,'mail')"
      >
        mdi-email
      </v-icon>
      <v-icon
        class='mx-2'
        small
        @click="shoWContactInfo(item,'contact')"
      >
        mdi-phone
      </v-icon>
       <v-icon
        class='mx-2'
        small
        @click="shoWContactInfo(item)"
      >
        mdi-message
      </v-icon>
    </template>
  </v-data-table>
  <v-dialog
    v-model="contactDialog"
    :key='contactInfo'
    persistent
    max-width="500px"
  >
    <v-card>
      <v-toolbar flat>
        <v-toolbar-title >Contact Info</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon
        >
          <v-icon @click='closeContactDialog()'>
            mdi-close
          </v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
          <v-card-subtitle  class='subtitle-1'> Name: <span class='body-1'> {{contactInfo.full_name}} </span></v-card-subtitle>

          <v-card-subtitle v-if='contactIconDialog' class='subtitle-1'> Mobile number: <span class='body-1'> {{contactInfo.mobile_number}} </span></v-card-subtitle>

          <v-card-subtitle v-if='contactIconDialog' class='subtitle-1'> Home number: <span class='body-1'> {{contactInfo.home_number}} </span></v-card-subtitle>

          <v-card-subtitle v-if='mailDialog' class='subtitle-1'> Email: <a :href=getMailUrl(contactInfo.private_email) target="_blank"> {{contactInfo.private_email}} </a></v-card-subtitle>

        <v-toolbar-title >Guardian Info</v-toolbar-title>

          <v-card-subtitle  class='subtitle-1'> Name: <span class='body-1'> {{contactInfo.first_guardian_name}} </span></v-card-subtitle>

          <v-card-subtitle v-if='contactIconDialog' class='subtitle-1'> Phone number: <span class='body-1'> {{contactInfo.first_guardian_phone}} </span></v-card-subtitle>

          <v-card-subtitle v-if='mailDialog' class='subtitle-1'> Email: <a :href=getMailUrl(contactInfo.first_guardian_email) target="_blank"> {{contactInfo.first_guardian_email}} </a></v-card-subtitle>
      </v-card-text>
    </v-card>
  </v-dialog>
  </v-card>
    </v-container>
  </base-section>
</template>

<script>
import jsPDF from 'jspdf'
import 'jspdf-autotable'
const axios = require('axios')

  export default {
    name: 'SectionAffiliates',
    data () {
      return {
        showLoader: false,
        dialog: false,
        headers: [
          {
            text: 'Student',
            align: 'start',
            sortable: false,
            value: 'student',
          },
          { text: 'Date', value: 'start' },
          { text: 'Note', value: 'note' },
          { text: 'URL', value: 'url'},
          { text: 'Reason', value: 'reason' },
          { text: 'Contact', value: 'contact' }
        ],
        absences: [],
        json_fields: {
          "Student": "student",
          "Date": "start",
          "URL": "url",
          "Reason": "reason",
          "Note": "note"
        },
        json_meta: [
            [{ 'key': 'charset', 'value': 'utf-8' }]
        ],

        type: [
        ],
        time: [
        ],
        pay: ['guardian', 'doctor'],
        start_date: new Date().toISOString().substr(0, 10),
        end_date: new Date().toISOString().substr(0, 10),
        reason: '',
        note: '',
        menu1: false,
        mailDialog:false,
        contactIconDialog:false,
        menu2: false,
        sendUpdateReq: false,
        updateData: null,
        contactInfo: {},
        contactDialog: false
      }
    },

    mounted () {
      this.getAbsences()
    },

    methods: {
      closeContactDialog(){
        this.contactDialog=false;
        this.mailDialog=false;
        this.contactIconDialog=false;
      },
      getAbsences () {
        this.showLoader = true
        const jwt = this.$store.state.sessionData[0].token
        const url = 'https://school.kfundi.com/api/absences'
        axios.get(url, {
          headers: {
            Authorization: 'Bearer ' + jwt
          }
        })
        .then((res) => {
          this.showLoader = false;
          const absentees = res.data.data
          absentees.forEach(datum => {
            this.absences.push(
              {
                // start end notes reason cancel
                id: datum.id,
                student: datum.learner_fullname,
                start: datum.date,
                url: datum.url,
                reason: datum.reason,
                note: datum.note_from,
                learner_id: datum.learner_id
              }
            )
          })
        })
        .catch((e) => {
          this.showLoader = false;
          console.log('Couldn\'t fetch data due to: ', e)
        })
      },

      saveNewAbsences () {
        this.dialog = false
        const jwt = this.$store.state.sessionData[0].token
        const url = 'https://school.kfundi.com/api/absences'
        axios.post(url, [], {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            Authorization: 'Bearer ' + jwt,
          },
          data: {
            date: this.start_date,
            reason: this.reason,
            note_from: this.note,
            learner_id: '6A2lxwBb53W5rkGX1oVd',
            learner_fullname: 'some dummhy name'
          },
        })
        .then((res) => {
          // ToDo: Add snackbar with success message
          console.log('response: ', res)
          this.getAbsences()
        })
        .catch((e) => {
          // ToDo: Add snackbar with error message
          console.log('Couldn\'t fetch data due to: ', e)
        })
      },

      exportAsPDF () {
        var columns = [
          {title: "Student", dataKey: "student"},
          {title: "date", dataKey: "start"},
          {title: "URL", dataKey: "url"},
          {title: "Reason", dataKey: "reason"},
          {title: "Note", dataKey: "note"}

        ];
        const doc = new jsPDF('p', 'pt');
        doc.text('Absences PDF', 40, 40);
        doc.autoTable(columns, this.absences, {
          margin: {top: 60},
        });
        doc.save('absences.pdf');
      },

      shoWContactInfo (item,icon) {
        const jwt = this.$store.state.sessionData[0].token
        const url = `https://school.kfundi.com/api/learners/${item.learner_id}`
        axios.get(url, {
          headers: {
            Authorization: 'Bearer ' + jwt
          }
        })
        .then((res) => {
          const datum = res.data.data
          console.log(res.data.data);
          this.contactInfo =
          {
            full_name: datum.full_name,
            mobile_number: datum.mobile_number,
            home_number: datum.home_number,
            private_email: datum.private_email,
            first_guardian_name: datum.first_guardian_name,
            first_guardian_phone: datum.first_guardian_phone,
            first_guardian_email: datum.first_guardian_email
          }
          if(icon ==='mail')
          this.mailDialog=true;
          else if(icon === 'contact')
          this.contactIconDialog=true;
          this.contactDialog = true
        })
        .catch((e) => {
          this.showLoader = false;
          console.log('Couldn\'t fetch data due to: ', e)
        })
      },
      getMailUrl (mail) {
        return `mailto:${mail}`
      }
    }
  }

</script>

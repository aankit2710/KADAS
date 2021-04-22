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
      title="Manage Create Class"
      />
          <v-card
            class="pa-2 text-center"
            color="transparent"
            style="box-shadow:none"
          >
    <v-btn
      color="#4ebc2a"
      class="mr-4"
      @click="exportToPDF()"
    >
      Export to Pdf
    </v-btn>
    <v-btn>
      <export-excel
        :data="classes"
        :fields="json_fields"
        worksheet="Classes"
        name="classes.xls">

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

      <v-toolbar-title>Create Class</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-text-field
        hide-details
        append-icon="mdi-magnify"
        single-line
        placeholder="Search"
        class="pr-2 mr-2"
      ></v-text-field>
      <v-dialog
      v-model="classDialog"
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
          <span v-if='!sendUpdateReq' class="headline">Create Class</span>
          <span v-else class="headline">Update Class</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
              cols="12"
              >
                <v-text-field
                label="Course Name"
                v-model="courseName"
                prepend-inner-icon="mdi-format-title"
                required
                />
                <v-text-field
                label="Description"
                v-model="courseDescription"
                prepend-inner-icon="mdi-format-title"
                required
                />
                <v-text-field
                label="Grade"
                v-model="grade"
                prepend-inner-icon="mdi-format-title"
                required
                />
                <v-text-field
                label="Educator Id"
                v-model="educatorId"
                prepend-inner-icon="mdi-format-title"
                required
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
          color="#4ebc2a darken-1"
          text
          @click="closeDialog()"
          >Close</v-btn>
          <v-btn
            v-if='!sendUpdateReq'
            color="#4ebc2a"
            dark
            v-model='sendUpdateReq'
            @click="saveNewClass()"
          >Save</v-btn>

          <v-btn
            v-if='sendUpdateReq'
            color="#4ebc2a"
            dark
            v-model='sendUpdateReq'
            @click="sendUpdateClassRequest()"
          >Update</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-dialog
      v-model="participantDialog"
      persistent
      :value='circularLoader'
      max-width="500px"
    >

      <v-card>
        <template v-if='circularLoader'>
          <div class='text-center'>
            <v-progress-circular
              indeterminate
              color="#4ebc2a"
            ></v-progress-circular>
          </div>
        </template>
        <div v-else>
          <v-card-title>
            <span class="headline">Add Class Participant</span>
          </v-card-title>
          <v-card-text>

            <v-select
              v-model='selectedLearner'
              :items='this.learners'
              label='Learners'
            >
            </v-select>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click='closeParticipantDialog'>
              Close
            </v-btn>
            <v-btn
            color='#4ebc2a'
            class='white--text'
            @click='addNewClassParticipant'
            >Add
            </v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>


    </v-toolbar>
    <v-divider></v-divider>
    <v-data-table
    :headers="headers"
    :loading='this.showLoader'
    loading-text='Loading classes...'
    :items="classes"
    v-model='classes'
    :items-per-page="5"
    class="elevation-1"
  >
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editClass(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteClass(item)"
      >
        mdi-delete
      </v-icon>

      <v-icon
        small
        @click="openParticipantDialog(item)"
      >
        mdi-account-plus
      </v-icon>
    </template>
  </v-data-table>
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
            text: 'Teacher',
            align: 'start',
            sortable: false,
            value: 'educator',
          },
          { text: 'Subject', value: 'name' },
          { text: 'Title', value: 'title' },
          { text: 'Grade', value: 'grade' },
          // { text: 'Teacher', value: 'teacher' },
          { text: 'Description', value: 'description' },
          { text: 'Created at', value: 'created_at' },
          { text: 'Actions', value: 'actions' },
        ],
        classes: [],
        courseClass: '',
        json_fields: {
          "Subject": "subject",
          "Grade": "grade",
          "Class": "class"
        },
        json_meta: [
          [{ 'key': 'charset', 'value': 'utf-8' }]
        ],

        type: [
        ],
        time: [
        ],
        pay: [
        ],
        date: new Date().toISOString().substr(0, 10),
        menu1: false,
        menu2: false,
        participantDialog: false,
        circularLoader: false,
        selectedLearner: '',
        learners: [],
        selectedClass: '',
        updatedData: {},
        classDialog: false,
        courseDescription: '',
        courseName: '',
        grade: '',
        educatorId: '',
        sendUpdateReq: false,
        updateData: false,
      }
    },
    mounted () {
      this.getClassesData()
      this.getLearners()
    },
    methods: {
      validate () {
        const jwt = this.$store.state.sessionData[0].token
        const url = 'https://school.kfundi.com/api/courses'
        axios.post(url, {
          headers: {
            Authorization: 'Bearer ' + jwt,
          },
          data: {
            name: this.classe,
            description: this.subject,
            grade: this.grade,
            educator_id: this.educatorId,
          },
        })
          .then(resp => {
            const token = resp.data.token
            alert(token)
          })
          .catch(err => console.log(err))
        this.$refs.form.validate()
      },
      reset () {
        this.$refs.form.reset()
      },
      resetValidation () {
        this.$refs.form.resetValidation()
      },

      saveNewClass () {
        this.dialog = false
        const jwt = this.$store.state.sessionData[0].token
        const url = 'https://school.kfundi.com/api/courses'
        axios.post(url, [], {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            Authorization: 'Bearer ' + jwt,
          },
          data: {
            name: this.courseName,
            description: this.courseDescription,
            grade: this.grade,
            educator_id: this.educatorId
            // creator_id: this.$store.state.sessionData[1].user.id,
          },
        })
        .then((res) => {
          console.log(res)
          // ToDo: Add snackbar with success message
          this.getClassesData()
        })
        .catch((e) => {
          // ToDo: Add snackbar with error message
          console.log('Couldn\'t fetch data due to: ', e)
        })
      },

      editClass (item) {

        this.courseName = item.name
        this.courseDescription = item.description
        this.grade = item.grade
        // this.educatorId = item.educator_id

        this.sendUpdateReq = true
        this.classDialog = true
        this.updateData = {
          id: item.id
        }
      },


      getClassesData () {
        this.showLoader = true
        const jwt = this.$store.state.sessionData[0].token
        const url = 'https://school.kfundi.com/api/courses'
        axios.get(url, {
          headers: {
            Authorization: 'Bearer ' + jwt
          }
        })
        .then((res) => {
          this.showLoader = false;
          this.classes= res.data.data
          console.log(res.data.data);
          // courseList.forEach(datum => {
          //   this.classes.push(
          //     {
          //       id: datum.id,
          //       subject: datum.name,
          //       title: datum.title,
          //       description: datum.description,
          //       grade: datum.grade,
          //       created_at:datum.created_at,
          //       teacher: datum.educator,
          //       actions: {}
          //     }
          //   )
          // })
          console.log(this.classes);
        })
        .catch((e) => {
          this.showLoader = false;
          console.log('Couldn\'t fetch data due to: ', e)
        })
      },
      exportToPDF () {
        var columns = [
          {title: "Subject", dataKey: "subject"},
          {title: "Grade", dataKey: "grade"},
          {title: "Class", dataKey: "class"}
        ];
        const doc = new jsPDF('p', 'pt');
        doc.text('Classes PDF', 40, 40);
        doc.autoTable(columns, this.classes, {
          margin: {top: 60},
        });
        doc.save('classes.pdf');
      },
      selected() {
        this.$router.push({name: "Learner"})
      },

      addNewClassParticipant () {
        // this.participantDialog = false
        const jwt = this.$store.state.sessionData[0].token
        const url = `https://school.kfundi.com/api/courses/${this.selectedClass.id}/learners`
        axios.post(url, [], {
          headers: {
            'Accept': 'application/json',
            Authorization: 'Bearer ' + jwt,
          },
          data: {
            learner_id: this.selectedLearner
          },
        })
        .then((res) => {
          // ToDo: Add snackbar with success message
          console.log(res)
          this.participantDialog = false
        })
        .catch((e) => {
          // ToDo: Add snackbar with error message
          console.log('Couldn\'t fetch data due to: ', e)
          this.courseId = ''
          this.participantDialog = false
        })
      },


      openParticipantDialog (item) {
        this.participantDialog = true
        this.selectedLearner = ''
        this.circularLoader = true
        this.selectedClass = item
        this.getLearners()
      },

      closeParticipantDialog () {
        this.selectedLearner = ''
        this.selectedClass = false
        this.learners = []
        this.participantDialog = false
        this.courseId = ''
      },

      getLearners () {
        const jwt = this.$store.state.sessionData[0].token
        const url = `https://school.kfundi.com/api/learners`
        axios.get(url, {
          headers: {
            Authorization: 'Bearer ' + jwt
          }
        })
        .then((res) => {
          // console.log(res)
          // alert(res)
          const userList = res.data.data
          userList.forEach((datum) => {
            // console.log('datum is: ', datum)
            this.learners.push(
              {text: datum.full_name, value: datum.id }
            )
          })
          this.circularLoader = false
        })
        .catch((e) => {
          // ToDo: Add snackbar with error message
          console.log('Couldn\'t fetch data due to: ', e)
          this.circularLoader = false
        })
      },

      deleteClass (item) {
        // this.participantDialog = false
        const jwt = this.$store.state.sessionData[0].token
        const url = `https://school.kfundi.com/api/courses/${item.id}`
        axios.delete(url, {
          headers: {
            'Accept': 'application/json',
            Authorization: 'Bearer ' + jwt,
          }
        })
        .then((res) => {
          // ToDo: Add snackbar with success message
          console.log(res)
          this.classes = []
          this.getClassesData()
        })
        .catch((e) => {
          // ToDo: Add snackbar with error message
          console.log('Couldn\'t fetch data due to: ', e)
        })
      },


      sendUpdateClassRequest () {
        const jwt = this.$store.state.sessionData[0].token
        const url = `https://school.kfundi.com/api/courses/${this.updateData.id}?_method=PATCH`
       axios.post(url, [], {
          headers: {
            'Accept': 'application/json',
            Authorization: 'Bearer ' + jwt,
          },
          data: {
            name: this.courseName,
            description: this.courseDescription,
            grade: this.grade,
            // educator_id: this.educatorId,
          },
        })
        .then((res) => {
          console.log(res)
          this.classes = []
          this.sendUpdateReq = false
          this.updateData = false
          this.classDialog = false
          // ToDo: Add snackbar with success message
          this.getClassesData()
        })
        .catch((e) => {
          // ToDo: Add snackbar with error message
          this.sendUpdateReq = false
          this.updateData = false
          this.dialog = false
          console.log('Couldn\'t fetch data due to: ', e)
        })
      },
      closeDialog(){
        this.classDialog = false;
        this.sendUpdateReq=false;
      }
    },
  }

</script>

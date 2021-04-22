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
      title="Manage Annoucement"
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
                :data="announcements"
                :fields="json_fields"
                worksheet="Announcements"
                name="announcements.xls">

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

      <v-toolbar-title>Announcements</v-toolbar-title>

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
      max-width="600px"
      >
      <template
      v-slot:activator="{ on }"
      >
        <v-btn
        color="#4ebc2a"
        dark
        v-on="on"
        @click="openAddDialog()"
        >ADD</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">New Announcement</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
              cols="12"
              >
                <v-text-field
                label="Title"
                v-model='title'
                prepend-inner-icon="mdi-format-title"
                required
                />
                <v-textarea
                class="mx-2"
                label="Body"
                v-model='body'
                rows="2"
                prepend-inner-icon="mdi-comment-processing"
                required
                ></v-textarea>
                <v-select
                  v-model='participants'
                  v-if="!sendUpdateReq"
                  :items='this.users'
                  label='Users'
                  multiple
                  chips
                >
                </v-select>
                <v-text-field
                  v-model='courseId'
                  v-if="!sendUpdateReq"
                  label='Course Id'
                ></v-text-field>
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
            v-model='sendUpdateReq'
            @click="saveNewAnnouncement()"
          >Save</v-btn>

          <v-btn
            v-if='sendUpdateReq'
            color="#4ebc2a"
            dark
            v-model='sendUpdateReq'
            @click="sendUpdateAnnouncementRequest()"
          >Update</v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-dialog
      v-model="participantDialog"
      persistent
      :value='circularLoader'
      max-width="700px"
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
            <span class="headline">Add Announcement Participant</span>
          </v-card-title>
          <v-card-text>

            <v-select
              v-model='participants'
              :items='this.users'
              label='Users'
              multiple
              chips
            >
            </v-select>

            <v-text-field
              v-model='courseId'
              label='Course Id'
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click='closeParticipantDialog'>
              Close
            </v-btn>
            <v-btn
            color='#4ebc2a'
            class='white--text'
            @click='addNewParticipant'
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
    loading-text='Loading announcements...'
    :v-model='announcements'
    :items="announcements"
    :items-per-page="5"
    class="elevation-1"
  >
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        @click="editAnnouncement(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteAnnouncement(item)"
      >
        mdi-delete
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
        title: '',
        body: '',
        headers: [
          {
            text: 'Title',
            align: 'start',
            sortable: false,
            value: 'title',
          },
          { text: 'Body', value: 'body' },
          { text: 'Creator', value: 'creator' },
          { text: 'Created At', value: 'created' },
          { text: 'Actions', value: 'actions' },
        ],
        announcements: [],
        sendUpdateReq: false,
        updateData: null,

        json_fields: {
            'Title': 'title',
            'Body': 'body',
            'Creator': 'creator',
            'Starts At' : 'start',
            'Created At': 'created'
        },
        json_meta: [
          [{ 'key': 'charset', 'value': 'utf-8' }]
        ],
        participantDialog: false,
        participants: [],
        users: [],
        circularLoader: false,
        selectedAnnouncement: null,
        courseId: '',

      }
    },
    mounted () {
      this.getAnnouncements()
      this.getUsers()
    },
    methods: {
      openAddDialog(){
        this.sendUpdateReq=false;
        this.dialog=true;
      },
      getAnnouncements () {
        this.showLoader = true
        const jwt = this.$store.state.sessionData[0].token
        const url = 'https://school.kfundi.com/api/announcements'
        axios.get(url, {
          headers: {
            Authorization: 'Bearer ' + jwt
          }
        })
        .then((res) => {
          this.showLoader = false
          this.announcements = []
          const announcementList = res.data.data
          console.log(res.data.data);
          announcementList.forEach(datum => {
            this.announcements.push(
              {
                title: datum.title,
                body: datum.body,
                id: datum.id,
                creator: datum.creator.full_name,
                created: datum.created_at,
                actions: { edit: 'mdi-pencil', viewResult: 'mdi-delete' }
              }
            )
          })
        })
        .catch((e) => {
          this.showLoader = false;
          console.log('Couldn\'t fetch data due to: ', e)
        })
      },
      saveNewAnnouncement () {
        this.dialog = false
        const jwt = this.$store.state.sessionData[0].token
        const url = 'https://school.kfundi.com/api/announcements'
        axios.post(url, [], {
          headers: {
            'Accept': 'application/json',
            Authorization: 'Bearer ' + jwt,
          },
          data: {
            title: this.title,
            body: this.body,
            creator_id: this.$store.state.sessionData[1].user.id,
            type_id:  this.selectedAnnouncement
          },
        })
        .then((res) => {
          console.log(res)
          // ToDo: Add snackbar with success message
          this.getAnnouncements()
          this.selectedAnnouncement = res.data.data
          this.addNewParticipant()
        })
        .catch((e) => {
          // ToDo: Add snackbar with error message
          console.log('Couldn\'t fetch data due to: ', e)
        })
      },

      exportAsPDF () {
        var columns = [
          {title: "Title", dataKey: "title"},
          {title: "Body", dataKey: "body"},
          {title: "Creator", dataKey: "creator"},
          {title: "Created", dataKey: "created"}

        ];
        const doc = new jsPDF('p', 'pt');
        doc.text('Announcements PDF', 40, 40);
        doc.autoTable(columns, this.announcements, {
          margin: {top: 60},
        });
        doc.save('announcements.pdf');
      },
      deleteAnnouncement (item) {
        if(confirm('Are you sure you want to delete this announcement?')) {
          const jwt = this.$store.state.sessionData[0].token
          const url = `https://school.kfundi.com/api/announcements/${item.id}`
          axios.delete(url, {
            headers: {
              Authorization: 'Bearer ' + jwt
            }
          })
          .then((res) => {
            console.log(res)
            this.announcements = []
            this.getAnnouncements()
          })
          .catch((e) => {
            console.log('Couldn\'t fetch data due to: ', e)
          })
        }
      },
      editAnnouncement (item) {
        this.title = item.title
        this.body = item.body
        this.sendUpdateReq = true
        this.dialog = true
        this.updateData = {
          title: this.title,
          body: this.body,
          id: item.id,
          creator_id: this.$store.state.sessionData[1].user.id
        }
      },
      sendUpdateAnnouncementRequest () {
        const jwt = this.$store.state.sessionData[0].token
        const url = `https://school.kfundi.com/api/announcements/${this.updateData.id}?_method=PATCH`
        axios.post(url, {
          title:this.title,
          body:this.body
        }, {
          headers: {
            'Accept': 'application/json',
            Authorization: 'Bearer ' + jwt,
          },
          // data: {
          //   title: this.updateData.title,
          //   body: this.updateData.body
          // },
        })
        .then((res) => {
          console.log(res)
          this.sendUpdateReq = false
          this.updateData = false
          this.dialog = false
          // ToDo: Add snackbar with success message
          this.getAnnouncements()
        })
        .catch((e) => {
          // ToDo: Add snackbar with error message
          this.sendUpdateReq = false
          this.updateData = false
          this.dialog = false
          console.log('Couldn\'t fetch data due to: ', e)
        })
      },
      openParticipantDialog (item) {
        this.participantDialog = true
        this.participants = []
        this.circularLoader = true
        this.selectedAnnouncement = item
        this.getUsers()
      },

      getUsers () {
        const jwt = this.$store.state.sessionData[0].token
        const url = `https://school.kfundi.com/api/users`
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
            this.users.push(
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

      closeParticipantDialog () {
        this.participants = []
        this.selectedAnnouncement = false
        this.users = []
        this.participantDialog = false
        this.courseId = ''
      },

      addNewParticipant () {
        this.participantDialog = false
        const jwt = this.$store.state.sessionData[0].token
        const url = `https://school.kfundi.com/api/announcements/${this.selectedAnnouncement.id}/participants`
        axios.post(url, [], {
          headers: {
            'Accept': 'application/json',
            Authorization: 'Bearer ' + jwt,
          },
          data: {
            user_id: this.$store.state.sessionData[1].user.id,
            users: this.participants,
            course_id: this.courseId
          },
        })
        .then((res) => {
          // ToDo: Add snackbar with success message
          console.log(res)
          this.participants = []
          this.courseId = ''
        })
        .catch((e) => {
          // ToDo: Add snackbar with error message
          console.log('Couldn\'t fetch data due to: ', e)
          this.participants = []
          this.courseId = ''
        })
      },
    }
  }

</script>

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
      title="Manage Events"
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
                :data="events"
                :fields="json_fields"
                worksheet="Events"
                name="events.xls">

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

      <v-toolbar-title>Events</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-text-field
        hide-details
        append-icon="mdi-magnify"
        single-line
        placeholder="Search"
        class="pr-2 mr-2"
      ></v-text-field>

      <v-btn
          color="#4ebc2a"
          dark
          @click='openNewEventDialog()'
        >ADD</v-btn>

    <v-dialog
      v-model="dialog"
      persistent
      max-width="500px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">New Event</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
              cols="12"
              >
                <v-text-field
                label="Name"
                v-model="name"
                prepend-inner-icon="mdi-format-title"
                required
                />
                <v-textarea
                class="mx-2"
                label="Description"
                v-model="description"
                rows="2"
                prepend-inner-icon="mdi-comment-processing"
                required
                ></v-textarea>

                <v-menu
                  v-model="startDateMenu"
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
                    @input="startDateMenu = false"
                  ></v-date-picker>
                </v-menu>

                <v-dialog
                  ref="startTimeModal"
                  v-model="startTimeModal"
                  :return-value.sync="startTime"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="startTime"
                      label="Start Time"
                      prepend-inner-icon="mdi-alarm"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="startTimeModal"
                    v-model="startTime"
                    full-width
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="#4ebc2a" @click="startTimeModal = false">Cancel</v-btn>
                    <v-btn text color="#4ebc2a" @click="$refs.startTimeModal.save(startTime)">OK</v-btn>
                  </v-time-picker>
                </v-dialog>

                <v-menu
                  v-model="endDateMenu"
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
                    @input="endDateMenu = false"
                  ></v-date-picker>
                </v-menu>

                <v-dialog
                  ref="endTimeModal"
                  v-model="endTimeModal"
                  :return-value.sync="endTime"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="endTime"
                      label="End Time"
                      prepend-inner-icon="mdi-alarm"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="endTimeModal"
                    v-model="endTime"
                    full-width
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="#4ebc2a" @click="endTimeModal = false">Cancel</v-btn>
                    <v-btn text color="#4ebc2a" @click="$refs.endTimeModal.save(endTime)">OK</v-btn>
                  </v-time-picker>
                </v-dialog>

                <v-select
                  v-model="selectedEventType"
                  :items="eventTypes"
                  :value='eventTypes'
                  menu-props="auto"
                  label="Event Type"
                  hide-details
                  prepend-inner-icon="mdi-account-multiple"
                  single-line
                ></v-select>
                <v-select
                  v-model="usertype"
                  :items="user"
                  menu-props="auto"
                  label="User"
                  hide-details
                  prepend-inner-icon="mdi-account-multiple"
                  single-line
                ></v-select>
                <v-select
                v-model="dataa"
                :items="dataa"
                menu-props="auto"
                label="User Data"
                hide-details
                prepend-inner-icon="mdi-account-multiple"
                single-line
                ></v-select>
                <v-select
                v-model="classes"
                :items="classes"
                menu-props="auto"
                label="Class"
                hide-details
                prepend-inner-icon="mdi-account-multiple"
                single-line
                ></v-select>
                <v-textarea
                class="mx-2"
                label="Note"
                rows="1"
                v-model='note'
                prepend-inner-icon="mdi-comment-processing"
                required
                ></v-textarea>

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
          >Close
          </v-btn>

          <v-btn
            v-if='!sendUpdateReq'
            color="#4ebc2a"
            dark
            v-model='sendUpdateReq'
            @click="saveNewEvent()"
          >Save</v-btn>

          <v-btn
            v-if='sendUpdateReq'
            color="#4ebc2a"
            dark
            v-model='sendUpdateReq'
            @click="sendUpdateEventRequest()"
          >Update</v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-dialog
      v-model='showParticipants'
      width="400"
      style="height:200px"
    >
      <v-card v-model="participantsToShow">
        <v-card-title>Event Participants</v-card-title>
        <v-list v-if='participantsToShow.length'>
          <v-list-item v-for='(i) in participantsToShow' :key="i.full_name">
            <v-list-item-avatar>
              <v-img :src="i.avatar"></v-img>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="i.full_name"></v-list-item-title>
              <v-list-item-subtitle v-text="i.phone"></v-list-item-subtitle>

            </v-list-item-content>
          </v-list-item>
        </v-list>
        <span v-else class='ma-5'> No participants found...</span>
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
            <span class="headline">Add Event Participant</span>
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
            @click='addNewEventParticipant'
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
    loading-text='Loading events...'
    :items="events"
    :v-model='events'
    :items-per-page="5"
    class="elevation-1"
  >
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editEvent(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteEvent(item)"
      >
        mdi-delete
      </v-icon>


    </template>

    <template v-slot:item.participants="{ item }">
      <v-icon
        small
        class="mr-2"
        :key='item'
        @click="showEventParticipants(item.id)"
      >
        mdi-account-details
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
        circularLoader: false,
        dialog: false,
        headers: [
          {
            text: 'Creator',
            align: 'start',
            sortable: false,
            value: 'creator',
          },
          { text: 'Name', value: 'name' },
          { text: 'Descriptions', value: 'descriptions' },
          { text: 'Start Date', value: 'start_date' },
          { text: 'Visible To', value: 'user' },
          { text: 'End', value: 'end_date' },
          { text: 'Note', value: 'note' },
          { text: 'Participants', value: 'participants'},
          { text: 'Actions', value: 'actions' },
        ],
        events: [],

        json_fields: {
          "Name": "name",
          "Descriptions": "descriptions",
          "Start Date": "start_date",
          "End Date": "end_date",
          "Notes": "note",
        },
        json_meta: [
          [{ 'key': 'charset', 'value': 'utf-8' }]
        ],

        type: [
        ],
        time: [
        ],
        eventTypes: [],
        user: [
          'Learner',
          'Educator',
          'Both',
        ],
        dataa: [
          'data1',
          'data2',
        ],
        classes: [
        ],
        date: new Date().toISOString().substr(0, 10),
        endDateMenu: false,
        startDateMenu: false,
        sendUpdateReq: false,
        updateData: null,
        name: '',
        description: '',
        note: '',
        start_date: new Date().toISOString().substr(0, 10),
        end_date: new Date().toISOString().substr(0, 10),
        selectedEventType: '',
        users: [],
        participants: [],
        participantDialog: false,
        selectedEvent: null,
        courseId: '',
        startTimeModal: false,
        startTime: '',
        endTimeModal: false,
        endTime: '',
        showParticipants: false,
        participantsToShow: []
      }
    },

    mounted () {
      this.getEvents()
      this.getUsers()
    },

    methods: {
      validate () {
        const jwt = this.$store.state.sessionData[0].token
        const url = 'https://school.kfundi.com/api/events'
        axios.post(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + jwt,
          },
          data: {
            name: this.name,
            description: this.description,
            note: '123',
            start_date: this.startdate,
            end_date: this.end_date,
            type_id: this.selectedEventType,
            creator_id: '1',
            actions: { edit: 'mdi-pencil', viewResult: 'mdi-delete' }
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


      getEvents () {
        this.showLoader = true
        const jwt = this.$store.state.sessionData[0].token
        const url = 'https://school.kfundi.com/api/events'
        axios.get(url, {
          headers: {
            Authorization: 'Bearer ' + jwt
          }
        })
        .then((res) => {
          this.showLoader = false;
          const eventList = res.data.data
          console.log(res.data.data);
          eventList.forEach(datum => {
            this.events.push(
              {
                id: datum.id,
                name: datum.name,
                descriptions: datum.description,
                note: datum.note,
                start_date: datum.start_date,
                end_date: datum.end_date,
                creator : datum.creator,
                participants: datum.participants,
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

      saveNewEvent () {
        this.dialog = false
        const jwt = this.$store.state.sessionData[0].token
        const url = 'https://school.kfundi.com/api/events'

        axios.post(url, [], {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            Authorization: 'Bearer ' + jwt,
          },
          data: {
            name: this.name,
            description: this.description,
            note: this.note,
            start_date: `${this.start_date} ${this.startTime}:00`,
            end_date: `${this.end_date} ${this.endTime}:00`,
            type_id:  this.selectedEventType
          },
        })
        .then((res) => {
          // ToDo: Add snackbar with success message
          console.log('response: ', res)
          this.selectedEvent = res.data.data
          this.events = []
          this.getEvents()
          this.addNewEventParticipant()
        })
        .catch((e) => {
          // ToDo: Add snackbar with error message
          console.log('Couldn\'t fetch data due to: ', e)
        })
      },

      exportAsPDF () {
        var columns = [
          {title: "Name", dataKey: "name"},
          {title: "Descriptions", dataKey: "descriptions"},
          {title: "Notes", dataKey: "note"},
          {title: "Start Date", dataKey: "start_date"},
          {title: "End Date", dataKey: "end_date"}

        ];
        const doc = new jsPDF('p', 'pt');
        doc.text('Events PDF', 40, 40);
        doc.autoTable(columns, this.events, {
          margin: {top: 60},
        });
        doc.save('events.pdf');
      },
      deleteEvent (item) {
        this.showLoader = true
        if(confirm('Are you sure you want to delete this event?')) {
          const jwt = this.$store.state.sessionData[0].token
          const url = `https://school.kfundi.com/api/events/${item.id}`
          axios.delete(url, {
            headers: {
              Authorization: 'Bearer ' + jwt
            }
          })
          .then((res) => {
            this.showLoader = false
            console.log(res)
            this.events = []
            this.getEvents()
          })
          .catch((e) => {
            this.showLoader = false
            console.log('Couldn\'t fetch data due to: ', e)
          })
        }
      },
      editEvent (item) {
        this.name = item.name
        this.end_date = item.end_date
        this.start_date = item.start_date
        this.note = item.note
        this.description = item.descriptions

        this.sendUpdateReq = true
        this.dialog = true
        this.updateData = {
          name: this.name,
          id: item.id
        }
      },

      sendUpdateEventRequest () {
        const jwt = this.$store.state.sessionData[0].token
        const url = `https://school.kfundi.com/api/events/${this.updateData.id}?_method=PATCH`
       axios.post(url, [], {
          headers: {
            Authorization: 'Bearer ' + jwt,
          },
          data: {
            name: this.name,
            start_date: this.start_date,
            end_date: this.end_date,
            note: this.note,
            description: this.description
          },
        })
        .then((res) => {
          console.log(res)
          this.events = []
          this.sendUpdateReq = false
          this.updateData = false
          this.dialog = false
          // ToDo: Add snackbar with success message
          this.getEvents()
        })
        .catch((e) => {
          // ToDo: Add snackbar with error message
          this.sendUpdateReq = false
          this.updateData = false
          this.dialog = false
          console.log('Couldn\'t fetch data due to: ', e)
        })
      },
      openNewEventDialog () {
        this.getEventTypes()
        this.dialog = true
      },

      openParticipantDialog (item) {
        this.participantDialog = true
        this.participants = []
        this.circularLoader = true
        this.selectedEvent = item
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
        this.selectedEvent = false
        this.users = []
        this.participantDialog = false
        this.courseId = ''
      },

      addNewEventParticipant () {
        this.participantDialog = false
        const jwt = this.$store.state.sessionData[0].token
        const url = `https://school.kfundi.com/api/events/${this.selectedEvent.id}/participants`
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
      getEventTypes () {
        const jwt = this.$store.state.sessionData[0].token
        const url = `https://school.kfundi.com/api/event-types`
        axios.get(url, {
            headers: {
              Authorization: 'Bearer ' + jwt
            }
          })
          .then((res) => {
            const eventTypesList = res.data.data
            eventTypesList.forEach((datum) => {
              this.eventTypes.push(
                {text: datum.name, value: datum.id }
              )
            })
          })
          .catch((e) => {
            // ToDo: Add snackbar with error message
            console.log('Couldn\'t fetch data due to: ', e)
          })
      },
      showEventParticipants (p) {
        // console.log(p);
        console.log('key is :'+p);
         const jwt = this.$store.state.sessionData[0].token
        const url = `https://school.kfundi.com/api/events/${p}/participants`
        axios.get(url, {
            headers: {
              Authorization: 'Bearer ' + jwt
            }
          })
          .then(res => {
            this.participantsToShow = res.data.data;
            this.showParticipants = true
          }).catch( e =>{
            console.log('error while fetching data'+e);
          })


      }
    }
  }

</script>

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
      title="Manage Tasks"
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
        :data="tasks"
        :fields="json_fields"
        worksheet="Tasks"
        name="tasks.xls">
    
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

      <v-toolbar-title>Tasks</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-text-field
        hide-details
        append-icon="mdi-magnify"
        single-line
        placeholder="Search"
        class="pr-2 mr-2"
      ></v-text-field>
      <v-dialog
        v-model="taskDialog"
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
          <span v-if='!sendUpdateReq' class="headline">New Task</span>
          <span v-else class="headline">Update Task</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
              cols="12"
              >
                <v-text-field
                label="Ask Title"
                v-model='taskTitle'
                prepend-inner-icon="mdi-format-title"
                required
                />
                <v-textarea
                class="mx-2"
                label="Description"
                v-model='taskDescription'
                rows="2"
                prepend-inner-icon="mdi-comment-processing"
                required
                ></v-textarea>
                <v-select
                v-model="userType"
                :items="userTypes"
                menu-props="auto"
                label="Employee"
                hide-details
                prepend-inner-icon="mdi-account-multiple"
                single-line
                ></v-select>
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
                v-model="startDate"
                label="Start Date"
                prepend-inner-icon="mdi-calendar"
                readonly
                v-on="on"
                ></v-text-field>
                </template>
                <v-date-picker
                v-model="startDate"
                @input="menu1 = false"
                ></v-date-picker>
                </v-menu>
                <v-menu
                v-model="menu2"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
                >
                <template v-slot:activator="{ on }">
                <v-text-field
                v-model="endDate"
                label="End Date"
                prepend-inner-icon="mdi-calendar"
                readonly
                v-on="on"
                ></v-text-field>
                </template>
                <v-date-picker
                v-model='endDate'
                @input="menu2 = false"
                ></v-date-picker>
                </v-menu>
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
                    v-model="startTime"
                    label="Start Time"
                    prepend-inner-icon="mdi-clock"
                    readonly
                    v-on="on"
                  />
                </template>
                <v-time-picker
                  v-model="startTime"
                  @input="menu3 = false"
                />
              </v-menu>
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
                    v-model="endTime"
                    label="End Time"
                    prepend-inner-icon="mdi-clock"
                    readonly
                    v-on="on"
                  />
                </template>
                <v-time-picker
                v-model="endTime"
                  @input="menu4 = false"
                />
              </v-menu>
                <v-textarea
                v-model='taskComment'
                class="mx-2"
                label="Comment"
                rows="1"
                prepend-inner-icon="mdi-comment-processing"
                required
                ></v-textarea>
              <v-select
                v-model='participants'
                :items='users'
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
          @click="closeTaskDialog()"
          >Close</v-btn>
          <v-btn
            v-if='!sendUpdateReq'
            color="#4ebc2a"
            dark
            v-model='sendUpdateReq'
            @click="saveNewTask()"
          >Save</v-btn>

          <v-btn
            v-if='sendUpdateReq'
            color="#4ebc2a"
            dark
            v-model='sendUpdateReq'
            @click="sendUpdateTaskRequest()"
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
            <span class="headline">Add Task Participant</span>
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
            @click='addNewTaskParticipant'
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
    loading-text='Loading tasks...'
    :items="tasks"
    :v-model='tasks'
    :items-per-page="5"
    class="elevation-1"
  >
    <template v-slot:item.status="{ item }">
      <v-chip :color="getColor(item.status)" dark>{{ item.status }}</v-chip>
    </template>
    
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editTask(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteTask(item)"
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
        taskDialog: false,
        dialog1: false,
        headers: [
          {
            text: 'Task Title',
            align: 'start',
            sortable: false,
            value: 'tasktitle',
          },
          { text: 'Start', value: 'start' },
          { text: 'Completed At', value: 'completed_at' },
          { text: 'Status', value: 'status' },
          { text: 'Descriptions', value: 'descriptions' },
          { text: 'Comment', value: 'comment' },
          { text: 'Actions', value: 'actions' },
        ],
        tasks: [],

        json_fields: {
          "Task Title": "tasktitle",
          "Start": "start",
          "Completed at": "ecompleted_atnd",
          "Descriptions": "descriptions",
          "Status": "status"
        },
        json_meta: [
            [{ 'key': 'charset', 'value': 'utf-8' }]
        ],


        type: [
        ],
        time: [
        ],
        userTypes: [ { text: 'Employee', value: 'employee' }, { text: 'Learner', value: 'learner'} ],
        date: new Date().toISOString().substr(0, 10),
        menu1: false,
        menu2: false,
        menu3: false,
        menu4: false,
        sendUpdateReq: false,
        startTime: '',
        endTime: '',
        startDate: '',
        endDate: '',
        taskTitle: '',
        taskDescription: '',
        userType: '',
        taskComment: '',
        users: [],
        participants: '',
        courseId: '',
        participantDialog: false,
        selectedTask: null,
        updateData: null
      }
    },

    mounted () {
      this.getTasks()
      this.getUsers()
    },

    methods: {
     getTasks () {
        this.showLoader = true
        const jwt = this.$store.state.sessionData[0].token
        const url = 'https://school.kfundi.com/api/tasks'
        axios.get(url, {
          headers: {
            Authorization: 'Bearer ' + jwt
          }
        })
        .then((res) => {
          this.showLoader = false
          const tasksList = res.data.data
          tasksList.forEach(datum => {
            this.tasks.push(
              {
                id: datum.id,
                tasktitle: datum.name,
                start: datum.start_date,
                completed_at: datum.completed_at,
                descriptions: datum.description,
                status: datum.status,
              }
            )
          })
        })
        .catch((e) => {
          this.showLoader = false;
          console.log('Couldn\'t fetch data due to: ', e)
        })
      },
      saveNewTask () {
        this.dialog = false
        const jwt = this.$store.state.sessionData[0].token
        const url = 'https://school.kfundi.com/api/tasks'
        
        let data = {}

        data = {
          name: this.taskTitle,
          description: this.taskDescription,
          start_date: this.startDate,
          end_date: this.endDate,
          task_for: this.userType,
          participants: this.participants
          // creator_id: this.$store.state.sessionData[1].user.id,
        }

        if (this.userType === 'learner') {
          data.course_id = this.courseId
        }
        
        axios.post(url, [], {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            Authorization: 'Bearer ' + jwt,
          },
          data,
        })
        .then((res) => {
          console.log(res)
          // ToDo: Add snackbar with success message
          this.getAnnouncements()
        })
        .catch((e) => {
          // ToDo: Add snackbar with error message
          console.log('Couldn\'t fetch data due to: ', e)
        })
      },
      
      exportAsPDF () {
        var columns = [
          {title: "Task Title", dataKey: "tasktitle"},
          {title: "Start", dataKey: "start"},
          {title: "Completed at", dataKey: "completed_at"},
          {title: "Descriptions", dataKey: "descriptions"},
          {title: "Status", dataKey: "status"}
        ]
        const doc = new jsPDF('p', 'pt');
        doc.text('Tasks PDF', 40, 40);
        doc.autoTable(columns, this.tasks, {
          margin: {top: 60},
        });
        doc.save('tasks.pdf');
      },
      
      getColor (type) {
        return (type === 'completed') ? 'green' : 'yellow accent-4'
      },

      openParticipantDialog (item) {
        this.participantDialog = true
        this.participants = []
        this.circularLoader = true
        this.selectedTask = item
        this.getUsers()
      },

      closeParticipantDialog () {
        this.participants = []
        this.selectedTask = false
        this.users = []
        this.participantDialog = false
        this.courseId = ''
      },

      deleteTask (item) {
        // this.participantDialog = false
        const jwt = this.$store.state.sessionData[0].token
        const url = `https://school.kfundi.com/api/tasks/${item.id}`
        axios.delete(url, {
          headers: {
            'Accept': 'application/json',
            Authorization: 'Bearer ' + jwt,
          }
        })
        .then((res) => {
          // ToDo: Add snackbar with success message
          console.log(res)
          this.tasks = []
          this.getTasks()
        })
        .catch((e) => {
          // ToDo: Add snackbar with error message
          console.log('Couldn\'t fetch data due to: ', e)
        })
      },

      addNewTaskParticipant () {
        // this.participantDialog = false
        const jwt = this.$store.state.sessionData[0].token
        const url = `https://school.kfundi.com/api/tasks/${this.selectedTask.id}?_method=PATCH`
        const data = {}
        for (let i = 0; i < this.participants.length; i++) {
          data[`participants[${i}]`] = this.participants[i]
        }
        axios.post(url, [], {
          headers: {
            'Accept': 'application/json',
            Authorization: 'Bearer ' + jwt,
          },
          data,
        })
        .then((res) => {
          // ToDo: Add snackbar with success message
          console.log(res)
          this.name = 'adf'
          this.courseId = ''
          this.participantDialog = false
        })
        .catch((e) => {
          // ToDo: Add snackbar with error message
          console.log('Couldn\'t fetch data due to: ', e)
          this.courseId = ''
          this.participantDialog = false
        })
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
            console.log('datum is: ', datum)
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

      editTask (item) {
        this.taskTitle = item.name
        this.taskDescription = item.description
        this.startDate = item.start_date
        this.endDate = item.end_date
        this.userType = item.task_for

        this.sendUpdateReq = true
        this.taskDialog = true
        this.updateData = {
          id: item.id
        }
      },

      sendUpdateTaskRequest () {
        const jwt = this.$store.state.sessionData[0].token
        const url = `https://school.kfundi.com/api/tasks/${this.updateData.id}?_method=PATCH`
       axios.post(url, [], {
          headers: {
            Authorization: 'Bearer ' + jwt,
          },
          data: {
            name: this.taskTitle,
            description: this.taskDescription,
            start_date: this.startDate,
            end_date: this.endDate,
            task_for: this.userType
          },
        })
        .then((res) => {
          console.log(res)
          this.tasks = []
          this.sendUpdateReq = false
          this.updateData = false
          this.taskDialog = false
          // ToDo: Add snackbar with success message
          this.getTasks()
        })
        .catch((e) => {
          // ToDo: Add snackbar with error message
          this.sendUpdateReq = false
          this.updateData = false
          this.dialog = false
          console.log('Couldn\'t fetch data due to: ', e)
        })
      },
      closeTaskDialog() {
        this.taskDialog = false
        this.sendUpdateReq = false
      }
    },
  }

</script>

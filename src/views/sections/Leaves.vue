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
      title="Manage Leaves"
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
                :data="leaves"
                :fields="json_fields"
                worksheet="Leaves"
                name="leaves.xls">
            
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

      <v-toolbar-title>Leaves</v-toolbar-title>

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
        >ADD</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Add Leave</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
              cols="12"
              >
                <v-select
                  label="Leave Type"
                  v-model='leaveType'
                  :items='leaveTypes'
                  hide-details
                  single-line
                ></v-select>
                
                <v-select
                  label="Duration Type"
                  v-model='durationType'
                  :items='durationTypes'
                  hide-details
                  single-line
                ></v-select>

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

                <v-select
                  label="Number of Hours"
                  v-model='numberOfHours'
                  :items='numberOfHours'
                  hide-details
                  single-line
                ></v-select>

                <v-select
                  label="Paid Type"
                  v-model='paidType'
                  :items='paidTypes'
                  hide-details
                  single-line
                ></v-select>
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
          @click="saveNewLeave()"
          >Save</v-btn>

          <v-btn
            v-if='sendUpdateReq'
            color="#4ebc2a"
            dark
            v-model='sendUpdateReq'
            @click="sendUpdateBookRequest()"
          >Update</v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>
    </v-toolbar>
    <v-divider></v-divider>
    <v-data-table
    :headers="headers"
    :sort-by="['status']"
    :loading='this.showLoader'
    loading-text='Loading leaves...'
    :items="leaves"
    :v-model='leaves'
    :items-per-page="5"
    class="elevation-1"
  >
    <template v-slot:item.status="{ item }">
      <v-chip :color="getColor(item.status)" dark>{{ item.status }}</v-chip>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-icon
            small
            v-on='on'
            @click="approveLeave(item, 'approved')"
          >
            mdi-check
          </v-icon>
        </template>
        <span>approve</span>
      </v-tooltip>
      
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-icon
            small
            class="mx-2"
            v-on='on'
            @click="approveLeave(item, 'rejected')"
          >
            mdi-close
          </v-icon>
        </template>
        <span>reject</span>
      </v-tooltip>

      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-icon
            small
            v-on='on'
            @click="openCommentDialog(item)"
          >
            mdi-chat-outline
          </v-icon>
        </template>
        <span>Comment</span>
      </v-tooltip>
    </template>
    <template v-slot:item.url="{ item }">
      <a v-if='item.url' :href='item.url' target='_blank'>view</a>
    </template>
  </v-data-table>
  <v-dialog
    v-model='commentDialog'
    width='500'
  >
    <v-card>
      <v-card-title>Add Comment</v-card-title>
      <textarea class="ml-5 pa-2" style="border:1px solid grey" v-model='comment' cols="50" rows="10"></textarea>
      <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
          color="#4ebc2a darken-1"
          text
          @click="commentDialog = false"
          >Close</v-btn>

          <v-btn
            color="#4ebc2a"
            dark
            @click="addComment()"
          >Comment</v-btn>

        </v-card-actions>
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
        durationType:'',
        durationTypes: ['hour', 'day'],
        leaveType: '',
        leaveTypes: [ {text: 'Sick Leave', value: 'xlDO6Ykrq8QXeK92maMG'}, { text: 'Annual Vacations', value: 'nkBE9wJe5RYpd4Y8L0PD'} ],
        paidType: '',
        paidTypes: ['paid', 'unpaid'],
        numberOfHours : ['0.5','1','1.5','2','2.5','3','3.5','4','4.5','5','5.5','6','6.5','7','7.5','8'],
        status: '',
        statusTypes: ['0', '1'],
        start_date: new Date().toISOString().substr(0, 10),
        end_date: new Date().toISOString().substr(0, 10),
        startDateMenu: false,
        endDateMenu: false,
        numOfHours: null,
        commentDialog: false,
        comment: '',
        selectedLeave: null,
        

        headers: [
          {
            text: 'Type',
            align: 'start',
            value: 'type',
          },
          { text: 'Duration Type', value: 'durationtype' },
          { text: 'Start', value: 'start' },
          { text: 'End', value: 'end' },
          { text: 'Hour', value: 'numOfHours' },
          { text: 'URL', value: 'url' },
          { text: 'Status', value: 'status', sortable: true },
          { text: 'Paid Type', value: 'paidtype' },
          { text: 'Comment', value: 'comment' },          
          { text: 'Actions', value: 'actions' }
        ],

        json_fields: {
          'Type': 'type',
          'Duration Type': 'durationtype',
          'Start' : 'start',
          'End': 'end',
          'Status': 'status',
          'Comment': 'comment',
          'Paid Type': 'paidtype'
        },
        json_meta: [
            [{ 'key': 'charset', 'value': 'utf-8' }]
        ],
        leaves: [],
        type: [
        ],
        time: [
        ],
        pay: [
        ],
        date: new Date().toISOString().substr(0, 10),
        menu1: false,
        menu2: false,
      }
    },

    mounted () {
      this.getLeaves()
    },

    methods: {
      getLeaves () {
        this.showLoader = true
        const jwt = this.$store.state.sessionData[0].token
        const url = 'https://school.kfundi.com/api/leaves'
        axios.get(url, {
          headers: {
            Authorization: 'Bearer ' + jwt
          }
        })
        .then((res) => {
          console.log('data is: ', res.data.data)
          this.showLoader = false;
          const leavesList = res.data.data
          leavesList.forEach(datum => {
            this.leaves.push(
              {
                id: datum.id,
                type: datum.type,
                durationtype: datum.duration_type, 
                start: datum.start_date.split(' ')[0],
                end: datum.end_date.split(' ')[0],
                url: datum.url,
                status: datum.status,
                paidtype: datum.paid_type,
                comment: datum.comment,
                numOfHours: datum.number_of_hours,
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

      approveLeave (leave, update) {
        if(confirm(`Are you sure you want to mark this leave as ${update}?`)) {
          const jwt = this.$store.state.sessionData[0].token
          const url = `https://school.kfundi.com/api/leaves/${leave.id}?_method=PATCH`
          axios.post(url, [], {
            headers: {
              Authorization: 'Bearer ' + jwt
            },
            data: {
              status: update
            }
          })
          .then((res) => {
            console.log('res: ', res)
            this.leaves = []
            this.getLeaves()
          })
          .catch((e) => {
            this.showLoader = false;
            console.log('Couldn\'t fetch data due to: ', e)
          })
        }
      },

      openCommentDialog (item) {
        this.selectedLeave = item
        this.commentDialog = true
      },

      addComment () {
        if(confirm(`Are you sure you want to comment?`)) {
          const jwt = this.$store.state.sessionData[0].token
          const url = `https://school.kfundi.com/api/leaves/${this.selectedLeave.id}?_method=PATCH`
          axios.post(url, [], {
            headers: {
              Authorization: 'Bearer ' + jwt
            },
            data: {
              comment: this.comment
            }
          })
          .then((res) => {
            console.log('res: ', res)
            this.leaves = []
            this.getLeaves()
            this.commentDialog = false
          })
          .catch((e) => {
            this.showLoader = false;
            console.log('Couldn\'t fetch data due to: ', e)
            this.commentDialog = false
          })
        }
      },

      exportAsPDF () {
        var columns = [
          { title: 'Type', dataKey: 'type' },
          { title: 'Duration Type', dataKey: 'durationtype' },
          { title: 'Start', dataKey: 'start' },
          { title: 'End', dataKey: 'end' },
          { title: 'Status', dataKey: 'status' },
          { title: 'Comment', dataKey: 'comment' },
          { title: 'Paid Type', dataKey: 'paidtype' },
        ];
        const doc = new jsPDF('p', 'pt');
        doc.text('Leaves PDF', 40, 40);
        doc.autoTable(columns, this.leaves, {
          margin: {top: 60},
        });
        doc.save('leaves.pdf');
      },

      getColor (type) {
        if (type ===  'approved') {
          return 'green'
        } else if (type === 'rejected') {
          return 'grey'
        } else {
          return 'yellow accent-4'
        }
      }
    }

  }

</script>

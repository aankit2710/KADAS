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
      title="Manage Attendance"
      />
      <v-card>
        <v-tabs
          v-model="tabs"
          centered
        >
          <v-tab
            v-for="item in tabname"
            :key="item"
          >
            {{ item }}
          </v-tab>
        </v-tabs>

    <v-tabs-items v-model="tabs">
      <v-tab-item>
         <v-card
            class="pa-2 text-center"
            color="transparent"
            style="box-shadow:none"
          >
    <v-btn
      color="#4ebc2a"
      class="mr-4"
      @click="exportAsPDF(learnersAttendance)"
    >
      Export to Pdf
    </v-btn>
    
    <v-btn>
      <export-excel
        :data="learnersAttendance"
        :fields="json_fields"
        worksheet="Learners Attendance"
        name="learners_attendance.xls">

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

      <v-toolbar-title>Learners Attendance</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-text-field
        hide-details
        append-icon="mdi-magnify"
        single-line
        placeholder="Search"
        class="pr-2 mr-2"
      ></v-text-field>
     
    </v-toolbar>
    <v-divider></v-divider>
    <v-data-table
    :headers="headers"
    :loading='this.showLoader'
    loading-text='Loading attendance...'
    :v-model='learnersAttendance'
    :items="learnersAttendance"
    :items-per-page="5"
    class="elevation-1"
  >
  </v-data-table>
  </v-card>
      </v-tab-item>
      <v-tab-item>
         <v-card
            class="pa-2 text-center"
            color="transparent"
            style="box-shadow:none"
          >
    <v-btn
      color="#4ebc2a"
      class="mr-4"
      @click="exportAsPDF(educatorsAttendance)"
    >
      Export to Pdf
    </v-btn>
    
    <v-btn>
      <export-excel
        :data="educatorsAttendance"
        :fields="json_fields"
        worksheet="Educators Attendance"
        name="educators_attendance.xls">

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

      <v-toolbar-title>Educators Attendance</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-text-field
        hide-details
        append-icon="mdi-magnify"
        single-line
        placeholder="Search"
        class="pr-2 mr-2"
      ></v-text-field>
     
    </v-toolbar>
    <v-divider></v-divider>
    <v-data-table
    :headers="headers"
    :loading='this.showLoader'
    loading-text='Loading attendance...'
    :v-model='educatorsAttendance'
    :items="educatorsAttendance"
    :items-per-page="5"
    class="elevation-1"
  ></v-data-table>
  </v-card>
      </v-tab-item>
    </v-tabs-items>
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
            text: 'ID',
            align: 'start',
            sortable: false,
            value: 'id',
          },
          { text: 'Number of Hours', value: 'value' },
          { text: 'Type', value: 'type' },
        // { text: 'User ID', value: 'user_id' }, 
          { text: 'Employee', value: 'employee' },
          // { text: 'Created at', value: 'created_at' },
        ],
        learnersAttendance: [],
        educatorsAttendance: [],

        json_fields: {
          "ID": "id",
          "Value": "value",
          "Type": "type",
          "User ID": "user_id",
          "Employee": "employee",
          "Created at": "created_at"
        },
        json_meta: [
          [{ 'key': 'charset', 'value': 'utf-8' }]
        ],        

        type: [
        ],
        time: [
        ],
        tabs: null,
        tabname: [
          'Learners Attandance', 'Educators Attendance',
        ],
        pay: ['Gardian', 'Doctor'],
        date: new Date().toISOString().substr(0, 10),
        menu1: false,
        menu2: false,
      }
    },

    mounted () {
      this.getAttendance()
    },

    methods: {
      getAttendance () {
        this.showLoader = true
        const jwt = this.$store.state.sessionData[0].token
        const url = 'https://school.kfundi.com/api/remotely-hours'
        axios.get(url, {
          headers: {
            Authorization: 'Bearer ' + jwt
          }
        })
        .then((res) => {
          this.showLoader = false
          this.educatorsAttendance = []
          this.learnersAttendance = []
          const attendanceList = res.data.data
          attendanceList.forEach(datum => {
            if(datum.type === 'Educator') {
              this.educatorsAttendance.push(
              {
                id: datum.id,
                value: datum.value,
                type: datum.type,
                user_id: datum.user_id,
                employee: datum.employee,
                created_at: datum.created_at
              })  
            } else {
              this.learnersAttendance.push(
              {
                id: datum.id,
                value: datum.value,
                type: datum.type,
                user_id: datum.user_id,
                employee: datum.employee,
                created_at: datum.created_at
              })
            }
            
          })
        })
        .catch((e) => {
          this.showLoader = false;
          console.log('Couldn\'t fetch data due to: ', e)
        })
      },

      exportAsPDF (attendance) {
        var columns = [
          {title: "ID", dataKey: "id"},
          {title: "Value", dataKey: "value"},
          {title: "Type", dataKey: "type"},
          {title: "User ID", dataKey: "user_id"},
          {title: "Employee", dataKey: "employee"},
          {title: "Created at", dataKey: "created_at"}

        ];
        const doc = new jsPDF('p', 'pt');
        doc.text('Attendance PDF', 40, 40);
        doc.autoTable(columns, attendance, {
          margin: {top: 60},
        });
        doc.save('attendance.pdf');
      }
      

    }
  }

</script>

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
      title="Manage Tickets"
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
        :data="tickets"
        :fields="json_fields"
        worksheet="Ticket"
        name="Ticket.xls">

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

      <v-toolbar-title>Tickets</v-toolbar-title>

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
    :items='tickets'
    :v-model='tickets'
    :loading='this.showLoader'
    loading-text='Loading tickets data...'
    :items-per-page="5"
    class="elevation-1"
  >
    <template v-slot:item.type="{ item }">
      <v-chip :color="getColor(item.type)" dark>{{ item.type }}</v-chip>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editBook(item)"
      >
        mdi-account-check
      </v-icon>

      <v-menu
      bottom
      origin="center center"
      transition="scale-transition"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          small
          v-on="on"
        >
         Status
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          @click="changeStatus(item.id,'open')"
        >
        <v-list-item-title>Open</v-list-item-title>
        </v-list-item>
        <v-list-item
          @click="changeStatus(item.id,'closed')"
        >
        <v-list-item-title>Closed</v-list-item-title>
        </v-list-item>
      <v-list-item
          @click="changeStatus(item.id,'solved')"
        >
        <v-list-item-title>Solved</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    </template>
  </v-data-table>
  </v-card>
    </v-container>
  </base-section>
</template>

<script>
  import jsPDF from 'jspdf'
  import 'jspdf-autotable'
  import { getCookie } from 'tiny-cookie'
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
          { text: 'Type', value: 'type' },
          { text: 'Status', value: 'status' },
          { text: 'Ref No.', value: 'ref_no' },
          { text: 'Title', value: 'title' },
          { text: 'Description', value: 'description' },
          { text: 'Creator', value: 'creator' },
          { text: 'Created At', value: 'created_at' },
          { text: 'Actions', value: 'actions' },
        ],

        json_fields: {
            'Type': 'type',
            'Ref No.': 'ref_no',
            'Title': 'title',
            'Description': 'description',
            'Creator': 'creator',
            'Created At': 'created_at'
        },
        json_meta: [
            [{ 'key': 'charset', 'value': 'utf-8' }]
        ],

        tickets: [],
      }
    },
    methods: {
      changeStatus(id,statusChange)
      {

         const jwt = this.$store.state.sessionData[0].token
        const url = 'https://school.kfundi.com/api/tickets/'+id+'?_method=PATCH';
        axios.post(url,
        {
          status:statusChange
        },

        {
          headers: {
            Authorization: 'Bearer ' + jwt
          }
        }
        ).then(res => {
          if(res.data.data[0].status == statusChange)
          {
            this.getTickets();
          }
        }).catch(e => {
          console.log('status change failed '+e);
        })
      },
      validate () {
        const tt = getCookie('dateObject')
        const url = 'https://school.kfundi.com/api/events'
        axios.post(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + tt,
          },
          data: {
            name: this.name,
            description: this.description,
            note: '123',
            start_date: this.startdate,
            end_date: this.enddate,
            type_id: this.typeid,
            creator_id: '1',
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

      getTickets () {
        this.showLoader = true
        const jwt = this.$store.state.sessionData[0].token
        const url = 'https://school.kfundi.com/api/tickets'
        axios.get(url, {
          headers: {
            Authorization: 'Bearer ' + jwt
          }
        })
        .then((res) => {
          console.log(res)
          this.showLoader = false
          this.tickets = []
          const ticketList = res.data.data
          ticketList.forEach(datum => {
            this.tickets.push(
              {
                id: datum.id,
                type: datum.type,
                status:datum.status,
                ref_no: datum.title,
                title: datum.type,
                description: datum.description,
                creator: datum.creator,
                created_at: datum.created_at,
                actions: { edit: 'mdi-account-check' }
              }
            )
          })
        })
        .catch((e) => {
          this.showLoader = false;
          console.log('Couldn\'t fetch data due to: ', e)
        })
      },
      exportAsPDF () {
        var columns = [
          // ref_no type title desc creator created at
          {title: "Type", dataKey: "type"},
          {title: "Ref No.", dataKey: "ref_no"},
          {title: "Title", dataKey: "title"},
          {title: "Description", dataKey: "description"},
          {title: "Creator", dataKey: "creator"},
          {title: 'Created at', dataKey: 'created_at' }
        ];
        const doc = new jsPDF('p', 'pt');
        doc.text('Tickets PDF', 40, 40);
        doc.autoTable(columns, this.tickets, {
          margin: {top: 60},
        });
        doc.save('tickets.pdf');
      },
      getColor (type) {
        return (type === 'internal') ? 'green' : 'grey'
      }
    },

    mounted () {
      this.getTickets()
    },

  }

</script>

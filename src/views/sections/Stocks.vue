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
      title="Stocks"
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
        :data="stocks"
        :fields="json_fields"
        worksheet="Stocks"
        name="stocks.xls">

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

      <v-toolbar-title>Stocks</v-toolbar-title>

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
          <span class="headline">Add Stocks</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
              cols="12"
              >

                <v-text-field
                  v-model='stockTitle'
                  label='Title'
                ></v-text-field>

                <v-textarea
                  v-model='stockDescription'
                  label='Description'
                  rows='3'
                ></v-textarea>

                <v-select
                  v-if='!sendUpdateReq'
                  v-model='selectedUser'
                  :items='users'
                  label='Creator'
                >
                </v-select>

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
            @click="saveNewStock()"
          >Save</v-btn>

          <v-btn
            v-if='sendUpdateReq'
            color="#4ebc2a"
            dark
            @click="sendUpdateStockRequest()"
          >Update</v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>
    </v-toolbar>
    <v-divider></v-divider>
    <v-data-table
        :headers="headers"
        :loading='this.showLoader'
        loading-text='Loading stocks...'
        :items="stocks"
        :v-model='stocks'
        :items-per-page="5"
        class="elevation-1"
    >
    <template v-slot:item.img="{ item }">
      <a v-if='item.img' :href='item.img' target='_blank'>view</a>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editStock(item)"
      >
        mdi-pencil
      </v-icon>

      <v-icon
        small
        class="mr-2"
        @click="deleteStock(item)"
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
        headers: [
          { text: 'Ref Number', value: 'ref_no' },
          { text: 'Title', value: 'title' },
          { text: 'Description', value: 'description' },
          { text: 'Image Url', value: 'img' },
          { text: 'Creator', value: 'creator'}

        ],
        stocks: [],
        json_fields: {
          'Ref No.': 'ref_no',
          'Title': 'title',
          'Description': 'description',
          'Creator': 'creator',
          'Created at': 'created_at'
        },
        json_meta: [
            [{ 'key': 'charset', 'value': 'utf-8' }]
        ],

        sendUpdateReq: false,
        updateData: null,
        contactInfo: {},
        stockDescription: '',
        stockTitle: '',
        users: [],
        selectedUser: ''
      }
    },

    mounted () {
      this.getStocks()
      this.getUsers()
    },

    methods: {
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


      getStocks () {
        this.showLoader = true
        const jwt = this.$store.state.sessionData[0].token
        const url = 'https://school.kfundi.com/api/stocks'
        axios.get(url, {
          headers: {
            Authorization: 'Bearer ' + jwt
          }
        })
        .then((res) => {
          this.showLoader = false;
          const stocksData = res.data.data
          console.log(res.data.data);
          stocksData.forEach(datum => {
            this.stocks.push(
              {
                // start end notes reason cancel
                id: datum.id,
                ref_no: datum.ref_no,
                title: datum.title,
                description: datum.description,
                img: datum.img,
                creator: datum.creator,
                created_at: datum.created_at,
                actions: {}
              }
            )
          })
        })
        .catch((e) => {
          this.showLoader = false;
          console.log('Couldn\'t fetch data due to: ', e)
        })
      },

      saveNewStock () {
        this.dialog = false
        const jwt = this.$store.state.sessionData[0].token
        const url = 'https://school.kfundi.com/api/stocks'
        axios.post(url, [], {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            Authorization: 'Bearer ' + jwt,
          },
          data: {
            title: this.stockTitle,
            description: this.stockDescription,
            creator_id: this.selectedUser
          },
        })
        .then((res) => {
          // ToDo: Add snackbar with success message
          console.log('response: ', res)
          this.stocks = []
          this.getStocks()
        })
        .catch((e) => {
          // ToDo: Add snackbar with error message
          console.log('Couldn\'t fetch data due to: ', e)
        })
      },

      editStock (item) {
        this.stockTitle = item.title
        this.stockDescription = item.description
        // this.selectedUser = item.start_date

        this.sendUpdateReq = true
        this.dialog = true
        this.updateData = {
          id: item.id
        }
      },

      sendUpdateStockRequest () {
        const jwt = this.$store.state.sessionData[0].token
        const url = `https://school.kfundi.com/api/stocks/${this.updateData.id}?_method=PATCH`
       axios.post(url, [], {
          headers: {
            Authorization: 'Bearer ' + jwt,
          },
          data: {
            title: this.stockTitle,
            description: this.stockDescription
          },
        })
        .then((res) => {
          console.log(res)
          this.events = []
          this.sendUpdateReq = false
          this.updateData = false
          this.dialog = false
          // ToDo: Add snackbar with success message
          this.stocks = []
          this.getStocks()
        })
        .catch((e) => {
          // ToDo: Add snackbar with error message
          this.sendUpdateReq = false
          this.updateData = false
          this.dialog = false
          console.log('Couldn\'t fetch data due to: ', e)
        })
      },

      deleteStock (item) {
        this.showLoader = true
        if(confirm('Are you sure you want to delete this stock?')) {
          const jwt = this.$store.state.sessionData[0].token
          const url = `https://school.kfundi.com/api/stocks/${item.id}`
          axios.delete(url, {
            headers: {
              Authorization: 'Bearer ' + jwt
            }
          })
          .then((res) => {
            this.showLoader = false
            console.log(res)
            this.stocks = []
            this.getStocks()
          })
          .catch((e) => {
            this.showLoader = false
            console.log('Couldn\'t fetch data due to: ', e)
          })
        }
      },

      exportAsPDF () {
        var columns = [
          {title: "Ref No.", dataKey: "ref_no"},
          {title: "Title", dataKey: "title"},
          {title: "Description", dataKey: "description"},
          {title: "Creator", dataKey: "creator"}

        ];
        const doc = new jsPDF('p', 'pt');
        doc.text('Stocks PDF', 40, 40);
        doc.autoTable(columns, this.stocks, {
          margin: {top: 60},
        });
        doc.save('stocks.pdf');
      },


    }
  }

</script>

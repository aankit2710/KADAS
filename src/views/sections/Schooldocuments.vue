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
      title="Regulation Management Policies"
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
        :data="documents"
        :fields="json_fields"
        worksheet="Documents"
        name="docs.xls">

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

      <v-toolbar-title>School Policies</v-toolbar-title>

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
          <span class="headline">New School Document</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
              cols="12"
              >
                <v-text-field
                  label="Name"
                  v-model='docName'
                  prepend-inner-icon="mdi-format-title"
                  required
                />
                <v-select
                  v-model="docType"
                  :items="types"
                  menu-props="auto"
                  label="Type"
                  hide-details
                  prepend-inner-icon="mdi-format-title"
                  single-line
                ></v-select>
                 <!-- <v-text-field
                  label="Participant"
                  v-model='docName'
                  prepend-inner-icon="mdi-format-title"
                  required
                /> -->
                <v-file-input
                  v-model="docFile"
                  label="Select Your Document"
                  prepend-icon="mdi-paperclip"
                >
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
            v-model='sendUpdateReq'
            @click="addNewDocument()"
          >Save</v-btn>

          <v-btn
            v-if='sendUpdateReq'
            color="#4ebc2a"
            dark
            v-model='sendUpdateReq'
            @click="sendUpdateDocRequest()"
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
            <span class="headline">Add Document Participant</span>
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
              v-model='documentId'
              label='Document Id'
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
            @click='addNewDocParticipant'
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
      loading-text='Loading docs...'
      :items="documents"
      :v-model='documents'
      :items-per-page="5"
      class="elevation-1"
    >
    <template v-slot:item.url="{ item }">
      <a v-if='item.url' :href='item.url' target='_blank'>view</a>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editDoc(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteDoc(item)"
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
        dialog: false,
        files: [],
        docName: '',
        docType: '',
        docFile: '',
        headers: [
          {
            text: 'Name',
            align: 'start',
            sortable: false,
            value: 'name',
          },
          { text: 'Type', value: 'type' },
          { text: 'URL', value: 'url' },
          { text: 'Actions', value: 'actions' },
        ],
        documents: [],

        json_fields: {
          "Name": "name",
          "Type": "type",
          "URL": "url"
        },
        json_meta: [
            [{ 'key': 'charset', 'value': 'utf-8' }]
        ],

        types: [
          'Learner',
          'Educator',
          'Both',
        ],

        documentId: '',
        participantDialog: false,
        users: [],
        participants: [],
        circularLoader: false,
        selectedDocument: null,
        sendUpdateReq: false,
        newDoc:new FormData(),

      }
    },

    mounted () {
      this.getDocuments()
    },

    methods: {
      getDocuments () {
        this.showLoader = true
        const jwt = this.$store.state.sessionData[0].token
        const url = 'https://school.kfundi.com/api/documents/company'
        axios.get(url, {
          headers: {
            Authorization: 'Bearer ' + jwt
          }
        })
        .then((res) => {
          this.showLoader = false;
          // ToDo: load data to docs table
          const documentList = res.data.data
          console.log(res.data.data);
          this.documents=[];
          documentList.forEach(datum => {
            this.documents.push(
              {
                id: datum.id,
                name: datum.name,
                type: datum.type,
                url: datum.url,
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

      addNewDocument () {
        this.newDoc.append('name',this.docName);
        this.newDoc.append('type',this.docType);
        this.newDoc.append('document',this.docFile);
        this.dialog = false
        const jwt = this.$store.state.sessionData[0].token
        const url = `https://school.kfundi.com/api/documents/company`

        axios.post(url, this.newDoc, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            Authorization: 'Bearer ' + jwt,
          },
          // data: {
          //   name: this.docName,
          //   type: this.docType,
          //   document: this.docFile[0]
          // },
        })
        .then((res) => {
          // ToDo: Add snackbar with success message
          console.log(res)
          // this.documents = []
          this.getDocuments()
        })
        .catch((e) => {
          // ToDo: Add snackbar with error message
          console.log('Couldn\'t fetch data due to: ', e)
        })

      },

      openParticipantDialog (item) {
        this.participantDialog = true
        this.participants = []
        this.circularLoader = true
        this.selectedDocument = item
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
        this.selectedDocument = false
        this.users = []
        this.participantDialog = false
        this.documentId = ''
      },

      addNewDocParticipant () {
        this.participantDialog = false
        const jwt = this.$store.state.sessionData[0].token
        const url = `https://school.kfundi.com/api/documents/${this.selectedDocument.id}/participants`
        axios.post(url, [], {
          headers: {
            'Accept': 'application/json',
            Authorization: 'Bearer ' + jwt,
          },
          data: {
            user_id: this.$store.state.sessionData[1].user.id,
            users: this.participants,
            course_id: this.documentId
          },
        })
        .then((res) => {
          // ToDo: Add snackbar with success message
          console.log(res)
          this.participants = []
          this.documentId = ''
        })
        .catch((e) => {
          // ToDo: Add snackbar with error message
          console.log('Couldn\'t fetch data due to: ', e)
          this.participants = []
          this.documentId = ''
        })
      },


      editDoc (item) {
        this.docName = item.name
        this.docType = item.type

        this.sendUpdateReq = true
        this.dialog = true
        this.updateData = {
          id: item.id
        }
      },

      sendUpdateDocRequest () {
        const jwt = this.$store.state.sessionData[0].token
        const url = `https://school.kfundi.com/api/documents/company/${this.updateData.id}?_method=PATCH`
       axios.post(url, [], {
          headers: {
            Authorization: 'Bearer ' + jwt,
          },
          data: {
            name: this.docName,
            description: this.docType,
            document: this.docFile[0]
          },
        })
        .then((res) => {
          console.log(res)
          this.documents = []
          this.sendUpdateReq = false
          this.updateData = false
          this.dialog = false
          // ToDo: Add snackbar with success message
          this.getDocuments()
        })
        .catch((e) => {
          // ToDo: Add snackbar with error message
          this.sendUpdateReq = false
          this.updateData = false
          this.dialog = false
          console.log('Couldn\'t fetch data due to: ', e)
        })
      },

      deleteDoc (item) {
        // this.participantDialog = false
        if(confirm('Are you sure you want to delete this document?')) {
          const jwt = this.$store.state.sessionData[0].token
          const url = `https://school.kfundi.com/api/documents/company/${item.id}`
          axios.delete(url, {
            headers: {
              'Accept': 'application/json',
              Authorization: 'Bearer ' + jwt,
            }
          })
          .then((res) => {
            // ToDo: Add snackbar with success message
            console.log(res)
            this.documents = []
            this.getDocuments()
          })
          .catch((e) => {
            // ToDo: Add snackbar with error message
            console.log('Couldn\'t fetch data due to: ', e)
          })
        }
      },


      exportAsPDF () {
        var columns = [
          {title: "Name", dataKey: "name"},
          {title: "Type", dataKey: "type"},
          {title: "Url", dataKey: "url"}
        ]
        const doc = new jsPDF('p', 'pt');
        doc.text('Documents PDF', 40, 40);
        doc.autoTable(columns, this.documents, {
          margin: {top: 60},
        });
        doc.save('documents.pdf');
      },
    }
  }

</script>

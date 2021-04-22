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
      title="Manage Library"
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
                :data="books"
                :fields="json_fields"
                worksheet="Library"
                name="Library.xls">

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

      <v-toolbar-title>Books</v-toolbar-title>

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
          <span class="headline">Add Books</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
              cols="12"
              >
                <v-text-field
                label="Title"
                v-model='bookTitle'
                prepend-inner-icon="mdi-format-title"
                required
                />
                <v-select
                  label="User Type"
                  v-model='userType'
                  :items='userTypes'
                  hide-details
                  prepend-inner-icon="mdi-format-title"
                  single-line
                ></v-select>

                 <v-select
                  v-model="visibleto"
                  :items="visible"
                  menu-props="auto"
                  label="Visible To"
                  hide-details
                  prepend-inner-icon="mdi-account-multiple"
                  single-line
                ></v-select>

                <v-select
                  label="Document Type"
                  v-model='docType'
                  :items='docTypes'
                  hide-details
                  prepend-inner-icon="mdi-format-title"
                  single-line
                ></v-select>

                <v-file-input
                  v-model="docFile"
                  label="Select Your Document"
                  prepend-icon="mdi-paperclip"
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
          @click="saveNewBook()"
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
    :items='books'
    :v-model='books'
    :loading='this.showLoader'
    loading-text='Loading books data...'
    :items-per-page="5"
    class="elevation-1"
  >
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editBook(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteBook(item)"
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
        bookTitle: '',
        userType: '',
        docType: '',
        docFile: '',
        dialog: false,
        headers: [
          
          { text: 'Title', value: 'title' },
          { text: 'User Type', value: 'user_type' },     
          { text: 'Visible To', value: 'visibleto' },
          { text: 'Document Type', value: 'doc_type' },
          { text: 'Uploaded By', value: 'uploaded_by' },
          { text: 'Created at', value: 'created_at' },
          { text: 'Actions', value: 'actions' }
        ],

        json_fields: {
            'Title': 'title',
            'UserType': 'user_type',
            'Document Type': 'doc_type',
            'Uploaded By': 'uploaded_by',
            'Created At': 'created_at'
        },
        json_meta: [
            [{ 'key': 'charset', 'value': 'utf-8' }]
        ],
        books: [],
        userTypes: [
          'learner',
          'educator',
          'both'
        ],
        docTypes: ['book'],
        sendUpdateReq: false,
        updateData: null
      }
    },

    mounted () {
      this.books = []
      this.getBooksData()
    },

    methods: {
      getBooksData () {
        this.showLoader = true
        const jwt = this.$store.state.sessionData[0].token
        const url = 'https://school.kfundi.com/api/contents'
        axios.get(url, {
          headers: {
            Authorization: 'Bearer ' + jwt
          }
        })
        .then((res) => {
          console.log(res)
          this.showLoader = false
          this.books = []
          const bookList = res.data.data
          bookList.forEach(datum => {
            this.books.push(
              {
                id: datum.id,
                title: datum.title,
                user_type: datum.type,
                doc_type: datum.document_type,
                uploaded_by: datum.uploaded_by,
                created_at: datum.created_at,
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

      saveNewBook () {
        this.dialog = false
        const jwt = this.$store.state.sessionData[0].token
        const url = 'https://school.kfundi.com/api/contents'
        axios.post(url, [], {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            Authorization: 'Bearer ' + jwt,
          },
          data: {
            title: this.bookTitle,
            type: this.userType,
            document_type: this.docType
          },
        })
        .then((res) => {
          // ToDo: Add snackbar with success message
          console.log('response: ', res)
          this.uploadFile(res.data.data)
        })
        .catch((e) => {
          // ToDo: Add snackbar with error message
          console.log('Couldn\'t fetch data due to: ', e)
        })
      },

      uploadFile (content) {
        const jwt = this.$store.state.sessionData[0].token
        const url = `https://school.kfundi.com/api/contents/${content.id}/documents`
        axios.post(url, [], {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            Authorization: 'Bearer ' + jwt,
          },
          data: {
            document: this.docFile[0]
          },
        })
        .then((res) => {
          // ToDo: Add snackbar with success message
          console.log('response: ', res)
          this.books = []
          this.getBooksData()
        })
        .catch((e) => {
          // ToDo: Add snackbar with error message
          console.log('Couldn\'t fetch data due to: ', e)
        })
      },

      exportAsPDF () {
        var columns = [
          {title: "Title", dataKey: "title"},
          {title: "User Type", dataKey: "user_type"},
          {title: "Document Type", dataKey: "doc_type"},
          {title: "Uploaded By", dataKey: "uploaded_by"},
          {title: 'Created at', dataKey: 'created_at' }
        ];
        const doc = new jsPDF('p', 'pt');
        doc.text('Books PDF', 40, 40);
        doc.autoTable(columns, this.books, {
          margin: {top: 60},
        });
        doc.save('books.pdf');
      },
      deleteBook (item) {
        if(confirm('Are you sure you want to delete this book?')) {
          const jwt = this.$store.state.sessionData[0].token
          const url = `https://school.kfundi.com/api/contents/${item.id}`
          axios.delete(url, {
            headers: {
              Authorization: 'Bearer ' + jwt
            }
          })
          .then((res) => {
            console.log(res)
            this.books = []
            this.getBooksData()
          })
          .catch((e) => {
            console.log('Couldn\'t fetch data due to: ', e)
          })
        }
      },
      editBook (item) {
        this.bookTitle = item.title
        this.userType = item.type
        this.document_type = item.docType
        this.sendUpdateReq = true
        this.dialog = true
        this.updateData = {
          id: item.id
        }
      },
      sendUpdateBookRequest () {
        const jwt = this.$store.state.sessionData[0].token
        const url = `https://school.kfundi.com/api/contents/${this.updateData.id}?_method=PATCH`
        axios.post(url, [], {
          headers: {
            Authorization: 'Bearer ' + jwt,
          },
          data: {
            title: this.bookTitle,
            type: this.userType,
            document_type: this.docType

          },
        })
        .then((res) => {
          console.log(res)
          this.sendUpdateReq = false
          this.updateData = false
          this.dialog = false
          // ToDo: Add snackbar with success message
          this.books = []
          this.getBooksData()
        })
        .catch((e) => {
          // ToDo: Add snackbar with error message
          this.sendUpdateReq = false
          this.updateData = false
          this.dialog = false
          console.log('Couldn\'t fetch data due to: ', e)
        })
      }
    }
  }

</script>

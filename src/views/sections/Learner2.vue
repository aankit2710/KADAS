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
      title="Manage Learner"
      />
          <v-card
            class="pa-2 text-center"
            color="transparent"
            style="box-shadow:none"
          >
            <v-btn
      :disabled="!valid"
      color="#4ebc2a"
      class="mr-4"
      @click="validate"
    >
      Export to Pdf
    </v-btn>
    <v-btn
      :disabled="!valid"
      color="#4ebc2a"
      class="mr-4"
      @click="validate"
    >
      Export to Pdf
    </v-btn>
          </v-card>
          <v-card
    color="grey lighten-4"
    flat
    height="100px"
  >
    <v-toolbar>

      <v-toolbar-title>Learner</v-toolbar-title>

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
        >ADD LEARNER</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">New Learner</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
              cols="12"
              >
                <v-text-field
                  label="Full Name"
                  v-model='fullName'
                  prepend-inner-icon="mdi-format-title"
                  required
                />
                <v-select
                  v-model="grade"
                  :items="gradee"
                  menu-props="auto"
                  label="Grade"
                  hide-details
                  prepend-inner-icon="mdi-format-title"
                  single-line
                ></v-select>
                 <v-text-field
                  label="Mobile Number"
                  v-model='mobilenumber'
                  prepend-inner-icon="mdi-format-title"
                  required
                />
                 <v-text-field
                  label="Guardian's Email"
                  v-model='gemail'
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
          @click="dialog = false"
          >Close</v-btn>
          <v-btn
          color="#4ebc2a"
          dark
          @click="addNewDocument()"
          >Save</v-btn>
        </v-card-actions>
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
  ></v-data-table>
  </v-card>
    </v-container>
  </base-section>
</template>

<script>

  export default {
    name: 'SectionAffiliates',
    data () {
      return {
        dialog: false,
        files: [],
        fullName: '',
        gradee: ['1', '2', '3'],
        docFile: '',
        headers: [
          {
            text: 'Learner Name',
            align: 'start',
            sortable: false,
            value: 'learner',
          },
          { text: 'Mobile Number', value: 'mobilenumber' },
          { text: 'Grade', value: 'grade' },
          { text: 'Email', value: 'email' },
        ],
        documents: [],
      }
    },   
  }

</script>

<template>
  <base-section id="affiliates" space="36" class="grey lighten-4">
    <v-container class="mr-auto" style="width:80%">
      <base-section-heading title="Roles and Permissions" />
      <v-card class="pa-2 text-center" color="transparent" style="box-shadow:none">
        <v-btn color="#4ebc2a" class="mr-4" @click="exportAsPDF()">Export to Pdf</v-btn>
        <v-btn>
          <export-excel
            :data="roles"
            :fields="json_fields"
            worksheet="roles"
            name="roles.xls"
          >Export as Excel</export-excel>
        </v-btn>
      </v-card>
      <v-card color="grey lighten-4" flat height="100px">
        <v-toolbar>
          <v-toolbar-title>Roles and Permissions</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-text-field
            hide-details
            append-icon="mdi-magnify"
            single-line
            placeholder="Search"
            class="pr-2 mr-2"
          ></v-text-field>
          <v-dialog v-model="dialog" persistent max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="#4ebc2a" dark v-on="on">ADD</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Add Role</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        hide-details
                        single-line
                        v-model='roleName'
                        placeholder="Role Name"
                      ></v-text-field>

                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#4ebc2a darken-1" text @click="dialog = false">Close</v-btn>

                <v-btn v-if="!sendUpdateReq" color="#4ebc2a" dark @click="saveNewRole()">Save</v-btn>

                <v-btn
                  v-if="sendUpdateReq"
                  color="#4ebc2a"
                  dark
                  @click="sendUpdateAbsenceRequest()"
                >Update</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
        <v-divider></v-divider>
        <v-data-table
          :headers="headers"
          :loading="this.showLoader"
          loading-text="Loading roles and permissions..."
          :items="roles"
          :v-model="roles"
          :items-per-page="5"
          class="elevation-1"
        >
        </v-data-table>
      </v-card>
    </v-container>
  </base-section>
</template>

<script>
import jsPDF from "jspdf";
import "jspdf-autotable";
const axios = require("axios");

export default {
  name: "SectionAffiliates",
  data() {
    return {
      showLoader: false,
      dialog: false,
      headers: [
        { text: "ID", value: "id" },
        { text: "Name", value: "name" },
        { text: "Action", value: "action" }
      ],
      roles: [],
      roleName: '',
      json_fields: {
        ID: "id",
        Name: "name"
      },
      json_meta: [[{ key: "charset", value: "utf-8" }]],

      type: [],
      time: [],
      pay: ["guardian", "doctor"],
      start_date: new Date().toISOString().substr(0, 10),
      end_date: new Date().toISOString().substr(0, 10),
      reason: "",
      note: "",
      menu1: false,
      menu2: false,
      sendUpdateReq: false,
      updateData: null,
      contactInfo: {},
      contactDialog: false
    };
  },

  mounted() {
    this.getRoles();
  },

  methods: {
    getRoles() {
      this.showLoader = true;
      const jwt = this.$store.state.sessionData[0].token;
      const url = "https://school.kfundi.com/api/roles";
      axios
        .get(url, {
          headers: {
            Authorization: "Bearer " + jwt
          }
        })
        .then(res => {
          this.showLoader = false;
          const rolesData = res.data.data;
          rolesData.forEach(datum => {
            this.roles.push({
              // start end notes reason cancel
              id: datum.id,
              name: datum.name
            });
          });
        })
        .catch(e => {
          this.showLoader = false;
          console.log("Couldn't fetch data due to: ", e);
        });
    },

    saveNewRole() {
      this.dialog = false;
      const jwt = this.$store.state.sessionData[0].token;
      const url = "https://school.kfundi.com/api/roles";
      axios
        .post(url, [], {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + jwt
          },
          data: {
            name: this.roleName
          }
        })
        .then(res => {
          // ToDo: Add snackbar with success message
          console.log("response: ", res);
          this.roles = []
          this.getRoles()
        })
        .catch(e => {
          // ToDo: Add snackbar with error message
          console.log("Couldn't fetch data due to: ", e);
        });
    },

    exportAsPDF() {
      var columns = [
        { title: "ID", dataKey: "id" },
        { title: "Name", dataKey: "name" }
      ];
      const doc = new jsPDF("p", "pt");
      doc.text("Roles PDF", 40, 40);
      doc.autoTable(columns, this.roles, {
        margin: { top: 60 }
      });
      doc.save("roles.pdf");
    }
  }
};
</script>

<template>
  <base-section id="affiliates" space="36" class="grey lighten-4">
    <v-container class="mr-auto" style="width:80%">
      <base-section-heading title="Registered Learners" />
      <v-card class="pa-2 text-center" color="transparent" style="box-shadow:none">
        <v-btn color="#4ebc2a" class="mr-4" @click="exportAsPDF()">Export to Pdf</v-btn>
        <v-btn>
          <export-excel
            :data="learners"
            :fields="json_fields"
            worksheet="learners"
            name="absences.xls"
          >Export as Excel</export-excel>
        </v-btn>
        <v-btn color="#4ebc2a" class="ml-4">Download CSV</v-btn>
      </v-card>
      <v-card color="grey lighten-4" flat height="100px">
        <v-toolbar>
          <v-toolbar-title>Registered Learners</v-toolbar-title>

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
                <span class="headline">Add Learner</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-select
                        v-model="selectedUser"
                        :items="users"
                        label="User"
                        hide-details
                        single-line
                      ></v-select>
                      <v-text-field
                        v-model="refId"
                        hide-details
                        single-line
                        placeholder="Refrence Id"
                      ></v-text-field>

                      <v-text-field
                        v-model="firstName"
                        hide-details
                        single-line
                        placeholder="First Name"
                      ></v-text-field>

                      <v-text-field
                        v-model="lastName"
                        hide-details
                        single-line
                        placeholder="Last Name"
                      ></v-text-field>

                      <v-text-field
                        v-model="fullName"
                        hide-details
                        single-line
                        placeholder="Full Name"
                      ></v-text-field>

                      <v-menu
                        v-model="hireDateMenu"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="DOB"
                            label="Date of Birth"
                            prepend-inner-icon="mdi-calendar"
                            readonly
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker v-model="DOB" @input="hireDateMenu = false"></v-date-picker>
                      </v-menu>

                      <v-text-field
                        v-model="nationality"
                        hide-details
                        single-line
                        placeholder="Nationality"
                      ></v-text-field>

                      <v-text-field
                        v-model="mobileNo"
                        hide-details
                        single-line
                        placeholder="Mobile Number"
                      ></v-text-field>

                      <v-text-field
                        v-model="homeNo"
                        hide-details
                        single-line
                        placeholder="Home Number"
                      ></v-text-field>

                      <v-text-field
                        v-model="privateEmail"
                        hide-details
                        single-line
                        placeholder="Private Email"
                      ></v-text-field>

                      <v-select v-model="selectedGender" :items="gender" label="Gender"></v-select>

                      <v-file-input show-size v-model="avatar" label="Avatar"></v-file-input>

                      <v-text-field
                        v-model="address"
                        hide-details
                        single-line
                        placeholder="Address"
                      ></v-text-field>

                      <v-text-field v-model="grade" hide-details single-line placeholder="Grade"></v-text-field>

                      <v-text-field
                        v-model="comment"
                        hide-details
                        single-line
                        placeholder="Comment"
                      ></v-text-field>

                      <v-select v-model="disable" :items="disableData" label="Disable"></v-select>

                      <v-text-field
                        v-model="firstGuardianName"
                        hide-details
                        single-line
                        placeholder="First Guardian Name"
                      ></v-text-field>

                      <v-text-field
                        v-model="firstGuardianTitle"
                        hide-details
                        single-line
                        placeholder="First Guardian Title"
                      ></v-text-field>

                      <v-text-field
                        v-model="firstGuardianPhone"
                        hide-details
                        single-line
                        placeholder="First Guardian Phone"
                      ></v-text-field>

                      <v-text-field
                        v-model="firstGuardianEmail"
                        hide-details
                        single-line
                        placeholder="First Guardian Email"
                      ></v-text-field>

                      <v-text-field
                        v-model="firstGuardianOccupation"
                        hide-details
                        single-line
                        placeholder="First Guardian Occupation"
                      ></v-text-field>

                      <v-text-field
                        v-model="secondGuardianName"
                        hide-details
                        single-line
                        placeholder="Second Guardian Name"
                      ></v-text-field>

                      <v-text-field
                        v-model="secondGuardianNumber"
                        hide-details
                        single-line
                        placeholder="Second Guardian Number"
                      ></v-text-field>

                      <v-text-field
                        v-model="secondGuardianEmail"
                        hide-details
                        single-line
                        placeholder="Second Guardian Email"
                      ></v-text-field>

                      <!-- <v-select
                        v-if='!sendUpdateReq'
                        v-model='selectedUser'
                        :items='users'
                        label='Users'
                      >
                      </v-select>-->
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#4ebc2a darken-1" text @click="dialog = false">Close</v-btn>

                <v-btn v-if="!sendUpdateReq" color="#4ebc2a" dark @click="saveNewLearner()">Save</v-btn>

                <v-btn
                  v-if="sendUpdateReq"
                  color="#4ebc2a"
                  dark
                  @click="sendUpdateLearnerRequest()"
                >Update</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="csvDialog" persistent max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn class="ml-3" color="#4ebc2a" dark v-on="on">UPLOAD CSV</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">UPLOAD CSV</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-file-input
                        v-model="csvFile"
                        label="Upload CSV File"
                        prepend-icon="mdi-paperclip"
                      >
                        <template v-slot:selection="{ text }">
                          <v-chip small label color="#4ebc2a">{{ text }}</v-chip>
                        </template>
                      </v-file-input>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#4ebc2a darken-1" text @click="csvDialog = false">Close</v-btn>
                <v-btn color="#4ebc2a" dark @click="uploadCsvFileData()">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
        <v-divider></v-divider>
        <v-data-table
          :headers="headers"
          :loading="this.showLoader"
          loading-text="Loading learners..."
          :items="learners"
          :v-model="learners"
          :items-per-page="5"
          class="elevation-1"
        >
          <template v-slot:item.url="{ item }">
            <a v-if="item.url" :href="item.url" target="_blank">view</a>
          </template>

          <template v-slot:item.contact="{ item }">
            <v-icon class="mx-2" small @click="shoWContactInfo(item)">mdi-account-details-outline</v-icon>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editLearner(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteLearner(item)">mdi-delete</v-icon>
          </template>
        </v-data-table>
      </v-card>

      <v-snackbar v-model="snackbar" :color="color" absolute centered elevation="24" bottom>
        {{ snackText }}
        <v-btn color="primary" @click="snackbar = false">Close</v-btn>
      </v-snackbar>
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
      snackbar: false,
      snackText: "",
      timeout: 6000,
      color: "",
      showLoader: false,
      dialog: false,
      headers: [
        { text: "First Name", value: "first_name" },
        { text: "Last Name", value: "last_name" },
        { text: "Date of Birth", value: "date_of_birth" },
        { text: "Nationaility", value: "nationality" },
        { text: "Grade", value: "grade" },
        { text: "Gender", value: "gender" },
        { text: "Actions", value: "actions" },
      ],
      learners: [],
      json_fields: {
        "First Name": "first_name",
        "Last Name": "last_name",
        "Date of Birth": "date_of_birth",
        Nationaility: "nationality",
        Grade: "grade",
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
      hireDateMenu: "",
      menu2: false,
      sendUpdateReq: false,
      updateData: null,
      contactInfo: {},
      contactDialog: false,
      csvDialog: false,
      csvFile: "",
      users: [],
      selectedUser: null,
      firstName: "",
      lastName: "",
      fullName: "",
      gender: [
        { text: "Male", value: "male" },
        { text: "Female", value: "female" },
      ],
      selectedGender: "",
      disableData: [
        { text: "True", value: 1},
        { text: "False", value: 0 },
      ],
      learnerUser: {},

      refId: "",
      DOB: "",
      nationality: "",
      mobileNo: "",
      homeNo: "",
      privateEmail: "",
      address: "",
      grade: "",
      comment: "",
      disable: "",
      firstGuardianName: "",
      firstGuardianTitle: "",
      firstGuardianPhone: "",
      firstGuardianEmail: "",
      firstGuardianOccupation: "",
      secondGuardianName: "",
      secondGuardianNumber: "",
      secondGuardianEmail: "",
      formData: new FormData(),
      newLearner: new FormData(),
    };
  },

  mounted() {
    this.learners = [];
    this.getLearners();
    this.getUsers();
  },

  methods: {
    uploadCsvFileData() {
      const jwt = this.$store.state.sessionData[0].token;
      const url = `https://school.kfundi.com/api/import/learners`;
      this.formData.append("learners", this.csvFile);
      // console.log('upload csv called');
      axios
        .post(url, this.formData, {
          headers: {
            Authorization: "Bearer " + jwt,
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.code == 200) {
            this.color = "success";
            this.snackText = "File uploaded successfully";
            this.snackbar = true;
            this.csvDialog = false;
          } else {
            this.color = "error";
            this.snackText = "File uploading failed";
            this.snackbar = true;
            this.csvDialog = false;
          }
          // console.log('response received')
          // this.csvDialog=false;
        })
        .catch(() => {
          // console.log("exception occured");
          this.color = "error";
          this.snackText = "File uploading failed";
          this.snackbar = true;
          this.csvDialog = false;
        });
    },
    getLearners() {
      this.showLoader = true;
      const jwt = this.$store.state.sessionData[0].token;
      const url = "https://school.kfundi.com/api/learners";
      axios
        .get(url, {
          headers: {
            Authorization: "Bearer " + jwt,
          },
        })
        .then((res) => {
          this.showLoader = false;
          this.learners = res.data.data;
          console.log(res.data.data);
          // learnersData.forEach(datum => {
          //   this.learners.push({
          //     // start end notes reason cancel
          //     id: datum.id,
          //     first_name: datum.first_name,
          //     last_name: datum.last_name,
          //     full_name: datum.full_name,
          //     date_of_birth: datum.date_of_birth,
          //     nationality: datum.nationality,
          //     grade: datum.grade,
          //     gender: datum.gender,
          //     actions: {}
          //   });
          // });
          console.log(res.data.data);
        })
        .catch((e) => {
          this.showLoader = false;
          console.log("Couldn't fetch data due to: ", e);
        });
    },

    showEditIcon(item) {
      return this.learnerUser[item.id];
    },

    saveNewLearner() {
      this.dialog = false;

      this.newLearner.append("user_id", this.selectedUser);
      this.newLearner.append("ref_id", this.refId);
      this.newLearner.append("first_name", this.firstName);
      this.newLearner.append("last_name", this.lastName);
      this.newLearner.append("full_name", this.fullName);
      this.newLearner.append("date_of_birth", this.DOB);
      this.newLearner.append("nationality", this.nationality);
      this.newLearner.append("mobile_number", this.mobileNo);
      this.newLearner.append("home_number", this.homeNo);
      this.newLearner.append("private_email", this.privateEmail);
      this.newLearner.append("avatar", this.avatar);
      this.newLearner.append("address", this.address);
      this.newLearner.append("grade", this.grade);
      this.newLearner.append("comment", this.comment);
      this.newLearner.append("disabled", this.disable);
      this.newLearner.append("first_guardian_name", this.firstGuardianName);
      this.newLearner.append("first_guardian_title", this.firstGuardianTitle);
      this.newLearner.append("first_guardian_phone", this.firstGuardianPhone);
      this.newLearner.append("first_guardian_email", this.firstGuardianEmail);
      this.newLearner.append(
        "first_guardian_occupation",
        this.firstGuardianOccupation
      );
      this.newLearner.append("second_guardian_name", this.secondGuardianName);
      this.newLearner.append(
        "second_guardian_number",
        this.secondGuardianNumber
      );
      this.newLearner.append("second_guardian_email", this.secondGuardianEmail);
      this.newLearner.append("gender", this.selectedGender);
      console.log(this.newLearner);
      const jwt = this.$store.state.sessionData[0].token;
      const url = "https://school.kfundi.com/api/learners";
      axios
        .post(url, this.newLearner, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + jwt,
          },

        })
        .then((res) => {
          // ToDo: Add snackbar with success message
          console.log("response: ", res);
          this.learners = [];
          this.getLearners();
        })
        .catch((e) => {
          // ToDo: Add snackbar with error message
          console.log("Couldn't fetch data due to: ", e.response);
          console.log( );
          this.snackText=e.response.data.message;
          this.color="error";
          this.snackbar=true;
        });
    },

    editLearner(item) {
      if (!this.showEditIcon) {
        alert("No user Id found. Cannot update learner");
        return false;
      }
      this.firstName = item.first_name;
      this.lastName = item.last_name;
      this.fullName = item.full_name;
      this.selectedGender = item.gender;
      this.selectedUser = item.id;

      this.sendUpdateReq = true;
      this.dialog = true;
      this.updateData = {
        id: item.id,
      };
    },

    sendUpdateLearnerRequest() {
      const jwt = this.$store.state.sessionData[0].token;
      const url = `https://school.kfundi.com/api/learners/${this.updateData.id}?_method=PATCH`;
      axios
        .post(url, [], {
          headers: {
            Authorization: "Bearer " + jwt,
          },
          data: {
            user_id: this.learnerUser[`${this.updateData.id}`],
            first_name: this.firstName,
            last_name: this.lastName,
            full_name: this.fullName,
            gender: this.selectedGender,
          },
        })
        .then((res) => {
          console.log(res);
          this.learners = [];
          this.sendUpdateReq = false;
          this.updateData = {};
          this.dialog = false;
          // ToDo: Add snackbar with success message
          this.getLearners();
        })
        .catch((e) => {
          // ToDo: Add snackbar with error message
          this.sendUpdateReq = false;
          this.updateData = {};
          this.dialog = false;
          console.log("Couldn't fetch data due to: ", e);
        });
    },

    deleteLearner(item) {
      // this.participantDialog = false
      const jwt = this.$store.state.sessionData[0].token;
      console.log("delete learner is :" + item.id);
      const url = `https://school.kfundi.com/api/learners/${item.id}?_method=DELETE`;
      axios
        .post(
          url,
          {},
          {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + jwt,
            },
          }
        )
        .then((res) => {
          // ToDo: Add snackbar with success message
          console.log(res);
          this.learners = [];
          this.getLearners();
        })
        .catch((e) => {
          // ToDo: Add snackbar with error message
          console.log("Couldn't fetch data due to: ", e);
        });
    },

    exportAsPDF() {
      var columns = [
        { title: "First Name", dataKey: "first_name" },
        { title: "Last Name", dataKey: "last_name" },
        { title: "Date of Birth", dataKey: "date_of_birth" },
        { title: "Nationality", dataKey: "nationality" },
        { title: "Grade", dataKey: "grade" },
      ];
      const doc = new jsPDF("p", "pt");
      doc.text("Learners PDF", 40, 40);
      doc.autoTable(columns, this.learners, {
        margin: { top: 60 },
      });
      doc.save("learners.pdf");
    },

    getUsers() {
      const jwt = this.$store.state.sessionData[0].token;
      const url = `https://school.kfundi.com/api/users`;
      axios
        .get(url, {
          headers: {
            Authorization: "Bearer " + jwt,
          },
        })
        .then((res) => {
          const userList = res.data.data;
          console.log("users");
          console.log(res.data.data);
          userList.forEach((datum) => {
            if (datum.learner) {
              this.learnerUser[`${datum.learner.id}`] = datum.id;
            }
            this.users.push({ text: datum.full_name, value: datum.id });
          });
          this.circularLoader = false;
        })
        .catch((e) => {
          // ToDo: Add snackbar with error message
          console.log("Couldn't fetch data due to: ", e);
          this.circularLoader = false;
        });
    },

    // uploadCsvFile() {
    //   const jwt = this.$store.state.sessionData[0].token;
    //   const url = "https://school.kfundi.com/api/import/learners";
    //   axios
    //     .post(url, [], {
    //       headers: {
    //         "Content-Type": "application/json",
    //         Accept: "application/json",
    //         Authorization: "Bearer " + jwt
    //       },
    //       data: {
    //         learners: this.csvFile[0]
    //       }
    //     })
    //     .then(res => {
    //       // ToDo: Add snackbar with success message
    //       console.log("response: ", res);
    //       this.csvDialog = false;
    //       this.learners = []
    //       this.getLearners()
    //     })
    //     .catch(e => {
    //       // ToDo: Add snackbar with error message
    //       console.log("Couldn't fetch data due to: ", e);
    //       this.csvDialog = false;
    //     });
    // }
  },
};
</script>

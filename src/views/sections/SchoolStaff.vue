<template>
  <base-section id="affiliates" space="36" class="grey lighten-4">
    <v-container class="mr-auto" style="width:80%">
      <base-section-heading title="School Staff" />
      <v-card class="pa-2 text-center" color="transparent" style="box-shadow:none">
        <v-btn color="#4ebc2a" class="mr-4" @click="exportAsPDF()">Export to Pdf</v-btn>

        <v-btn>
          <export-excel
            :data="staff"
            :fields="json_fields"
            worksheet="Staff"
            name="staff.xls"
          >Export as Excel</export-excel>
        </v-btn>
        <v-btn color="#4ebc2a" class="ml-4">Download CSV</v-btn>
      </v-card>
      <v-card color="grey lighten-4" flat height="100px">
        <v-toolbar>
          <v-toolbar-title>School Staff</v-toolbar-title>

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
                <span class="headline">Add Staff</span>
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

                      <v-select
                        v-model="selectedJob"
                        :items="jobs"
                        label="Job"
                        hide-details
                        single-line
                      ></v-select>
                      <v-text-field v-model="depId" label="Department"></v-text-field>
                      <v-text-field v-model="supervisorId" label="Supervisor"></v-text-field>
                      <v-text-field v-model="refId" label="Ref ID"></v-text-field>

                      <v-text-field v-model="extCodeNo" label="Extension Code No."></v-text-field>

                      <v-menu
                        v-model="hireDateMenu"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="hireDate"
                            label="Hire Date"
                            prepend-inner-icon="mdi-calendar"
                            readonly
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker v-model="hireDate" @input="hireDateMenu = false"></v-date-picker>
                      </v-menu>

                      <v-text-field v-model="extNumber" label="Extension Number"></v-text-field>

                      <v-text-field v-model="qualifications" label="Qualifications"></v-text-field>

                      <v-text-field v-model="funcClass" label="Funcational Class"></v-text-field>

                      <v-text-field v-model="phone" label="Phone"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#4ebc2a darken-1" text @click="closeDialog()">Close</v-btn>

                <v-btn v-if="!sendUpdateReq" color="#4ebc2a" dark @click="saveNewStaff()">Save</v-btn>

                <v-btn
                  v-if="sendUpdateReq"
                  color="#4ebc2a"
                  dark
                  @click="sendUpdateStaffRequest()"
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
                <v-btn color="#4ebc2a" @click="uploadCsvFile()" dark>Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
        <v-divider></v-divider>
        <v-data-table
          :headers="headers"
          :items="staff"
          :v-model="staff"
          :loading="this.showLoader"
          loading-text="Loading staff info..."
          :items-per-page="5"
          class="elevation-1"
        >
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editStaff(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteStaff(item)">mdi-delete</v-icon>
          </template>
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
  name: "Staff",
  data() {
    return {
      showLoader: false,
      dialog: false,
      DOBMenu: false,
      headers: [
        {
          text: "No.",
          align: "start",
          sortable: false,
          value: "id",
        },
        { text: "Full Name", value: "full_name" },
        { text: "Type of Employement", value: "type_of_employment" },
        { text: "Ref ID", value: "ref_id" },
        { text: "Job Title", value: "job_title_name" },
        { text: "Phone", value: "phone" },
        { text: "Total Leaves", value: "totalleaves" },
        { text: "Remaining Days", value: "total_leave_remaining_days" },
        { text: "Actions", value: "actions" },
      ],

      json_fields: {
        "Full Name": "full_name",
        "Type of Employement": "type_of_employment",
        "Ref ID": "ref_id",
        "Job Title": "job_title_id",
        Phone: "phone",
        "Total Leaves": "totalleaves",
        "Remaining Days": "total_leave_remaining_days",
      },
      json_meta: [[{ key: "charset", value: "utf-8" }]],

      staff: [],
      sendUpdateReq: false,
      users: [],
      selectedUser: "",
      jobs: [],
      selectedJob: "",
      refId: "",
      updateData: null,
      csvDialog: false,
      phone: "",
      extNumber: "",
      extCode: "",
      hireDate: new Date().toISOString().substr(0, 10),
      hireDateMenu: "",
      qualifications: "",
      funcClass: "",
      dept: "",
      firstName: "",
      lastName: "",
      fullName: "",
      privateEmail: "",
      DOB: new Date().toISOString().substr(0, 10),
      gender: "",
      nationalId: "",
      carReg: "",
      address: "",
      kinPhone: "",
      kinName: "",
      extCodeNo: "",
      avatar: "",
      csvFile: "",
      staffId: "",
      depId: "",
      supervisorId: "",
      editEmployee: new FormData(),
    };
  },

  mounted() {
    this.getStaff();
    this.getJobs();
    this.getUsers();
  },

  methods: {
    editStaff(item) {
      console.log(item);
      this.selectedJob = item.job_title_id;
      this.refId = item.ref_id;

      this.phone = item.phone;
      this.staffId = item.id;
      this.sendUpdateReq = true;
      this.dialog = true;
    },

    sendUpdateStaffRequest() {
      const jwt = this.$store.state.sessionData[0].token;
      const url = `https://school.kfundi.com/api/employees/${this.staffId}?_method=PATCH`;
      axios
        .post(
          url,
          {
            ref_id: this.refId,
            phone: this.phone,
            ext_num: this.extNumber,
            ext_code_num: this.extCodeNo,
            hired_at: this.hireDate,
            qualifications: this.qualifications,
            functional_class: this.funcClass,
            job_title_id: this.selectedJob,
            user_id: this.selectedUser,
            department_id: this.depId,
            supervisor_id: this.supervisorId,
          },
          {
            headers: {
              Authorization: "Bearer " + jwt,
            },
          }
        )
        .then((res) => {
          console.log(res);
          this.staff = [];
          this.sendUpdateReq = false;
          this.updateData = false;
          this.dialog = false;
          // ToDo: Add snackbar with success message
          this.getStaff();
        })
        .catch((e) => {
          // ToDo: Add snackbar with error message
          this.sendUpdateReq = false;
          this.updateData = false;
          this.dialog = false;
          console.log("Couldn't fetch data due to: ", e);
        });
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
          // console.log(res)
          // alert(res)
          const userList = res.data.data;
          userList.forEach((datum) => {
            this.users.push({ text: datum.full_name, value: datum.id });
          });
          this.circularLoader = false;
          // console.log('users');
          // console.log(this.users);
        })
        .catch((e) => {
          // ToDo: Add snackbar with error message
          console.log("Couldn't fetch data due to: ", e);
          this.circularLoader = false;
        });
    },

    getJobs() {
      const jwt = this.$store.state.sessionData[0].token;
      const url = `https://school.kfundi.com/api/job-titles`;
      axios
        .get(url, {
          headers: {
            Authorization: "Bearer " + jwt,
          },
        })
        .then((res) => {
          // console.log(res)
          // alert(res)
          const jobList = res.data.data;
          jobList.forEach((datum) => {
            this.jobs.push({ text: datum.name, value: datum.id });
          });
          console.log(this.jobs);
          this.circularLoader = false;
          // console.log(this.jobs)
        })
        .catch((e) => {
          // ToDo: Add snackbar with error message
          console.log("Couldn't fetch data due to: ", e);
          this.circularLoader = false;
        });
    },

    getStaff() {
      this.showLoader = true;
      const jwt = this.$store.state.sessionData[0].token;
      const url = "https://school.kfundi.com/api/employees";
      axios
        .get(url, {
          headers: {
            Authorization: "Bearer " + jwt,
          },
        })
        .then((res) => {
          this.showLoader = false;
          this.staff = res.data.data;
          console.log(res.data.data);
          // employeesList.forEach(datum => {
          //   this.staff.push(
          //     {
          //       id: datum.id,
          //       ref_id: datum.ref_id,
          //       full_name: datum.full_name,
          //       type_of_employment: datum.type_of_employment,
          //       job_title_id: datum.job_title_name,
          //       job_id: datum.job_title_id,
          //       phone: datum.phone,
          //       total_leave_remaining_days: datum.total_leave_remaining_days,
          //       actions: { edit: 'mdi-pencil', viewResult: 'mdi-delete' }
          //     }
          //   )
          //   // console.log('employees');

          // })
        })
        .catch((e) => {
          this.showLoader = false;
          console.log("Couldn't fetch data due to: ", e);
        });
    },
    closeDialog() {
      this.dialog = false;
      this.sendUpdateReq = false;
    },
    saveNewStaff() {
      this.dialog = false;
      const jwt = this.$store.state.sessionData[0].token;

      console.log("user_id:" + this.selectedUser);
      console.log("job_title_id:" + this.selectedJob);
      const url = "https://school.kfundi.com/api/employees";

      axios
        .post(
          url,

          {
            ref_id: this.refId,
            phone: this.phone,
            ext_num: this.extNumber,
            ext_code_num: this.extCode,
            hired_at: this.hireDate,
            qualifications: this.qualifications,
            functional_class: this.funcClass,
            department_id: this.depId,
            job_title_id: this.selectedJob,
            user_id: this.selectedUser,
          },
          {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + jwt,
            },
            // data: {

            // },
          }
        )
        .then((res) => {
          // ToDo: Add snackbar with success message
          console.log("response: ", res);
          this.staff = [];
          this.getStaff();
        })
        .catch((e) => {
          // ToDo: Add snackbar with error message
          console.log("Couldn't fetch data due to: ", e);
        });
    },

    deleteStaff(item) {
      this.showLoader = true;
      if (confirm("Are you sure you want to delete this staff member?")) {
        const jwt = this.$store.state.sessionData[0].token;
        const url = `https://school.kfundi.com/api/employees/${item.id}`;
        axios
          .delete(url, {
            headers: {
              Authorization: "Bearer " + jwt,
            },
          })
          .then((res) => {
            this.showLoader = false;
            console.log(res);
            this.staff = [];
            this.getStaff();
          })
          .catch((e) => {
            this.showLoader = false;
            console.log("Couldn't fetch data due to: ", e);
          });
      }
    },

    exportAsPDF() {
      var columns = [
        { title: "Name", dataKey: "name" },

        { title: "Full Name", dataKey: "full_name" },
        { title: "Type of Employement", dataKey: "type_of_employment" },
        { title: "Ref ID", dataKey: "ref_id" },
        { title: "Job Title", dataKey: "job_title_id" },
        { title: "Phone", dataKey: "phone" },
        { title: "Total Leave", dataKey: "totalleaves" },
        { title: "Remaining Days", dataKey: "total_leave_remaining_days" },
      ];
      const doc = new jsPDF("p", "pt");
      doc.text("Staff PDF", 40, 40);
      doc.autoTable(columns, this.staff, {
        margin: { top: 60 },
      });
      doc.save("staff.pdf");
    },
  },
};
</script>

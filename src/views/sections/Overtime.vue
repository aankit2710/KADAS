<template>
  <base-section id="affiliates" space="36" class="grey lighten-4">
    <v-container class="mr-auto" style="width:80%">
      <base-section-heading title="Manage Overtime" />
      <v-card class="pa-2 text-center" color="transparent" style="box-shadow:none">
        <v-btn color="#4ebc2a" class="mr-4" @click="exportAsPDF()">Export to Pdf</v-btn>

        <v-btn>
          <export-excel
            :data="overTime"
            :fields="json_fields"
            worksheet="Overtime"
            name="Overtime.xls"
          >Export as Excel</export-excel>
        </v-btn>
      </v-card>
      <v-card color="grey lighten-4" flat height="100px">
        <v-toolbar>
          <v-toolbar-title>Overtime</v-toolbar-title>

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
          :items="overTime"
          :v-model="overTime"
          :loading="this.showLoader"
          loading-text="Loading overtime data..."
          :items-per-page="5"
          class="elevation-1"
        >
          <template v-slot:item.actions="{ item }">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-icon
                  small
                  v-on="on"
                  class="mr-2"
                  @click="approveOvertime(item, 'approved')"
                >mdi-check</v-icon>
              </template>
              <span>approve</span>
            </v-tooltip>

            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-icon small v-on="on" @click="approveOvertime(item, 'rejected')">mdi-close</v-icon>
              </template>
              <span>reject</span>
            </v-tooltip>

            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-icon small v-on="on" @click="approveOvertime(item, 'pending')">mdi-account-clock</v-icon>
              </template>
              <span>pending</span>
            </v-tooltip>
          </template>
          <template v-slot:item.status="{ item }">
            <v-chip :color="getColor(item.status)" dark>{{ item.status }}</v-chip>
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
// const qs = require('qs')
export default {
  name: "SectionAffiliates",
  data() {
    return {
      showLoader: false,
      dialog: false,
      headers: [
        {
          text: "ID",
          align: "start",
          sortable: false,
          value: "id",
        },
        { text: "Reason", value: "reason" },
        { text: "Date Start", value: "date_start" },
        { text: "Date End", value: "date_end" },
        { text: "Requested At", value: "requested_at" },
        { text: "Full Name", value: "employee_fullname" },
        { text: "Status", value: "status" },
        { text: "Actions", value: "actions" },
      ],
      overTime: [],

      json_fields: {
        ID: "id",
        Reason: "reason",
        "Date Start": "date_start",
        "Date End": "date_end",
        "Requested At": "requested_at",
        "Full Name": "employee_fullname",
        Status: "status",
        "Is Started": "is_started",
        "Is End": "is_ended",
      },
      json_meta: [[{ key: "charset", value: "utf-8" }]],
      statusData: new FormData(),
    };
  },
  methods: {
    getColor(type) {
      if (type === "accepted") {
        return "green";
      } else if (type === "rejected") {
        return "red";
      } else {
        return "yellow accent-4";
      }
    },
    validate() {
      const jwt = this.$store.state.sessionData[0].token;
      const url = "https://school.kfundi.com/api/events";
      axios
        .post(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwt,
          },
          data: {
            id: this.id,
            name: this.name,
            description: this.description,
            note: "123",
            start_date: this.startdate,
            end_date: this.enddate,
            type_id: this.typeid,
            creator_id: "1",
          },
        })
        .then((resp) => {
          const token = resp.data.token;
          alert(token);
        })
        .catch((err) => console.log(err));
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },

    getOverTimeData() {
      this.showLoader = true;
      const jwt = this.$store.state.sessionData[0].token;
      const url = "https://school.kfundi.com/api/overtimes";
      axios
        .get(url, {
          headers: {
            Authorization: "Bearer " + jwt,
          },
        })
        .then((res) => {
          console.log(res);
          this.showLoader = false;
          this.overTime = [];
          const overTimeArr = res.data.data;
          overTimeArr.forEach((datum) => {
            this.overTime.push({
              id: datum.id,
              reason: datum.reason,
              type: datum.type,
              date_start: datum.date_start,
              date_end: datum.date_end,
              requested_at: datum.requested_at,
              employee_fullname: datum.employee_fullname,
              status: datum.status,
              is_started: datum.is_started,
              is_ended: datum.is_ended,
              creator: datum.creator,
              created_at: datum.created_at,
              actions: {},
            });
          });
        })
        .catch((e) => {
          this.showLoader = false;
          console.log("Couldn't fetch data due to: ", e);
        });
    },
    exportAsPDF() {
      var columns = [
        // ref_no type title desc creator created at
        { title: "ID", dataKey: "id" },
        { title: "Reason", dataKey: "reason" },
        { title: "Type", dataKey: "type" },
        { title: "Date Start", dataKey: "date_start" },
        { title: "Date End", dataKey: "date_end" },
        { title: "Requested At", dataKey: "requested_at" },
        { title: "Full Name", dataKey: "employee_fullname" },
        { title: "Status", dataKey: "status" },
        { title: "Is Started", dataKey: "is_started" },
        { title: "Is End", dataKey: "is_end" },
      ];
      const doc = new jsPDF("p", "pt");
      doc.text("Overtime PDF", 20, 20);
      doc.autoTable(columns, this.overTime, {
        margin: { top: 60 },
      });
      doc.save("overtime.pdf");
    },
    approveOvertime(overtime, update) {
      if (
        confirm(`Are you sure you want to mark this overtime as ${update}?`)
      ) {
        const jwt = this.$store.state.sessionData[0].token;
        // console.log('method is being called');
        this.statusData.append("status", update);
        this.statusData.append("status_note", 'update status ');
        // let requestBody= {
        //   status:update,
        //   status_note:'update status'
        // }
        // for (var pair of this.statusData.entries()) {
        //   console.log(pair[0] + ", " + pair[1]);
        // }
        const url =
          "https://school.kfundi.com/api/overtimes/" +
          overtime.id +
          "?_method=PATCH";
        // console.log(requestBody);
        axios
          .post(
            url,
            //  {
            //     status:update,
            //     status_note:'status updated'
            //  },
            this.statusData,
            // qs.stringify(requestBody),
            // [],
            {
              headers: {
                Authorization: "Bearer " + jwt,
                // 'Accept': "application/json",
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              // data:{
              //   status:update,
              //   status_note:'testing status change'
              // }
            }
          )
          .then((res) => {
            console.log("res: ", res);
            this.overTime = [];
            this.getOverTimeData();
          })
          .catch((e) => {
            this.showLoader = false;
            console.log("Couldn't fetch data due to: ", e);
          });
      }
    },
  },

  mounted() {
    this.getOverTimeData();
  },
};
</script>

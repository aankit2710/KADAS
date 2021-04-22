<template>
  <base-section id="affiliates" space="36" class="grey lighten-4">
    <v-container class="mr-auto" fluid tag="section" style="width:80%">
      <v-toolbar-title>Admin Dashboard</v-toolbar-title>

      <v-row class="mr-auto" fluid tag="section">
        <v-col v-for="item in names" :key="item.title" cols="12" sm="6" md="4">
          <v-alert outlined dense>
            <v-list-item three-line :class="'miniVariant px-0'">
              <v-btn color="#4ebc2a" fab dark small>
                <v-icon center>{{ item.icon }}</v-icon>
              </v-btn>
              <v-list-item-content>
                <v-list-item-title class="text-left pl-3 #4ebc2a">{{item.numbers}}</v-list-item-title>
                <v-list-item-subtitle class="text-left pl-3">{{item.title}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-alert>
        </v-col>
      </v-row>
    </v-container>


     <v-container class="mr-auto" fluid tag="section" style="width:80%">
      <v-toolbar-title>Learners Dashboard</v-toolbar-title>

      <v-row class="mr-auto" fluid tag="section">
        <v-col v-for="item in names" :key="item.title" cols="12" sm="6" md="4">
          <v-alert outlined dense>
            <v-list-item three-line :class="'miniVariant px-0'">
              <v-btn color="#4ebc2a" fab dark small>
                <v-icon center>{{ item.icon }}</v-icon>
              </v-btn>
              <v-list-item-content>
                <v-list-item-title class="text-left pl-3 #4ebc2a">{{item.numbers}}</v-list-item-title>
                <v-list-item-subtitle class="text-left pl-3">{{item.title}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-alert>
        </v-col>
      </v-row>
    </v-container>
  </base-section>
</template>


<script>
import { getCookie } from "tiny-cookie";
const axios = require('axios')
let user = JSON.parse(getCookie("logged_user"));
export default {
  data() {
    return {
      names:[],
      user: user,
      stats:''
    };
  },
  created(){
    this.getAdminDashboardStats();
  },
  methods: {
    getAdminDashboardStats(){
      const jwt = this.$store.state.sessionData[0].token
        const url = 'https://school.kfundi.com/api/admin/dashboard'
        axios.get(url, {
           headers: {
            Authorization: 'Bearer ' + jwt,
          }
        }).then(res => {
          this.stats=res.data.data;
          console.log(res.data);
          this.initializeNames();
        })
    },
    initializeNames(){
      this.names = [
        {
          title: "Remaining Days in Your Plan",
          icon: "mdi-calendar",
          numbers: this.stats.remaining_days_in_your_plan,
          color: "red--text"
        },
        {
          title: "Leaves",
          icon: "mdi-view-dashboard",
          numbers: this.stats.total_leaves,
          color: "red"
        },
        {
          title: "On-Going Chats",
          icon: "mdi-view-dashboard",
          numbers:this.stats.total_chat_conversation,
          color: "red"
        },
        {
          title: "On Going Lessons",
          icon: "mdi-view-dashboard",
          numbers: this.stats.ongoing_lessons,
          color: "red"
        },
        {
          title: "Internal Tickets",
          icon: "mdi-view-dashboard",
          numbers: this.stats.internal_tickets,
          color: "red"
        },
        {
          title: "External Tickets",
          icon: "mdi-view-dashboard",
          numbers: this.stats.external_tickets,
          color: "red"
        },
        {
          title: "Tasks for the day",
          icon: "mdi-view-dashboard",
          numbers: this.stats.total_tasks,
          color: "red"
        },
        {
          title: "Submitted Overtimes",
          icon: "mdi-view-dashboard",
          numbers: this.stats.total_overtimes,
          color: "red"
        },
        {
          title: "Attendance",
          icon: "mdi-view-dashboard",
          numbers: this.stats.total_attendances,
          color: "red"
        }
      ]
    }
  }
};
</script>

<template>
  <div>
    <v-app-bar
      id="home-app-bar"
      app
      color="#4ebc2a"
      elevation="1"
      height="50"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>KADAS FUNDI</v-toolbar-title>

      <v-spacer />
      <v-icon class="mr-3">
        mdi-account
      </v-icon>
      <div align="center">
        Admin Kadas <br>admin@gmail.com
      </div>
      <v-menu
        bottom
        left
      >
        <template v-slot:activator="{ on }">
          <v-btn
            class="ma-2"
            icon
            v-on="on"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(li, i) in item"
            :key="i"
            link
          >
            <v-list-item-title v-if='li.button' @click='logout()'>{{ li.title }}</v-list-item-title>
            <v-list-item-title v-else @click='goToProfile(li.title)'>{{ li.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      app
      floating
      :color="color"
      :mini-variant.sync="mini"
      :permanent="permanent"
      :src="bg"
      fixed
      height="100%"
      dark
    >
      <v-list
        dense
        nav
        class="py-0"
      >
        <v-list-item
          two-line

        >
          <v-list-item-avatar >
            <router-link to="/Admin/Profile">
            <img src="https://randomuser.me/api/portraits/men/81.jpg">
            </router-link>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title> {{ userName }} </v-list-item-title>
            <v-list-item-subtitle>
              {{ userRole }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-btn
          icon
          @click.stop="mini = !mini"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        </v-list-item>
        <v-divider />
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          :to="item.title"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
  export default {
    name: 'HomeAppBar',
    data: () => ({
      userName: '',
      userRole: '',
      dialog: false,
      dialog2: false,
      dialog3: false,
      notifications: false,
      sound: true,
      widgets: false,
      item: [
        { title: 'Profile', link: 'Profile' },
        { title: 'Logout', button: 'logout' },
      ],
      valid: false,
      toggle_exclusive: undefined,
      drawer: true,
      items: [
        { title: 'Dashboard', icon: 'mdi-account-multiple' },
        { title: 'School Staff', icon: 'mdi-account-multiple' },
        { title: 'Registered Learners', icon: 'mdi-account-multiple' },
        { title: 'Roles and Permissions', icon: 'mdi-account-multiple' },
        { title: 'Educators Leave', icon: 'mdi-account-multiple' },
        { title: 'Learners Absences', icon: 'mdi-account-multiple-outline' },
        { title: 'Library', icon: 'mdi-account-multiple-outline' },
        { title: 'Events', icon: 'mdi-calendar-outline' },
        { title: 'Chat', icon: 'mdi-chat' },
        { title: 'Policies', icon: 'mdi-folder' },
        { title: 'Tasks', icon: 'mdi-check-all' },
        { title: 'files', icon: 'mdi-paperclip' },
        { title: 'Announcements', icon: 'mdi-bell-ring' },
        { title: 'Class', icon: 'mdi-help-box' },
        { title: 'Create Lesson', icon: 'mdi-help-box' },
        { title: 'Stocks', icon: 'mdi-help-box' },
        { title: 'Tickets', icon: 'mdi-alert-circle' },
        { title: 'Overtime', icon: 'mdi-alert-circle' },
        { title: 'Reports', icon: 'mdi-alert-circle' },
        { title: 'Attendance', icon: 'mdi-calendar-check ' },
        { title: 'Settings', icon: 'mdi-cog' },
      ],
      mini: false,
      color: '#158251',
      colors: [
        'primary',
        'blue',
        'success',
        'red',
        'teal',
      ],
      right: true,
      permanent: false,
      miniVariant: true,
      background: false,
    }),

    mounted () {
      const loggedInUser = this.$store.state.sessionData[1].user
      this.userName = loggedInUser.full_name,
      this.userRole = loggedInUser.roles[0]
    },


    methods: {
      logout () {
        this.$store.commit('updateSessionData', [])
        location.replace('/')
      },
      goToProfile (path) {
        location.replace(`/admin/${path}`)
      }
    },
  }
</script>

<style lang="sass">
  #home-app-bar
    .v-tabs-slider
      max-width: 24px
      margin: 0 auto

    .v-tab
      &::before
        display: none
</style>

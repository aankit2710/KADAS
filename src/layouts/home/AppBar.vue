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
      <v-app-bar-nav-icon @click.stop="mini = !mini" />
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
            v-for="(item, i) in items"
            :key="i"
            @click="logout"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<script>
  import { removeCookie } from 'tiny-cookie'
  export default {
    name: 'HomeAppBar',
    data: () => ({
      dialog: false,
      dialog2: false,
      dialog3: false,
      notifications: false,
      sound: true,
      widgets: false,
      items: [
        {
          title: 'Profile',
        },
        {
          title: 'Logout',
        },
      ],
    }),
    methods: {
      logout () {
        removeCookie('dateObject')
        alert('logout Successfully')
        location.replace('/')
      },
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

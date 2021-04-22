<template>
  <v-navigation-drawer
    v-model="drawer"
    :color="color"
    :expand-on-hover="expandOnHover"
    :mini-variant.sync="mini"
    :permanent="permanent"
    :src="bg"
    fixed
    height="100%"
    dark
    style="margin:0px;margin-top:50px;padding:0px"
  >
    <v-list
      dense
      nav
      class="py-0"
    >
      <v-list-item
        two-line
        @click.stop="mini = !mini"
      >
        <v-list-item-avatar>
          <img src="https://randomuser.me/api/portraits/men/81.jpg">
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>Application</v-list-item-title>
          <v-list-item-subtitle
            to:dashboard
          >
            Subtext
          </v-list-item-subtitle>
        </v-list-item-content>
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
</template>

<script>
  export default {
    name: 'HomeDrawer',
    data () {
      return {
        valid: false,
        toggle_exclusive: undefined,
        drawer: true,
        items: [
          { title: 'Educators Leave', icon: 'mdi-account-multiple' },
          { title: 'Learners Absences', icon: 'mdi-account-multiple-outline' },
          { title: 'Library', icon: 'mdi-account-multiple-outline' },
          { title: 'Events', icon: 'mdi-help-box' },
          { title: 'Chat', icon: 'mdi-help-box' },
          { title: 'Documents', icon: 'mdi-help-box' },
          { title: 'Tasks', icon: 'mdi-check-all' },
          { title: 'Announcements', icon: 'mdi-help-box' },
          { title: 'Create Class', icon: 'mdi-help-box' },
          { title: 'Create Lesson', icon: 'mdi-help-box' },
          { title: 'Reports', icon: 'mdi-bus' },
          { title: 'Settings', icon: 'mdi-bus' },
        ],
        mini: true,
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
        expandOnHover: false,
        background: false,
      }
    },
    computed: {
      bg () {
        return this.background ? 'https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg' : undefined
      },
    },
  }
</script>

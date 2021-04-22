// Imports
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: (to, from, savedPosition) => {
    if (to.hash) return { selector: to.hash }
    if (savedPosition) return savedPosition

    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/home/Index.vue'),
      children: [
        // {
        //   path: '/home',
        //   name: 'Dashboard',
        //   component: () => import('@/views/home/Index.vue'),
        // },
        {
          path: '/form',
          name: 'Form',
          component: () => import('@/views/sections/Form.vue'),
        },
        {
          path: '/Admin/Dashboard',
          name: 'Dashboard',
          component: () => import('@/views/Admin/Dashboard.vue'),
        },
        {
          path: '/Admin/School Staff',
          name: 'SchoolStaff',
          component: () => import('@/views/Admin/SchoolStaff.vue'),
        },
        // {
        //   path: '/Admin/Registered Learners',
        //   name: 'Registered Learners',
        //   component: () => import('@/views/Admin/RegisteredLearners.vue'),
        // },
        {
          path: '/Admin/Educators Leave',
          name: 'Leaves',
          component: () => import('@/views/Admin/Leaves.vue'),
        },
        {
          path: '/Admin/Learners Absences',
          name: 'Leaves',
          component: () => import('@/views/Admin/Absences.vue'),
        },

        {
          path: '/Admin/Registered Learners',
          name: 'Learners',
          component: () => import('@/views/Admin/Learners.vue'),
        },

        {
          path: '/Admin/Roles And Permissions',
          name: 'Learners',
          component: () => import('@/views/Admin/RolesPermissions.vue'),
        },

        {
          path: '/Admin/Library',
          name: 'Library',
          component: () => import('@/views/Admin/Library.vue'),
        },
        {
          path: '/Admin/Events',
          name: 'Events',
          component: () => import('@/views/Admin/Events.vue'),
        },
        {
          path: '/Admin/Policies',
          name: 'Policies',
          component: () => import('@/views/Admin/RegulationDocuments.vue'),
        },
        {
          path: '/Admin/Tasks',
          name: 'Tasks',
          component: () => import('@/views/Admin/Tasks.vue'),
        },
        {
          path: '/Admin/Announcements',
          name: 'Announcements',
          component: () => import('@/views/Admin/Announcements.vue'),
        },
        {
          path: '/Admin/Stocks',
          name: 'Stocks',
          component: () => import('@/views/Admin/Stocks.vue'),
        },
        {
          path: '/Admin/Chat',
          name: 'Chats',
          component: () => import('@/views/Admin/Chat.vue'),
        },
        {
          path: '/Admin/Class',
          name: 'Class',
          component: () => import('@/views/Admin/Createclass.vue'),
        },
        {
          path: '/Admin/Learner',
          name: 'Learner',
          component: () => import('@/views/Admin/Learner2.vue'),
        },
        {
          path: '/Admin/Create Lesson',
          name: 'Create Lesson',
          component: () => import('@/views/Admin/Createstream.vue'),
        },
        {
          path: '/Admin/Tickets',
          name: 'Tickets',
          component: () => import('@/views/Admin/Tickets.vue'),
        },
        {
          path: '/Admin/Overtime',
          name: 'Overtime',
          component: () => import('@/views/Admin/Overtime.vue'),
        },
        {
          path: '/Admin/Attendance',
          name: 'Attendance',
          component: () => import('@/views/Admin/Attendance.vue'),
        },
        {
          path: '/Admin/Settings',
          name: 'Settings',
          component: () => import('@/views/Admin/Settings.vue'),
        },
        {
          path: '/Admin/Files',
          name: 'Settings',
          component: () => import('@/views/Admin/Files.vue'),
        },
        {
          path: '/Admin/Managefiles',
          name: 'Managefiles',
          component: () => import('@/views/Admin/Managefiles.vue'),
        },
        {
          path: '/',
          name: 'Login',
          component: () => import('@/views/sections/Login.vue'),
        },
        {
          path: '/Admin/Profile',
          name: 'Profile',
          component: () => import('@/views/Admin/Profile.vue'),
        },
        {
          path: '*',
          name: 'FourOhFour',
          component: () => import('@/views/Admin/404.vue'),
        },
      ],
    },

  ],
})

export default router

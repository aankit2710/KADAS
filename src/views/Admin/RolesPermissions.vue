<script>
  // Extensions
  import View from '@/views/View'

  // Mixins
  import LoadSections from '@/mixins/load-sections'

  export default {
    name: 'ContactUs',

    metaInfo: { title: 'Roles and Permissions' },

    extends: View,

    mixins: [
      LoadSections([
        'AppBar',
        'Drawer',
        'RolesPermissions',
      ]),
    ],

    props: {
      id: {
        type: String,
        default: 'Roles/Permissions',
      },
    },
  }
</script>

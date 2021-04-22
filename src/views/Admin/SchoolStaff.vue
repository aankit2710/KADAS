<script>
  // Extensions
  import View from '@/views/View'

  // Mixins
  import LoadSections from '@/mixins/load-sections'

  export default {
    name: 'ContactUs',

    metaInfo: { title: 'School Staff' },

    extends: View,

    mixins: [
      LoadSections([
        'AppBar',
        'Drawer',
        'SchoolStaff',
      ]),
    ],

    props: {
      id: {
        type: String,
        default: 'Events',
      },
    },
  }
</script>

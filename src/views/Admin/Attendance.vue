<script>
  // Extensions
  import View from '@/views/View'

  // Mixins
  import LoadSections from '@/mixins/load-sections'

  export default {
    name: 'ContactUs',

    metaInfo: { title: 'Attendance' },

    extends: View,

    mixins: [
      LoadSections([
        'AppBar',
        'Drawer',
        'Attendance',
      ]),
    ],

    props: {
      id: {
        type: String,
        default: 'Attendance',
      },
    },
  }
</script>

<script>
  // Extensions
  import View from '@/views/View'

  // Mixins
  import LoadSections from '@/mixins/load-sections'

  export default {
    name: 'ContactUs',

    metaInfo: { title: 'Announcements' },

    extends: View,

    mixins: [
      LoadSections([
        'AppBar',
        'Drawer',
        'Announcements',
      ]),
    ],

    props: {
      id: {
        type: String,
        default: 'Announcements',
      },
    },
  }
</script>

<script>
  // Extensions
  import View from '@/views/View'

  // Mixins
  import LoadSections from '@/mixins/load-sections'

  export default {
    name: 'ContactUs',

    metaInfo: { title: 'Tickets' },

    extends: View,

    mixins: [
      LoadSections([
        'AppBar',
        'Drawer',
        'Tickets',
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

<script>
  // Extensions
  import View from '@/views/View'

  // Mixins
  import LoadSections from '@/mixins/load-sections'

  export default {
    name: 'ContactUs',

    metaInfo: { title: 'Events' },

    extends: View,

    mixins: [
      LoadSections([
        'AppBar',
        'Drawer',
        'Events',
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

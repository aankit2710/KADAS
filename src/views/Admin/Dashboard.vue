<script>
  // Extensions
  import View from '@/views/View'

  // Mixins
  import LoadSections from '@/mixins/load-sections'

  export default {
    name: 'ContactUs',

    metaInfo: { title: 'Dashboard' },

    extends: View,

    mixins: [
      LoadSections([
        'AppBar',
        'Drawer',
        'Dashboard',
      ]),
    ],

    props: {
      id: {
        type: String,
        default: 'Dashboard',
      },
    },
  }
</script>

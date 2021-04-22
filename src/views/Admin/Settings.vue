<script>
  // Extensions
  import View from '@/views/View'

  // Mixins
  import LoadSections from '@/mixins/load-sections'

  export default {
    name: 'ContactUs',

    metaInfo: { title: 'Settings' },

    extends: View,

    mixins: [
      LoadSections([
        'AppBar',
        'Drawer',
        'Settings',
      ]),
    ],

    props: {
      id: {
        type: String,
        default: 'Settings',
      },
    },
  }
</script>

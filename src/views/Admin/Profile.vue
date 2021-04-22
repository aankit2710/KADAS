<script>
  // Extensions
  import View from '@/views/View'

  // Mixins
  import LoadSections from '@/mixins/load-sections'

  export default {
    name: 'ContactUs',

    metaInfo: { title: 'Profile' },

    extends: View,

    mixins: [
      LoadSections([
        'AppBar',
        'Drawer',
        'Profile',
      ]),
    ],

    props: {
      id: {
        type: String,
        default: 'Profile',
      },
    },
  }
</script>

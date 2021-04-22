<script>
  // Extensions
  import View from '@/views/View'

  // Mixins
  import LoadSections from '@/mixins/load-sections'

  export default {
    name: 'ContactUs',

    metaInfo: { title: 'Registered Learners' },

    extends: View,

    mixins: [
      LoadSections([
        'AppBar',
        'Drawer',
        'RegisteredLearners',
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

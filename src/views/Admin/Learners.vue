<script>
  // Extensions
  import View from '@/views/View'

  // Mixins
  import LoadSections from '@/mixins/load-sections'

  export default {
    name: 'ContactUs',

    metaInfo: { title: 'Learners' },

    extends: View,

    mixins: [
      LoadSections([
        'AppBar',
        'Drawer',
        'Learners',
      ]),
    ],

    props: {
      id: {
        type: String,
        default: 'Learners',
      },
    },
  }
</script>

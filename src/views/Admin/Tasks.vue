<script>
  // Extensions
  import View from '@/views/View'

  // Mixins
  import LoadSections from '@/mixins/load-sections'

  export default {
    name: 'ContactUs',

    metaInfo: { title: 'Tasks' },

    extends: View,

    mixins: [
      LoadSections([
        'AppBar',
        'Drawer',
        'Tasks',
      ]),
    ],

    props: {
      id: {
        type: String,
        default: 'Tasks',
      },
    },
  }
</script>

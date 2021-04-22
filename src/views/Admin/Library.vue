<script>
  // Extensions
  import View from '@/views/View'

  // Mixins
  import LoadSections from '@/mixins/load-sections'

  export default {
    name: 'ContactUs',

    metaInfo: { title: 'Library' },

    extends: View,

    mixins: [
      LoadSections([
        'AppBar',
        'Drawer',
        'Library',
      ]),
    ],

    props: {
      id: {
        type: String,
        default: 'Library',
      },
    },
  }
</script>

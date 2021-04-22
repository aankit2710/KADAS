<script>
  // Extensions
  import View from '@/views/View'

  // Mixins
  import LoadSections from '@/mixins/load-sections'

  export default {
    name: 'ContactUs',

    metaInfo: { title: 'Leaves' },

    extends: View,

    mixins: [
      LoadSections([
        'AppBar',
        'Drawer',
        'Leaves',
      ]),
    ],

    props: {
      id: {
        type: String,
        default: 'leaves',
      },
    },
  }
</script>

<script>
  // Extensions
  import View from '@/views/View'

  // Mixins
  import LoadSections from '@/mixins/load-sections'

  export default {
    name: 'Stocks',

    metaInfo: { title: 'Stocks' },

    extends: View,

    mixins: [
      LoadSections([
        'AppBar',
        'Drawer',
        'Stocks',
      ]),
    ],

    props: {
      id: {
        type: String,
        default: 'Stocks',
      },
    },
  }
</script>

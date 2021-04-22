<script>
  // Extensions
  import View from '@/views/View'

  // Mixins
  import LoadSections from '@/mixins/load-sections'

  export default {
    name: 'Chat',

    metaInfo: { title: 'Chat' },

    extends: View,

    mixins: [
      LoadSections([
        'AppBar',
        'Drawer',
        'Chat',
      ]),
    ],

    props: {
      id: {
        type: String,
        default: 'Chat',
      },
    },
  }
</script>

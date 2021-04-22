<script>
  // Extensions
  import View from '@/views/View'

  // Mixins
  import LoadSections from '@/mixins/load-sections'

  export default {
    name: 'Files',

    metaInfo: { title: 'Files' },

    extends: View,

    mixins: [
      LoadSections([
        'AppBar',
        'Drawer',
        'Managefiles',
      ]),
    ],

    props: {
      id: {
        type: String,
        default: 'Files',
      },
    },
  }
</script>

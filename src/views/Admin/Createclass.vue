<script>
  // Extensions
  import View from '@/views/View'

  // Mixins
  import LoadSections from '@/mixins/load-sections'

  export default {
    name: 'ContactUs',

    metaInfo: { title: 'Create Class' },

    extends: View,

    mixins: [
      LoadSections([
        'AppBar',
        'Drawer',
        'Createclass',
      ]),
    ],

    props: {
      id: {
        type: String,
        default: 'Createclass',
      },
    },
  }
</script>

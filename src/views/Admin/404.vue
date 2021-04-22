<script>
  // Extensions
  import View from '@/views/View'

  // Mixins
  import LoadSections from '@/mixins/load-sections'

  export default {
    name: 'ContactUs',

    metaInfo: { title: 'Oops! No Page Found' },

    extends: View,

    mixins: [
      LoadSections([
        'AppBar',
        'Drawer',
        '404',
      ]),
    ],

    props: {
      id: {
        type: String,
        default: 'Createstream',
      },
    },
  }
</script>

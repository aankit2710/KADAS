<script>
  // Extensions
  import View from '@/views/View'

  // Mixins
  import LoadSections from '@/mixins/load-sections'

  export default {
    name: 'ContactUs',

    metaInfo: { title: 'Create Lesson' },

    extends: View,

    mixins: [
      LoadSections([
        'AppBar',
        'Drawer',
        'Createstream',
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

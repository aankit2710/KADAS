<script>
  // Extensions
  import View from '@/views/View'

  // Mixins
  import LoadSections from '@/mixins/load-sections'

  export default {
    name: 'Policies',

    metaInfo: { title: 'Policies' },

    extends: View,

    mixins: [
      LoadSections([
        'AppBar',
        'Drawer',
        'Schooldocuments',
      ]),
    ],

    props: {
      id: {
        type: String,
        default: 'Schooldocuments',
      },
    },
  }
</script>

<script>
  // Extensions
  import View from '@/views/View'

  // Mixins
  import LoadSections from '@/mixins/load-sections'

  export default {
    name: 'ContactUs',

    metaInfo: { title: 'Absences' },

    extends: View,

    mixins: [
      LoadSections([
        'AppBar',
        'Drawer',
        'Absences',
      ]),
    ],

    props: {
      id: {
        type: String,
        default: 'Absences',
      },
    },
  }
</script>

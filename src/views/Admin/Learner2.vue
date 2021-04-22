<script>
  // Extensions
  import View from '@/views/View'

  // Mixins
  import LoadSections from '@/mixins/load-sections'

  export default {
    name: 'Learner',

    metaInfo: { title: 'Learner' },

    extends: View,

    mixins: [
      LoadSections([
        'AppBar',
        'Drawer',
        'Learner2',
      ]),
    ],

    props: {
      id: {
        type: String,
        default: 'Learner',
      },
    },
  }
</script>

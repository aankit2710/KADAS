<template>
  <v-app>
   
    <home-view>x</home-view>
   

  </v-app>
</template>

<script>
  export default {
    name: 'HomeLayout',

    components: {
      
     
      HomeView: () => import('@/layouts/home/View'),
    },
  }
</script>

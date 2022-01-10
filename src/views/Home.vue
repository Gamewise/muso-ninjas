<template>
  <div class="home">

    <div v-if="error" class="error">{{ error }} </div>
    <div v-else>
       <!-- passing documents through as props -->
       <ListView :documents="documents" /> 
    </div>     
      
  </div>


</template>

<script>

import getCollection from '@/composables/getCollection'
import ListView from '../components/ListView.vue'

export default {
  components: { ListView },
  name: 'Home',  
  setup(){
  //getCollection
  const { error, documents } = getCollection('playlists')


  return{ error, documents}
},

}
</script>


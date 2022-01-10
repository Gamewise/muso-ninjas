<template>
  <div class="user-playlists">
    <h2>My Playlists</h2>
      <div v-if="documents">
        <ListView :documents="documents"/>
      </div>
      <router-link :to="{ name: 'CreatePlaylist' }" class="btn">Create new Playlist</router-link>
    </div>
</template>

<script>
import getUser from '@/composables/getUser'
import getCollection from '@/composables/getCollection'
import ListView from '../../components/ListView.vue'
export default {
  components: { ListView },
    setup() {
      const { user } = getUser()
      const { documents} = getCollection(
        'playlists', 
        ['userId','==', user.value.uid] //queryConstraint being passed to getCollection!
      )
      console.log('user playlists! ', documents)
    
      return { documents }
    }
}
</script>


<style scoped>
  h2 {
    padding-bottom: 10px;
    margin-bottom: 30px;
    border-bottom: 1px solid var(--secondary)
  }
  .btn {
    margin-top: 20px;
  }
</style>
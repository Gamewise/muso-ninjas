<template>
<div v-if="error" class="error"> {{ error }}</div>

<div v-if="playlist" class="playlist-details">
    
    <!-- Playlist info -->
    <div class="playlist-info">
        <div class="cover">
            <img :src="playlist.coverUrl">
        </div>
        <h2> {{ playlist.title }}</h2>
        <p class="uername">Created by {{ playlist.userName }} </p>
        <p class="description">{{ playlist.description }}</p>
        <!-- only show this delete button to the owner of the playlist -->
        <button v-if="ownership" @click="deletePlaylist">Delete Playlist</button>
    </div>
    

    <!-- song list -->
    <div class="song-list">
        <div v-if="!playlist.songs.length">No songs have been added to this playlist yet...</div>
        <div v-for="song in playlist.songs" :key="song.id" class="single-song">
            <div class="details">
                <h3>{{ song.title }}</h3>
                <p> {{ song.artist }} </p>
            </div>
            <button v-if="ownership" @click="deleteSong(song.id)">Delete</button>
        </div>

        <AddSong v-if="ownership" :playlist="playlist"/>
    </div>
</div>
</template>

<script>
import { computed } from '@vue/reactivity'
import { useRouter } from 'vue-router'
import getDocument from '../../composables/getDocument'
import useDocument from '../../composables/useDocument'
import getUser from '../../composables/getUser'
import useStorage from '../../composables/useStorage'
import AddSong from '../../components/AddSong.vue'

export default {
  components: { AddSong },
    props: ['id'], //this is the route parameter on the page itself, cos we enabled props in this route in index.js 

    setup(props){
        //router
        const router = useRouter()
        //getDocument
        const { error, document: playlist } = getDocument('playlists',props.id)
        
        //useDocument //update
        const { deleteDocFunc, updateDocFunc } = useDocument('playlists',props.id)
        

        //getUser
        const { user } = getUser()

        //useStorage
        const { deleteImage } = useStorage()

        //show delete button?
        const ownership = computed(()=> {
            //THREE checks here. All three have to be true for return (and thus ownership) to be true
            //1. playlist exists 
            //2. user exists 
            //3. user id matches the playlist userId (they created it)
            return playlist.value && user.value && user.value.uid == playlist.value.userId
        })

        //Delete playlist
        const deletePlaylist = async () => {
            await deleteImage(playlist.value.filePath)  //this is the path of the image!         
            console.log("image deleted from storage!");
            await deleteDocFunc()
            console.log("doc deleted from collection!");
            router.push({ name: 'Home' }) 
        }

        //Delete song
        const deleteSong = async (songId) => {
            console.log('song id: ',songId)
            console.log('playlist songs: ', playlist.value.songs)
            
            let filteredsongs = playlist.value.songs.filter(findMatch); //call this findMatch function for each one of this array

            //This findMatch function triggers for each one of the array above, and call each item a song (the findMath parameter)
            function findMatch(song){
                return song.id != songId
            }
           
            const pie = await updateDocFunc(
              { songs: filteredsongs }
            ) 
            
        }

        
            
            
         


        return { error, playlist, ownership, deletePlaylist, deleteSong }
    }
}
</script>

<style>
  .playlist-details {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 80px;
  }
  .cover {
    overflow: hidden;
    border-radius: 20px;
    position: relative;
    padding: 160px;
  }
  .cover img {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    min-width: 100%;
    min-height: 100%;
    max-width: 200%;
    max-height: 200%;
  }
  .playlist-info {
    text-align: center;
  }
  .playlist-info h2 {
    text-transform: capitalize;
    font-size: 28px;
    margin-top: 20px;
  }
  .playlist-info p {
    margin-bottom: 20px;
  }
  .username {
    color: #999;
  }
  .description {
    text-align: left;
  }
  .single-song {
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px dashed var(--secondary);
    margin-bottom: 20px;
  }
</style>
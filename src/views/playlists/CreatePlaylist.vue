<template>
   <form @submit.prevent="handleSubmit">
        <h4>Create New Playlist</h4>
        <input type="text" required placeholder="Playlist title" v-model="title">
        <textarea required placeholder="Playlist description" v-model="description"></textarea>
        
        <!-- upload playlist image -->
        <label>Upload playlist cover image</label>
        <input type="file" multiple @change="handleChange">

        
        <!-- while login is processing, showing this loading button (disabled) -->
        <div class="error" v-if="fileError">{{ fileError }} </div>
        <div v-if="uploadProgress">          
          <button disabled>Saving...</button> 
          {{ uploadProgress }} 
        </div>
        <button v-else>Create!</button>
       
    </form>
</template>

<script>
import { ref } from '@vue/reactivity'
import useStorage from '@/composables/useStorage'
import useCollection from '@/composables/useCollection'
import getUser from '@/composables/getUser'
import { timestamp } from '@/firebase/config'
import { useRouter } from 'vue-router'

export default {
  setup(){
    //router
    const router = useRouter()
    //user vars
    const { user } = getUser()

    //upload image vars
    const { filePath, url, uploadProgress, uploadImage } = useStorage()

    //upload post vars
    const {error, createPost, isPending } = useCollection('playlists')

    const title = ref('')
    const description = ref('')
    const file = ref(null)
    const fileError = ref(null)
   
    
    const handleSubmit = async () => {
      if (file.value){
         console.log(title.value, description.value, file.value)
        
        //upload image
        await uploadImage(file.value)
        
        //create post (important this happens after uploadImage because it needs the url value!)
        const resPost = await createPost({
          userId: user.value.uid,
          userName: user.value.displayName,
          title: title.value,
          description: description.value,
          coverUrl: url.value,
          filePath: filePath.value, //this is so users can delete this data later
          songs: [],
          createdAt: timestamp
        })
        
        if (!error.value){
          console.log('playlist post added!')
          router.push({ name: 'PlaylistDetails', params: {id: resPost.id }})
        }
      }

    }

    //allowed file types
    const types = ['image/png','image/jpeg']


    const handleChange = (e) => {
      const selected =  e.target.files[0] //e.target is the input field itself, files is an array, and we're looking at the first in the array
      
      //note the change event ALSO triggers when you DEselect a file, so 
      //we have to include a check to make sure the file actually has a value 
      //before we store it's value
      if(selected){
        console.log('the type of the selected file is',selected.type)
        //now check the file is the right type by comparing to our types array above
        if (types.includes(selected.type)){
           file.value = selected
           fileError.value = null //reset
        } else {
          fileError.value = 'Please select an image file (png or jpg)'
          file.value = null //reset to null! (wrong type of file selected!)
        }
        
      } else {
        fileError.value = 'No file selected'
        file.value = null //reset to null! (no file is selected!)
      }

      //final file value
      console.log('FILE:', file.value)
    }


    return {isPending,title, description, handleSubmit, handleChange, fileError, uploadProgress}
  }
}
</script>

<style>
  form {
    background: white;
  }
  input[type="file"] {
    border: 0;
    padding: 0;
  }
  label {
    font-size: 12px;
    display: block;
    margin-top: 30px;
  }
  button {
    margin-top: 20px;
  }
</style>
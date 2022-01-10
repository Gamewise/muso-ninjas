import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

//global styles
import './assets/main.css'


// When you REFRESH, app waits for connection to firebase BEFORE mounting the app. 
// this means a user can refresh the page and still be logged in! Which is awesome :)
import { auth } from './firebase/config'

//0. initially no value
let app  

//1. wait for connection to firebase
auth.onAuthStateChanged(()=>{
    
    // 2. if app DOESN'T have a value (ie immediately after refresh) mount the app!
    // so this will only ONCE :)
    if (!app) {
        app = createApp(App).use(router).mount('#app')
    }
})




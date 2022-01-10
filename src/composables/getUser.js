import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { ref } from 'vue'


const user = ref(auth.currentUser)

// user observer (is this like a global??)
onAuthStateChanged(auth, (_user) => {  //here _user could be named anything, so long as it's changed on all occurences!
    
    user.value = _user //storing the logged in user object in the user ref
    console.log('user state change. Current user is: ', user.value)

});
 

const getUser = () => {

    return { user }
}

export default getUser

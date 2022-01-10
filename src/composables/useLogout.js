import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import { ref } from 'vue'

const error = ref(null)
const isPending = ref(false)   


//this main function can be outside the useSignup function below that is triggering it. This means, the only function that gets copied to each component is useSignup 
// useSignup is like the lightweight 'messenger' so to speak - it gets copied everywhere, but the heavyweight 'commander' it executes (signup) doesn't need to be copied everywhere
// an example of this is returning the error. If I put the error in the messenger useSignup, it would be created fresh EVERY time it's used - which would be handy if multiple parts of the site were 
//using the SAME function at the same time. But since that's not happening in my application, it's better to put the error in the commander, and it'll be updated rather than recreated 


//the heavyweight commander
const logout = async () => {

    error.value = null  //default no error, so the user doesn't see any errors by default
    isPending.value = true //set variable to true while the firebase addDoc process is happening
    
    try {
        await signOut(auth)
        console.log('User logged out')
        isPending.value = false //reset to false (the signOut has successfully completed, not pending anymore!)

    } catch (err) {
        console.log(err.message)
        error.value = 'That logout did not work properly' //update the value of the ref error (above) to whatever error you've encountered in this function
        isPending.value = false //reset to false (the signOut has successfully completed, not pending anymore!)
    }

}

//the lightweight messenger
const useLogout = () => {

    return { error, logout, isPending }
}

export default useLogout

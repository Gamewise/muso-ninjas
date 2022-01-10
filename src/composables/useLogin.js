import { auth } from "../firebase/config";
import { signInWithEmailAndPassword} from "firebase/auth";
import { ref } from 'vue'

const error = ref(null)
const isPending = ref(false)

//this main function can be outside the useSignup function below that is triggering it. This means, the only function that gets copied to each component is useSignup 
// useSignup is like the lightweight 'messenger' so to speak - it gets copied everywhere, but the heavyweight 'commander' it executes (signup) doesn't need to be copied everywhere
// an example of this is returning the error. If I put the error in the messenger useSignup, it would be created fresh EVERY time it's used - which would be handy if multiple parts of the site were 
//using the SAME function at the same time. But since that's not happening in my application, it's better to put the error in the commander, and it'll be updated rather than recreated 


//the heavyweight commander
const login = async (email, password) => {

    
    error.value = null  //default no error, so the user doesn't see any errors by default
    isPending.value = true //set variable to true while the firebase login process is happenign

    try {
        const res = await signInWithEmailAndPassword(auth, email, password)
        
        if (!res){
            throw new Error('Could not complete the login')
        }        
        console.log("Logged in user: ", res.user) // we automatically get the user back from firebase
        
        isPending.value = false //reset to false (the login has successfully completed, not pending anymore!)
        return res

    } catch (err) {
        console.log(err.message)
        error.value = 'Hmmm... we could not find a user with that login' //update the value of the ref error (above) to whatever error you've encountered in this function
        isPending.value = false //reset to false (the login has successfully completed, not pending anymore!)

    }

}

//the lightweight messenger
const useLogin = () => {

    return { error, login, isPending }
}

export default useLogin



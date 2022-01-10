import { firestore } from "../firebase/config";
import { addDoc,collection } from "firebase/firestore";
import { ref } from 'vue'

const useCollection = (coll) => {
    const error = ref(null)
    const isPending = ref(false)   

     // Collection/doc ref
     const collectionRef = collection(firestore, coll);
    
          
    // try add a document to a collection (with an auto assigned doc ID) | Option #1
    const createPost = async (post) => {
        //reset the error to null by default
        error.value = null
        isPending.value = true //set variable to true while the firebase addDoc process is happenign

        try {  
            
            const res = await addDoc(collectionRef, post);
            console.log("NEW POST IS THIS: ", post)
            isPending.value = false //reset to false (the login has successfully completed, not pending anymore!)
            return res
            
        } catch (err) {
            console.log(err.message)
            error.value = 'Hmmm... something went wrong with that post...' //update the value of the ref error (above) to whatever error you've encountered in this function
            isPending.value = false //reset to false (the login has successfully completed, not pending anymore!)
        }
    }
    
    
   
    return { error, createPost, isPending }
}

export default useCollection
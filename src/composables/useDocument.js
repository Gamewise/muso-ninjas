import { firestore } from "../firebase/config";
import {
    setDoc,
    updateDoc,
    deleteDoc,
    arrayUnion,
    arrayRemove,
    doc,
    collection,
  } from "firebase/firestore";

  import { ref } from 'vue'


const useDocument = (coll, id) => {
    const error = ref(null)
    const isPending = ref(false)

    // Collection/doc ref (outside of delete doc, so we can use this reference in other functions, ie editDoc etc.)
    // let collectionRef = collection(firestore, coll); //let instead of const in case it changes
    let documentRef = doc(firestore, coll, id);

    
    // Deleting a document
    const deleteDocFunc = async () => {
        isPending.value = true
        error.value = null

        try {
            let res = await deleteDoc(documentRef)
            isPending.value = false
            return res
        } catch (err) {
            console.log(err.message)
            error.value = err.message
            isPending.value = false
        }
      
    }
        
    // Updating a document. note this "updates" parameter must be an OBJECT
    const updateDocFunc = async (updates) => {
        isPending.value = true
        error.value = null

        try {
            let res = await updateDoc(documentRef,updates)
            isPending.value = false
            return res
        } catch (err) {
            console.log(err.message)
            error.value = 'could not update the document'
            isPending.value = false
        }
      
    }
    return { error, isPending, deleteDocFunc, updateDocFunc }
}

export default useDocument
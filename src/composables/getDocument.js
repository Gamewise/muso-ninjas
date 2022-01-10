import { firestore } from "../firebase/config";
import { collection, getDoc, doc, query, orderBy, onSnapshot } from "firebase/firestore";
import { ref, watchEffect } from 'vue'

const getDocument = (coll, id) => {
    const error = ref(null)
    const document = ref(null)

    // 1. the doc reference
    const documentRef = doc(firestore, coll, id);
   
    //2. Splitting the collection snapshot out into different docs and then putting back in a docuements array
    const unsub = onSnapshot(documentRef, (singleDoc) => {
        console.log('doc snapshot!')
        
        //first check if the singleDoc we're looking at in the collection and id has data
        if(singleDoc.data()){
            document.value = {...singleDoc.data(),id: singleDoc.id}
            error.value = null
        } else {
            error.value = "that docuement does not exist"
        }

        //this is firebase's recommended way of dealing with errors in a snapshot
    }, (err) => {
        console.log(err.message)
        document.value = null
        error.value = 'could not fetch document'
    })

    //this will run when a component using this getDocument function unmounts -> 
    //that's when we need to unsubscribe from this firebase listener!
    watchEffect((onInvalidate) => {   
        onInvalidate(()=> unsub()) //unsub() unsubscribes from a real time listener, simply by running the onSnapshot function (now assigned to the unsub variable)
    })

    return { error, document }
}

export default getDocument
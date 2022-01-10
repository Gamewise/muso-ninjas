import { firestore } from "../firebase/config";
import { collection, getDocs, query, orderBy, onSnapshot, where } from "firebase/firestore";
import { ref, watchEffect } from 'vue'

const getCollection = (coll,queryConstraint) => {
    const error = ref(null)
    const documents = ref(null)
    const collectionQuery = ref(null)

    // 1. the collection reference
    const collectionRef = collection(firestore, coll);

      
   //2. query constraint/s
         
   //a) check for queryContraint -> if present, add the where contstraint on to the collectionQuery

    if (queryConstraint) {
       collectionQuery.value = query(
            collectionRef,
            orderBy("createdAt"),  
            where(...queryConstraint),   //spread syntax, spreads the array out into 3 separate bits!   
        )  
    } else {
        collectionQuery.value = query(
            collectionRef,
            orderBy("createdAt"),        
        )  
    }
   
    //3. Splitting the collection snapshot out into different docs and then putting back in a docuements array
    const unsub = onSnapshot(collectionQuery.value, (snap) => {
        console.log('snapshot!')
        const results = []
        snap.forEach((doc) => {
            doc.data().createdAt && results.push({ ...doc.data(), id: doc.id})
        })
        documents.value = results
        error.value = null

        //this is firebase's recommended way of dealing with erros in a snapshot
    }, (err) => {
        console.log(err.message)
        documents.value = null
        error.value = 'could not fetch data'
    })

    //this will run when a component using this getCollection function unmounts -> 
    //that's when we need to unsubscribe from this firebase listener!
    watchEffect((onInvalidate) => {   
        onInvalidate(()=> unsub()) //unsub() unsubscribes from a real time listener, simply by running the onSnapshot function (now assigned to the unsub variable)
    })

    return { error, documents }
}

export default getCollection
import { ref } from 'vue'
import getUser from '@/composables/getUser'
import { ref as fref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from '../firebase/config'

const { user } = getUser() //using the getUser composable

const useStorage = () => {
    const error = ref(null)
    const url = ref(null)
    const filePath = ref(null)
    const uploadProgress = ref(null)

    const uploadImage = async (file) => {
        // need to use user.value cos user is a ref. file.name is a property from the upload input box
        // this filePath is where we want the image to be saved in firebase storage
        
        filePath.value = `covers/${user.value.uid}/${file.name}`
        const storageRef = fref(storage,filePath.value) //note the firebase ref here!

        //--- v9 code ---
        /** @type {any} */ 
        const metadata = {
            contentType: 'image/jpeg'
        }

        const uploadTask = uploadBytesResumable(storageRef, file, metadata);

        // Upload file and metadata to the object 'images/mountains.jpg'
        // const storageRef = firebaseref(storage, 'images/' + file.name);
        await new Promise((resolve, reject) => {
            uploadTask.on('state_changed',
                (snapshot) => {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    uploadProgress.value = 'Upload is ' + progress + '% done'
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    switch (error.code) {
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            break;
                        case 'storage/canceled':
                            // User canceled the upload
                            break;
        
                            // ...
        
                        case 'storage/unknown':
                            // Unknown error occurred, inspect error.serverResponse
                            break;
                    }
        
                    reject(new Error(error))      // <------
                },
                () => {
                    // Upload completed successfully, now we can get the download URL
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('File available at', downloadURL);
                        url.value = downloadURL
                        uploadProgress.value = null //reset
                        resolve(downloadURL)  // <------------------ TAKE NOTE
                    });
                }
            );
        });
    } 
    
    const deleteImage = async(filePath) => {

        const storageRef = fref(storage,filePath) //note the firebase ref here!
        try {
            await deleteObject(storageRef)            
        } catch (err) {
            console.log(err.message)
            error.value = err.message
        }
    }
            
     
    return {error, url, filePath, uploadProgress, uploadImage, deleteImage}
}

export default useStorage
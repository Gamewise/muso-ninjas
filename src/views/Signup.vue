<template>
    <form @submit.prevent="handleSubmit">
        <h3>Sign up</h3>
        <input type="text" placeholder="Display name" v-model="displayName">
        <input type="email" placeholder="email" v-model="email">
        <input type="password" placeholder="password" v-model="password">
        <div class="error" v-if="error">{{ error }}</div>
        
        <!-- while login is processing, showing this loading button (disabled) -->
        <button v-if="isPending" disabled>Loading...</button>
        <button v-else>Sign up</button>
    </form>
</template>

<script>
import { ref } from '@vue/reactivity'
import useSignup from '../composables/useSignup'
import { useRouter } from 'vue-router'

export default {
    setup() {
        const router = useRouter()

        const {error, signup, isPending} = useSignup()
    
        const email = ref('')
        const password = ref('')
        const displayName = ref('')

        const handleSubmit = async () => {
            const res = await signup(email.value, password.value, displayName.value)
            if (!error.value){
                console.log('signup successful!')
                router.push({ name: 'UserPlaylists' })

            }
        }

        return {email, password, displayName, error, handleSubmit, isPending}
    }
}
</script>

<style>

</style>
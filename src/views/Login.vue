<template>
    <form @submit.prevent="handleSubmit">
        <h3>Login</h3>
        <input type="email" placeholder="email" v-model="email">
        <input type="password" placeholder="password" v-model="password">
        <div class="error" v-if="error">{{ error }}</div>
        
        <!-- while login is processing, showing this loading button (disabled) -->
        <button v-if="isPending" disabled>Loading...</button>
        <button v-else>Log in</button>
    </form>
</template>

<script>
import { ref } from '@vue/reactivity'
import useLogin from '../composables/useLogin'
import { useRouter } from 'vue-router'

export default {
    setup() {
        const router = useRouter()
        const {error, login, isPending} = useLogin()
    
        const email = ref('')
        const password = ref('')
        const handleSubmit = async () => {
            const res = await login(email.value, password.value)
            if (!error.value){
                console.log('login successful!')
                router.push({ name: 'UserPlaylists' })
            }
        }

        return {email, password, error, handleSubmit, isPending}
    }
}
</script>

<style>

</style>
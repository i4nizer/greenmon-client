<template>
    <v-container class="pa-5 py-7" fluid>
        <v-row>
            <v-col>
                <h3>User Settings</h3>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <UserAccountCard 
                    :user="user" 
                    :loading="state.updatingUser"
                    :disabled="state.updatingUser"
                    @change="onUpdateUser"
                />
            </v-col>
            <v-col>
                <UserSecurityCard 
                    :user="user" 
                    :loading="state.forgettingPassword"
                    :disabled="state.forgettingPassword"
                    @change-password="onChangePassword"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { useUserStore } from '@/stores/user.store';
import { defineAsyncComponent, reactive } from 'vue';
import router from '@/router';
import { useTokenStore } from '@/stores/token.store';

const UserAccountCard = defineAsyncComponent(() => import("@/components/user/UserAccountCard.vue"))
const UserSecurityCard = defineAsyncComponent(() => import("@/components/user/UserSecurityCard.vue"))


// ---stores
const {
    user,
    update,
    forgotPassword,
} = useUserStore()
const { clear: clearTokens } = useTokenStore()

// ---state
const state = reactive({
    updatingUser: false,
    forgettingPassword: false
})

// ---events
const onUpdateUser = async (user) => {
    state.updatingUser = true

    await update(user.name)
        .catch(console.error)
    
    state.updatingUser = false
}

const onChangePassword = async () => {
    state.forgettingPassword = true

    await forgotPassword(user.email)
        .then(() => clearTokens())
        .then(() => router.push('/auth/forgot-password'))
        .catch(console.error)

    state.forgettingPassword = false
}



</script>

<style lang="scss" scoped>

</style>
<template>
    <v-navigation-drawer
        permanent
        expand-on-hover 
        v-model="state.drawer"
        :rail="state.rail"
    >
        <template #prepend>
            <v-list class="py-5">
                <v-list-item
                    prepend-icon="mdi-account"
                    :title="user?.name"
                    :subtitle="user?.email"
                ></v-list-item>
            </v-list>
        </template>
        
        <v-divider></v-divider>
        
        <v-list density="compact" nav>
            <v-list-item link to="/user/greenhouse" title="Greenhouse" prepend-icon="mdi-greenhouse"></v-list-item>
            <v-list-item link to="/user/settings" title="Settings" prepend-icon="mdi-cog"></v-list-item>
        </v-list>
        
        <template #append>
            <v-list density="compact">
                <v-list-item
                    link
                    color="red"
                    title="Sign Out"
                    prepend-icon="mdi-logout"
                    :disabled="state.signingOut"
                    @click="onSignOut"
                ></v-list-item>
            </v-list>
        </template>
    </v-navigation-drawer>
</template>

<script setup>
import router from '@/router';
import { useTokenStore } from '@/stores/token.store';
import { useUserStore } from '@/stores/user.store';
import { reactive, ref, watch } from 'vue';



// ---stores
const { user, signOut } = useUserStore()
const { refreshToken, clear } = useTokenStore()

// ---state
const state = reactive({
    rail: true,
    drawer: true,
    signingOut: false,
})

// ---events
const onSignOut = async () => {
    state.signingOut = true
    
    await signOut(refreshToken)
        .then(() => clear())
        .then(() => router.push('/auth/sign-in'))
        .catch(console.error)

    state.signingOut = false
}




</script>

<style lang="scss" scoped>

</style>
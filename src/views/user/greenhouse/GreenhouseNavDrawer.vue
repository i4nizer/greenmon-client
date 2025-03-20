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
            <v-list-item 
                link 
                title="Dashboard" 
                prepend-icon="mdi-view-dashboard"
                :to="`/user/greenhouse/${greenhouseId}/dashboard`" 
            ></v-list-item>
            <v-list-item 
                link 
                title="Devices" 
                prepend-icon="mdi-devices"
                :to="`/user/greenhouse/${greenhouseId}/devices`" 
            ></v-list-item>
            <v-list-item 
                link 
                title="Automation" 
                prepend-icon="mdi-auto-fix"
                :to="`/user/greenhouse/${greenhouseId}/automation`" 
            ></v-list-item>
            <v-list-item 
                link 
                title="Schedule" 
                prepend-icon="mdi-calendar-clock"
                :to="`/user/greenhouse/${greenhouseId}/schedule`" 
            ></v-list-item>
            <v-list-item 
                link 
                title="Settings" 
                prepend-icon="mdi-cog"
                :to="`/user/greenhouse/${greenhouseId}/settings`" 
            ></v-list-item>
        </v-list>
        
        <template #append>
            <v-list density="compact">
                <v-list-item
                    link
                    :to="`/user/greenhouse`"
                    title="Back to User"
                    prepend-icon="mdi-account-arrow-left"
                ></v-list-item>
                <v-list-item
                    link
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
import { useTokenStore } from '@/stores/token.store';
import { useUserStore } from '@/stores/user.store';
import { reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';



// ---stores
const { user, signOut } = useUserStore()
const { refreshToken, clear } = useTokenStore()

// ---composables
const route = useRoute()
const router = useRouter()

// ---data
const greenhouseId = route.params.greenhouseId

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
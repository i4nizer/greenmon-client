<template>
    <v-navigation-drawer
        permanent
        expand-on-hover 
        v-model="state.drawer"
        :rail="state.rail"
    >
        <template #prepend>
            <v-list class="py-5" nav>
                <v-list-item
                    link
                    v-tooltip="`Return to User Page`"
                    prepend-icon="mdi-account"
                    :to="`/user/greenhouse`"
                    :title="user?.name"
                    :subtitle="user?.email"
                ></v-list-item>    
            </v-list>
        </template>
        
        <v-divider></v-divider>
        
        <v-list density="compact" nav>
            <v-list-subheader>{{ greenhouse?.name }}</v-list-subheader>
            <v-list-item 
                link 
                title="Dashboard" 
                prepend-icon="mdi-view-dashboard"
                :to="`/user/greenhouse/${greenhouseId}/dashboard`" 
            ></v-list-item>
            <v-list-item 
                link 
                title="Statistics" 
                prepend-icon="mdi-chart-line"
                :to="`/user/greenhouse/${greenhouseId}/statistics`" 
            ></v-list-item>
            <v-list-item 
                link 
                title="Microcontrollers" 
                prepend-icon="mdi-chip"
                :to="`/user/greenhouse/${greenhouseId}/mcu`" 
            ></v-list-item>
            <v-list-item 
                link 
                title="Action" 
                prepend-icon="mdi-rocket-launch"
                :to="`/user/greenhouse/${greenhouseId}/action`" 
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
            <v-divider></v-divider>
            <v-list density="compact">
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
import { useGreenhouseStore } from '@/stores/greenhouse.store';
import { useTokenStore } from '@/stores/token.store';
import { useUserStore } from '@/stores/user.store';
import { computed, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';



// ---stores
const { user, signOut } = useUserStore()
const { refreshToken, clear } = useTokenStore()
const { greenhouses } = useGreenhouseStore()

// ---composables
const route = useRoute()
const router = useRouter()

// ---data
const greenhouseId = route.params.greenhouseId

// ---getters
const greenhouse = computed(() => greenhouses.find(g => g.id == greenhouseId));

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
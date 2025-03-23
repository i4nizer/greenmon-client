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
            <v-divider></v-divider>
            <v-list density="compact" nav>
                <v-list-item
                    link
                    v-tooltip="`Return to Greenhouse Page`"
                    prepend-icon="mdi-greenhouse"
                    :to="`/user/greenhouse/${greenhouseId}/mcu`"
                    :title="greenhouse?.name"
                ></v-list-item>
            </v-list>
        </template>
        
        <v-divider></v-divider>
        
        <v-list density="compact" nav>
            <v-list-subheader>{{ mcu?.name }} ({{ mcu?.label }})</v-list-subheader>
            <v-list-item 
                link 
                title="Dashboard" 
                prepend-icon="mdi-view-dashboard"
                :to="`/user/greenhouse/${greenhouseId}/mcu/${mcuId}/dashboard`" 
            ></v-list-item>
            <v-list-item 
                link 
                title="Pins" 
                prepend-icon="mdi-sine-wave"
                :to="`/user/greenhouse/${greenhouseId}/mcu/${mcuId}/pins`" 
            ></v-list-item>
            <v-list-item 
                link 
                title="Sensors" 
                prepend-icon="mdi-thermometer"
                :to="`/user/greenhouse/${greenhouseId}/mcu/${mcuId}/sensors`" 
            ></v-list-item>
            <v-list-item 
                link 
                title="Actuators" 
                prepend-icon="mdi-fan"
                :to="`/user/greenhouse/${greenhouseId}/mcu/${mcuId}/actuators`" 
            ></v-list-item>
            <v-list-item 
                link 
                title="Settings" 
                prepend-icon="mdi-cog"
                :to="`/user/greenhouse/${greenhouseId}/mcu/${mcuId}/settings`" 
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
import { useMcuStore } from '@/stores/mcu.store';
import { useTokenStore } from '@/stores/token.store';
import { useUserStore } from '@/stores/user.store';
import { computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';



// ---stores
const { user, signOut } = useUserStore()
const { mcus } = useMcuStore()
const { greenhouses } = useGreenhouseStore()
const { refreshToken, clear } = useTokenStore()

// ---composables
const route = useRoute()
const router = useRouter()

// ---data
const mcuId = route.params.mcuId
const greenhouseId = route.params.greenhouseId

// ---getters
const mcu = computed(() => mcus.find(m => m.id == mcuId))
const greenhouse = computed(() => greenhouses.find(g => g.id == greenhouseId))

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
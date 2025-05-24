<template>
    <v-layout full-height>
        
        <!-- The Left Navigation Drawer -->
        <v-navigation-drawer
            class="bg-green-darken-4 position-fixed"
            :rail="isTablet"
            :permanent="!isMobile"
            :expand-on-hover="isTablet"
            v-model="state.drawer"
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
                        :to="`/user/greenhouse/${greenhouseId}/camera`"
                        :title="greenhouse?.name"
                    ></v-list-item>
                </v-list>
            </template>
            <v-divider></v-divider>
            <v-list density="compact" nav>
                <v-list-subheader>{{ camera?.name }} ({{ camera?.label }})</v-list-subheader>
                <v-list-item 
                    link 
                    title="Dashboard" 
                    prepend-icon="mdi-view-dashboard"
                    :to="`/user/greenhouse/${greenhouseId}/camera/${cameraId}/dashboard`" 
                ></v-list-item>
                <v-list-item 
                    link 
                    title="Capture" 
                    prepend-icon="mdi-image"
                    :to="`/user/greenhouse/${greenhouseId}/camera/${cameraId}/capture`" 
                ></v-list-item>
                <v-list-item 
                    link 
                    title="Reatime" 
                    prepend-icon="mdi-video-wireless"
                    :to="`/user/greenhouse/${greenhouseId}/camera/${cameraId}/realtime`" 
                ></v-list-item>
                <v-list-item 
                    link 
                    title="Settings" 
                    prepend-icon="mdi-cog"
                    :to="`/user/greenhouse/${greenhouseId}/camera/${cameraId}/settings`" 
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

        <!-- Contains Controls -->
        <v-app-bar class="bg-green">
            <v-app-bar-nav-icon v-if="isMobile" @click="state.drawer = !state.drawer" />
            <v-icon size="large" class="pl-6 pl-md-8">mdi-camera</v-icon>
            <v-toolbar-title>{{ camera?.name }} - {{ camera?.label }}</v-toolbar-title>
        </v-app-bar>

        <!-- All Contents Goes Here -->
        <v-main>
            <slot></slot>
        </v-main>

    </v-layout>
</template>

<script setup>
import { useCameraStore } from '@/stores/camera.store';
import { useGreenhouseStore } from '@/stores/greenhouse.store';
import { useTokenStore } from '@/stores/token.store';
import { useUserStore } from '@/stores/user.store';
import { computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDisplay } from 'vuetify'

//

// ---stores
const { user, signOut } = useUserStore()
const { cameras } = useCameraStore()
const { greenhouses } = useGreenhouseStore()
const { refreshToken, clear } = useTokenStore()

// ---composables
const route = useRoute()
const router = useRouter()
const { mdAndDown, smAndDown, lgAndUp } = useDisplay()

// ---data
const cameraId = route.params.cameraId
const greenhouseId = route.params.greenhouseId

// ---getters
const camera = computed(() => cameras.find(c => c.id == cameraId))
const greenhouse = computed(() => greenhouses.find(g => g.id == greenhouseId))
const isMobile = computed(() => smAndDown.value)
const isTablet = computed(() => !isMobile.value && mdAndDown.value)

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
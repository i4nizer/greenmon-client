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
                <v-list>
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
                    title="Alert" 
                    prepend-icon="mdi-alert"
                    :to="`/user/greenhouse/${greenhouseId}/alert`" 
                ></v-list-item>
                <v-list-item 
                    link 
                    title="Microcontrollers" 
                    prepend-icon="mdi-chip"
                    :to="`/user/greenhouse/${greenhouseId}/mcu`" 
                ></v-list-item>
                <v-list-item 
                    link 
                    title="Camera" 
                    prepend-icon="mdi-camera"
                    :to="`/user/greenhouse/${greenhouseId}/camera`" 
                ></v-list-item>
                <v-list-item 
                    link 
                    title="Lettuce Detection" 
                    prepend-icon="mdi-brain"
                    :to="`/user/greenhouse/${greenhouseId}/lettuce-detection`" 
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
        
        <!-- Contains Controls -->
        <v-app-bar class="bg-green">
            <v-app-bar-nav-icon v-if="isMobile" @click="state.drawer = !state.drawer" />
            <v-icon size="large" class="pl-6 pl-md-8">mdi-greenhouse</v-icon>
            <v-toolbar-title>{{ greenhouse?.name }}</v-toolbar-title>
        </v-app-bar>

        <!-- All Contents Goes Here -->
        <v-main>
            <slot></slot>
        </v-main>

    </v-layout>
</template>

<script setup>
import { useGreenhouseStore } from '@/stores/greenhouse.store';
import { useTokenStore } from '@/stores/token.store';
import { useUserStore } from '@/stores/user.store';
import { computed, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDisplay } from 'vuetify';

//

// ---stores
const { user, signOut } = useUserStore()
const { refreshToken, clear } = useTokenStore()
const { greenhouses } = useGreenhouseStore()

// ---composables
const route = useRoute()
const router = useRouter()
const { mdAndDown, smAndDown, lgAndUp } = useDisplay()

// ---getters
const isMobile = computed(() => smAndDown.value)
const isTablet = computed(() => !isMobile.value && mdAndDown.value)

// ---data
const greenhouseId = route.params.greenhouseId

// ---getters
const greenhouse = computed(() => greenhouses.find(g => g.id == greenhouseId));

// ---state
const state = reactive({
    drawer: !smAndDown.value,
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
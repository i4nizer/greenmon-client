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
            <v-icon size="large" class="pl-6 pl-md-8">mdi-leaf</v-icon>
            <v-toolbar-title>Greenmon</v-toolbar-title>
        </v-app-bar>

        <!-- All Contents Goes Here -->
        <v-main>
            <slot></slot>
        </v-main>

    </v-layout>
</template>

<script setup>
import { useTokenStore } from '@/stores/token.store';
import { useUserStore } from '@/stores/user.store';
import { useRouter } from 'vue-router';
import { reactive, computed } from 'vue';
import { useDisplay } from 'vuetify';

//

// ---stores
const { user, signOut } = useUserStore()
const { refreshToken, clear } = useTokenStore()

// ---composables
const router = useRouter()
const { mdAndDown, smAndDown, lgAndUp } = useDisplay()

// ---getters
const isMobile = computed(() => smAndDown.value)
const isTablet = computed(() => !isMobile.value && mdAndDown.value)

// ---state
const state = reactive({
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
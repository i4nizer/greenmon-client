<template>
    <v-container class="fill-height" fluid>
        <v-row justify="center">
            <v-col cols="12" sm="6" md="4" lg="3" xl="2">
                <ResetPasswordForm 
                    :loading="state.resetting"
                    @reset="onReset"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { useUserStore } from "@/stores/user.store";
import { defineAsyncComponent, reactive } from "vue";
import { useRouter } from "vue-router";

const ResetPasswordForm = defineAsyncComponent(() => import("@/components/auth/ResetPasswordForm.vue"));



// ---stores
const { user, resetPassword } = useUserStore()

// ---composables
const router = useRouter()

// ---state
const state = reactive({
    resetting: false,
})

// ---events
const onReset = async (password) => {
    state.resetting = true

    await resetPassword(user.email, password)
        .then(() => router.push("/auth/sign-in"))
        .catch(console.error)

    state.resetting = false
}



</script>

<style lang="scss" scoped>

</style>
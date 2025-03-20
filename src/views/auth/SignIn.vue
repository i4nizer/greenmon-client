<template>
    <v-container class="fill-height" fluid>
        <v-row justify="center">
            <v-col cols="12" sm="6" md="4" lg="3" xl="2">
                <SignInForm 
                    :loading="state.signing"
                    @sign-in="onSignIn"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { useTokenStore } from "@/stores/token.store";
import { useUserStore } from "@/stores/user.store";
import { defineAsyncComponent, reactive } from "vue";
import { useRouter } from "vue-router";

const SignInForm = defineAsyncComponent(() => import("@/components/auth/SignInForm.vue"));


// ---stores
const { signIn } = useUserStore()
const { set } = useTokenStore()

// ---composables
const router = useRouter()

// ---state
const state = reactive({
    signing: false,
})

// ---actions
const onSignIn = async ({ email, password }) => {
    state.signing = true;

    await signIn(email, password)
        .then(res => set(res.data))
        .then(() => router.push("/user"))
        .catch(console.error)

    state.signing = false;
}

</script>

<style scoped></style>

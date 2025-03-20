<template>
    <v-container class="fill-height" fluid>
        <v-row justify="center">
            <v-col cols="12" sm="6" md="4" lg="3" xl="2">
                
                <!-- User haven't signed up. -->
                <SignUpForm 
                    v-if="!requiresVerification"
                    :loading="state.signing"
                    @sign-up="onSignUp"
                />
                
                <!-- User signed up but needs to verify. -->
                <OtpVerificationForm
                    v-else
                    :otp-last="recent.accountVerificationOtp"
                    :loading="state.verifying"
                    @verify-otp="onVerifyOtp"
                    @resend-otp="onResendOtp"
                />

            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import env from "@/configs/env.config";
import axios from "axios";
import { useUserStore } from "@/stores/user.store";
import { computed, defineAsyncComponent, reactive } from "vue";
import { useRouter } from "vue-router";

const SignUpForm = defineAsyncComponent(() => import("@/components/auth/SignUpForm.vue"));
const OtpVerificationForm = defineAsyncComponent(() => import("@/components/auth/OtpVerificationForm.vue"));



// ---stores
const {
    user,
    recent,
    signUp,
    verifyAccountVerificationOtp,
} = useUserStore();

// ---composables
const router = useRouter()

// ---getters
const requiresVerification = computed(() => !user.verified && !!recent.accountVerificationOtp);

// ---state
const state = reactive({
    signing: false,
    verifying: false,
})

// ---events
const onSignUp = async (user) => {
    state.signing = true;

    await signUp(user)
        .catch(console.error)

    state.signing = false;
}

const onVerifyOtp = async (otp) => {
    state.verifying = true;

    otp = parseInt(otp);
    await verifyAccountVerificationOtp(user.id, otp)
        .then(() => router.push("/auth/sign-in"))
        .catch(console.error)

    state.verifying = false;
}

const onResendOtp = async () => {
    // request otp again
    const body = { userId: user.id, name: user.name, email: user.email }
    const url = `${env.apiDomain}/user/resend-account-verification-otp`;

    // call
    await axios.post(url, body)
        .catch(console.error)
}

</script>

<style scoped></style>

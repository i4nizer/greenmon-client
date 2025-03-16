<template>
    <v-container class="fill-height" fluid>
        <v-row justify="center">
            <v-col cols="12" sm="6" md="4" lg="3" xl="2">
                
                <!-- User haven't sent a password reset otp. -->
                <ForgotPasswordForm
                    v-if="!forgottenPassword"
                    :loading="state.forgetting"
                    @forgot="onForgot"
                />

                <!-- Was sent an otp -->
                <OtpVerificationForm
                    v-else
                    :loading="state.verifying"
                    :otp-last="recent.passwordResetOtp"
                    @resend-otp="onResendOtp"
                    @verify-otp="onVerifyOtp"
                />

            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import router from '@/router';
import { useUserStore } from '@/stores/user.store';
import { computed, defineAsyncComponent, reactive } from 'vue';

const ForgotPasswordForm = defineAsyncComponent(() => import('@/components/auth/ForgotPasswordForm.vue'))
const OtpVerificationForm = defineAsyncComponent(() => import('@/components/auth/OtpVerificationForm.vue'))



// ---stores
const {
    user,
    recent,
    forgotPassword,
    verifyResetPasswordOtp,
} = useUserStore()

// ---getters
const forgottenPassword = computed(() => user.email && recent.passwordResetOtp);

// ---state
const state = reactive({
    verifying: false,
    forgetting: false,
})

// ---events
const onForgot = async (email) => {
    user.email = email;
    state.forgetting = true;

    await forgotPassword(email)
        .catch(console.error)

    state.forgetting = false;
}

const onResendOtp = async () => {
    await onForgot(user.email)
}

const onVerifyOtp = async (otp) => {
    state.verifying = true

    await verifyResetPasswordOtp(user.email, otp)
        .then(() => router.push("/auth/reset-password"))
        .catch(console.error)

    state.verifying = false;
}


</script>

<style scoped></style>

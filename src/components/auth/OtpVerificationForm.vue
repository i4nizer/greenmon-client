<template>
    <v-form 
        class="pa-7"
        :disabled="loading"
        @submit.prevent="$emit('verify-otp', otp)"
    >
        <h2 class="text-green">OTP Verification</h2>
        <span class="text-grey">Your otp was sent to you via email.</span>

        <v-otp-input
            v-model="otp"
            :length="otpDigits"
            :loading="loading"
            @finish="$emit('verify-otp', otp)"
        ></v-otp-input>

        <div class="text-center mt-3">
            <span class="text-center">Didn't receive the email?</span>
            <br>
            <router-link 
                to="" 
                class="text-grey mt-3"
                @click.prevent="onResendOtp"
            >{{ resendEmailText }}</router-link>
        </div>
    </v-form>
</template>

<script setup>
import { useCounter } from '@/composables/counter.composable';
import { onBeforeMount, ref } from 'vue';


// ---events
const emit = defineEmits(["verify-otp", "resend-otp"]);

// ---props
const props = defineProps({
    /** Gap in seconds. */
    otpGap: {
        type: Number,
        default: 30,
    },
    /** Milliseconds from Date.now(). */
    otpLast: {
        type: Number,
        default: 0,
    },
    /** 6 digits = "012345" */
    otpDigits: {
        type: Number,
        default: 6,
    },
    loading: {
        type: Boolean,
        default: false,
    }
})

// ---composables
const { counter, startCount, onCount, onCountEnd } = useCounter()

// ---data
const otp = ref(null);
const resendEmailText = ref("Resend Email")

// ---actions
const onResendOtp = () => {
    if (counter.value != 0) return;
    startCount(props.otpGap, 0, "Down");
    emit('resend-otp');
}

// ---events
onCount.value = (v) => resendEmailText.value = `Resend in ${v}s`;
onCountEnd.value = (v) => resendEmailText.value = "Resend Email";

// ---hooks
onBeforeMount(() => {
    // check existing count
    const count = props.otpGap - (Date.now() - props.otpLast)
    if (count >= 0) startCount(props.counter, 0, "Down");
})

</script>

<style scoped></style>

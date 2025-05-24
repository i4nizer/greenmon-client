<template>
    <v-form
        class="pa-7"
        v-model="valid"
        :disabled="loading"
        @submit.prevent="$emit('forgot', mail)"
    >
        <h2 class="text-green">Forgot Password</h2>
        <span class="text-grey">Enter email to reset your password</span>

        <v-text-field
            label="Email"
            class="mt-6"
            v-model="mail"
            placeholder="example@email.com"
            :rules="[required(), email()]"
        ></v-text-field>

        <v-btn
            type="submit"
            text="Forgot Password"
            color="green"
            class="w-100 mt-3"
            :loading="loading"
            :disabled="!valid"
        ></v-btn>

        <div class="text-center mt-3">
            <span>Remember your password? </span>
            <router-link class="text-grey" to="/auth/sign-in">Sign In</router-link>
        </div>
    </v-form>
</template>

<script setup>
import { useRules } from '@/composables/rules.composable';
import { ref } from 'vue';


// ---events
const emit = defineEmits(["forgot"])

// ---props
const props = defineProps({
    loading: {
        type: Boolean,
        default: false,
    }
})

// ---composables
const { required, email } = useRules()

// ---data
const mail = ref(null);

// ---state
const valid = ref(null);

</script>

<style scoped></style>

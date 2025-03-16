<template>
    <v-form
        class="border rounded pa-7 d-flex flex-column"
        v-model="valid"
        :disabled="loading"
        @submit.prevent="$emit('reset', password.new)"
    >
        <h2>Reset Password</h2>
        <span class="text-grey">Enter your new password below</span>

        <v-text-field
            label="New Password"
            class="mt-6"
            variant="outlined"
            density="compact"
            type="password"
            v-model="password.new"
            :rules="rules"
        ></v-text-field>

        <v-text-field
            label="Confirm Password"
            class="mt-1"
            variant="outlined"
            density="compact"
            type="password"
            v-model="password.confirm"
            :rules="rules"
        ></v-text-field>

        <v-btn
            type="submit"
            text="Reset Passsword"
            class="text-none mt-3"
            color="white"
            :loading="loading"
            :disabled="!valid"
        ></v-btn>
    </v-form>
</template>

<script setup>
import { useRules } from '@/composables/rules.composable';
import { reactive, ref } from 'vue';



// ---events
const emit = defineEmits(['reset'])

// ---props
const props = defineProps({
    loading: {
        type: Boolean,
        default: false,
    }
})

// ---composable
const { required, min } = useRules();

// ---data
const password = reactive({
    new: null,
    confirm: null,
})

// ---rules
const rules = [
    required(),
    min(8),
    v => (v == password.new && v == password.confirm) || "Passwords must match.",
]

// ---state
const valid = ref(false);


</script>

<style scoped></style>

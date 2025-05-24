<template>
    <v-form
        class="pa-7"
        v-model="valid"
        :disabled="loading"
        @submit.prevent="$emit('reset', password.new)"
    >
        <h2 class="text-green">Reset Password</h2>
        <span class="text-grey">Enter your new password below</span>

        <v-text-field
            type="password"
            label="New Password"
            class="mt-6"
            v-model="password.new"
            :rules="rules"
        ></v-text-field>

        <v-text-field
            label="Confirm Password"
            type="password"
            v-model="password.confirm"
            :rules="rules"
        ></v-text-field>

        <v-btn
            type="submit"
            text="Reset Passsword"
            color="green"
            class="w-100 mt-3"
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

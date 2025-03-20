<template>
    <v-form 
        class="pa-7"
        v-model="valid" 
        :loading="loading"
        @submit.prevent="onSubmit"
    >
        <h2>Sign in to your account</h2>
        <span class="text-grey">Enter your credentials to access your IoT Dashboard</span>

        <v-text-field
            label="Email"
            class="mt-6"
            v-model="user.email"
            placeholder="example@email.com"
            :rules="[required(), email()]"
        ></v-text-field>

        <v-text-field
            type="password"
            label="Password"
            v-model="user.password"
            :rules="[required(), min(8)]"
        ></v-text-field>

        <v-btn 
            type="submit" 
            text="Sign In" 
            class="w-100 mt-3" 
            :disabled="!valid"
            :loading="loading"
        ></v-btn>

        <div class="text-center mt-3">
            <span>Don't have an account? </span>
            <router-link to="/auth/sign-up" class="text-grey">Sign Up</router-link>
            <br>
            <router-link to="/auth/forgot-password" class="text-grey">Forgot your password?</router-link>
        </div>
    </v-form>
</template>

<script setup>
import { useRules } from "@/composables/rules.composable";
import { reactive, ref } from "vue";



// ---events
const emit = defineEmits(['sign-in'])

// ---props
const props = defineProps({
    loading: {
        type: Boolean,
        default: false,
    }
})

// ---composables
const { required, min, max, email } = useRules();

// ---data
const user = reactive({
    email: null,
    password: null,
});

// ---state
const valid = ref(false)

// ---actions
const onSubmit = () => {
    if (!valid.value) return;
    emit("sign-in", user);
}

</script>

<style scoped></style>

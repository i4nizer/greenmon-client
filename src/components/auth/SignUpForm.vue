<template>
    <v-form 
        class="border rounded pa-7" 
        v-model="valid" 
        :disabled="loading"
        @submit.prevent="onSubmit"
    >
        <h2>Create an account</h2>
        <span class="text-grey">Sign up for your IoT Dashboard account</span>

        <v-text-field
            label="Name"
            class="mt-6"
            variant="outlined"
            density="compact"
            v-model="user.name"
            placeholder="Example Name"
            :rules="[required(), min(3), max(30)]"
        ></v-text-field>

        <v-text-field
            label="Email"
            class="mt-1"
            variant="outlined"
            density="compact"
            v-model="user.email"
            placeholder="example@email.com"
            :rules="[required(), email()]"
        ></v-text-field>

        <v-text-field
            label="Password"
            class="mt-1"
            variant="outlined"
            density="compact"
            type="password"
            v-model="user.password"
            :rules="[required(), min(8)]"
        ></v-text-field>

        <v-btn
            text="Sign Up"
            type="submit"
            color="white"
            class="text-none w-100 mt-3"
            :loading="loading"
            :disabled="!valid"
        ></v-btn>

        <div class="text-center mt-3">
            <span>Already have an account? </span>
            <router-link class="text-white" to="/auth/sign-in">Sign In</router-link>
        </div>
    </v-form>
</template>

<script setup>
import { useRules } from '@/composables/rules.composable';
import { reactive, ref } from 'vue';



// ---event
const emit = defineEmits(['sign-up'])

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
    name: null,
    email: null,
    password: null
});

// ---state
const valid = ref(false);

// ---actions
const onSubmit = () => {
    if (!valid.value) return;
    emit('sign-up', user);
}


</script>

<style lang="scss" scoped></style>

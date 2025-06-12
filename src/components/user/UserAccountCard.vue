<template>
    <v-card>
        <v-card-title>
            <v-icon>mdi-account-cog</v-icon>
            <span class="ml-2">Account</span>
        </v-card-title>
        <v-card-subtitle class="text-wrap">Manage your account settings and preferences.</v-card-subtitle>
        <v-card-text>
            <v-form 
                class="border-none pa-1"
                v-model="state.valid"
                @submit.prevent="emit('change', user)"
            >
                <v-text-field
                    label="Name"
                    v-model="user.name"
                    :rules="[required(), min(3), max(30)]"
                ></v-text-field>
                <v-text-field
                    readonly
                    label="Email"
                    :model-value="user.email"
                ></v-text-field>
                <v-btn
                    text="Save"
                    type="submit"
                    color="green"
                    elevation="0"
                    :disabled="!state.valid || !changed"
                ></v-btn>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { useRules } from '@/composables/rules.composable';
import equal from 'fast-deep-equal';
import { computed, reactive } from 'vue';



// ---events 
const emit = defineEmits(['change'])

// ---props
const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
})

// ---composables
const { required, min, max } = useRules()

// ---data
const user = reactive({
    ...props.user,
    name: props.user?.name,
    email: props.user?.email,
})

// ---getters
const changed = computed(() => !equal(props.user, user))

// ---state
const state = reactive({ valid: false })




</script>

<style lang="scss" scoped>

</style>
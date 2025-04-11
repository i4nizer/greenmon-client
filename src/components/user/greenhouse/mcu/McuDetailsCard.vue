<template>
    <v-card>
        <v-card-title>
            <v-icon>mdi-chip</v-icon>
            <span class="ml-2">Details</span>
        </v-card-title>
        <v-card-subtitle>Manage your microcontroller settings and preferences.</v-card-subtitle>
        <v-card-text>
            <v-form 
                class="border-none pa-1"
                v-model="state.valid" 
                @submit.prevent="onSubmit"
            >
                <v-text-field
                    label="Name"
                    v-model="mcu.name"
                    :rules="[required(), min(3), max(100)]"
                ></v-text-field>
                <v-text-field
                    label="Label"
                    v-model="mcu.label"
                ></v-text-field>
                <v-btn
                    type="submit"
                    text="Save"
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
    mcu: {
        type: Object,
        required: true,
    }
})

// ---composables
const { required, min, max } = useRules()

// ---data
const mcu = reactive({
    name: props.mcu?.name,
    label: props.mcu?.label,
})

// ---getters
const propsGreenhouse = computed(() => ({
    name: props.mcu?.name,
    label: props.mcu?.label,
}))
const changed = computed(() => !equal(mcu, propsGreenhouse.value))

// ---state
const state = reactive({ valid: false })

// ---events
const onSubmit = () => emit('change', { ...props.mcu, ...mcu })


</script>

<style lang="scss" scoped>

</style>
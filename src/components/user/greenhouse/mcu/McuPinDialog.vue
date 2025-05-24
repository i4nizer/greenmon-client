<template>
    <v-dialog>
        <template #activator="{ props: activatorProps }">
            <slot name="activator" :="{ props: activatorProps }"></slot>
        </template>
        <template #default="{ isActive }">
            <v-form 
                class="bg-green-darken-4 pa-7"
                v-model="state.valid" 
                @submit.prevent="onSubmit"
            >
                <h3>{{ `${type} Pin` }}</h3>
                <span class="text-grey">Please provide the pin details.</span>
                <v-select
                    label="Type"
                    class="mt-6"
                    v-model="pin.type"
                    :items="['Digital', 'Analog']"
                    :rules="[required()]"
                ></v-select>
                <v-number-input
                    label="Number"
                    v-model="pin.number"
                    :rules="[required('Number'), min(0), pinAvalaibleRule]"
                    :disabled="!pin.type"
                ></v-number-input>
                <v-select
                    label="Mode"
                    v-model="pin.mode"
                    :items="['Unset', 'Input', 'Output', 'Other']"
                    :rules="[required()]"
                ></v-select>
                <v-btn
                    type="submit"
                    class="mt-3"
                    :text="type"
                    :disabled="!state.valid || (props.type == 'Update' && !changed)"
                    @click="isActive.value = !isActive.value"
                ></v-btn>
            </v-form>
        </template>
    </v-dialog>
</template>

<script setup>
import { useRules } from '@/composables/rules.composable';
import { computed, reactive } from 'vue';
import equal from 'fast-deep-equal';



// ---events
const emit = defineEmits(['submit'])

// ---props
const props = defineProps({
    type: {
        type: String,
        default: "Create",
    },
    initial: {
        type: Object,
        default: {},
    },
    existing: {
        type: Array,
        default: [],
    }
})

// ---composables
const { required, min, } = useRules()

// ---data
const pin = reactive({
    type: props.initial?.type,
    mode: props.initial?.mode || 'Unset',
    number: props.initial?.number,
})

// ---rules
const pinAvalaibleRule = v =>
    !props.existing.some(p =>
        props.type == 'Create'
            ? p.type == pin.type && p.number == v
            : p.type == pin.type && p.number == v && props.initial.number != v
    ) || "This pin is already taken."

// ---getters
const pinProps = computed(() => ({
    type: props.initial?.type,
    mode: props.initial?.mode,
    number: props.initial?.number,
}))
const changed = computed(() => !equal(pin, pinProps.value))

// ---state
const state = reactive({ valid: false })

// ---events
const onSubmit = () => {
    const data = {
        ...props.initial,
        ...pin,
    }

    emit("submit", data);

    if (props.type == 'Create') {
        pin.type = null
        pin.mode = null
        pin.number = null
    }
}



</script>

<style lang="scss" scoped>

</style>
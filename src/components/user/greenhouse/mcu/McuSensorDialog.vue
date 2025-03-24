<template>
    <v-dialog>
        <template #activator="{ props: activatorProps }">
            <slot name="activator" :="{ props: activatorProps }"></slot>
        </template>
        <template #default="{ isActive }">
            <v-form 
                class="bg-grey-darken-4 pa-7"
                v-model="state.valid" 
                @submit.prevent="onSubmit"
            >
                <h3>{{ `${type} Sensor` }}</h3>
                <span class="text-grey">Please provide the sensor details.</span>
                <v-text-field
                    label="Name"
                    class="mt-6"
                    v-model="sensor.name"
                    :rules="[required(), min(3), max(100)]"
                ></v-text-field>
                <v-text-field
                    label="Label"
                    v-model="sensor.label"
                ></v-text-field>
                <v-btn
                    type="submit"
                    class="mt-3"
                    :text="type"
                    :disabled="!state.valid || (props.type != 'Create' && !changed)"
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
})

// ---composables
const { required, min, max, } = useRules()

// ---data
const sensor = reactive({
    name: props.initial?.name,
    label: props.initial?.label,
})

// ---getters
const sensorProps = computed(() => ({
    name: props.initial?.name,
    label: props.initial?.label,
}))
const changed = computed(() => !equal(sensor, sensorProps.value))

// ---state
const state = reactive({ valid: false })

// ---events
const onSubmit = () => {
    const data = {
        ...props.initial,
        ...sensor,
    }

    emit("submit", data);

    if (props.type == 'Create') {
        sensor.name = null
        sensor.label = null
    }
}



</script>

<style lang="scss" scoped>

</style>
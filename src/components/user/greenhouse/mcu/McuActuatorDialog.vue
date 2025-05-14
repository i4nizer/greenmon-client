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
                <h3>{{ `${type} Actuator` }}</h3>
                <span class="text-grey">Please provide the actuator details.</span>
                <v-text-field
                    label="Name"
                    class="mt-6"
                    v-model="actuator.name"
                    :rules="[required(), min(3), max(100)]"
                ></v-text-field>
                <v-text-field
                    label="Label"
                    v-model="actuator.label"
                ></v-text-field>
                <v-select
                    label="Flag"
                    v-model="actuator.disabled"
                    :items="['Enabled', 'Disabled']"
                    :item-title="v => v"
                    :item-value="v => v == 'Disabled'"
                ></v-select>
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
const actuator = reactive({
    name: props.initial?.name,
    label: props.initial?.label,
    disabled: props.initial?.disabled ?? true,
})

// ---getters
const actuatorProps = computed(() => ({
    name: props.initial?.name,
    label: props.initial?.label,
    disabled: props.initial?.disabled ?? true,
}))
const changed = computed(() => !equal(actuator, actuatorProps.value))

// ---state
const state = reactive({ valid: false })

// ---events
const onSubmit = () => {
    const data = {
        ...props.initial,
        ...actuator,
    }

    emit("submit", data);

    if (props.type == 'Create') {
        actuator.name = null
        actuator.label = null
        actuator.disabled = true
    }
}



</script>

<style lang="scss" scoped>

</style>
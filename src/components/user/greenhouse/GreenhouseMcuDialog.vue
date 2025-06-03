<template>
    <v-dialog>
        <template #activator="{ props: activatorProps }">
            <slot name="activator" :="{ props: activatorProps }"></slot>
        </template>
        <template #default="{ isActive }">
            <v-form 
                class="bg-green-darken-4 pa-7 overflow-auto"
                v-model="state.valid" 
                @submit.prevent="onSubmit"
            >
                <h3>{{ `${type} Microcontroller` }}</h3>
                <span class="text-grey">Please provide the microcontroller details.</span>
                <v-text-field
                    label="Name"
                    class="mt-6"
                    v-model="mcu.name"
                    :rules="[required(), min(3), max(100)]"
                ></v-text-field>
                <v-text-field
                    label="Label"
                    v-model="mcu.label"
                ></v-text-field>
                <v-number-input
                    label="Digital Pins"
                    v-model="pins.digital"
                    :rules="[required('Number'), min(0)]"
                    :readonly="type == 'Update'"
                ></v-number-input>
                <v-number-input
                    label="Analog Pins"
                    v-model="pins.analog"
                    :rules="[required('Number'), min(0)]"
                    :readonly="type == 'Update'"
                ></v-number-input>
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
const mcu = reactive({
    name: props.initial?.name,
    label: props.initial?.label,
})
const pins = reactive({
    analog: (props.initial?.pins?.filter(p => p.type == 'Analog')?.length),
    digital: (props.initial?.pins?.filter(p => p.type == 'Digital')?.length),
})

// ---getters
const mcuProps = computed(() => ({
    name: props.initial?.name,
    label: props.initial?.label,
}))
const changed = computed(() => !equal(mcu, mcuProps.value))

// ---state
const state = reactive({ valid: false })

// ---events
const onSubmit = () => {
    const data = {
        ...props.initial,
        ...mcu,
    }

    if (props.type == 'Create') {
        data.pins = []
        let pinNum = 0;
        for (; pinNum < pins.digital; pinNum++) data.pins.push({ type: 'Digital', number: pinNum });
        for (; pinNum < pins.digital + pins.analog; pinNum++) data.pins.push({ type: 'Analog', number: pinNum });
    }

    emit("submit", data);

    if (props.type == 'Create') {
        mcu.name = null
        mcu.label = null
        pins.analog = 0
        pins.digital = 0
    }
}



</script>

<style lang="scss" scoped>

</style>
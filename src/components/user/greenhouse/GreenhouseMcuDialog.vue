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
                <v-text-field
                    type="number"
                    label="Digital Pins"
                    v-model="pins.digital"
                    :rules="[required('Number'), v => min(0)(parseInt(v))]"
                    :readonly="type == 'Update'"
                ></v-text-field>
                <v-text-field
                    type="number"
                    label="Analog Pins"
                    v-model="pins.analog"
                    :rules="[required('Number'), v => min(0)(parseInt(v))]"
                    :readonly="type == 'Update'"
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
const mcu = reactive({
    name: props.initial?.name,
    label: props.initial?.label,
})
const pins = reactive({
    analog: (props.initial?.pins?.filter(p => p.type == 'Analog')?.length) || 0,
    digital: (props.initial?.pins?.filter(p => p.type == 'Digital')?.length) || 0,
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
        for (let i = 0; i < pins.analog; i++) data.pins.push({ type: 'Analog', number: i });
        for (let i = 0; i < pins.digital; i++) data.pins.push({ type: 'Digital', number: i });
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
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
                <h3>{{ `${type} Camera` }}</h3>
                <span class="text-grey">Please provide the camera details.</span>
                <v-text-field
                    label="Name"
                    class="mt-6"
                    v-model="camera.name"
                    :rules="[required(), min(3), max(100)]"
                ></v-text-field>
                <v-text-field
                    label="Label"
                    v-model="camera.label"
                ></v-text-field>
                <v-select
                    persistent-hint
                    hint="Set Detect to Apply Lettuce NPK Deficiency Detection"
                    label="Detect"
                    v-model="camera.detect"
                    :items="['Detect', 'Ignore']"
                    :disabled="state.tooFrequentDetect"
                    :item-title="v => v"
                    :item-value="v => v == 'Detect'"
                ></v-select>
                <v-number-input
                    label="Interval"
                    v-model="camera.interval"
                    :rules="[required('Number'), min(0)]"
                ></v-number-input>
                <v-select
                    label="Flag"
                    v-model="camera.disabled"
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
import { computed, reactive, watch } from 'vue';
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
const camera = reactive({
    name: props.initial?.name,
    label: props.initial?.label,
    detect: props.initial?.detect ?? true,
    interval: props.initial?.interval ?? 60,
    disabled: props.initial?.disabled ?? true,
})

// ---getters
const cameraProps = computed(() => ({
    name: props.initial?.name,
    label: props.initial?.label,
    detect: props.initial?.detect ?? true,
    interval: props.initial?.interval ?? 60,
    disabled: props.initial?.disabled ?? true,
}))
const changed = computed(() => !equal(camera, cameraProps.value))

// ---state
const state = reactive({
    valid: false,
    tooFrequentDetect: false,
})

// ---watchers
watch(camera, nv => state.tooFrequentDetect = nv.interval < 60)
watch(() => state.tooFrequentDetect, (nv, ov) => { if (nv != ov) camera.detect = !nv })

// ---events
const onSubmit = () => {
    const data = {
        ...props.initial,
        ...camera,
    }

    emit("submit", data);

    if (props.type == 'Create') {
        camera.name = null
        camera.label = null
        camera.detect = true
        camera.interval = 60
        camera.disabled = true
    }
}



</script>

<style lang="scss" scoped>

</style>
<template>
    <v-card>
        <v-card-title>
            <v-icon>mdi-camera</v-icon>
            <span class="ml-2">Details</span>
        </v-card-title>
        <v-card-subtitle>Manage your camera settings and preferences.</v-card-subtitle>
        <v-card-text>
            <v-form 
                class="border-none pa-1"
                v-model="state.valid" 
                @submit.prevent="onSubmit"
            >
                <v-text-field
                    label="Name"
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
                <v-text-field
                    readonly
                    label="Api Key"
                    v-model="camera.key"
                    append-inner-icon="mdi-content-copy"
                    @click:append-inner="onCopyKey"
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
import { computed, reactive, watch } from 'vue';



// ---events
const emit = defineEmits(['change'])

// ---props
const props = defineProps({
    camera: {
        type: Object,
        required: true,
    }
})

// ---composables
const { required, min, max } = useRules()

// ---data
const camera = reactive({
    name: props.camera?.name,
    label: props.camera?.label,
    key: props.camera?.key,
    detect: props.camera?.detect ?? true,
    interval: props.camera?.interval ?? 60,
    disabled: props.camera?.disabled ?? true,
})

// ---getters
const propsCamera = computed(() => ({
    name: props.camera?.name,
    label: props.camera?.label,
    key: props.camera?.key,
    detect: props.camera?.detect ?? true,
    interval: props.camera?.interval ?? 60,
    disabled: props.camera?.disabled ?? true,
}))
const changed = computed(() => !equal(camera, propsCamera.value))

// ---state
const state = reactive({
    valid: false,
    tooFrequentDetect: false,
})

// ---watchers
watch(camera, nv => state.tooFrequentDetect = nv.interval < 60)
watch(() => state.tooFrequentDetect, (nv, ov) => { if (nv != ov) camera.detect = !nv })

// ---events
const onSubmit = () => emit('change', { ...props.camera, ...camera })

const onCopyKey = async () => await navigator.clipboard.writeText(props.camera.key).catch(console.error)

</script>

<style lang="scss" scoped>

</style>
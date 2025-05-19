<template>
    <v-dialog>
        <template #activator="{ props: activatorProps }">
            <slot name="activator" :="{ props: activatorProps }"></slot>
        </template>
        <template #default="{ isActive }">
            <v-form 
                class="bg-grey-darken-4 pa-7 overflow-auto"
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
                    persistent-hint
                    hint="Default recommended is PIXFORMAT_JPEG."
                    label="Pixel Format"
                    v-model="camera.format"
                    :items="pixelFormats"
                ></v-select>
                <v-number-input
                    label="Quality"
                    v-model="camera.quality"
                    :rules="[min(0), max(63)]"
                ></v-number-input>
                <v-select
                    persistent-hint
                    hint="Default recommended is FRAMESIZE_UXGA."
                    label="Resolution"
                    v-model="camera.resolution"
                    :items="resolutions"
                ></v-select>
                <v-select
                    hint="Even at realtime, the delays are still present due to network transmit."
                    label="Capture Speed"
                    v-model="camera.realtime"
                    :items="['Realtime', 'Interval']"
                    :item-title="v => v"
                    :item-value="v => v == 'Realtime'"
                ></v-select>
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
    format: props.initial?.format ?? "PIXFORMAT_JPEG",
    quality: props.initial?.quality ?? 12,
    resolution: props.initial?.resolution ?? "FRAMESIZE_UXGA",
    realtime: props.initial?.realtime ?? false,
    disabled: props.initial?.disabled ?? true,
})
const pixelFormats = reactive([
    "PIXFORMAT_RG656", "PIXFORMAT_YUV422", "PIXFORMAT_YUV420", "PIXFORMAT_GRAYSCALE", 
    "PIXFORMAT_JPEG", "PIXFORMAT_RGB888", "PIXFORMAT_RAW", "PIXFORMAT_RGB444", 
    "PIXFORMAT_RGB555"
])
const resolutions = reactive([
    "FRAMESIZE_96X96", "FRAMESIZE_QQVGA", "FRAMESIZE_QCIF", "FRAMESIZE_HQVGA", 
    "FRAMESIZE_240X240", "FRAMESIZE_QVGA", "FRAMESIZE_CIF", "FRAMESIZE_HVGA",
    "FRAMESIZE_VGA", "FRAMESIZE_SVGA", "FRAMESIZE_XGA", "FRAMESIZE_HD",
    "FRAMESIZE_SXGA", "FRAMESIZE_UXGA", "FRAMESIZE_FHD", "FRAMESIZE_P_HD",
    "FRAMESIZE_P_3MP", "FRAMESIZE_QXGA", "FRAMESIZE_QHD", "FRAMESIZE_WQXGA",
    "FRAMESIZE_P_FHD", "FRAMESIZE_QSXGA"
])

// ---getters
const cameraProps = computed(() => ({
    name: props.initial?.name,
    label: props.initial?.label,
    detect: props.initial?.detect ?? true,
    interval: props.initial?.interval ?? 60,
    format: props.initial?.format ?? "PIXFORMAT_JPEG",
    quality: props.initial?.quality ?? 12,
    resolution: props.initial?.resolution ?? "FRAMESIZE_UXGA",
    realtime: props.initial?.realtime ?? false,
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
        camera.format = "PIXFORMAT_JPEG"
        camera.quality = 12
        camera.resolution = "FRAMESIZE_UXGA"
        camera.disabled = false
        camera.disabled = true
    }
}



</script>

<style lang="scss" scoped>

</style>
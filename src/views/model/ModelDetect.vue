<template>
    <v-container>
        <v-row>
            <v-col>
                <div class="d-flex ga-1 align-center">
                    <v-btn to="/model/details" color="transparent" icon="mdi-arrow-left"></v-btn>
                    <v-spacer></v-spacer>
                    <v-select
                        chips
                        hide-details
                        label="Camera"
                        v-model="camera.source"
                        :items="devices"
                        :item-title="i => i?.label"
                        :item-value="i => i?.deviceId"
                        @update:model-value="onCameraChangeSource"
                    ></v-select>
                    <v-btn
                        text="Camera"
                        class="mt-1"
                        :color="camera.active ? 'green':'grey'"
                        :disabled="!camera.source"
                        @click="onCameraToggle"
                    ></v-btn>
                </div>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <VideoDetectionCard
                    :bounding-boxes="boundingBoxes"
                    :video-src-object="camera.stream"
                    @paint-frame="onVideoFrame"
                ></VideoDetectionCard>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <ModelDetectionGuideCard></ModelDetectionGuideCard>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { mlLettuceModelPredict, mlLettuceModelUnload } from '@/utils/model.util';
import { getVideoDevices, getVideoDeviceStream } from '@/utils/camera.util';
import { defineAsyncComponent, onBeforeMount, onBeforeUnmount, reactive } from 'vue';

const VideoDetectionCard = defineAsyncComponent(() => import("@/components/model/VideoDetectionCard.vue"))
const ModelDetectionGuideCard = defineAsyncComponent(() => import("@/components/model/ModelDetectionGuideCard.vue"))


// ---data
const devices = reactive([])
const camera = reactive({
    active: false,
    source: null,
    stream: null,
})
const boundingBoxes = reactive([])

// ---action
const cameraInit = async () => {
    await getVideoDevices()
        .then(devs => devices.push(...devs))
        .then(_ => camera.source = devices.at(0)?.deviceId)
        .catch(console.error)
}

const cameraOn = async () => {
    camera.active = true
    await getVideoDeviceStream(camera.source)
        .then(stream => camera.stream = stream)
        .catch(_ => camera.active = false)
}

const cameraOff = () => {
    camera.active = false
    if (camera.stream == null) return;
    camera.stream?.getTracks()?.forEach(t => t?.stop())
    camera.stream = null
}

// ---events
const onCameraToggle = async () => {
    if (!camera.active) cameraOn()
    else cameraOff()
}

const onCameraChangeSource = async () => {
    if (!camera.active) return;
    if (camera.stream != null) cameraOff()
    await cameraOn()
}

const onVideoFrame = async (canvas) => {
    const bboxes = await mlLettuceModelPredict(canvas, 0.7)
    boundingBoxes.splice(0, boundingBoxes.length)
    boundingBoxes.push(...bboxes)
}

// ---hooks
onBeforeMount(async () => {
    await cameraInit()
    // await cameraOn()
})

onBeforeUnmount(() => mlLettuceModelUnload())

//
</script>

<style lang="scss" scoped>

</style>
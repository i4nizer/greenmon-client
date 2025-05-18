<template>
    <v-card class="border pt-3">
        <template #prepend>
            <v-icon>mdi-camera</v-icon>
        </template>
        <template #title>
            <span class="ml-2">{{ camera?.name }}</span>
        </template>
        <v-card-subtitle>{{ camera?.label }}</v-card-subtitle>
        <template #append>
            <span>FPS: {{ fps.toFixed(2) }}</span>
        </template>
        <v-card-text>

            <ImageDetectionCard
                v-if="base64url.length > 0"
                :src="base64url"
                :bounding-boxes="boundingBoxes"
                @load-image="onLoadImage"
            ></ImageDetectionCard>
            
            <v-empty-state
                v-if="base64url.length <= 0"
                icon="mdi-camera-off"
                text="Kindly wait while we are requesting preview."
                title="Please Wait"
            ></v-empty-state>
            
        </v-card-text>
    </v-card>
</template>

<script setup>
import { useCameraStore } from "@/stores/camera.store";
import { mlLettuceModelPredict, mlLettuceModelUnload } from "@/utils/model.util";
import { wsAddEvent, wsDelEvent } from "@/utils/ws.util";
import { defineAsyncComponent, onBeforeUnmount, onMounted, reactive, ref } from "vue";

const ImageDetectionCard = defineAsyncComponent(() => import("@/components/user/greenhouse/camera/ImageDetectionCard.vue"))

//

// ---events
const emit = defineEmits({
    
})

// ---props
const props = defineProps({
    camera: {
        type: Object,
        required: true,
    },
});

// ---stores
const { updateCamera } = useCameraStore();

// ---fps
const fps = ref(0);
const lastFrame = ref(0);

// ---data
const wsEvents = reactive([]);
const base64url = ref("");
const boundingBoxes = reactive([])

// ---events
const onImageRealtime = (data) => {
    for (const image of data) {
        if (image?.cameraId != props.camera?.id) continue;

        base64url.value = `data:image/jpeg;base64,${image?.base64img}`;

        const frameDiff = Date.now() - lastFrame.value;
        fps.value = frameDiff > 0 ? 1 / (frameDiff / 1000) : 0;
        lastFrame.value = Date.now();
    }
};

const onLoadImage = async (image) => {
    const bboxes = await mlLettuceModelPredict(image, 0.7)
    boundingBoxes.splice(0, boundingBoxes.length)
    boundingBoxes.push(...bboxes)
}

// ---hooks
onMounted(async () => {

    // set camera realtime
    await updateCamera({ ...props.camera, realtime: true }).catch(console.error);
    wsEvents.push(wsAddEvent("image-realtime", onImageRealtime, "Create"));

});

onBeforeUnmount(async () => {

    // reset back to non-realtime
    await updateCamera({ ...props.camera, realtime: false }).catch(console.error);
    while (wsEvents.length > 0) wsDelEvent(wsEvents.shift());

    // unload ml model
    mlLettuceModelUnload()

});

//

</script>

<style lang="scss" scoped></style>

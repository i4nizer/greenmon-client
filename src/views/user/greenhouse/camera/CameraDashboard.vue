<template>
    <CameraLayout>
        <v-container class="pa-5 py-7" fluid>
            <v-row justify="center" align-content="center">
                <v-img
                    src="https://res.cloudinary.com/dqgnetjlz/image/upload/f_auto,q_auto/v1749725689/bg-doa.png"
                    class="position-fixed top-0 h-100 w-75 w-sm-50 w-md-33 w-lg-25 opacity-50"
                ></v-img>
            </v-row>
            <v-row>
                <v-col>
                    <h3>Camera Dashboard</h3>
                </v-col>
            </v-row>
            <v-row>
                <!-- Numeric Specific -->
                <v-col v-for="cls in Object.keys(classCounts)" cols="12" sm="12" md="6" lg="4" xl="3" xxl="2">
                    <CameraDetectionCard :class="cls" :count="classCounts[cls]"></CameraDetectionCard>
                </v-col>

                <!-- Meaningful Graph Data with Values -->
                <v-col cols="12" xl="6">
                    <CameraDetectionBarChart class="border pt-3" :camera="camera"></CameraDetectionBarChart>
                </v-col>
            </v-row>
        </v-container>
    </CameraLayout>
</template>

<script setup>
import { useCameraStore } from "@/stores/camera.store";
import { wsAddEvent, wsConnect, wsDelEvent } from "@/utils/ws.util";
import { computed, defineAsyncComponent, onBeforeMount, onBeforeUnmount, onMounted, reactive, watch } from "vue";
import { useRoute } from "vue-router";

const CameraLayout = defineAsyncComponent(() => import("@/views/user/greenhouse/camera/CameraLayout.vue"));
const CameraDetectionCard = defineAsyncComponent(() => import("@/components/user/greenhouse/camera/CameraDetectionCard.vue"));
const CameraDetectionBarChart = defineAsyncComponent(() => import("@/components/user/greenhouse/camera/CameraDetectionBarChart.vue"));

// ---stores
const { cameras, retrieveImage } = useCameraStore();

// ---composables
const route = useRoute();

// ---data
const wsEvents = reactive([]);
const cameraId = route.params.cameraId;
const classCounts = reactive({ "No Lettuce": 0 });
const imagesWithDetections = reactive([]);

// ---getters
const camera = computed(() => cameras.find((c) => c.id == cameraId));

// ---watchers
watch(imagesWithDetections, (nv, ov) => {
    // reset counters
    Object.keys(classCounts).forEach((k) => (classCounts[k] = 0));

    // recount detections
    for (const img of nv) {
        if (!img.detections || img.detections.length <= 0) classCounts["No Lettuce"]++;
        for (const det of img.detections) {
            if (!classCounts[det?.class]) classCounts[det?.class] = 1;
            else classCounts[det?.class]++;
        }
    }
});

// ---events
const onWsEventImage = (data) => {
    for (const img of data) {
        if (img?.cameraId != cameraId) continue;
        imagesWithDetections.push({ ...img, detections: [] });
    }
};

const onWsEventDetection = (data) => {
    for (const det of data) {
        for (const iwd of imagesWithDetections) {
            if (iwd.id == det.imageId) iwd.detections.push(det);
        }
    }
};

// ---hooks
onBeforeMount(async () => {
    wsConnect();

    // prefetch detections from images to count no lettuce too
    const res = await retrieveImage({ cameraId, detection: true });
    imagesWithDetections.push(...res.data.images);

    // listen to new images and detections
    wsEvents.push(wsAddEvent("image", onWsEventImage, "Create"));
    wsEvents.push(wsAddEvent("detection", onWsEventDetection, "Create"));
});

onBeforeUnmount(() => {
    while (wsEvents.length > 0) wsDelEvent(wsEvents.shift());
});

//
</script>

<style lang="scss" scoped></style>

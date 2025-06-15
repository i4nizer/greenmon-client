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
                    <h3>Camera Capture</h3>
                </v-col>
            </v-row>
            <v-row>
                <!-- List Date Range Control -->
                <v-col class="pa-1" cols="12" sm="12" md="9" lg="6" xl="4">
                    <v-select
                        chips
                        multiple
                        hide-details
                        label="Class"
                        v-model="filter.classes"
                        :items="['No Lettuce', ...env.modelClasses]"
                        @update:model-value="onPaginate"
                    ></v-select>
                </v-col>
                <v-col class="pa-1" cols="12" sm="12" md="3" lg="2" xl="2">
                    <v-select
                        chips
                        hide-details
                        label="Limit"
                        v-model="pagination.limit"
                        :items="[25, 50, 100, 200, 500]"
                        @update:model-value="onPaginate"
                    ></v-select>
                </v-col>
                <v-col class="pa-1" cols="12" sm="12" md="6" lg="2" xl="3">
                    <v-select
                        chips
                        hide-details
                        label="Year"
                        v-model="pagination.year"
                        :items="Array.from({ length: new Date().getFullYear() - 2024 }, (_, i) => i + 2025)"
                        @update:model-value="onPaginate"
                    ></v-select>
                </v-col>
                <v-col class="pa-1" cols="12" sm="12" md="6" lg="2" xl="3">
                    <v-select
                        chips
                        hide-details
                        label="Month"
                        v-model="pagination.month"
                        :items="Array.from({ length: 12 }, (_, i) => i)"
                        :item-title="
                            (i) =>
                                [
                                    'January',
                                    'February',
                                    'March',
                                    'April',
                                    'May',
                                    'June',
                                    'July',
                                    'August',
                                    'September',
                                    'October',
                                    'November',
                                    'December',
                                ][i]
                        "
                        :item-value="(i) => i"
                        @update:model-value="onPaginate"
                    ></v-select>
                </v-col>
            </v-row>
            <v-row>
                <!-- List of detections -->
                <v-col v-for="(image, index) in imageWithDetections" cols="12" sm="6" md="4" lg="3" xl="2" :key="image?.id ?? index">
                    <CameraImageCard :image="image" :detections="image?.detections"></CameraImageCard>
                </v-col>

                <v-col v-if="imageWithDetections.length <= 0" cols="12">
                    <v-empty-state
                        icon="mdi-image-off"
                        text="There are no captured images for the selected filter and year-month."
                        title="No Captures"
                    ></v-empty-state>
                </v-col>
            </v-row>
            <v-row>
                <!-- List Pagination Control -->
                <v-col>
                    <v-pagination v-model="pagination.page" :length="pagination.count" @update:model-value="onPaginate"></v-pagination>
                </v-col>
            </v-row>
        </v-container>
    </CameraLayout>
</template>

<script setup>
import env from "@/configs/env.config";
import { useCameraStore } from "@/stores/camera.store";
import { wsAddEvent, wsDelEvent } from "@/utils/ws.util";
import { computed, defineAsyncComponent, onBeforeUnmount, onBeforeMount, reactive, toRaw } from "vue";
import { useRoute } from "vue-router";

const CameraLayout = defineAsyncComponent(() => import("@/views/user/greenhouse/camera/CameraLayout.vue"));
const CameraImageCard = defineAsyncComponent(() => import("@/components/user/greenhouse/camera/CameraImageCard.vue"));

// ---stores
const { cameras, retrieveImage, retrieveDetection } = useCameraStore();

// ---composables
const route = useRoute();

// ---data
const cameraId = route.params.cameraId;
const greenhouseId = route.params.greenhouseId;

const imageWithDetections = reactive([]);
const wsEvents = reactive([]);

const filter = reactive({
    classes: ["No Lettuce", ...env.modelClasses],
});
const pagination = reactive({
    page: 1,
    limit: 25,
    count: 0,
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
});

// ---getters
const camera = computed(() => cameras.find((c) => c.id == cameraId));

// ---state

// ---events
const onPaginate = async () => {
    const res = await retrieveImage({
        cameraId,
        greenhouseId,
        limit: pagination.limit,
        offset: (pagination.page - 1) * pagination.limit,
        year: pagination.year,
        month: pagination.month,
        detection: true,
        ...(filter.classes.length > 0 && { classes: filter.classes.join(",") }),
    });
    pagination.count = Math.ceil(res.data?.count / pagination.limit);
    imageWithDetections.splice(0, imageWithDetections.length);
    imageWithDetections.push(...res.data.images);
};

const onWsEventImage = (data) => {
    for (const img of data) {
        if (img?.cameraId != cameraId) continue;
        imageWithDetections.unshift({ ...img, detections: [] });
    }
};

const onWsEventDetection = (data) => {
    for (const det of data) {
        for (const iwd of imageWithDetections) {
            if (iwd.id == det.imageId) iwd.detections.unshift(det);
        }
    }
};

// ---hooks
onBeforeMount(async () => {
    await onPaginate();
    wsEvents.push(wsAddEvent("image", onWsEventImage, "Create"));
    wsEvents.push(wsAddEvent("detection", onWsEventDetection, "Create"));
});

onBeforeUnmount(async () => {
    while (wsEvents.length > 0) wsDelEvent(wsEvents.shift());
});

//
</script>

<style lang="scss" scoped></style>

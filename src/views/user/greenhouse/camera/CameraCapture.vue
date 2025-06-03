<template>
    <CameraLayout>
        <v-container class="pa-5 py-7" fluid>
            <v-row justify="center" align-content="center">
                <v-img
                    src="@/assets/bg-doa.png"
                    class="position-fixed top-0 h-100 w-75 w-sm-50 w-md-33 w-lg-25 opacity-50"
                ></v-img>
            </v-row>
            <v-row>
                <v-col>
                    <h3>Camera Capture</h3>
                </v-col>
            </v-row>
            <v-row justify="end">

                <!-- List Date Range Control -->
                <v-col cols="6" class="d-flex ga-1 align-center">
                    <v-select
                        hide-details
                        label="Year"
                        v-model="pagination.year"
                        :items="Array.from({ length: new Date().getFullYear() - 2024 }, (_, i) => i + 2025)"
                        @update:model-value="onPaginate"
                    ></v-select>
                    <v-select
                        hide-details
                        label="Month"
                        v-model="pagination.month"
                        :items="Array.from({ length: 12 }, (_, i) => i)"
                        :item-title="i => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][i]"
                        :item-value="i => i"
                        @update:model-value="onPaginate"
                    ></v-select>
                </v-col>

            </v-row>
            <v-row>
                
                <!-- List of detections -->
                <v-col 
                    v-for="(image, index) in imageWithDetections" 
                    cols="12" sm="6" md="4" lg="3" xl="2"
                    :key="image?.id ?? index"
                >
                    <CameraImageCard
                        :image="image"
                        :detections="image?.detections"
                    ></CameraImageCard>
                </v-col>

                <v-col
                    v-if="imageWithDetections.length <= 0"
                    cols="12"
                >
                    <v-empty-state
                        icon="mdi-image-off"
                        text="There are no captured images for the selected month."
                        title="No Captures"
                    ></v-empty-state>
                </v-col>
                
            </v-row>
            <v-row>
                
                <!-- List Pagination Control -->
                <v-col>
                    <v-pagination
                        v-model="pagination.page"
                        :length="pagination.count"
                        @update:model-value="onPaginate"
                    ></v-pagination>
                </v-col>

            </v-row>
        </v-container>
    </CameraLayout>
</template>

<script setup>
import { useCameraStore } from '@/stores/camera.store';
import { wsAddEvent, wsDelEvent } from '@/utils/ws.util';
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, reactive, toRaw } from 'vue';
import { useRoute } from 'vue-router';

const CameraLayout = defineAsyncComponent(() => import("@/views/user/greenhouse/camera/CameraLayout.vue"))
const CameraImageCard = defineAsyncComponent(() => import("@/components/user/greenhouse/camera/CameraImageCard.vue"))


// ---stores
const { cameras, retrieveImage, retrieveDetection } = useCameraStore()

// ---composables
const route = useRoute()

// ---data
const cameraId = route.params.cameraId
const greenhouseId = route.params.greenhouseId

const images = reactive([])
const detections = reactive([])
const wsEvents = reactive([])

const pagination = reactive({
    page: 1,
    limit: 25,
    count: 0,
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
})

// ---getters
const camera = computed(() => cameras.find(c => c.id == cameraId))
const imageWithDetections = computed(() => images.map(i => ({ ...i, detections: detections.filter(d => d.imageId == i.id) })))

// ---state


// ---events
const onPaginate = async () => {
    const imgRes = await retrieveImage(
        cameraId,
        greenhouseId,
        pagination.limit,
        (pagination.page - 1) * pagination.limit,
        pagination.year,
        pagination.month
    )

    images.splice(0, images.length)
    images.push(...imgRes.data?.images)
    pagination.count = Math.ceil(imgRes.data?.count / pagination.limit)

    const detRes = await Promise.all(images.map(i => retrieveDetection(i.id)))
    detections.splice(0, detections.length)
    detections.push(...detRes.map(res => res.data?.detections).flat())
}

const onWsEventImage = (data) => {
    images.unshift(...data)
}

const onWsEventDetection = (data) => {
    detections.unshift(...data)
}

// ---hooks
onMounted(async () => {
    await onPaginate()
    wsEvents.push(wsAddEvent('image', onWsEventImage, 'Create'))
    wsEvents.push(wsAddEvent('detection', onWsEventDetection, 'Create'))
})

onBeforeUnmount(async () => { while(wsEvents.length > 0) wsDelEvent(wsEvents.shift()) })

//

</script>

<style lang="scss" scoped>

</style>
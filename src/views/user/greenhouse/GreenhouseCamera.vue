<template>
    <GreenhouseLayout>
        <v-container class="pa-5 py-7" fluid>
            <v-row justify="center" align-content="center">
                <v-img
                    src="https://res.cloudinary.com/dqgnetjlz/image/upload/f_auto,q_auto/v1749725689/bg-doa.png"
                    class="position-fixed top-0 h-100 w-75 w-sm-50 w-md-33 w-lg-25 opacity-50"
                ></v-img>
            </v-row>
            <v-row>
                <v-col>
                    <h3>Greenhouse Cameras</h3>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="text-end py-0">
                    <!-- For creating camera -->
                    <GreenhouseCameraDialog class="w-100 w-md-50" type="Create" @submit="onCreateCamera">
                        <template #activator="{ props: activatorProps }">
                            <v-btn class="bg-green" :="activatorProps" :loading="state.creatingCamera">
                                <v-icon class="mr-1">mdi-plus</v-icon>
                                <span v-if="$vuetify.display.smAndUp">New Camera</span>
                            </v-btn>
                        </template>
                    </GreenhouseCameraDialog>
                </v-col>
            </v-row>
            <v-row>
                <!-- Camera Lists -->
                <v-col v-for="camera in ghCameras" xs="12" sm="6" md="4" lg="3" xl="2">
                    <GreenhouseCameraCard
                        :key="camera.id"
                        :camera="camera"
                        @view="onViewCamera"
                        @edit="onEditCamera"
                        @delete="onDeleteCamera"
                    />
                </v-col>

                <!-- Fallback/emptystate when no camera -->
                <v-col v-if="ghCameras.length <= 0">
                    <v-empty-state icon="mdi-camera" text="You haven't created any camera yet." title="No camera yet"></v-empty-state>
                </v-col>
            </v-row>
        </v-container>
    </GreenhouseLayout>
</template>

<script setup>
import { useCameraStore } from "@/stores/camera.store";
import { useMcuStore } from "@/stores/mcu.store";
import { computed, defineAsyncComponent, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

const GreenhouseLayout = defineAsyncComponent(() => import("@/views/user/greenhouse/GreenhouseLayout.vue"));
const GreenhouseCameraCard = defineAsyncComponent(() => import("@/components/user/greenhouse/GreenhouseCameraCard.vue"));
const GreenhouseCameraDialog = defineAsyncComponent(() => import("@/components/user/greenhouse/GreenhouseCameraDialog.vue"));

// ---stores
const { cameras, createCamera, updateCamera, destroyCamera } = useCameraStore();

// ---composables
const route = useRoute();
const router = useRouter();

// ---getters
const greenhouseId = route.params.greenhouseId;
const ghCameras = computed(() => cameras.filter((c) => c.greenhouseId == greenhouseId));

// ---state
const state = reactive({
    creatingCamera: false,
    editingCameraId: null,
});

// ---events
const onCreateCamera = async (camera) => {
    state.creatingCamera = true;
    camera.greenhouseId = greenhouseId;

    await createCamera(camera).catch(console.error);

    state.creatingCamera = false;
};

const onViewCamera = async (cameraId) => {
    state.editingCameraId = cameraId;

    await router.push(`/user/greenhouse/${greenhouseId}/camera/${cameraId}/settings`);

    state.editingCameraId = null;
};

const onEditCamera = async (camera) => {
    state.editingCameraId = camera?.id;

    await updateCamera(camera).catch(console.error);

    state.editingCameraId = null;
};

const onDeleteCamera = async (cameraId) => {
    state.editingCameraId = cameraId;

    await destroyCamera(cameraId).catch(console.error);

    state.editingCameraId = null;
};
</script>

<style lang="scss" scoped></style>

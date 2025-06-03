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
                    <h3>Camera Settings</h3>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <CameraDetailsCard 
                        :camera="camera"
                        :loading="state.updating"
                        :disabled="state.updating"
                        @change="onUpdateCamera"
                    />
                </v-col>
            </v-row>
        </v-container>
    </CameraLayout>
</template>

<script setup>
import { useCameraStore } from '@/stores/camera.store';
import { computed, defineAsyncComponent, reactive } from 'vue';
import { useRoute } from 'vue-router';

const CameraLayout = defineAsyncComponent(() => import("@/views/user/greenhouse/camera/CameraLayout.vue"))
const CameraDetailsCard = defineAsyncComponent(() => import("@/components/user/greenhouse/camera/CameraDetailsCard.vue"))


// ---stores
const { cameras, retrieveCamera, updateCamera } = useCameraStore()

// ---composables
const route = useRoute()

// ---data
const cameraId = route.params.cameraId

// ---getters
const camera = computed(() => cameras.find(m => m.id == cameraId))

// ---state
const state = reactive({ updating: false })

// ---events
const onUpdateCamera = async (camera) => {
    state.updating = true

    await updateCamera(camera)
        .catch(console.error)

    state.updating = false
}

//

</script>

<style lang="scss" scoped>

</style>
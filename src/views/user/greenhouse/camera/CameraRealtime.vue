<template>
    <CameraLayout>
        <v-container class="pa-5 py-7" fluid>
            <v-row>
                <v-col>
                    <h3>Camera Realtime</h3>
                </v-col>
            </v-row>
            <v-row>

                <v-col>
                    
                </v-col>

            </v-row>
        </v-container>
    </CameraLayout>
</template>

<script setup>
import { useCameraStore } from '@/stores/camera.store';
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const CameraLayout = defineAsyncComponent(() => import("@/views/user/greenhouse/camera/CameraLayout.vue"))


// ---stores
const { cameras, updateCamera } = useCameraStore()

// ---composables
const route = useRoute()

// ---data
const cameraId = route.params.cameraId

// ---getters
const camera = computed(() => cameras.find(c => c.id == cameraId))

// ---hooks
onMounted(async () => await updateCamera({ ...camera.value, interval: 0, detect: false }).catch(console.error))
onBeforeUnmount(async () => await updateCamera({ ...camera.value }).catch(console.error))


</script>

<style lang="scss" scoped>

</style>
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
                    <h3>Camera Dashboard</h3>
                </v-col>
            </v-row>
            <v-row>

                <v-col cols="12">
                    
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
const { cameras } = useCameraStore()

// ---composables
const route = useRoute()

// ---data
const cameraId = route.params.cameraId

// ---getters
const camera = computed(() => cameras.find(c => c.id == cameraId))

//

</script>

<style lang="scss" scoped>

</style>
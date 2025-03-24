<template>
    <McuLayout>
        <v-container class="pa-5 py-7" fluid>
            <v-row>
                <v-col>
                    <h3>Microcontroller Sensors</h3>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="text-end py-0">

                    <!-- For creating sensor -->
                    <McuSensorDialog 
                        class="w-100 w-md-50" 
                        type="Create" 
                        @submit="onCreateSensor"
                    >
                        <template #activator="{ props: activatorProps }">
                            <v-btn :="activatorProps">
                                <v-icon class="mr-1">mdi-plus</v-icon>
                                <span v-if="$vuetify.display.smAndUp">New Sensor</span>
                            </v-btn>
                        </template>
                    </McuSensorDialog>

                </v-col>
            </v-row>
            <v-row>
                
                <!-- Sensor Lists -->
                <v-col v-for="sensor in sensors" sm="12" md="6" lg="4" xl="3" xxl="2">
                    <McuSensorCard
                        :key="sensor?.id"
                        :pins="mcuPins"
                        :sensor="sensor"
                        :outputs="outputs.filter(o => o?.sensorId == sensor?.id)"
                        :loading="state.loadingSensorId == sensor?.id"
                        :disabled="state.loadingSensorId == sensor?.id"
                        @edit-sensor="onEditSensor"
                        @delete-sensor="onDeleteSensor"
                        @create-output="onCreateOutput"
                        @edit-output="onEditOutput"
                        @delete-output="onDeleteOutput"
                    />
                </v-col>

                <!-- Fallback/emptystate when no sensor -->
                <v-col v-if="!sensors.length">
                    <v-empty-state
                        icon="mdi-thermometer"
                        text="You haven't created any sensor yet."
                        title="No sensor yet"
                    ></v-empty-state>
                </v-col>

            </v-row>
        </v-container>
    </McuLayout>
</template>

<script setup>
import { useMcuStore } from '@/stores/mcu.store';
import { useSensorStore } from '@/stores/sensor.store';
import { computed, defineAsyncComponent, reactive } from 'vue';
import { useRoute } from 'vue-router';

const McuLayout = defineAsyncComponent(() => import("@/views/user/greenhouse/mcu/McuLayout.vue"))
const McuSensorCard = defineAsyncComponent(() => import("@/components/user/greenhouse/mcu/McuSensorCard.vue"))
const McuSensorDialog = defineAsyncComponent(() => import("@/components/user/greenhouse/mcu/McuSensorDialog.vue"))



// ---stores
const { pins } = useMcuStore()
const {
    sensors,
    outputs,
    createSensor,
    updateSensor,
    destroySensor,
    createOutput,
    updateOutput,
    destroyOutput,
} = useSensorStore()

// ---composables
const route = useRoute()

// ---data
const mcuId = route.params.mcuId
const mcuPins = computed(() => pins.filter(p => p.mcuId == mcuId))

// ---state
const state = reactive({
    loadingSensorId: null,
})

// ---events
const onCreateSensor = async (sensor) => {
    state.loadingSensorId = sensor?.id

    sensor.mcuId = mcuId
    await createSensor(sensor)
        .catch(console.error)
    
    state.loadingSensorId = null
}

const onEditSensor = async (sensor) => {
    state.loadingSensorId = sensor?.id

    await updateSensor(sensor)
        .catch(console.error)

    state.loadingSensorId = null
}

const onDeleteSensor = async (sensorId) => {
    state.loadingSensorId = sensorId

    await destroySensor(sensorId)
        .catch(console.error)

    state.loadingSensorId = null
}

const onCreateOutput = async (output) => {
    state.loadingSensorId = output?.sensorId

    await createOutput(output)
        .catch(console.error)

    state.loadingSensorId = null
}

const onEditOutput = async (output) => {
    state.loadingSensorId = output?.sensorId

    await updateOutput(output)
        .catch(console.error)

    state.loadingSensorId = null
}

const onDeleteOutput = async (outputId, sensorId) => {
    state.loadingSensorId = sensorId

    await destroyOutput(outputId)
        .catch(console.error)
    
    state.loadingSensorId = null
}

</script>

<style lang="scss" scoped>

</style>
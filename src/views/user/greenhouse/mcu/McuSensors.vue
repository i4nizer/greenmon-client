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
                            <v-btn :="activatorProps" :loading="state.creatingSensor">
                                <v-icon class="mr-1">mdi-plus</v-icon>
                                <span v-if="$vuetify.display.smAndUp">New Sensor</span>
                            </v-btn>
                        </template>
                    </McuSensorDialog>

                </v-col>
            </v-row>
            <v-row>
                
                <!-- Sensor Lists -->
                <v-col v-for="sensor in sensorsWithOutputs" sm="12" md="6" lg="4" xl="3" xxl="2">
                    <McuSensorCard
                        :key="sensor?.id"
                        :pins="getFreeSensorOutputPins(mcuFreePins, sensor.outputs)"
                        :sensor="sensor"
                        :outputs="sensor.outputs"
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
import { useActuatorStore } from '@/stores/actuator.store';
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
const { inputs } = useActuatorStore()

// ---composables
const route = useRoute()

// ---data
const mcuId = route.params.mcuId

// ---getters
const mcuFreePins = computed(() => {
    const mcuOutputPins = pins.filter(p => p.mcuId == mcuId && (p.mode == 'Unset' || p.mode == 'Output'))
    for (const inp of inputs) { 
        const pindex = mcuOutputPins.findIndex(p => p.id == inp.pinId)
        if (pindex != -1) mcuOutputPins.splice(pindex, 1) // remove pins used by inputs
    }
    return mcuOutputPins;
})
const sensorsWithOutputs = computed(() => {
    const swo = []
    sensors.forEach(s => swo.push({ ...s, outputs: outputs.filter(o => o.sensorId == s.id)}))
    return swo;
})

// ---state
const state = reactive({
    creatingSensor: false,
    loadingSensorId: null,
})

// ---actions
const getFreeSensorOutputPins = (pins, outputs) => {
    const freePins = []
    for (const pin of pins) {

        if (pin.mode == 'Unset') {
            freePins.push(pin)
            continue
        }

        if (pin.mode == 'Output' && outputs.some(o => o.pinId == pin.id)) {
            freePins.push(pin)
            continue
        }
    }
    return freePins;
}

// ---events
const onCreateSensor = async (sensor) => {
    state.creatingSensor = true

    sensor.mcuId = mcuId
    await createSensor(sensor)
        .catch(console.error)
    
    state.creatingSensor = false
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
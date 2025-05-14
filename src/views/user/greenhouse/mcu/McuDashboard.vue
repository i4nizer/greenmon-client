<template>
    <McuLayout>
        <v-container class="pa-5 py-7" fluid>
            <v-row>
                <v-col>
                    <h3>Microcontroller Dashboard</h3>
                </v-col>
            </v-row>
            <v-row>

                <!-- Sensor Reading Cards -->
                <v-col v-for="mswo in mcuSensorsWithOutputs" :key="mswo?.id" sm="12" md="6" lg="4">
                    <SensorOutputReadingCard
                        class="border"
                        :key="mswo?.id"
                        :sensor="mswo"
                        :outputs="mswo?.outputs"
                    ></SensorOutputReadingCard>
                </v-col>

                <!-- Actuator Input Cards -->
                <v-col v-for="mawi in mcuActuatorsWithInputs" :key="mawi?.id" sm="12" md="6" lg="4">
                    <ActuatorInputControlCard
                        class="border"
                        :key="mawi?.id"
                        :inputs="mawi?.inputs"
                        :loading="state.loadingActuatorId == mawi?.id"
                        :actuator="mawi"
                    ></ActuatorInputControlCard>
                </v-col>

            </v-row>
        </v-container>
    </McuLayout>
</template>

<script setup>
import { useActuatorStore } from '@/stores/actuator.store';
import { useSensorStore } from '@/stores/sensor.store';
import { computed, defineAsyncComponent, reactive } from 'vue';
import { useRoute } from 'vue-router';

const McuLayout = defineAsyncComponent(() => import("@/views/user/greenhouse/mcu/McuLayout.vue"))
const SensorOutputReadingCard = defineAsyncComponent(() => import("@/components/user/greenhouse/mcu/SensorOutputReadingCard.vue"))
const ActuatorInputControlCard = defineAsyncComponent(() => import("@/components/user/greenhouse/mcu/ActuatorInputControlCard.vue"))


// ---stores
const { sensors, outputs } = useSensorStore()
const { actuators, inputs } = useActuatorStore()

// ---composables
const route = useRoute()

// ---getters
const mcuId = route.params.mcuId
const mcuSensorsWithOutputs = computed(() => 
    sensors
        .filter(s => s.mcuId == mcuId)
        .map(s => ({ ...s, outputs: outputs.filter(o => o.sensorId == s.id) }))
)
const mcuActuatorsWithInputs = computed(() =>
    actuators
        .filter(a => a.mcuId == mcuId)
        .map(a => ({ ...a, inputs: inputs.filter(i => i.actuatorId == a.id) }))
)

// ---state
const state = reactive({
    loadingActuatorId: null,
})


// ---events


</script>

<style lang="scss" scoped>

</style>
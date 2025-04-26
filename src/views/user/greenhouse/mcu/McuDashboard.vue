<template>
    <McuLayout>
        <v-container class="pa-5 py-7" fluid>
            <v-row>
                <v-col>Microcontroller Dashboard</v-col>
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

            </v-row>
        </v-container>
    </McuLayout>
</template>

<script setup>
import { useSensorStore } from '@/stores/sensor.store';
import { computed, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';

const McuLayout = defineAsyncComponent(() => import("@/views/user/greenhouse/mcu/McuLayout.vue"))
const SensorOutputReadingCard = defineAsyncComponent(() => import("@/components/user/greenhouse/mcu/SensorOutputReadingCard.vue"))


// ---stores
const { sensors, outputs } = useSensorStore()

// ---composables
const route = useRoute()

// ---getters
const mcuId = route.params.mcuId
const mcuSensorsWithOutputs = computed(() => {
    const mswo = []
    sensors
        .filter(s => s.mcuId == mcuId)
        .forEach(s => mswo.push({
            ...s,
            outputs: outputs.filter(o => o.sensorId == s.id)
        }))
    return mswo
})


</script>

<style lang="scss" scoped>

</style>
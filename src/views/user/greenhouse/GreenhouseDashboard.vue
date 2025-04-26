<template>
    <GreenhouseLayout>
        <v-container class="pa-5 py-7" fluid>
            <v-row>
                <v-col>
                    Dashboard
                </v-col>
            </v-row>
            <v-row>

                <!-- Sensor Reading Cards -->
                <v-col v-for="gmswo in greenhouseMcusSensorsWithOutputs" :key="gmswo?.id" sm="12" md="6" lg="4">
                    <SensorOutputReadingCard
                        class="border"
                        :key="gmswo?.id"
                        :sensor="gmswo"
                        :outputs="gmswo?.outputs"
                    ></SensorOutputReadingCard>
                </v-col>

            </v-row>
        </v-container>
    </GreenhouseLayout>
</template>

<script setup>
import { useMcuStore } from '@/stores/mcu.store';
import { useSensorStore } from '@/stores/sensor.store';
import { computed, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';

const GreenhouseLayout = defineAsyncComponent(() => import("@/views/user/greenhouse/GreenhouseLayout.vue"))
const SensorOutputReadingCard = defineAsyncComponent(() => import("@/components/user/greenhouse/mcu/SensorOutputReadingCard.vue"))


// ---stores
const { mcus } = useMcuStore()
const { sensors, outputs } = useSensorStore()

// ---composables
const route = useRoute()

// ---getters
const greenhouseId = route.params.greenhouseId
const greenhouseMcusSensorsWithOutputs = computed(() => {
    const gm = mcus.filter(m => m.greenhouseId == greenhouseId)
    return sensors
        .filter(s => gm.some(m => m.id == s.mcuId))
        .map(s => ({ ...s, outputs: outputs.filter(o => o.sensorId == s.id) }))
})


</script>

<style lang="scss" scoped>

</style>
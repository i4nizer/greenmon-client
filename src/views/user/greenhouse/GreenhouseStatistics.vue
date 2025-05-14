<template>
    <GreenhouseLayout>
        <v-container class="pa-5 py-7" fluid>
            <v-row>
                <v-col>
                    <h3>Statistics</h3>
                </v-col>
            </v-row>
            <v-row>
                
                <!-- Line Chart of All Reading -->
                <v-col v-for="gmswo in ghMcusSensorsWithOutputs" cols="12" :key="gmswo?.key">
                    <GreenhouseSensorReadingChart
                        :key="gmswo?.key"
                        :sensor="gmswo"
                        :outputs="gmswo?.outputs"
                    ></GreenhouseSensorReadingChart>
                </v-col>

                <!-- Fallback/emptystate when no readings/charts -->
                <v-col v-if="ghMcusSensorsWithOutputs?.length <= 0">
                    <v-empty-state
                        icon="mdi-chart-line"
                        text="There aren't any generated readings yet."
                        title="No statistics yet"
                    ></v-empty-state>
                </v-col>

            </v-row>
        </v-container>
    </GreenhouseLayout>
</template>

<script setup>
import { useGreenhouseStore } from '@/stores/greenhouse.store';
import { useMcuStore } from '@/stores/mcu.store';
import { useSensorStore } from '@/stores/sensor.store';
import { computed, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';

const GreenhouseLayout = defineAsyncComponent(() => import("@/views/user/greenhouse/GreenhouseLayout.vue"))
const GreenhouseSensorReadingChart = defineAsyncComponent(() => import("@/components/user/greenhouse/GreenhouseSensorReadingChart.vue"))


// ---store
const { greenhouses } = useGreenhouseStore()
const { mcus } = useMcuStore()
const { sensors, outputs } = useSensorStore()

// ---composables
const route = useRoute()

// ---getters
const greenhouse = computed(() => greenhouses.find(g => g.id == route.params?.greenhouseId))
const ghMcus = computed(() => mcus.filter(m => m.greenhouseId == greenhouse.value.id))
const ghMcusSensors = computed(() => sensors.filter(s => ghMcus.value.some(m => m.id == s.mcuId)))
const ghMcusSensorsWithOutputs = computed(() =>
    ghMcusSensors.value.map(s => ({
        ...s,
        outputs: outputs.filter(o => o.sensorId == s.id),
    }))
)


</script>

<style lang="scss" scoped>

</style>
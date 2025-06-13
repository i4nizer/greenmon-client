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
                    <h3>Greenhouse Dashboard</h3>
                </v-col>
            </v-row>
            <v-row>
                <!-- The Lettuce NPK Detection Chart -->
                <v-col cols="12" sm="12" md="6" lg="8" xl="6" xxl="4">
                    <GreenhouseCapturePieChart
                        class="border"
                        :greenhouse="greenhouse"
                    ></GreenhouseCapturePieChart>
                </v-col>

                <!-- Sensor Reading Cards -->
                <v-col v-for="gmswo in greenhouseMcusSensorsWithOutputs" :key="gmswo?.id" sm="12" md="6" lg="4" xl="3" xxl="2">
                    <SensorOutputReadingCard
                        class="border"
                        :key="gmswo?.id"
                        :sensor="gmswo"
                        :outputs="gmswo?.outputs"
                    ></SensorOutputReadingCard>
                </v-col>

                <!-- Actuator Input Cards -->
                <v-col v-for="gmawi in greenhouseMcusActuatorsWithInputs" :key="gmawi?.id" sm="12" md="6" lg="4" xl="3" xxl="2">
                    <ActuatorInputControlCard
                        class="border"
                        :key="gmawi?.id"
                        :inputs="gmawi?.inputs"
                        :loading="state.loadingActuatorId == gmawi?.id"
                        :actuator="gmawi"
                    ></ActuatorInputControlCard>
                </v-col>
            </v-row>
            <v-row>
                <!-- Greenhouse Alerts -->
                <v-col cols="12" lg="6">
                    <GreenhouseAlertCard class="border" :limit="10" :greenhouse="greenhouse"></GreenhouseAlertCard>
                </v-col>

                <!-- Greenhouse Log Card -->
                <v-col cols="12" lg="6">
                    <GreenhouseLogCard class="border" :limit="10" :greenhouse="greenhouse"></GreenhouseLogCard>
                </v-col>
            </v-row>
        </v-container>
    </GreenhouseLayout>
</template>

<script setup>
import { useActuatorStore } from "@/stores/actuator.store";
import { useGreenhouseStore } from "@/stores/greenhouse.store";
import { useMcuStore } from "@/stores/mcu.store";
import { useSensorStore } from "@/stores/sensor.store";
import { reactive, computed, defineAsyncComponent } from "vue";
import { useRoute } from "vue-router";

const GreenhouseLayout = defineAsyncComponent(() => import("@/views/user/greenhouse/GreenhouseLayout.vue"));
const GreenhouseLogCard = defineAsyncComponent(() => import("@/components/user/greenhouse/GreenhouseLogCard.vue"));
const GreenhouseAlertCard = defineAsyncComponent(() => import("@/components/user/greenhouse/GreenhouseAlertCard.vue"));
const SensorOutputReadingCard = defineAsyncComponent(() => import("@/components/user/greenhouse/mcu/SensorOutputReadingCard.vue"));
const ActuatorInputControlCard = defineAsyncComponent(() => import("@/components/user/greenhouse/mcu/ActuatorInputControlCard.vue"));
const GreenhouseCapturePieChart = defineAsyncComponent(() => import("@/components/user/greenhouse/GreenhouseCapturePieChart.vue"))

// ---stores
const { mcus } = useMcuStore();
const { sensors, outputs } = useSensorStore();
const { actuators, inputs } = useActuatorStore();
const { greenhouses } = useGreenhouseStore();

// ---composables
const route = useRoute();

// ---getters
const greenhouseId = route.params.greenhouseId;
const greenhouse = computed(() => greenhouses.find((g) => g.id == greenhouseId));
const greenhouseMcus = computed(() => mcus.filter((m) => m.greenhouseId == greenhouseId));
const greenhouseMcusSensorsWithOutputs = computed(() =>
    sensors
        .filter((s) => greenhouseMcus.value.some((m) => m.id == s.mcuId))
        .map((s) => ({ ...s, outputs: outputs.filter((o) => o.sensorId == s.id) }))
);
const greenhouseMcusActuatorsWithInputs = computed(() =>
    actuators
        .filter((a) => greenhouseMcus.value.some((m) => m.id == a.mcuId))
        .map((a) => ({ ...a, inputs: inputs.filter((i) => i.actuatorId == a.id) }))
);

// ---state
const state = reactive({
    loadingActuatorId: null,
});

//

</script>

<style lang="scss" scoped></style>

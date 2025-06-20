<template>
    <McuLayout>
        <v-container class="pa-5 py-7" fluid>
            <v-row justify="center" align-content="center">
                <v-img
                    src="https://res.cloudinary.com/dqgnetjlz/image/upload/f_auto,q_auto/v1749725689/bg-doa.png"
                    class="position-fixed top-0 h-100 w-75 w-sm-50 w-md-33 w-lg-25 opacity-50"
                ></v-img>
            </v-row>
            <v-row>
                <v-col>
                    <h3>Microcontroller Actuators</h3>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="text-end py-0">
                    <!-- For creating actuator -->
                    <McuActuatorDialog class="w-100 w-md-50" type="Create" @submit="onCreateActuator">
                        <template #activator="{ props: activatorProps }">
                            <v-btn color="green" :="activatorProps">
                                <v-icon class="mr-1">mdi-plus</v-icon>
                                <span v-if="$vuetify.display.smAndUp">New Actuator</span>
                            </v-btn>
                        </template>
                    </McuActuatorDialog>
                </v-col>
            </v-row>
            <v-row>
                <!-- Actuator Lists -->
                <v-col v-for="actuator in actuatorsWithInputs" sm="12" lg="6" xxl="4">
                    <McuActuatorCard
                        :key="actuator.id"
                        :pins="getFreeActuatorInputPins(mcuFreePins, actuator.inputs)"
                        :inputs="actuator.inputs"
                        :actuator="actuator"
                        :loading="state.loadingActuatorId == actuator.id"
                        :disabled="state.loadingActuatorId == actuator.id"
                        @edit-actuator="onEditActuator"
                        @delete-actuator="onDeleteActuator"
                        @create-input="onCreateInput"
                        @edit-input="onEditInput"
                        @delete-input="onDeleteInput"
                    />
                </v-col>

                <!-- Fallback/emptystate when no actuator -->
                <v-col v-if="!actuatorsWithInputs.length">
                    <v-empty-state icon="mdi-fan" text="You haven't created any actuator yet." title="No actuator yet"></v-empty-state>
                </v-col>
            </v-row>
        </v-container>
    </McuLayout>
</template>

<script setup>
import { useActuatorStore } from "@/stores/actuator.store";
import { useMcuStore } from "@/stores/mcu.store";
import { useSensorStore } from "@/stores/sensor.store";
import { computed, defineAsyncComponent, reactive } from "vue";
import { useRoute } from "vue-router";

const McuLayout = defineAsyncComponent(() => import("@/views/user/greenhouse/mcu/McuLayout.vue"));
const McuActuatorCard = defineAsyncComponent(() => import("@/components/user/greenhouse/mcu/McuActuatorCard.vue"));
const McuActuatorDialog = defineAsyncComponent(() => import("@/components/user/greenhouse/mcu/McuActuatorDialog.vue"));

// ---stores
const { pins } = useMcuStore();
const { actuators, inputs, createActuator, updateActuator, destroyActuator, createInput, updateInput, destroyInput } =
    useActuatorStore();
const { outputs } = useSensorStore();

// ---composables
const route = useRoute();

// ---getters
const mcuId = route.params.mcuId;
const mcuFreePins = computed(() => {
    const mcuInputPins = pins.filter((p) => p.mcuId == mcuId && (p.mode == "Unset" || p.mode == "Input"));
    for (const out of outputs) {
        const pindex = mcuInputPins.findIndex((p) => p.id == out.pinId);
        if (pindex != -1) mcuInputPins.splice(pindex, 1); // remove pins used by outputs
    }
    return mcuInputPins;
});
const actuatorsWithInputs = computed(() => {
    const awi = [];
    actuators
        .filter((a) => a.mcuId == mcuId)
        .forEach((a) =>
            awi.push({
                ...a,
                inputs: inputs.filter((i) => i.actuatorId == a.id),
            })
        );
    return awi;
});

// ---state
const state = reactive({
    creatingActuator: false,
    loadingActuatorId: null,
});

// ---actions
const getFreeActuatorInputPins = (pins, inputs) => {
    const freePins = [];
    for (const pin of pins) {
        if (pin.mode == "Unset") {
            freePins.push(pin);
            continue;
        }

        if (pin.mode == "Input" && inputs.some((i) => i.pinId == pin.id)) {
            freePins.push(pin);
            continue;
        }
    }
    return freePins;
};

// ---events
const onCreateActuator = async (actuator) => {
    state.creatingActuator = true;

    actuator.mcuId = mcuId;
    await createActuator(actuator).catch(console.error);

    state.creatingActuator = false;
};

const onEditActuator = async (actuator) => {
    state.loadingActuatorId = actuator.id;

    await updateActuator(actuator).catch(console.error);

    state.loadingActuatorId = null;
};

const onDeleteActuator = async (actuatorId) => {
    state.loadingActuatorId = actuatorId;

    await destroyActuator(actuatorId).catch(console.error);

    state.loadingActuatorId = null;
};

const onCreateInput = async (input) => {
    state.loadingActuatorId = input?.actuatorId;

    await createInput(input).catch(console.error);

    state.loadingActuatorId = null;
};

const onEditInput = async (input) => {
    state.loadingActuatorId = input.actuatorId;

    await updateInput(input).catch(console.error);

    state.loadingActuatorId = null;
};

const onDeleteInput = async (inputId, actuatorId) => {
    state.loadingActuatorId = actuatorId;

    await destroyInput(inputId).catch(console.error);

    state.loadingActuatorId = null;
};
</script>

<style lang="scss" scoped></style>

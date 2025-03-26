<template>
    <McuLayout>
        <v-container class="pa-5 py-7" fluid>
            <v-row>
                <v-col>
                    <h3>Microcontroller Actuators</h3>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="text-end py-0">

                    <!-- For creating actuator -->
                    <McuActuatorDialog
                        class="w-100 w-md-50" 
                        type="Create" 
                        @submit="onCreateActuator"
                    >
                        <template #activator="{ props: activatorProps }">
                            <v-btn :="activatorProps">
                                <v-icon class="mr-1">mdi-plus</v-icon>
                                <span v-if="$vuetify.display.smAndUp">New Actuator</span>
                            </v-btn>
                        </template>
                    </McuActuatorDialog>

                </v-col>
            </v-row>
            <v-row>

                <!-- Actuator Lists -->
                <v-col v-for="actuator in actuatorsWithInputs" sm="12" md="6" lg="4" xl="3" xxl="2">
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
const McuActuatorCard = defineAsyncComponent(() => import("@/components/user/greenhouse/mcu/McuActuatorCard.vue"))
const McuActuatorDialog = defineAsyncComponent(() => import("@/components/user/greenhouse/mcu/McuActuatorDialog.vue"))


// ---stores
const { pins } = useMcuStore()
const {
    actuators,
    inputs,
    createActuator,
    updateActuator,
    destroyActuator,
    createInput,
    updateInput,
    destroyInput,
} = useActuatorStore()
const { outputs } = useSensorStore()

// ---composables
const route = useRoute()

// ---data
const mcuId = route.params.mcuId

// ---getters
const mcuFreePins = computed(() => {
    const mcuInputPins = pins.filter(p => p.mcuId == mcuId && (p.mode == 'Unset' || p.mode == 'Input'))
    for (const out of outputs) { 
        const pindex = mcuInputPins.findIndex(p => p.id == out.pinId)
        if (pindex != -1) mcuInputPins.splice(pindex, 1) // remove pins used by outputs
    }
    return mcuInputPins;
})
const actuatorsWithInputs = computed(() => {
    const awi = []
    actuators.forEach(a => awi.push({ ...a, inputs: inputs.filter(i => i.actuatorId == a.id)}))
    return awi;
})

// ---state
const state = reactive({
    creatingActuator: false,
    loadingActuatorId: null
})

// ---actions
const getFreeActuatorInputPins = (pins, inputs) => {
    const freePins = []
    for (const pin of pins) {

        if (pin.mode == 'Unset') {
            freePins.push(pin)
            continue
        }

        if (pin.mode == 'Input' && inputs.some(i => i.pinId == pin.id)) {
            freePins.push(pin)
            continue
        }
    }
    return freePins;
}

// ---events
const onCreateActuator = async (actuator) => {
    state.creatingActuator = true

    actuator.mcuId = mcuId
    await createActuator(actuator)
        .catch(console.error)

    state.creatingActuator = false
}

const onEditActuator = async (actuator) => {
    state.loadingActuatorId = actuator.id

    await updateActuator(actuator)
        .catch(console.error)

    state.loadingActuatorId = null
}

const onDeleteActuator = async (actuatorId) => {
    state.loadingActuatorId = actuatorId

    await destroyActuator(actuatorId)
        .catch(console.error)

    state.loadingActuatorId = null
}

const onCreateInput = async (input) => {
    state.loadingActuatorId = input?.actuatorId

    await createInput(input)
        .catch(console.error)

    state.loadingActuatorId = null
}

const onEditInput = async (input) => {
    state.loadingActuatorId = input.actuatorId

    await updateInput(input)
        .catch(console.error)

    state.loadingActuatorId = null
}

const onDeleteInput = async (inputId, actuatorId) => {
    state.loadingActuatorId = actuatorId

    await destroyInput(inputId)
        .catch(console.error)

    state.loadingActuatorId = null
}



</script>

<style lang="scss" scoped>

</style>
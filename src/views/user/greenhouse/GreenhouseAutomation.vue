<template>
    <GreenhouseLayout>
        <v-container class="pa-5 py-7" fluid>
            <v-row>
                <v-col>
                    <h3>Greenhouse Automation</h3>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="text-end py-0">

                    <!-- For creating thresholds -->
                    <GreenhouseThresholdDialog class="w-100 w-md-50" type="Create" @submit="onCreateThreshold">
                        <template #activator="{ props: activatorProps }">
                            <v-btn :="activatorProps" :loading="state.creatingThreshold">
                                <v-icon class="mr-1">mdi-plus</v-icon>
                                <span v-if="$vuetify.display.smAndUp">New Threshold</span>
                            </v-btn>
                        </template>
                    </GreenhouseThresholdDialog>

                </v-col>
            </v-row>
            <v-row>

                <!-- Threshold Lists -->
                <v-col v-for="threshold in thresholdsWithConditionsActions" lg="6" xxl="4">
                    <GreenhouseThresholdCard 
                        :key="threshold?.id"
                        :inputs="inputs"
                        :outputs="outputs"
                        :actions="threshold.actions"
                        :loading="state.loadingThresholdId == threshold?.id"
                        :disabled="state.loadingThresholdId == threshold?.id"
                        :threshold="threshold"
                        :conditions="threshold.conditions"
                        @edit-threshold="onEditThreshold"
                        @delete-threshold="onDeleteThreshold"
                        @create-condition="onCreateCondition"
                        @edit-condition="onEditCondition"
                        @delete-condition="onDeleteCondition"
                        @create-action="onCreateAction"
                        @edit-action="onEditAction"
                        @delete-action="onDeleteAction"
                    />
                </v-col>

            </v-row>
        </v-container>
    </GreenhouseLayout>
</template>

<script setup>
import { useActionStore } from '@/stores/action.store';
import { useActuatorStore } from '@/stores/actuator.store';
import { useSensorStore } from '@/stores/sensor.store';
import { useThresholdStore } from '@/stores/threshold.store';
import { computed, defineAsyncComponent, reactive } from 'vue';
import { useRoute } from 'vue-router';

const GreenhouseLayout = defineAsyncComponent(() => import("@/views/user/greenhouse/GreenhouseLayout.vue"))
const GreenhouseThresholdCard = defineAsyncComponent(() => import("@/components/user/greenhouse/GreenhouseThresholdCard.vue"))
const GreenhouseThresholdDialog = defineAsyncComponent(() => import("@/components/user/greenhouse/GreenhouseThresholdDialog.vue"))


// ---stores
const { inputs } = useActuatorStore()
const { outputs } = useSensorStore()
const {
    actions,
    createAction,
    updateAction,
    destroyAction,
} = useActionStore()
const {
    thresholds,
    conditions,
    createThreshold,
    updateThreshold,
    destroyThreshold,
    createCondition,
    updateCondition,
    destroyCondition,
} = useThresholdStore()

// ---composables
const route = useRoute()

// ---data
const greenhouseId = route.params.greenhouseId

// ---getters
const thresholdsWithConditionsActions = computed(() => {
    const twca = [];
    thresholds.forEach(t =>
        twca.push(
            {
                ...t,
                actions: actions.filter(a => a.thresholdId == t.id),
                conditions: conditions.filter(c => c.thresholdId == t.id)
            }))
    return twca;
})

// ---state
const state = reactive({
    creatingThreshold: false,
    loadingThresholdId: null,
})

// ---events
const onCreateThreshold = async (threshold) => {
    state.creatingThreshold = true
    
    threshold.greenhouseId = greenhouseId
    await createThreshold(threshold)
        .catch(console.error)

    state.creatingThreshold = false
}

const onEditThreshold = async (threshold) => {
    state.loadingThresholdId = threshold?.id

    await updateThreshold(threshold)
        .catch(console.error)

    state.loadingThresholdId = null
}

const onDeleteThreshold = async (thresholdId) => {
    state.loadingThresholdId = thresholdId

    await destroyThreshold(thresholdId)
        .catch(console.error)

    state.loadingThresholdId = null
}

const onCreateAction = async (action) => {
    state.loadingThresholdId = action?.thresholdId

    await createAction(action)
        .catch(console.error)

    state.loadingThresholdId = null
}

const onEditAction = async (action) => {
    state.loadingThresholdId = action?.thresholdId

    await updateAction(action)
        .catch(console.error)

    state.loadingThresholdId = null
}

const onDeleteAction = async (actionId, thresholdId) => {
    state.loadingThresholdId = thresholdId

    await destroyAction(actionId)
        .catch(console.error)

    state.loadingThresholdId = null
}

const onCreateCondition = async (condition) => {
    state.loadingThresholdId = condition?.thresholdId

    await createCondition(condition)
        .catch(console.error)

    state.loadingThresholdId = null
}

const onEditCondition = async (condition) => {
    state.loadingThresholdId = condition?.thresholdId

    await updateCondition(condition)
        .catch(console.error)

    state.loadingThresholdId = null
}

const onDeleteCondition = async (conditionId, thresholdId) => {
    state.loadingThresholdId = thresholdId

    await destroyCondition(conditionId)
        .catch(console.error)

    state.loadingThresholdId = null
}







</script>

<style lang="scss" scoped>

</style>
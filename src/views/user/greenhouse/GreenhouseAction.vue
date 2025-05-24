<template>
    <GreenhouseLayout>
        <v-container class="pa-5 py-7" fluid>
            <v-row justify="center" align-content="center">
                <v-img
                    src="@/assets/bg-doa.png"
                    class="position-fixed top-0 h-100 w-75 w-sm-50 w-md-33 w-lg-25 opacity-50"
                ></v-img>
            </v-row>
            <v-row>
                <v-col>
                    <h3>Greenhouse Actions</h3>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="text-end py-0">

                    <!-- For creating action -->
                    <GreenhouseActionDialog
                        type="Create" 
                        class="w-100 w-md-50"
                        :inputs="inputs"
                        :schedules="greenhouseSchedules"
                        :thresholds="greenhouseThresholds"
                        :referenced="'Greenhouse'"
                        @submit="onCreateAction"
                    >
                        <template #activator="{ props: activatorProps }">
                            <v-btn 
                                text="Add Action"
                                class="bg-green"
                                :="activatorProps" 
                                :loading="state.creatingAction"
                                :disabled="state.creatingAction"
                            >
                                <v-icon class="mr-1">mdi-plus</v-icon>
                                <span v-if="$vuetify.display.smAndUp">New Action</span>
                            </v-btn>
                        </template>
                    </GreenhouseActionDialog>

                </v-col>
            </v-row>
            <v-row>

                <!-- Microcontroller Lists -->
                <v-col v-for="action in greenhouseActionsWithInputs" md="12" lg="6" xl="4">
                    <GreenhouseActionCard
                        :id="`action-${action?.id}`"
                        :key="action?.id"
                        :input="action?.input"
                        :inputs="inputs"
                        :action="action"
                        :loading="state.loadingActionId == action?.id"
                        :schedules="greenhouseSchedules"
                        :thresholds="greenhouseThresholds"
                        :referenced="'Greenhouse'"
                        @edit="onUpdateAction"
                        @delete="onDeleteAction"
                    />
                </v-col>

                <!-- Fallback/emptystate when no mcu -->
                <v-col v-if="greenhouseActionsWithInputs?.length <= 0">
                    <v-empty-state
                        icon="mdi-rocket-launch"
                        text="You haven't created any action yet."
                        title="No action yet"
                    ></v-empty-state>
                </v-col>

            </v-row>
        </v-container>
    </GreenhouseLayout>
</template>

<script setup>
import { useActionStore } from '@/stores/action.store';
import { useActuatorStore } from '@/stores/actuator.store';
import { useScheduleStore } from '@/stores/schedule.store';
import { useThresholdStore } from '@/stores/threshold.store';
import { computed, defineAsyncComponent, reactive } from 'vue';
import { useRoute } from 'vue-router';

const GreenhouseLayout = defineAsyncComponent(() => import("@/views/user/greenhouse/GreenhouseLayout.vue"))
const GreenhouseActionCard = defineAsyncComponent(() => import("@/components/user/greenhouse/GreenhouseActionCard.vue"))
const GreenhouseActionDialog = defineAsyncComponent(() => import("@/components/user/greenhouse/GreenhouseActionDialog.vue"))


// ---stores
const { inputs } = useActuatorStore()
const { schedules } = useScheduleStore()
const { thresholds } = useThresholdStore()
const {
    actions,
    createAction,
    updateAction,
    destroyAction,
} = useActionStore()

// ---composables
const route = useRoute()

// ---getters
const greenhouseId = route.params.greenhouseId
const greenhouseSchedules = computed(() => schedules.filter(s => s?.greenhouseId == greenhouseId))
const greenhouseThresholds = computed(() => thresholds.filter(t => t?.greenhouseId == greenhouseId))
const greenhouseActionsWithInputs = computed(() => {
    const awi = []
    actions
        .filter(a => a.greenhouseId == greenhouseId)
        .forEach(a => awi.push({ ...a, input: inputs.find(i => i?.id == a?.inputId) || {} }))
    return awi
})

// ---state
const state = reactive({
    creatingAction: false,
    loadingActionId: null,
})


// ---events
const onCreateAction = async (action) => {
    state.creatingAction = true
    action.greenhouseId = greenhouseId

    await createAction(action)
        .catch(console.error)

    state.creatingAction = false
}

const onUpdateAction = async (action) => {
    state.loadingActionId = action?.id

    await updateAction(action)
        .catch(console.error)

    state.loadingActionId = null
}

const onDeleteAction = async (action) => {
    state.loadingActionId = action?.id

    await destroyAction(action)
        .catch(console.error)

    state.loadingActionId = null
}


</script>

<style lang="scss" scoped>

</style>
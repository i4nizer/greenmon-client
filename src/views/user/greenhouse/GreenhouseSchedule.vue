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
                    <h3>Greenhouse Schedule</h3>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="text-end py-0">
                    <!-- For creating schedule -->
                    <GreenhouseScheduleDialog class="w-100 w-md-50" type="Create" @submit="onCreateSchedule">
                        <template #activator="{ props: activatorProps }">
                            <v-btn 
                                class="bg-green"
                                :="activatorProps"
                            >
                                <v-icon class="mr-1">mdi-plus</v-icon>
                                <span v-if="$vuetify.display.smAndUp">New Schedule</span>
                            </v-btn>
                        </template>
                    </GreenhouseScheduleDialog>
                </v-col>
            </v-row>
            <v-row>
                <!-- Schedule Lists -->
                <v-col v-for="schedule in schedulesWithActions" lg="6" xxl="4">
                    <GreenhouseScheduleCard
                        :key="schedule?.id"
                        :inputs="inputs"
                        :actions="schedule.actions"
                        :schedule="schedule"
                        @edit-schedule="onEditSchedule"
                        @delete-schedule="onDeleteSchedule"
                        @create-action="onCreateAction"
                        @edit-action="onEditAction"
                        @delete-action="onDeleteAction"
                    />
                </v-col>

                <!-- Fallback/emptystate when no schedule -->
                <v-col v-if="!schedulesWithActions.length">
                    <v-empty-state
                        icon="mdi-calendar-clock"
                        text="You haven't created any schedule yet."
                        title="No schedule yet"
                    ></v-empty-state>
                </v-col>
            </v-row>
        </v-container>
    </GreenhouseLayout>
</template>

<script setup>
import { useActionStore } from "@/stores/action.store";
import { useActuatorStore } from "@/stores/actuator.store";
import { useScheduleStore } from "@/stores/schedule.store";
import { computed, defineAsyncComponent, reactive, watch } from "vue";
import { useRoute } from "vue-router";

const GreenhouseLayout = defineAsyncComponent(() => import("@/views/user/greenhouse/GreenhouseLayout.vue"));
const GreenhouseScheduleCard = defineAsyncComponent(() => import("@/components/user/greenhouse/GreenhouseScheduleCard.vue"));
const GreenhouseScheduleDialog = defineAsyncComponent(() => import("@/components/user/greenhouse/GreenhouseScheduleDialog.vue"));

// ---stores
const { schedules, createSchedule, updateSchedule, destroySchedule } = useScheduleStore();
const { actions, createAction, updateAction, destroyAction } = useActionStore();
const { inputs } = useActuatorStore();

// ---composables
const route = useRoute();

// ---data
const greenhouseId = route.params.greenhouseId;

// ---getters
const schedulesWithActions = computed(() => {
    const swa = [];
    schedules
        .filter((s) => s.greenhouseId == greenhouseId)
        .forEach((s) =>
            swa.push({
                ...s,
                actions: actions.filter((a) => a.scheduleId == s.id),
            })
        );
    return swa;
});

// ---watchers
watch(actions, (nv) => actions.sort((a, b) => b.priority - a.priority), { deep: true });

// ---state
const state = reactive({
    creatingSchedule: false,
    updatingSchedule: false,
    deletingSchedule: false,
    loadingScheduleId: null,
});

// ---events
const onCreateSchedule = async (schedule) => {
    state.creatingSchedule = true;

    schedule.greenhouseId = greenhouseId;
    await createSchedule(schedule).catch(console.error);

    state.creatingSchedule = false;
};

const onEditSchedule = async (schedule) => {
    state.updatingSchedule = true;

    await updateSchedule(schedule).catch(console.error);

    state.updatingSchedule = false;
};

const onDeleteSchedule = async (scheduleId) => {
    state.deletingSchedule = true;

    await destroySchedule(scheduleId).catch(console.error);

    state.deletingSchedule = false;
};

const onCreateAction = async (action) => {
    state.loadingScheduleId = action?.scheduleId;

    action.greenhouseId = greenhouseId;
    await createAction(action).catch(console.error);

    state.loadingScheduleId = null;
};

const onEditAction = async (action) => {
    state.loadingScheduleId = action?.scheduleId;

    await updateAction(action).catch(console.error);

    state.loadingScheduleId = null;
};

const onDeleteAction = async (actionId, scheduleId) => {
    state.loadingScheduleId = scheduleId;

    await destroyAction(actionId).catch(console.error);

    state.loadingScheduleId = null;
};
</script>

<style lang="scss" scoped></style>

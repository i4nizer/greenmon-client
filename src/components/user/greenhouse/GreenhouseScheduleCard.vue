<template>
    <v-card class="border pt-3">
        <v-card-title class="d-flex">
            <v-icon :color="schedule?.disabled ? 'red':'green'">mdi-calendar-clock</v-icon>
            <span class="ml-2" :class="schedule?.disabled ? 'text-red':'text-green'">{{ schedule?.name }}</span>
            <v-spacer></v-spacer>

            <GreenhouseScheduleDialog
                class="w-100 w-md-50"
                v-model="state.scheduleEditDialog"
                :type="'Update'"
                :inputs="inputs"
                :initial="schedule"
                @submit="(s) => emit('edit-schedule', s)"
            ></GreenhouseScheduleDialog>

            <v-menu open-on-hover>
                <template #activator="{ props: menuProps }">
                    <v-btn
                        icon="mdi-dots-vertical"
                        size="small"
                        color="white"
                        class="bg-transparent"
                        elevation="0"
                        :="menuProps"
                    ></v-btn>
                </template>
                <template #default>
                    <v-list>
                        <v-list-item 
                            link 
                            rounded 
                            title="Edit"
                            @click="state.scheduleEditDialog = true"
                        ></v-list-item>
                        <v-list-item 
                            link 
                            rounded 
                            title="Delete"
                            @click="emit('delete-schedule', schedule?.id)"
                        ></v-list-item>
                        <v-list-item 
                            link 
                            rounded 
                            :title="schedule?.disabled ? 'Enable':'Disable'"
                            @click="onToggleSchedule"
                        ></v-list-item>
                    </v-list>
                </template>
            </v-menu>
        </v-card-title>

        <v-card-subtitle class="text-wrap">
            <span>These actions will be triggered every </span>
            <span>[{{ schedule?.times.map(t => format(`1970-01-01 ${t}`, 'fullTime12h')).join(', ') }}] </span>
            <span>in these days [{{ schedule?.days.join(', ') }}] of the month.</span>
        </v-card-subtitle>

        <v-card-text>
            <v-list>
                <v-list-subheader class="d-flex justify-end">
                    <GreenhouseActionDialog
                        type="Create" 
                        class="w-100 w-md-50" 
                        :inputs="inputs"
                        :referenced="'Schedule'"
                        @submit="onCreateAction"
                    >
                        <template #activator="{ props: activatorProps }">
                            <v-btn 
                                text="Add Action"
                                color="green"
                                :="activatorProps" 
                            ></v-btn>
                        </template>
                    </GreenhouseActionDialog>
                </v-list-subheader>
                <v-list-item v-for="action in actionsWithInputs">
                    <GreenhouseActionCard
                        :key="action?.id"
                        :input="action.input"
                        :inputs="inputs"
                        :action="action"
                        :referenced="'Schedule'"
                        @edit="a => emit('edit-action', a)"
                        @delete="a => emit('delete-action', a, schedule?.id)"
                    />
                </v-list-item>
                <v-list-item v-if="!actionsWithInputs.length" class="text-center">
                    <span class="text-grey">No Actions Yet</span>
                </v-list-item>
            </v-list>
        </v-card-text>

    </v-card>
</template>

<script setup>
import { computed, defineAsyncComponent, reactive } from "vue";
import { useDate } from "vuetify";

const GreenhouseActionCard = defineAsyncComponent(() => import("@/components/user/greenhouse/GreenhouseActionCard.vue"))
const GreenhouseActionDialog = defineAsyncComponent(() => import("@/components/user/greenhouse/GreenhouseActionDialog.vue"))
const GreenhouseScheduleDialog = defineAsyncComponent(() => import("@/components/user/greenhouse/GreenhouseScheduleDialog.vue"))


// ---events
const emit = defineEmits([
    "edit-schedule",
    "delete-schedule",
    "create-action",
    "edit-action",
    "delete-action",
]);

// ---props
const props = defineProps({
    schedule: {
        type: Object,
        required: true,
    },
    actions: {
        type: Array,
        default: [],
    },
    inputs: {
        type: Array,
        default: [],
    }
});

// ---composables
const { format } = useDate()

// ---getters
const actionsWithInputs = computed(() => {
    const awi = []
    props.actions.forEach(a => awi.push({ ...a, input: props.inputs.find(i => i.id == a.inputId) }))
    return awi
})

// ---state
const state = reactive({
    scheduleEditDialog: false,
})

// ---events
const onToggleSchedule = () => {
    emit('edit-schedule', { ...props.schedule, disabled: !props.schedule?.disabled })
}

const onCreateAction = (action) => {
    action.scheduleId = props.schedule?.id
    emit('create-action', action)
}



</script>

<style lang="scss" scoped></style>

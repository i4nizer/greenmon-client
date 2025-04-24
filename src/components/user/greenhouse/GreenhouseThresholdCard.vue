<template>
    <v-card class="border pt-3">
        <v-card-title class="d-flex">
            <v-icon :color="threshold?.disabled ? 'red':'green'">mdi-arrow-decision-auto</v-icon>
            <span class="ml-2" :class="threshold?.disabled ? 'text-red':'text-green'">{{ threshold?.name }}</span>
            <v-spacer></v-spacer>

            <GreenhouseThresholdDialog
                class="w-100 w-md-50"
                v-model="state.thresholdEditDialog"
                :type="'Update'"
                :initial="threshold"
                @submit="(s) => emit('edit-threshold', s)"
            ></GreenhouseThresholdDialog>

            <v-menu open-on-hover>
                <template #activator="{ props: menuProps }">
                    <v-btn
                        icon="mdi-dots-vertical"
                        size="small"
                        color="white"
                        class="bg-transparent"
                        :="menuProps"
                    ></v-btn>
                </template>
                <template #default>
                    <v-list>
                        <v-list-item 
                            link 
                            rounded 
                            title="Edit"
                            @click="state.thresholdEditDialog = true"
                        ></v-list-item>
                        <v-list-item 
                            link 
                            rounded 
                            title="Delete"
                            @click="emit('delete-threshold', threshold?.id)"
                        ></v-list-item>
                        <v-list-item 
                            link 
                            rounded 
                            :title="threshold?.disabled ? 'Enable':'Disable'"
                            @click="onToggleSchedule"
                        ></v-list-item>
                    </v-list>
                </template>
            </v-menu>
        </v-card-title>

        <v-card-text>
            
            <!-- Condition Lists -->
            <v-list>
                <v-list-subheader class="d-flex justify-end">
                    <ThresholdConditionDialog
                        type="Create" 
                        class="w-100 w-md-50"
                        :outputs="outputs"
                        @submit="onCreateCondition"
                    >
                        <template #activator="{ props: activatorProps }">
                            <v-btn 
                                text="Add Condtion"
                                color="white"
                                :="activatorProps" 
                            ></v-btn>
                        </template>
                    </ThresholdConditionDialog>
                </v-list-subheader>
                <v-list-item v-for="condition in conditionsWithOutputs">
                    <ThresholdConditionCard 
                        :key="condition?.id"
                        :output="condition?.output"
                        :outputs="outputs"
                        :condition="condition"
                        @edit="c => emit('edit-condition', c)"
                        @delete="c => emit('delete-condition', c, threshold?.id)"
                    />
                </v-list-item>
                <v-list-item v-if="!conditions.length" class="text-center">
                    <span class="text-grey">No Condition Yet</span>
                </v-list-item>
            </v-list>

            <!-- Threshold Statement -->
            <v-card-subtitle class="text-center text-wrap">
                <span>If </span>
                <span class="font-weight-bold">{{ threshold?.operator?.toUpperCase() }}</span>
                <span> of these <span class="font-weight-bold">CONDITIONS</span> above are met then </span>
                <span>these <span class="font-weight-bold">ACTIONS</span> below will be triggered.</span>
            </v-card-subtitle>
            
            <!-- Action Lists -->
            <v-list>
                <v-list-subheader class="d-flex justify-end">
                    <GreenhouseActionDialog
                        type="Create" 
                        class="w-100 w-md-50"
                        :inputs="inputs"
                        :referenced="'Threshold'"
                        @submit="onCreateAction"
                    >
                        <template #activator="{ props: activatorProps }">
                            <v-btn 
                                text="Add Action"
                                color="white"
                                :="activatorProps" 
                            ></v-btn>
                        </template>
                    </GreenhouseActionDialog>
                </v-list-subheader>
                <v-list-item v-for="action in actionsWithInputs" class="text-center">
                    <GreenhouseActionCard
                        :key="action?.id"
                        :input="action?.input"
                        :inputs="inputs"
                        :action="action"
                        :referenced="'Threshold'"
                        @edit="a => emit('edit-action', a)"
                        @delete="a => emit('delete-action', a, threshold?.id)"
                    />
                </v-list-item>
                <v-list-item v-if="!actions.length" class="text-center">
                    <span class="text-grey">No Actions Yet</span>
                </v-list-item>
            </v-list>

        </v-card-text>

    </v-card>
</template>

<script setup>
import { computed, defineAsyncComponent, reactive } from "vue";

const GreenhouseActionCard = defineAsyncComponent(() => import("@/components/user/greenhouse/GreenhouseActionCard.vue"))
const GreenhouseActionDialog = defineAsyncComponent(() => import("@/components/user/greenhouse/GreenhouseActionDialog.vue"))
const ThresholdConditionCard = defineAsyncComponent(() => import("@/components/user/greenhouse/ThresholdConditionCard.vue"))
const ThresholdConditionDialog = defineAsyncComponent(() => import("@/components/user/greenhouse/ThresholdConditionDialog.vue"))
const GreenhouseThresholdDialog = defineAsyncComponent(() => import("@/components/user/greenhouse/GreenhouseThresholdDialog.vue"))


// ---events
const emit = defineEmits([
    "edit-threshold",
    "delete-threshold",
    "create-condition",
    "edit-condition",
    "delete-condition",
    "create-action",
    "edit-action",
    "delete-action",
]);

// ---props
const props = defineProps({
    threshold: {
        type: Object,
        required: true,
    },
    inputs: {
        type: Array,
        default: [],
    },
    actions: {
        type: Array,
        default: [],
    },
    outputs: {
        type: Array,
        default: [],
    },
    conditions: {
        type: Array,
        default: [],
    },
});

// ---getters
const actionsWithInputs = computed(() => {
    const awi = []
    props.actions.forEach(a => awi.push({ ...a, input: props.inputs.find(i => i.id == a.inputId) }))
    return awi
})
const conditionsWithOutputs = computed(() => {
    const cwo = []
    props.conditions.forEach(c => cwo.push({ ...c, output: props.outputs.find(o => o.id == c.outputId) }))
    return cwo
})

// ---state
const state = reactive({
    thresholdEditDialog: false,
})

// ---events
const onCreateAction = (action) => {
    action.thresholdId = props.threshold?.id
    emit('create-action', action)
}


const onToggleSchedule = () => {
    emit('edit-threshold', { ...props.threshold, disabled: !props.threshold?.disabled })
}

const onCreateCondition = (condition) => {
    condition.thresholdId = props.threshold?.id
    emit('create-condition', condition)
}




</script>

<style lang="scss" scoped></style>

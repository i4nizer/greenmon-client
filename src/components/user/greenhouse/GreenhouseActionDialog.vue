<template>
    <v-dialog>
        <template #activator="{ props: activatorProps }">
            <slot name="activator" :="{ props: activatorProps }"></slot>
        </template>
        <template #default="{ isActive }">
            <v-form class="bg-grey-darken-4 pa-7" v-model="state.valid" @submit.prevent="onSubmit">
                <h3>{{ `${type} Action` }}</h3>
                <span class="text-grey">Please provide the action details.</span>
                <v-select
                    label="Input"
                    class="mt-6"
                    v-model="action.inputId"
                    :rules="[required('Number')]"
                    :items="inputs"
                    :item-title="(i) => i?.name"
                    :item-value="(i) => i?.id"
                    :prepend-inner-icon="input?.icon"
                >
                    <template #item="{ props: listItemProps, item }">
                        <v-list-item :="listItemProps" :prepend-icon="item.raw.icon"></v-list-item>
                    </template>
                </v-select>
                <v-text-field label="Name" v-model="action.name" :rules="[required(), min(3), max(100)]"></v-text-field>
                <v-number-input
                    v-if="input?.type == 'Number'"
                    label="Input Value"
                    v-model="action.value"
                    :rules="[required('Number'), min(0)]"
                ></v-number-input>
                <v-select
                    v-if="input?.type == 'Boolean'"
                    label="Input Value"
                    v-model="action.value"
                    :items="['ON', 'OFF']"
                    :item-title="(i) => i"
                    :item-value="(i) => (i == 'ON' ? 1 : 0)"
                ></v-select>
                <v-number-input
                    label="Delay"
                    prefix="Seconds: "
                    v-model="action.delay"
                    :rules="[required('Number'), min(0)]"
                ></v-number-input>
                <v-number-input
                    label="Duration"
                    prefix="Seconds: "
                    v-model="action.duration"
                    :rules="[required('Number'), min(-1)]"
                ></v-number-input>
                <v-number-input label="Priority" v-model="action.priority" :rules="[required('Number'), min(0)]"></v-number-input>
                <v-select
                    v-if="referenced == 'Greenhouse'"
                    clearable
                    label="Schedule"
                    v-model="action.scheduleId"
                    :items="schedules"
                    :item-title="(s) => s?.name"
                    :item-value="(s) => s?.id"
                ></v-select>
                <v-select
                    v-if="referenced == 'Greenhouse'"
                    clearable
                    label="Threshold"
                    v-model="action.thresholdId"
                    :items="thresholds"
                    :item-title="(t) => t?.name"
                    :item-value="(t) => t?.id"
                ></v-select>
                <v-btn
                    type="submit"
                    class="mt-3"
                    :text="type"
                    :disabled="!state.valid || (props.type != 'Create' && !changed)"
                    @click="isActive.value = !isActive.value"
                ></v-btn>
            </v-form>
        </template>
    </v-dialog>
</template>

<script setup>
import { useRules } from "@/composables/rules.composable";
import { computed, reactive } from "vue";
import equal from "fast-deep-equal";

// ---events
const emit = defineEmits(["submit"]);

// ---props
const props = defineProps({
    type: {
        type: String,
        default: "Create",
    },
    inputs: {
        type: Array,
        default: [],
    },
    initial: {
        type: Object,
        default: {},
    },
    schedules: {
        type: Array,
        default: [],
    },
    thresholds: {
        type: Array,
        default: [],
    },
    referenced: {
        type: String,
        default: "Greenhouse",
    },
});

// ---composables
const { required, min, max } = useRules();

// ---data
const action = reactive({
    name: props.initial?.name,
    value: props.initial?.value || 1,
    delay: props.initial?.delay || 0,
    duration: props.initial?.duration || 30,
    priority: props.initial?.priority || 0,
    inputId: props.initial?.inputId,
    scheduleId: props.initial?.scheduleId,
    thresholdId: props.initial?.thresholdId,
});

// ---getters
const input = computed(() => props.inputs.find((i) => i.id == action.inputId));
const actionProps = computed(() => ({
    name: props.initial?.name,
    value: props.initial?.value,
    delay: props.initial?.delay,
    duration: props.initial?.duration,
    priority: props.initial?.priority,
    inputId: props.initial?.inputId,
    scheduleId: props.initial?.scheduleId,
    thresholdId: props.initial?.thresholdId,
}));
const changed = computed(() => !equal(action, actionProps.value));

// ---state
const state = reactive({ valid: false });

// ---events
const onSubmit = () => {
    const data = {
        ...props.initial,
        ...action,
    };

    emit("submit", data);

    if (props.type == "Create") {
        action.name = null;
        action.value = 0;
        action.delay = 0;
        action.duration = 30;
        action.priority = 0;
        action.inputId = null;
        action.scheduleId = null;
        action.thresholdId = null;
    }
};
</script>

<style lang="scss" scoped></style>

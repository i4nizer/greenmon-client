<template>
    <v-dialog>
        <template #activator="{ props: activatorProps }">
            <slot name="activator" :="{ props: activatorProps }"></slot>
        </template>
        <template #default="{ isActive }">
            <v-form class="bg-green-darken-4 pa-7" v-model="state.valid" @submit.prevent="onSubmit">
                <h3>{{ `${type} Hook` }}</h3>
                <span class="text-grey">Please provide the hook details.</span>
                <v-select
                    label="Type"
                    class="mt-6"
                    v-model="hook.type"
                    :items="['Before', 'During', 'After']"
                    :rules="[required()]"
                ></v-select>
                <v-select
                    label="Action"
                    v-model="hook.actionId"
                    :items="actions"
                    :item-title="a => `${a?.name} (${a?.value})`"
                    :item-value="a => a.id"
                    :rules="[required('Number')]"
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
    sensor: {
        type: Object,
        required: true,
    },
    actions: {
        type: Array,
        default: [],
    },
    initial: {
        type: Object,
        default: {},
    },
});

// ---composables
const { required, min, max } = useRules();

// ---data
const hook = reactive({
    type: props.initial?.type || 'Before',
    sensorId: props.sensor?.id,
    actionId: props.initial?.actionId,
});

// ---getters
const hookProps = computed(() => ({
    type: props.initial?.type,
    sensorId: props.sensor?.id,
    actionId: props.initial?.actionId,
}));
const changed = computed(() => !equal(hook, hookProps.value));

// ---state
const state = reactive({ valid: false });

// ---events
const onSubmit = () => {
    const data = {
        ...props.initial,
        ...hook,
    };

    emit("submit", data);

    if (props.type == "Create") {
        hook.type = 'Before';
        hook.sensorId = null;
        hook.actionId = null;
    }
};
</script>

<style lang="scss" scoped></style>

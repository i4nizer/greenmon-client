<template>
    <v-card :loading="state.loading" :disabled="state.loading">
        <v-card-title class="d-flex align-center text-wrap">
            <v-icon size="48" class="me-8">{{ input?.icon }}</v-icon>
            <span class="text-h6 font-weight-black text-wrap">{{ input?.name }}</span>
            <v-spacer></v-spacer>
            <span class="text-subtitle-2 text-grey">{{ state.inputting ? "(Applying Input)" : "" }}</span>
        </v-card-title>
        <v-card-text class="d-flex align-center justify-space-between px-5">
            <span v-if="input?.type == 'Boolean'" class="w-50">Status: {{ !!input.status ? "ON" : "OFF" }}</span>
            <span v-if="input?.type == 'Number'" class="w-50">Status: {{ input.status }}</span>

            <!-- Boolean Input = ON/OFF -->
            <v-switch
                v-if="input?.type == 'Boolean'"
                inset
                hide-details
                class="w-50"
                density="compact"
                v-model="input.flag"
                :label="$vuetify.display.mdAndDown ? '' : input?.flag ? '&nbsp;&nbsp;TURN OFF' : '&nbsp;&nbsp;TURN ON'"
                :loading="state.loading"
                :model-value="!!input.flag"
                @update:model-value="(v) => onChange(Number(v))"
            ></v-switch>

            <!-- Numerical Input -->
            <v-number-input
                v-if="input?.type == 'Number'"
                hide-details
                class="w-50"
                label="Input"
                v-model="input.flag"
                :rules="[min(0)]"
                :loading="state.loading"
                @update:model-value="onChange"
            ></v-number-input>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { useRules } from "@/composables/rules.composable";
import { useActuatorStore } from "@/stores/actuator.store";
import { wsAddEvent, wsDelEvent } from "@/utils/ws.util";
import { onBeforeMount, onBeforeUnmount, reactive, watch } from "vue";

//

// ---props
const props = defineProps({
    input: {
        type: Object,
        required: true,
    },
});

// ---stores
const { updateInput } = useActuatorStore();

// ---composables
const { min } = useRules();

// ---data
const wsEvents = reactive([]);
const input = reactive({
    icon: props.input?.icon,
    name: props.input?.name,
    type: props.input?.type,
    flag: props.input?.flag,
    status: props.input?.status,
    pinId: props.input?.pinId,
    actuatorId: props.input?.actuatorId,
});

// ---states
const state = reactive({
    loading: false,
    inputting: input.flag != input.status,
});

// ---watchers
watch(input, (nv) => (state.inputting = nv.status != nv.flag));

// ---events
const onChange = async (value) => {
    input.flag = Number(value);
    if (value <= -1) return;
    const data = { ...props.input, ...input, flag: Number(value) };

    state.loading = true;
    await updateInput(data).catch(console.error);
    state.loading = false;
};

const onWsInput = (data) => {
    for (const d of data) {
        if (d?.id != props.input?.id) continue;

        input.icon = d.icon;
        input.name = d.name;
        input.type = d.type;
        input.flag = d.flag;
        input.status = d.status;
        input.pinId = d.pinId;
        input.actuatorId = d.actuatorId;
    }
};

// ---hooks
onBeforeMount(() => wsEvents.push(wsAddEvent("input", onWsInput, "Update")) );
onBeforeUnmount(() => { while (wsEvents.length > 0) wsDelEvent(wsEvents.shift()) });

//

</script>

<style scoped></style>

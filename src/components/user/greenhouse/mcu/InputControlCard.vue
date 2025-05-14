<template>
    <v-card 
        class="bg-grey-darken-3"
        :loading="state.loading"
        :disabled="state.loading"
    >
        <v-card-title class="d-flex align-center">
            <v-icon size="48" class="me-8">{{ input?.icon }}</v-icon>
            <span class="text-h6 font-weight-black text-truncate">{{ input?.name }}</span>
            <v-spacer></v-spacer>
            <span class="text-subtitle-2 text-grey">{{ state.inputting ? '(Applying Input)':'' }}</span>
        </v-card-title>
        <v-card-text class="d-flex align-center justify-space-between px-5">
            
            <span v-if="input?.type == 'Boolean'" class="w-50">Status: {{ !!input.status ? 'ON' : 'OFF' }}</span>
            <span v-if="input?.type == 'Number'" class="w-50">Status: {{ input.status }}</span>

            <!-- Boolean Input = ON/OFF -->
            <v-switch
                v-if="input?.type == 'Boolean'"
                inset
                hide-details
                class="w-50"
                density="compact"
                v-model="input.flag"
                :model-value="!!input.flag"
                :label="input?.flag ? '&nbsp;&nbsp;TURN OFF' : '&nbsp;&nbsp;TURN ON'"
                :loading="state.loading"
                @update:model-value="v => onChange(Number(v))"
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
import { addWsEvent, connectWebSocket, delWsEvent } from "@/utils/ws.util";
import { onMounted, onUnmounted, reactive, toRaw, watch } from "vue";



// ---props
const props = defineProps({
    input: {
        type: Object,
        required: true,
    },
});

// ---stores
const { updateInput } = useActuatorStore()

// ---composables
const { min } = useRules();

// ---data
const wsEvents = reactive([])
const input = reactive({
    icon: props.input?.icon,
    name: props.input?.name,
    type: props.input?.type,
    flag: props.input?.flag,
    status: props.input?.status,
    pinId: props.input?.pinId,
    actuatorId: props.input?.actuatorId,
})

// ---states
const state = reactive({
    loading: false,
    inputting: input.flag != input.status,
})

// ---watchers
watch(input, nv => state.inputting = nv.status != nv.flag)

// ---events
const onChange = async (value) => {
    input.flag = Number(value)
    if (value <= -1) return;
    const data = { ...props.input, ...input, flag: Number(value) };
    console.log("Sent: ", data)

    state.loading = true;
    await updateInput(data).catch(console.error)
    state.loading = false;
};

const onWsInput = (data) => {
    for (const d of data) {
        if (d?.id != props.input?.id) continue;

        input.icon = d.icon
        input.name = d.name
        input.type = d.type
        input.flag = d.flag
        input.status = d.status
        input.pinId = d.pinId
        input.actuatorId = d.actuatorId

        console.log('Received: ', { ...props.input, ...input, ...d })
    }
}


// ---hooks
onMounted(() => {
    connectWebSocket();
    wsEvents.push(addWsEvent('input', onWsInput, "Update"))
})

onUnmounted(() => { while(wsEvents.length > 0) delWsEvent(wsEvents.shift()) })



</script>

<style scoped></style>

<template>
    <v-card class="mx-auto" max-width="600">
        <template #prepend>
            <v-icon size="48" class="me-8">{{ output?.icon }}</v-icon>
        </template>

        <template #title>
            <div>
                <span class="text-caption text-grey text-uppercase">{{ output?.name }}</span>
            </div>
            <span v-if="readings.length > 0" class="text-h4 font-weight-black">{{ readings?.at(-1)?.value }}</span>
            <strong v-if="readings.length > 0">{{ output?.unit }}</strong>
            <span v-if="readings.length <= 0">No Records Yet</span>
        </template>

        <template #append>
            <v-btn
                v-if="readings.length > 0"
                link
                size="small"
                icon="mdi-arrow-right-thick"
                color="transparent"
                elevation="0"
                :to="`/user/greenhouse/${$route.params?.greenhouseId}/statistics#sensor-${output?.sensorId}`"
            ></v-btn>
        </template>

        <v-sheet v-if="readings.length > 0" color="transparent">
            <v-sparkline
                auto-draw
                key="id"
                stroke-linecap="round"
                :smooth="16"
                :gradient="['#f72047', '#ffd200', '#1feaea']"
                :line-width="3"
                :model-value="readings"
            ></v-sparkline>
        </v-sheet>
    </v-card>
</template>

<script setup>
import api from "@/utils/api.util";
import { wsAddEvent, wsConnect, wsDelEvent } from "@/utils/ws.util";
import { onMounted, onUnmounted, reactive } from "vue";

//

// ---props
const props = defineProps({
    limit: {
        type: Number,
        default: 30,
    },
    output: {
        type: Object,
        required: true,
    },
});

// ---data
const events = reactive([]);
const readings = reactive([]);

// ---events
const onWsReadings = (data) => {
    for (const d of data) {
        if (d?.outputId != props.output?.id) continue;
        if (readings.length >= props.limit) readings.shift();
        readings.push(d);
    }
};

// ---hooks
onMounted(async () => {
    const url = "/user/greenhouse/reading";
    await api
        .get(`${url}?outputId=${props.output?.id}&limit=${props.limit}`)
        .then((res) => readings.push(...res.data?.readings))
        .catch(console.error);

    events.push(wsAddEvent("reading", onWsReadings, "Create"));
});

onUnmounted(() => { while (events.length > 0) wsDelEvent(events.shift()); });

//

</script>

<style lang="scss" scoped></style>

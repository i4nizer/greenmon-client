<template>
    <v-card class="mx-auto" max-width="600">
        <template #prepend>
            <v-icon size="48" class="me-8">{{ camera?.icon }}</v-icon>
        </template>

        <template #title>
            <div>
                <span class="text-caption text-grey text-uppercase">{{ camera?.name }}</span>
            </div>
            <span v-if="detections.length > 0" class="text-h4 font-weight-black">{{ detections?.at(-1)?.value }}</span>
            <strong v-if="detections.length > 0">{{ camera?.unit }}</strong>
            <span v-if="detections.length <= 0">No Records Yet</span>
        </template>

        <template #append>
            <v-btn
                v-if="detections.length > 0"
                link
                size="small"
                icon="mdi-arrow-right-thick"
                color="transparent"
                elevation="0"
                :to="`/user/greenhouse/${$route.params?.greenhouseId}/statistics#sensor-${camera?.sensorId}`"
            ></v-btn>
        </template>

        <v-sheet v-if="detections.length > 0" color="transparent">
            <v-sparkline
                auto-draw
                key="id"
                stroke-linecap="round"
                :smooth="16"
                :gradient="['#f72047', '#ffd200', '#1feaea']"
                :line-width="3"
                :model-value="detections"
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
    camera: {
        type: Object,
        required: true,
    },
});

// ---data
const events = reactive([]);
const detections = reactive([]);

// ---events
const onWsDetection = (data) => {
    for (const d of data) {
        if (d?.outputId != props.output?.id) continue;
        if (readings.length >= props.limit) readings.shift();
        readings.push(d);
    }
};

// ---hooks
onMounted(async () => {
    const url = "/user/greenhouse/image/detection";
    await api
        .get(`${url}?limit=${props.limit}`)
        .then((res) => detections.push(...res.data?.detections))
        .catch(console.error);

    events.push(wsAddEvent("detection", onWsDetection, "Create"));
});

onUnmounted(() => { while (events.length > 0) wsDelEvent(events.shift()); });

//

</script>

<style lang="scss" scoped></style>

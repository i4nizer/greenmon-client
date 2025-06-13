<template>
    <v-card class="border pt-3">
        <v-card-title>{{ greenhouse?.name }} Alerts</v-card-title>
        <v-card-subtitle v-if="alerts.length > 0">
            <span>Last Alert: {{ date.format(alerts.at(-1)?.createdAt, "fullDateWithWeekday") }}</span>
        </v-card-subtitle>
        <v-card-text>
            <!-- Alerts Lists -->
            <v-alert
                v-for="alert in alerts.toReversed()"
                class="mb-1 border"
                variant="text"
                :key="alert?.id"
                :text="`${alert?.message} (${date.format(alert?.createdAt, 'fullDateWithWeekday')})`"
                :type="alert?.severity?.toLowerCase()"
                :title="alert?.title"
            ></v-alert>

            <!-- Fallback/emptystate when no alert -->
            <v-empty-state
                v-if="alerts?.length <= 0"
                icon="mdi-alert"
                text="There aren't any generated alert yet."
                title="No alert yet"
            ></v-empty-state>
        </v-card-text>
    </v-card>
</template>

<script setup>
import api from "@/utils/api.util";
import { wsAddEvent, wsDelEvent } from "@/utils/ws.util";
import { onBeforeMount, onBeforeUnmount, reactive } from "vue";
import { useDate } from "vuetify";

//

// ---props
const props = defineProps({
    limit: {
        type: Number,
        default: 10,
    },
    greenhouse: {
        type: Object,
        required: true,
    },
});

// ---composables
const date = useDate();

// ---data
const alerts = reactive([]);
const events = reactive([]);

// ---events
const onWsAlerts = (data) => {
    for (const alert of data) {
        if (alerts.length >= props.limit) alerts.shift();
        alerts.push(alert);
    }
};

// ---hooks
onBeforeMount(async () => {
    const url = `/user/greenhouse/alert?greenhouseId=${props.greenhouse?.id}&limit=${props.limit}`;
    await api.get(url)
        .then((res) => alerts.push(...res.data?.alerts))
        .catch(console.error);

    events.push(wsAddEvent("alert", onWsAlerts, "Create"));
});

onBeforeUnmount(() => {
    while (events.length > 0) wsDelEvent(events.shift());
});

//

</script>

<style scoped></style>

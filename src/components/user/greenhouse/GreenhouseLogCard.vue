<template>
    <v-card class="border pt-3" density="compact">
        <v-card-title>{{ greenhouse?.name }} Logs</v-card-title>
        <v-card-subtitle v-if="logs.length > 0">
            <span>Last Log: {{ date.format(logs.at(-1)?.createdAt, 'fullDateWithWeekday') }}</span>
        </v-card-subtitle>
        <v-card-text class="overflow-auto">
            <v-timeline side="end">
    
                <!-- Logs Lists -->
                <v-timeline-item v-for="log in logs" :key="log?.id" size="small">
                    <v-card>
                        <v-card-title>{{ log?.title }}</v-card-title>
                        <v-card-subtitle>{{ date.format(log?.createdAt, 'fullDateWithWeekday') }}</v-card-subtitle>
                        <v-card-text>{{ log?.message }}</v-card-text>
                    </v-card>
                </v-timeline-item>

                <v-timeline-item v-if="logs.length <= 0">
                    <v-card>
                        <v-card-title>No Records Yet</v-card-title>
                    </v-card>
                </v-timeline-item>
    
            </v-timeline>   
        </v-card-text>
    </v-card>
</template>

<script setup>
import api from '@/utils/api.util';
import { addWsEvent, connectWebSocket, delWsEvent } from '@/utils/ws.util';
import { onBeforeUnmount, onMounted, reactive } from 'vue';
import { useDate } from 'vuetify';



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
})

// ---composables
const date = useDate()

// ---data
const logs = reactive([])
const events = reactive([])

// ---events
const onWsLogs = (data) => {
    for (const log of data) {
        if (logs.length >= props.limit) logs.shift()
        logs.push(log)
    }
}


// ---hooks
onMounted(async () => {
    connectWebSocket()

    const url = `/user/greenhouse/log?greenhouseId=${props.greenhouse?.id}&limit=${props.limit}`
    await api.get(url)
        .then(res => logs.push(...res.data?.logs))
        .catch(console.error)

    events.push(addWsEvent("log", onWsLogs, 'Create'))
})

onBeforeUnmount(() => { while (events.length > 0) delWsEvent(events.shift()) })



</script>

<style scoped>

</style>
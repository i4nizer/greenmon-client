<template>
    <v-card class="mx-auto" color="surface-light" max-width="600">
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
            <v-icon v-if="readings.length > 0" size="24">mdi-arrow-right-thick</v-icon>
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
import api from '@/utils/api.util';
import { addWsEvent, connectWebSocket, delWsEvent } from '@/utils/ws.util';
import { onMounted, onUnmounted, reactive } from 'vue';


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
})


// ---data
const events = reactive([])
const readings = reactive([])

// ---events
const onWsReadings = (data) => {
    for (const d of data) {
        if (readings.length >= props.limit) readings.shift()
        readings.push(d)
    }
}

// ---hooks
onMounted(async () => {
    connectWebSocket()

    const url = "/user/greenhouse/mcu/sensor/output/reading"
    await api.get(`${url}?outputId=${props.output?.id}&limit=${props.limit}`)
        .then(res => readings.push(...res.data?.readings))
        .catch(console.error)

    events.push(addWsEvent('reading', onWsReadings, 'Create'))
})

onUnmounted(() => { while(events.length > 0) delWsEvent(events.shift()) })


</script>

<style lang="scss" scoped></style>

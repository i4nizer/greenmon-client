<template>
    <v-card class="border pt-3" :id="`sensor-${sensor?.id}`">
        <template #prepend>
            <v-icon size="38" class="me-2">mdi-chart-line</v-icon>
        </template>
        <template #title>
            <span>{{ outputs.map(o => o.name).join(', ') }} Readings</span>
        </template>
        <template #append>
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
                            title="Download Data"
                            @click="downloadReadingsData"
                        ></v-list-item>
                        <v-list-item 
                            link 
                            rounded 
                            title="Download All Data"
                            @click="downloadReadingsDataAll"
                        ></v-list-item>
                    </v-list>
                </template>
            </v-menu>
        </template>
        <template #subtitle>
            <span>Readings from {{ date.format(dateRange.start, 'fullDateWithWeekday') }}</span>
            <span>&nbsp;to {{ date.format(dateRange.end, 'fullDateWithWeekday') }}</span>
        </template>
        <template #default>
            <v-container fluid>
                <v-row>
                    <v-col cols="12">
                        <DateRangeControl
                            :end="dateRange.end"
                            :start="dateRange.start"
                            :interval="dateRange.interval"
                            @change="v => ([dateRange.end, dateRange.start, dateRange.interval] = [v.end, v.start, v.interval])"
                        ></DateRangeControl>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <Line 
                            class="w-100 border pt-3"
                            :key="chartKey"
                            :data="chartData" 
                            :options="chartOptions"
                        ></Line>
                    </v-col>
                </v-row>
            </v-container>
        </template>
    </v-card>
</template>

<script setup>
import api from '@/utils/api.util';
import colors from 'vuetify/util/colors'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { useDate } from 'vuetify';
import { computed, defineAsyncComponent, reactive, ref, watch } from 'vue'

const DateRangeControl = defineAsyncComponent(() => import("@/components/user/greenhouse/DateRangeControl.vue"))


// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale)

// Chart Options
const chartOptions = reactive({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            grid: {
                color: 'rgba(128, 128, 128, 0.5)',
            },
        },
        y: {
            grid: {
                color: 'rgba(128, 128, 128, 0.5)',
            },
        },
    },
})

// ---props
const props = defineProps({
    sensor: {
        type: Object,
        required: true,
    },
    outputs: {
        type: Array,
        default: [],
    },
})

// ---composables
const date = useDate()

// ---const
const today = new Date()
const yesterday = new Date(today)
yesterday.setDate(today.getDate() - 1)

// ---data
const readings = reactive([])
const chartKey = ref(0)
const chartData = reactive({ labels: [], datasets: [] })
const dateRange = reactive({
    end: today.toISOString(),
    start: yesterday.toISOString(),
    interval: 60, // minute
})

// ---getters
const outputWithReadings = computed(() =>
    props.outputs.map(o => ({
        ...o,
        readings: readings.filter(r => r.outputId == o.id),
    }))
)

// ---state
const state = reactive({ downloading: false })

// ---watchers
watch(dateRange, async (nv, ov) => {
    readings.splice(0, readings.length)
    const { start, end } = dateRange
    for (const output of props.outputs) {
        const url = `/user/greenhouse/mcu/sensor/output/reading`
        const query = `outputId=${output?.id}&startdt=${start}&enddt=${end}`

        await api.get(`${url}?${query}`)
            .then(res => readings.push(...res.data.readings))
            .catch(console.error)
    }

    chartData.datasets = generateChartDatasets(outputWithReadings.value, nv.interval)
    chartData.labels = generateChartLabels(nv.start, nv.end, nv.interval)
    chartKey.value++;
}, { immediate: true })



// ---actions
const getRandColor = () => {
    const colorArr = Object.keys(colors).map(key => colors[key].lighten2)
    const randIndex = Math.floor((colorArr.length - 1) * Math.random())
    return colorArr.at(randIndex)
}

const generateChartLabels = (startDateStr, endDateStr, interval) => {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    const labels = [];
    
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        labels.push(date.format(currentDate, 'keyboardDateTime12h'));
        currentDate.setMinutes(currentDate.getMinutes() + interval)
    }

    return labels;
}

const generateChartDatasets = (outputs, interval) => {
    const datasets = []

    for (const output of outputs) {
        const color = getRandColor()
        const dataset = { 
            label: output?.name,
            backgroundColor: color,
            borderColor: color,
            data: [],
            fill: false,
            tension: 0.4,
        }

        let lastTime = -1;
        for (const r of output.readings) {
            const time = new Date(r?.createdAt).getTime(); // milliseconds

            if (lastTime == -1 || (time - lastTime) >= (interval * 60 * 1000)) {
                dataset.data.push(r?.value)
                lastTime = time
            }
        }

        datasets.push(dataset)
    }

    return datasets
}

const downloadReadingsCsv = async (query = '', filename = 'readings.csv') => {
    const url = `/user/greenhouse/mcu/sensor/output/reading/csv`
    state.downloading = true

    const res = await api.get(`${url}?${query}`, { responseType: 'blob' })
    if (res.status >= 400) return state.downloading = false

    const blob = new Blob([res.data], { type: 'text/csv' })
    const link = document.createElement('a')
    const burl = URL.createObjectURL(blob)

    link.href = burl
    link.download = filename
    link.click()
    URL.revokeObjectURL(burl)

    state.downloading = false
}

const downloadReadingsData = async () => {
    const query = `sensorId=${props.sensor?.id}&startdt=${dateRange.start}&enddt=${dateRange.end}`
    const filename = `${props.sensor?.name}-readings-${new Date().toISOString()}--startdt-${dateRange.start}--enddt-${dateRange.end}.csv`
    await downloadReadingsCsv(query, filename)
        .catch(console.error)
}

const downloadReadingsDataAll = async () => {
    const query = `sensorId=${props.sensor?.id}`
    await downloadReadingsCsv(query, `${props.sensor?.name}-readings-${new Date().toISOString()}-all.csv`)
        .catch(console.error)
}



</script>

<style scoped>

</style>
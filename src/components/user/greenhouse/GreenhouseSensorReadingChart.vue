<template>
    <v-card class="border pt-3" :id="`sensor-${sensor?.id}`" :loading="state.downloading">
        <template #prepend>
            <v-icon size="38" class="me-2">mdi-chart-line</v-icon>
        </template>
        <template #title>
            <span class="text-wrap">{{ outputs.map(o => o.name).join(', ') }} Readings</span>
        </template>
        <template #append>
            <v-menu open-on-hover>
                <template #activator="{ props: menuProps }">
                    <v-btn
                        icon="mdi-dots-vertical"
                        size="small"
                        color="white"
                        elevation="0"
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
            <span class="text-wrap">Readings from {{ date.format(dateRange.start, 'fullDateWithWeekday') }}</span>
            <span>&nbsp;to {{ date.format(dateRange.end, 'fullDateWithWeekday') }}</span>
        </template>
        <template #default>
            <v-container fluid>
                <v-row>
                    <v-col cols="4" class="d-flex align-center">
                        <span class="pl-1">Interval: {{ props.sensor?.interval }} seconds</span>
                    </v-col>
                    <v-col cols="8" class="d-flex align-center justify-end">
                        <v-btn 
                            size="small"
                            icon="mdi-chevron-triple-left"
                            color="transparent"
                            class="mr-1"
                            @click="decrement += 10"
                        ></v-btn>
                        <v-btn 
                            size="small"
                            icon="mdi-chevron-left"
                            color="transparent"
                            class="mr-1"
                            @click="decrement++"
                        ></v-btn>
                        <span>{{ date.format(dateRange.start, 'keyboardDateTime12h') }}</span>
                        <span>&nbsp;-&nbsp;</span>
                        <span>{{ date.format(dateRange.end, 'keyboardDateTime12h') }}</span>
                        <v-btn 
                            size="small"
                            icon="mdi-chevron-right"
                            color="transparent"
                            class="ml-1"
                            :disabled="decrement <= 0"
                            @click="decrement--"
                        ></v-btn>
                        <v-btn 
                            size="small"
                            icon="mdi-chevron-triple-right"
                            color="transparent"
                            class="ml-1"
                            :disabled="decrement <= 0"
                            @click="decrement -= 10"
                        ></v-btn>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">

                        <!-- The line chart -->
                        <div class="overflow-auto">
                            <Line 
                                v-if="readings.length > 0"
                                class="w-auto w-sm-100 h-auto h-sm-100 border pt-3"
                                :key="chartKey"
                                :data="chartData" 
                                :options="chartOptions"
                            ></Line>
                        </div>

                        <!-- Fallback/emptystate when no readings -->
                        <v-empty-state
                            v-if="readings.length <= 0"
                            icon="mdi-chart-line"
                            text="There are no data from this date range."
                            title="No records found."
                        ></v-empty-state>

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
    CategoryScale,
    TimeScale
} from 'chart.js'
import 'chartjs-adapter-date-fns'
import { Line } from 'vue-chartjs'
import { useDate } from 'vuetify';
import { computed, onBeforeMount, reactive, ref, watch } from 'vue'


// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale, TimeScale)

// Chart Options
const chartOptions = reactive({
    responsive: true,
    maintainAspectRatio: true,
    scales: {
        x: {
            type: 'time',
            time: {
                unit: 'second'
            },
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
    limit: {
        type: Number,
        default: 50,
    },
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

// ---data
const readings = reactive([])
const chartKey = ref(0)
const decrement = ref(0)
const chartData = reactive({ datasets: [] })
const dateRange = reactive({ start: new Date(), end: new Date() })

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
watch(decrement, async (nv, ov) => {
    const gap = props.sensor.interval * props.limit
    const { start, end } = getDateRange(gap, nv)
    dateRange.end = end.toISOString()
    dateRange.start = start.toISOString()

    const outputReadings = []
    for (const output of props.outputs) {
        const url = `/user/greenhouse/reading`
        const query = `outputId=${output?.id}&startdt=${start.toISOString()}&enddt=${end.toISOString()}&limit=${props.limit}`

        await api.get(`${url}?${query}`)
            .then(res => outputReadings.push(...res.data.readings))
            .catch(console.error)
    }

    readings.splice(0, readings.length)
    readings.push(...outputReadings)

    chartData.datasets = generateChartDatasets(outputWithReadings.value, nv.interval)
    chartKey.value++;
})



// ---actions
const getRandColor = () => {
    const colorArr = Object.keys(colors).map(key => colors[key].lighten2)
    const randIndex = Math.floor((colorArr.length - 1) * Math.random())
    return colorArr.at(randIndex)
}

const getDateRange = (gap, decrement) => {
    const start = new Date()
    start.setSeconds(start.getSeconds() - (gap * decrement))
    const end = new Date(start)
    end.setSeconds(end.getSeconds() + gap)

    return { start, end }
}

const generateChartDatasets = (outputs) => {
    const datasets = []

    for (const output of outputs) {
        const color = getRandColor()

        const dataset = { 
            label: output?.name,
            backgroundColor: color,
            borderColor: color,
            data: [],
            fill: false,
            tension: 0.1,
        }

        dataset.data = output?.readings?.map(r => ({
            x: r.createdAt,
            y: r.value,
        }))

        datasets.push(dataset)
    }

    return datasets
}

const downloadReadingsCsv = async (query = '', filename = 'readings.csv') => {
    const url = `/user/greenhouse/reading/csv`
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
    const gap = props.sensor.interval * props.limit
    const { start, end } = getDateRange(gap, decrement.value)
    const [todayStr, startStr, endStr] = [new Date().toISOString(), start.toISOString(), end.toISOString()]
    
    const query = `sensorId=${props.sensor?.id}&startdt=${startStr}&enddt=${endStr}`
    const filename = `${props.sensor?.name}-readings-${todayStr}--startdt-${startStr}--enddt-${endStr}.csv`

    await downloadReadingsCsv(query, filename).catch(console.error)
}

const downloadReadingsDataAll = async () => {
    const query = `sensorId=${props.sensor?.id}`
    const filename = `${props.sensor?.name}-readings-${new Date().toISOString()}-all.csv`

    await downloadReadingsCsv(query, filename).catch(console.error)
}


// ---hooks
onBeforeMount(async () => {
    if (props.outputs.length <= 0) return;

    const url = `/user/greenhouse/reading`
    const query = `outputId=${props.outputs[0]?.id}&limit=1`

    const sample = await api.get(`${url}?${query}`)
    if (sample.data?.readings?.length <= 0) return;

    const gap = props.sensor.interval * props.limit
    const endDate = new Date(sample.data?.readings?.at(0).createdAt)
    const diffSeconds = Math.abs((new Date() - endDate) / 1000)
    decrement.value = Math.floor((diffSeconds / gap)) + 1
})


</script>

<style scoped>

</style>
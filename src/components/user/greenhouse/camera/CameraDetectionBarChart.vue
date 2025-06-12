<template>
    <v-card>
        <template #prepend>
            <v-icon size="38" class="me-2">mdi-chart-line</v-icon>
        </template>
        <template #title>
            <span class="text-wrap">{{ camera?.name }} Monthly Detections</span>
        </template>
        <template #subtitle>
            <span class="text-wrap">The graph shows the detections on images captured by this camera for the selected month.</span>
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
                            :disabled="imagesWithDetections.length <= 0"
                            @click="downloadDetectionsData"
                        ></v-list-item>
                        <v-list-item 
                            link 
                            rounded 
                            title="Download All Data"
                            :disabled="pagination.count <= 0"
                            @click="downloadDetectionsDataAll"
                        ></v-list-item>
                    </v-list>
                </template>
            </v-menu>
        </template>
        <template #default>
            <v-container fluid>
                <v-row justify="end">
                
                    <!-- List Date Range Control -->
                    <v-col cols="12" sm="6" md="4" lg="3" xl="2" xxl="1">
                        <v-select
                            hide-details
                            label="Year"
                            v-model="pagination.year"
                            :items="Array.from({ length: new Date().getFullYear() - 2024 }, (_, i) => i + 2025)"
                            @update:model-value="onPaginate().catch(console.error)"
                        ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" lg="3" xl="2" xxl="1">
                        <v-select
                            hide-details
                            label="Month"
                            v-model="pagination.month"
                            :items="Array.from({ length: 12 }, (_, i) => i)"
                            :item-title="i => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][i]"
                            :item-value="i => i"
                            @update:model-value="onPaginate().catch(console.error)"
                        ></v-select>
                    </v-col>
                    
                </v-row>
                <v-row>
                    <v-col cols="12">
                       
                        <!-- The Chart, Bow -->
                        <div 
                            class="overflow-auto"
                        >
                            <Bar 
                                v-if="imagesWithDetections.length > 0"
                                class="w-auto h-auto border pa-2" 
                                :style="{ minWidth: '600px' }"
                                :key="chartKey"
                                :data="chartData" 
                                :options="chartOptions" 
                            />
                        </div>

                        <!-- Fallback/emptystate when no captures -->
                        <v-empty-state
                            v-if="imagesWithDetections.length <= 0"
                            icon="mdi-image-off"
                            text="There are no data for this year-month."
                            title="No captures found."
                        ></v-empty-state>

                    </v-col>
                </v-row>
            </v-container>
        </template>
    </v-card>
</template>

<script setup>
import colors from 'vuetify/util/colors'
import { Bar } from 'vue-chartjs'
import { computed, onBeforeMount, reactive, ref } from 'vue'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js'
import { useCameraStore } from '@/stores/camera.store'
import { useDate } from 'vuetify'
import api from '@/utils/api.util'

//

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

// ---chart
const chartKey = ref(0)
const chartData = reactive({ labels: [], datasets: [] })
const chartOptions = reactive({ responsive: true, maintainAspectRatio: true })

// ---props
const props = defineProps({
    camera: {
        type: Object,
        required: true,
    },
})

// ---stores
const { retrieveImage } = useCameraStore()

// ---composables
const date = useDate()

// ---data
const imagesWithDetections = reactive([])
const pagination = reactive({
    page: 1,
    count: 0,
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
})

// ---state
const state = reactive({ downloading: false, })

// ---actions
const genNPKColor = (label) => {
    return label?.startsWith('No Lettuce') ? colors.grey.lighten2
        : label?.startsWith('Healthy') ? colors.green.lighten2
        : label?.startsWith('Nitrogen') ? colors.yellow.lighten2
        : label?.startsWith('Phosphorus') ? colors.purple.lighten2
        : label?.startsWith('Potassium') ? colors.brown.lighten2
        : null
}

const genRandColor = () => {
    const colorArr = Object.keys(colors).map(key => colors[key].lighten2)
    const randIndex = Math.floor((colorArr.length - 1) * Math.random())
    return colorArr.at(randIndex)
}

const genLabelsDatasets = (iwd) => {
    const data = {}
    data["No Lettuce"] = 0

    for (const img of iwd) {

        if (img?.detections?.length == 0) data["No Lettuce"]++;
        for (const detection of img?.detections) {

            if (!data[detection?.class]) data[detection?.class] = 1
            else data[detection?.class] += 1
        }
    }

    const colors = Object.keys(data).map(k => genNPKColor(k) ?? genRandColor())
    const labels = Object.keys(data)
    const datasets = [{
        label: 'Detections',
        data: Object.keys(data).map(k => data[k]),
        borderColor: colors,
        borderWidth: 1,
        backgroundColor: colors,
    }]

    return { labels, datasets }
}

const downloadDetectionsCsv = async (query, filename) => {
    const url = `/user/greenhouse/image/csv?` + Object.keys(query).map(q => `${q}=${query[q]}`).join('&');
    state.downloading = true;

    const res = await api.get(url, { responseType: 'blob' })
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

const downloadDetectionsData = async () => {
    const filename = `${props.camera.name}-detection-${pagination.year}-${pagination.month}.csv`
    const query = {
        cameraId: props.camera?.id,
        year: pagination.year,
        month: pagination.month,
        detection: true
    }

    await downloadDetectionsCsv(query, filename).catch(console.error)
}

const downloadDetectionsDataAll = async () => {
    const filename = `${props.camera.name}-detection.csv`
    const query = {
        cameraId: props.camera?.id,
        detection: true
    }

    await downloadDetectionsCsv(query, filename).catch(console.error)
}

// ---events
const onPaginate = async () => {

    const res = await retrieveImage({
        cameraId: props.camera?.id,
        year: pagination.year,
        month: pagination.month,
        detection: true
    })

    pagination.count = res.data?.count ?? 0
    imagesWithDetections.splice(0, imagesWithDetections.length)
    imagesWithDetections.push(...res.data?.images)

    const { labels, datasets } = genLabelsDatasets(imagesWithDetections)
    chartData.labels.splice(0, chartData.labels.length)
    chartData.labels.push(...labels)
    chartData.datasets.splice(0, chartData.datasets.length)
    chartData.datasets.push(...datasets)
    chartKey.value++
}

// ---hooks
onBeforeMount(async () => {

    // prefetch
    onPaginate().catch(console.error)

    // precount
    const url = `/user/greenhouse/image/detection?cameraId=${props.camera.id}`
    api.get(url)
        .then(res => pagination.count = res.data.count)
        .catch(console.error)
})

//

</script>

<style scoped>

</style>
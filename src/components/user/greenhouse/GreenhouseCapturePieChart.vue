<template>
    <v-card class="pt-3" :loading="state.downloading">
        <template #prepend>
            <v-icon size="38" class="me-2">mdi-chart-line</v-icon>
        </template>
        <template #title>
            <span class="text-wrap">{{ greenhouse?.name }} All Detections</span>
        </template>
        <template #subtitle>
            <span class="text-wrap">The graph shows all the detections on images captured by the cameras under this greenhouse.</span>
        </template>
        <template #append>
            <v-btn
                icon="mdi-download"
                elevation="0"
                @click="downloadDetectionsData"
            ></v-btn>
        </template>
        <template #default>
            <v-container fluid>
                <v-row>
                    <v-col cols="12">
                        <div class="overflow-auto">
                            <Pie 
                                class="border w-100 h-100 pa-2"
                                :key="chartKey"
                                :data="chartData" 
                                :options="chartOptions" 
                            />
                        </div>
                    </v-col>
                </v-row>
            </v-container>
        </template>
    </v-card>
</template>

<script setup>
import api from '@/utils/api.util';
import colors from 'vuetify/util/colors'
import { Pie } from 'vue-chartjs'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js'
import { useCameraStore } from '@/stores/camera.store';
import { onBeforeMount, onMounted, reactive, ref } from 'vue';

//

// ---props
const props = defineProps({
    greenhouse: {
        type: Object,
        required: true,
    },
})

// ---stores
const { retrieveImage } = useCameraStore()

// ---chart
ChartJS.register(Title, Tooltip, Legend, ArcElement)
const chartKey = ref(0)
const chartData = reactive({ labels: [], datasets: [] })
const chartOptions = reactive({
    responsive: true,
    maintainAspectRatio: true,
})

// ---data
const imagesWithDetections = reactive([])

// ---state
const state = reactive({ downloading: false })

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
    const labels = Object.keys(data).map(k => `${data[k]} - ${k}`)
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
    const filename = `${props.greenhouse?.name}-detection.csv`
    const query = {
        greenhouseId: props.greenhouse?.id,
        detection: true
    }

    await downloadDetectionsCsv(query, filename).catch(console.error)
}

// ---hooks
onBeforeMount(async () => {
    const res = await retrieveImage({ greenhouseId: props.greenhouse?.id, detection: true })
    imagesWithDetections.splice(0, imagesWithDetections.length)
    imagesWithDetections.push(...res.data.images)

    const { labels, datasets } = genLabelsDatasets(imagesWithDetections)
    chartData.labels = labels
    chartData.datasets = datasets
    setTimeout(() => chartKey.value++, 100)
})

//
</script>

<style lang="scss" scoped>

</style>
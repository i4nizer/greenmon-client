<template>
    <v-card class="border">
        <ImageDetectionCard
            class="border-none"
            variant="flat"
            elevation="0"
            :src="url"
            :bounding-boxes="boundingBoxes"
        ></ImageDetectionCard>
        <v-card-title>
            <v-chip
                v-for="d in deficiencies"
                :text="d"
                :color="d?.includes('Nitrogen') ? 'orange' : d?.includes('Phosphorus') ? 'purple' : d?.includes('Potassium') ? 'brown' : 'green'"
            ></v-chip>
            <v-chip
                v-if="deficiencies.length <= 0"
                :text="'No Lettuce'"
            ></v-chip>
        </v-card-title>
        <v-card-subtitle>{{ date.format(image?.createdAt, 'fullDateTime12h') }}</v-card-subtitle>
        <v-card-text>
            <ImageDetailsDialog 
                :src="url" 
                :image="image"
                :deficiencies="deficiencies"
                :bounding-boxes="boundingBoxes"
            >
                <template #activator="{ props: activatorProps }">
                    <v-btn
                        text="View Details"
                        class="w-100 border"
                        variant="flat"
                        elevation="0"
                        :="activatorProps"
                    ></v-btn>
                </template>
            </ImageDetailsDialog>
        </v-card-text>
    </v-card>
</template>

<script setup>
import api from '@/utils/api.util';
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref } from 'vue';
import { useDate } from 'vuetify';

const ImageDetectionCard = defineAsyncComponent(() => import("@/components/user/greenhouse/camera/ImageDetectionCard.vue"))
const ImageDetailsDialog = defineAsyncComponent(() => import("@/components/user/greenhouse/camera/ImageDetailsDialog.vue"))

//

// ---props
const props = defineProps({
    image: {
        type: Object,
        required: true,
    },
    detections: {
        type: Array,
        default: [],
    },
})

// ---composables
const date = useDate()

// ---data
const url = ref('')

// ---getters
const deficiencies = computed(() => 
    props.detections
        .map(d => d.class)
        .sort((a, b) => a?.confidence - b?.confidence)
)
const boundingBoxes = computed(() =>
    props.detections.map(d => ({
        box: { w: d.w, h: d.h, x: d.x, y: d.y },
        class: d.class,
        confidence: d.confidence,
    }))
)

// ---hooks
onMounted(async () => {
    const res = await api.get(
        `/user/greenhouse/uploads/${props.image?.filename}`,
        { responseType: 'blob' }
    )
    url.value = URL.createObjectURL(res.data)
})

onBeforeUnmount(() => URL.revokeObjectURL(url.value))

</script>

<style scoped>

</style>
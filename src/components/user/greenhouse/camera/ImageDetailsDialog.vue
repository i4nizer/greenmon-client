<template>
    <v-dialog v-model="state.dialog">
        <template #activator="{ props: activatorProps }">
            <slot name="activator" :="{ props: activatorProps }"></slot>
        </template>
        <template #default="{ isActive }">
            <v-container class="bg-green-darken-4 rounded pt-7 overflow-auto">
                <v-row>
                    <v-col cols="10" class="pl-8">
                        <h3>Image: {{ image?.filename }}</h3>
                        <sub>Captured: {{ date.format(image?.createdAt, 'fullDateTime12h') }}</sub>
                    </v-col>
                    <v-col cols="2" class="text-end">
                        <v-btn
                            text="Close"
                            icon="mdi-close"
                            class="bg-transparent elevation-0"
                            @click="state.dialog = !state.dialog"
                        ></v-btn>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" sm="12" md="6">
                        <ImageDetectionCard
                            class="bg-transparent border"
                            variant="flat"
                            elevation="0"
                            :src="src"
                            :bounding-boxes="boundingBoxes"
                        ></ImageDetectionCard>
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                        <v-list class="bg-transparent border">
                            <v-list-subheader>
                                <h3 class="text-white">Recommendations</h3>
                            </v-list-subheader>
                            <v-list-item 
                                v-for="d in deficiencies"
                                class="d-flex flex-column"
                            >
                                <v-chip
                                    class="mb-2"
                                    :text="d"
                                    :class="d?.includes('Nitrogen') ? 'bg-orange' : d?.includes('Phosphorus') ? 'bg-purple' : d?.includes('Potassium') ? 'bg-brown' : 'bg-green'"
                                ></v-chip>
                                <li v-for="r in getRecommendations(d)">{{ r }}</li>
                            </v-list-item>
                            <v-list-item v-if="deficiencies.length <= 0">
                                <v-empty-state
                                    icon="mdi-leaf"
                                    text="There is no lettuce found on the image."
                                    title="No Lettuce Detected"
                                ></v-empty-state>
                            </v-list-item>
                        </v-list>
                    </v-col>
                </v-row>
            </v-container>
        </template>
    </v-dialog>
</template>

<script setup>
import { reactive, defineAsyncComponent } from "vue";
import { useDate } from "vuetify";

const ImageDetectionCard = defineAsyncComponent(() => import("@/components/user/greenhouse/camera/ImageDetectionCard.vue"))

//

// ---props
const props = defineProps({
    src: {
        type: String,
        default: '',
    },
    image: {
        type: Object,
        required: true,
    },
    deficiencies: {
        type: Array,
        default: [],
    },
    boundingBoxes: {
        type: Array,
        default: [],
    },
})

// ---composables
const date = useDate()

// ---state
const state = reactive({ dialog: false })

// ---actions
const getRecommendations = (deficiency) => {
    if (deficiency?.includes('Nitrogen')) {
        return [
            'Apply nitrogen-rich fertilizers such as urea, ammonium nitrate, or calcium ammonium nitrate.',
            'For rapid correction, use a foliar spray with a 1–2% urea solution.',
            'Incorporate well-decomposed compost or manure to improve nitrogen availability.',
        ]
    } else if (deficiency?.includes('Phosphorus')) {
        return [
            'Apply phosphorus-rich fertilizers like monoammonium phosphate (MAP), diammonium phosphate (DAP), or rock phosphate.',
            'Use bone meal or composted manure as organic phosphorus sources.',
            'Ensure soil pH is maintained between 6.0 and 7.0 to optimize phosphorus availability.',
        ]
    } else if (deficiency?.includes('Potassium')) {
        return [
            'Apply potassium-rich fertilizers such as potassium sulfate (SOP) or potassium nitrate.',
            'Use wood ash sparingly as an organic potassium source, being mindful of its alkalinity.',
            'Ensure adequate soil moisture to facilitate potassium uptake.'
        ]
    } else {
        return [
            `You're doing amazing, keep it going!`
        ]
    }
}

// 


</script>

<style scoped>

</style>
<template>
    <v-card class="border pt-3">
        <v-card-title class="d-flex align-center justify-space-between text-wrap">
            <span :class="sensor?.disabled ? 'text-red' : 'text-green'">{{ sensor?.name }}</span>
            <v-btn
                link
                icon="mdi-chevron-right"
                size="small"
                elevation="0"
                :to="`/user/greenhouse/${$route.params?.greenhouseId}/mcu/${sensor?.mcuId}/sensors#sensor-${sensor?.id}`"
            ></v-btn>
        </v-card-title>
        <v-card-subtitle class="text-wrap">{{ sensor?.label }}</v-card-subtitle>
        <v-card-text>
            
            <!-- Output Reading List -->
            <OutputReadingCard 
                v-for="output in outputs"
                class="w-100 mb-1 border"
                variant="flat"
                elevation="0"
                :key="output?.id"
                :output="output"
            ></OutputReadingCard>

        </v-card-text>
    </v-card>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const OutputReadingCard = defineAsyncComponent(() => import("@/components/user/greenhouse/mcu/OutputReadingCard.vue"))


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

</script>

<style lang="scss" scoped>

</style>
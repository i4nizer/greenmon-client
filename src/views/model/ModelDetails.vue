<template>
    <v-container>
        <v-row class="mt-4">
            <v-col>
                <h1 class="text-center">Lettuce Nutrient Deficiency Detection</h1>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col>
                <ModelDetailsInfoCard
                    :btn-loading="state.modelLoading"
                ></ModelDetailsInfoCard>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col cols="12" md="6">
                <ModelDetailsHowItWorksCard></ModelDetailsHowItWorksCard>
            </v-col>
            <v-col cols="12" md="6">
                <ModelDetailsBestPracticesCard></ModelDetailsBestPracticesCard>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { mlLettuceModelLoad } from '@/utils/model.util';
import { defineAsyncComponent, onBeforeMount, reactive } from 'vue';

const ModelDetailsInfoCard = defineAsyncComponent(() => import("@/components/model/ModelDetailsInfoCard.vue"))
const ModelDetailsHowItWorksCard = defineAsyncComponent(() => import("@/components/model/ModelDetailsHowItWorksCard.vue"))
const ModelDetailsBestPracticesCard = defineAsyncComponent(() => import("@/components/model/ModelDetailsBestPracticesCard.vue"))


// ---state
const state = reactive({ modelLoading: false })

// ---hooks
onBeforeMount(async () => {
    state.modelLoading = true
    await mlLettuceModelLoad().catch(console.error)
    state.modelLoading = false
})
</script>

<style lang="scss" scoped>

</style>
<template>
    <v-card class="border pt-3">
        <v-card-title class="d-flex align-center justify-space-between">
            <span :class="actuator?.disabled ? 'text-red' : 'text-green'">{{ actuator?.name }}</span>
            <v-btn
                link
                size="small"
                icon="mdi-chevron-right"
                elevation="0"
                :to="`/user/greenhouse/${$route.params?.greenhouseId}/mcu/${actuator?.mcuId}/actuators#actuator-${actuator?.id}`"
            ></v-btn>
        </v-card-title>
        <v-card-subtitle>{{ actuator?.label }}</v-card-subtitle>
        <v-card-text>

            <!-- Input Lists -->
            <InputControlCard
                v-for="input in inputs"
                class="mb-1 border"
                variant="flat"
                elevation="0"
                :key="input?.id"
                :input="input"
                :disabled="actuator?.disabled"
            ></InputControlCard>

        </v-card-text>
    </v-card>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const InputControlCard = defineAsyncComponent(() => import("@/components/user/greenhouse/mcu/InputControlCard.vue"))



// ---props
const props = defineProps({
    actuator: {
        type: Object,
        required: true,
    },
    inputs: {
        type: Array,
        default: [],
    },
})



</script>

<style scoped>

</style>
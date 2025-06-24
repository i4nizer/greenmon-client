<template>
    <v-card class="pa-4">
        <template #title>
            <span>{{ severity }}</span>
        </template>
        <template #append>
            <v-icon :color="color">{{ icon }}</v-icon>
        </template>
        <template #text>
            <span class="text-h4" :class="`text-${color}`">{{ count }}</span>
        </template>
    </v-card>
</template>

<script setup>
import { computed } from 'vue';


//

// ---props
const props = defineProps({
    count: {
        type: Number,
        default: 0,
    },
    severity: {
        type: String,
        default: "Info"
    },
})

// ---getters
const icon = computed(() =>
    props.severity == "Error"
        ? "mdi-close-outline"
        : props.severity == "Warning"
        ? "mdi-alert-outline"
        : props.severity == "Success"
        ? "mdi-check-outline"
        : "mdi-information-outline"
)

const color = computed(() =>
    props.severity == "Error"
        ? "red"
        : props.severity == "Warning"
        ? "orange"
        : props.severity == "Success"
        ? "green"
        : props.severity == "Info"
        ? "blue"
        : "grey"
)


//

</script>

<style lang="scss" scoped>

</style>
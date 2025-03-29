<template>
    <v-card class="border pt-3">
        <v-card-title class="d-flex text-subtitle-1">
            <span>{{ output?.name }} is <span class="font-weight-bold">{{ condition?.type?.toUpperCase() }}</span></span>
            <v-spacer></v-spacer>
            <v-icon>{{ output?.icon }}</v-icon>
        </v-card-title>
        
        <v-card-actions>
            <v-card-subtitle>Unit: {{ output?.unit }}</v-card-subtitle>
            <v-spacer></v-spacer>
            <ThresholdConditionDialog 
                type="Update" 
                class="w-100 w-md-50" 
                :outputs="outputs"
                :initial="condition"
                @submit="i => emit('edit', i)"
            >
                <template #activator="{ props: activatorProps }">
                    <v-btn 
                        size="small"
                        icon="mdi-pencil"
                        color="blue" 
                        :="activatorProps"
                    ></v-btn>
                </template>
            </ThresholdConditionDialog>
            <v-btn 
                size="small"
                icon="mdi-delete"
                color="red" 
                @click="emit('delete', condition?.id)"
            ></v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { defineAsyncComponent } from "vue";

const ThresholdConditionDialog = defineAsyncComponent(() => import("@/components/user/greenhouse/ThresholdConditionDialog.vue"));


// ---events
const emit = defineEmits(['edit', 'delete'])

// ---props
const props = defineProps({
    output: {
        type: Object,
        required: true,
    },
    outputs: {
        type: Array,
        default: [],
    },
    condition: {
        type: Object,
        required: true,
    },
});



</script>

<style lang="scss" scoped></style>

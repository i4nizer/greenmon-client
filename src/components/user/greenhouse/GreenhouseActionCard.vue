<template>
    <v-card class="border pt-3">
        <v-card-title class="d-flex ga-1 text-subtitle-1">
            <span class="text-truncate" style="white-space: normal;">{{ action?.name }}</span>
            <v-spacer></v-spacer>
            <v-icon>{{ input?.icon }}</v-icon>
        </v-card-title>
        
        <v-card-actions>
            <v-card-subtitle v-if="$vuetify.display.smAndUp">
                <span>Input: {{ action?.value }}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span>Delay: {{ action?.delay }}s&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span>Duration: {{ action?.duration <= -1 ? 'Endless' : `${action?.duration}s` }}</span>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span>Precedence: {{ action?.precedence }}</span>
            </v-card-subtitle>
            <v-spacer></v-spacer>
            <GreenhouseActionDialog 
                type="Update" 
                class="w-100 w-md-50" 
                :inputs="inputs"
                :initial="action"
                :schedules="schedules"
                :thresholds="thresholds"
                :referenced="referenced"
                @submit="o => emit('edit', o)"
            >
                <template #activator="{ props: activatorProps }">
                    <v-btn 
                        size="small"
                        icon="mdi-pencil"
                        color="blue" 
                        :="activatorProps"
                    ></v-btn>
                </template>
            </GreenhouseActionDialog>
            <v-btn 
                size="small"
                icon="mdi-delete"
                color="red" 
                @click="emit('delete', action?.id)"
            ></v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { defineAsyncComponent } from "vue";

const GreenhouseActionDialog = defineAsyncComponent(() => import("@/components/user/greenhouse/GreenhouseActionDialog.vue"));


// ---events
const emit = defineEmits(['edit', 'delete'])

// ---props
const props = defineProps({
    input: {
        type: Object,
        required: true,
    },
    inputs: {
        type: Array,
        default: [],
    },
    action: {
        type: Object,
        required: true,
    },
    schedules: {
        type: Array,
        default: [],
    },
    thresholds: {
        type: Array,
        default: [],
    },
    referenced: {
        type: String,
        default: 'Greenhouse'
    },
});



</script>

<style lang="scss" scoped></style>

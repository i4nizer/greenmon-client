<template>
    <v-card class="border pt-3">
        <v-card-title class="d-flex text-subtitle-1 text-wrap">
            <span>{{ output?.name }}</span>
            <v-spacer></v-spacer>
            <v-icon>{{ output?.icon }}</v-icon>
        </v-card-title>
        
        <v-card-actions>
            <v-card-subtitle v-if="$vuetify.display.smAndUp">Unit: {{ output?.unit }}</v-card-subtitle>
            <v-spacer></v-spacer>
            <SensorOutputDialog 
                type="Update" 
                class="w-100 w-md-50" 
                :pins="pins" 
                :initial="output"
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
            </SensorOutputDialog>
            <v-btn 
                size="small"
                icon="mdi-delete"
                color="red" 
                @click="emit('delete', output?.id)"
            ></v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { defineAsyncComponent } from "vue";

const SensorOutputDialog = defineAsyncComponent(() => import("@/components/user/greenhouse/mcu/SensorOutputDialog.vue"));


// ---events
const emit = defineEmits(['edit', 'delete'])

// ---props
const props = defineProps({
    pins: {
        type: Array,
        default: [],
    },
    output: {
        type: Object,
        required: true,
    },
});



</script>

<style lang="scss" scoped></style>

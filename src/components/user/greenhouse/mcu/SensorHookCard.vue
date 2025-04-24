<template>
    <v-card class="border pt-3">
        <v-card-title class="d-flex ga-1 text-subtitle-1">
            <span class="text-truncate">Hook to {{ action?.name }}</span>
            <v-spacer></v-spacer>
            <v-icon>mdi-hook</v-icon>
        </v-card-title>

        <v-card-text class="pb-0">
            <span class="font-weight-bold">{{ action?.name }}&nbsp;</span>
            <span>will be executed <span class="font-weight-bold">{{ hook?.type }}</span> sensor reads.</span>
        </v-card-text>
        
        <v-card-actions>
            <v-spacer></v-spacer>
            <SensorHookDialog 
                type="Update" 
                class="w-100 w-md-50" 
                :pins="pins" 
                :sensor="sensor"
                :actions="actions"
                :initial="hook"
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
            </SensorHookDialog>
            <v-btn 
                size="small"
                icon="mdi-delete"
                color="red" 
                @click="emit('delete', hook?.id)"
            ></v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { defineAsyncComponent } from "vue";

const SensorHookDialog = defineAsyncComponent(() => import("@/components/user/greenhouse/mcu/SensorHookDialog.vue"));


// ---events
const emit = defineEmits(['edit', 'delete'])

// ---props
const props = defineProps({
    pins: {
        type: Array,
        default: [],
    },
    hook: {
        type: Object,
        required: true,
    },
    sensor: {
        type: Object,
        required: true,
    },
    action: {
        type: Object,
        required: true,
    },
    actions: {
        type: Array,
        default: [],
    },
});



</script>

<style lang="scss" scoped></style>

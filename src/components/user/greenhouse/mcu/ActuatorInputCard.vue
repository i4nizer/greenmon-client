<template>
    <v-card class="border pt-3">
        <v-card-title class="d-flex text-subtitle-1 text-wrap">
            <span>{{ input?.name }}</span>
            <v-spacer></v-spacer>
            <v-icon>{{ input?.icon }}</v-icon>
        </v-card-title>
        
        <v-card-actions>
            <v-card-subtitle v-if="$vuetify.display.smAndUp">
                <span>Type: {{ input?.type == 'Boolean' ? 'ON/OFF':'Numerical Input' }}</span>
                <v-spacer></v-spacer>
                <span>Flag: {{ input?.flag }}</span>
                <v-spacer></v-spacer>
                <span>Status: {{ input?.status }}</span>
            </v-card-subtitle>
            <v-spacer></v-spacer>
            <ActuatorInputDialog 
                type="Update" 
                class="w-100 w-md-50" 
                :pins="pins" 
                :initial="input"
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
            </ActuatorInputDialog>
            <v-btn 
                size="small"
                icon="mdi-delete"
                color="red" 
                @click="emit('delete', input?.id)"
            ></v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { defineAsyncComponent } from "vue";

const ActuatorInputDialog = defineAsyncComponent(() => import("@/components/user/greenhouse/mcu/ActuatorInputDialog.vue"));


// ---events
const emit = defineEmits(['edit', 'delete'])

// ---props
const props = defineProps({
    pins: {
        type: Array,
        default: [],
    },
    input: {
        type: Object,
        required: true,
    },
});



</script>

<style lang="scss" scoped></style>

<template>
    <v-card class="border pt-3">
        <v-card-title class="d-flex text-subtitle-1">
            <span>{{ action?.name }}</span>
            <v-spacer></v-spacer>
            <v-icon>{{ input?.icon }}</v-icon>
        </v-card-title>
        
        <v-card-actions>
            <v-card-subtitle v-if="$vuetify.display.smAndUp">Duration: {{ action?.duration }} seconds</v-card-subtitle>
            <v-card-subtitle v-if="$vuetify.display.smAndUp">Precedence: {{ action?.precedence }}</v-card-subtitle>
            <v-spacer></v-spacer>
            <ScheduleActionDialog 
                type="Update" 
                class="w-100 w-md-50" 
                :inputs="inputs"
                :initial="action"
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
            </ScheduleActionDialog>
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

const ScheduleActionDialog = defineAsyncComponent(() => import("@/components/user/greenhouse/ScheduleActionDialog.vue"));


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
});



</script>

<style lang="scss" scoped></style>

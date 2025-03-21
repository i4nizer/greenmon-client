<template>
    <v-card class="border pt-3">
        <v-card-title class="d-flex">
            <v-icon>mdi-chip</v-icon>
            <span class="ml-2">{{ mcu?.name }}</span>
        </v-card-title>

        <v-card-text class="text-grey">{{ mcu?.label }}</v-card-text>

        <v-card-actions>
            <v-btn @click="emit('view', mcu?.id)">
                <v-icon class="mr-1">mdi-cog</v-icon>
                <span v-if="$vuetify.display.smAndUp">View</span>
            </v-btn>
            <GreenhouseMcuDialog
                class="w-100 w-md-50"
                :type="'Update'"
                :initial="mcu"
                @submit="(m) => emit('edit', m)"
            >
                <template #activator="{ props: activatorProps }">
                    <v-btn color="blue" :="activatorProps">
                        <v-icon class="mr-1">mdi-pencil</v-icon>
                        <span v-if="$vuetify.display.smAndUp">Edit</span>
                    </v-btn>
                </template>
            </GreenhouseMcuDialog>
            <v-btn color="red" @click="emit('delete', mcu?.id)">
                <v-icon class="mr-1">mdi-delete</v-icon>
                <span v-if="$vuetify.display.smAndUp">Delete</span>
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { defineAsyncComponent } from "vue";

const GreenhouseMcuDialog = defineAsyncComponent(() => import("@/components/user/greenhouse/GreenhouseMcuDialog.vue"));


// ---events
const emit = defineEmits(["view", "edit", "delete"]);

// ---props
const props = defineProps({
    mcu: {
        type: Object,
        required: true,
    },
});
</script>

<style lang="scss" scoped></style>

<template>
    <v-card class="border pt-3">
        <v-card-title class="d-flex"    >
            <v-icon>mdi-camera</v-icon>
            <span class="ml-2" :class="camera?.connected ? 'text-green':''">{{ camera?.name }}</span>
        </v-card-title>

        <v-card-text class="text-grey">{{ camera?.label }}</v-card-text>

        <v-card-actions>
            <v-btn @click="emit('view', camera?.id)">
                <v-icon class="mr-1">mdi-cog</v-icon>
                <span v-if="$vuetify.display.smAndUp">View</span>
            </v-btn>
            <GreenhouseCameraDialog
                class="w-100 w-md-50"
                :type="'Update'"
                :initial="camera"
                @submit="(c) => emit('edit', c)"
            >
                <template #activator="{ props: activatorProps }">
                    <v-btn color="blue" :="activatorProps">
                        <v-icon class="mr-1">mdi-pencil</v-icon>
                        <span v-if="$vuetify.display.smAndUp">Edit</span>
                    </v-btn>
                </template>
            </GreenhouseCameraDialog>
            <v-btn color="red" @click="emit('delete', camera?.id)">
                <v-icon class="mr-1">mdi-delete</v-icon>
                <span v-if="$vuetify.display.smAndUp">Delete</span>
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { defineAsyncComponent } from "vue";

const GreenhouseCameraDialog = defineAsyncComponent(() => import("@/components/user/greenhouse/GreenhouseCameraDialog.vue"));


// ---events
const emit = defineEmits(["view", "edit", "delete"]);

// ---props
const props = defineProps({
    camera: {
        type: Object,
        required: true,
    },
});
</script>

<style lang="scss" scoped></style>

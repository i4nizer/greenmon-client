<template>
    <v-dialog>
        <template #activator="{ props: activatorProps }">
            <slot name="activator" :="{ props: activatorProps }"></slot>
        </template>
        <template #default="{ isActive }">
            
        </template>
    </v-dialog>
</template>

<script setup>


const ImageDetectionCard = defineAsyncComponent(() => import("@/components/user/greenhouse/camera/ImageDetectionCard.vue"))

//

// ---props
const props = defineProps({
    src: {
        type: String,
        default: '',
    },
    boundingBoxes: {
        type: Array,
        default: [],
    },
})

// 


</script>

<style scoped>

</style>
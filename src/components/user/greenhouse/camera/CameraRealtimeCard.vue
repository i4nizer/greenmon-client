<template>
    <v-card class="border pt-3">
        <v-card-title>
            <v-icon>mdi-camera</v-icon>
            <span class="ml-2">{{ camera?.name }}</span>
        </v-card-title>
        <v-card-subtitle>{{ camera?.label }}</v-card-subtitle>
        <v-card-text>
            <v-img  
                :src="base64url"
            ></v-img>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { useCameraStore } from "@/stores/camera.store"
import { addWsEvent, connectWebSocket, delWsEvent } from "@/utils/ws.util"
import { onBeforeUnmount, onMounted, reactive, ref } from "vue"


// ---props
const props = defineProps({
    camera: {
        type: Object,
        required: true,
    },
})

// ---stores
const { updateCamera } = useCameraStore()

// ---data
const wsEvents = reactive([])
const base64url = ref('')

// ---actions


// ---events
const onImageRealtime = (data) => {
    console.log(data) 
    for (const image of data) {
        if (image?.cameraId != props.camera?.id) continue

        base64url.value = image?.base64img
    }
}

// ---hooks
onMounted(async () => {

    await updateCamera({ ...props.camera, interval: 0, detect: false })
        .catch(console.error)

    connectWebSocket()
    wsEvents.push(addWsEvent('image-realtime', onImageRealtime, "Create"))
})

onBeforeUnmount(async () => {

    await updateCamera({ ...props.camera })
    
    while (wsEvents.length > 0) delWsEvent(wsEvents.shift())
})

</script>

<style lang="scss" scoped>

</style>
<template>
    <v-card class="border pa-5">
        <v-card-text class="overflow-wrap">
            <video
                autoplay
                ref="videoRef"
                class="position-absolute w-100 h-100"
                style="left: -9999px;"
            ></video>
            <div class="text-center text-wrap overflow-wrap">
                <canvas
                    ref="canvasRef"
                    class="border"
                    style="width: min(70dvh, 100%); aspect-ratio: 1;"
                    :width="canvasSize.width"
                    :height="canvasSize.height"
                ></canvas>
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { useSize } from '@/composables/size.composable';
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue';

//

// ---events
const emit = defineEmits(['paintFrame'])

// ---props
const props = defineProps({
    videoSrcObject: {
        type: Object,
        default: null,
    },
    boundingBoxes: {
        type: Array,
        default: [],
    },
})

// ---composables
const { observe, stop } = useSize()

// ---refs
const videoRef = ref(null)
const canvasRef = ref(null)

// ---data
const canvasCtx = ref(null)
const canvasSize = reactive({ width: 1000, height: 1000 })

// ---actions
const denormalize = (base, box) => {
    const x = base.width * box.x
    const y = base.height * box.y
    const w = base.width * box.w
    const h = base.height * box.h

    return { x, y, w, h }
}

const drawBox = (ctx, box, color, thickness) => {
    const { x, y, w, h } = box

    ctx.strokeStyle = color;
    ctx.setLineDash([6, 4]);
    ctx.lineWidth = thickness;
    ctx.strokeRect(x, y, w, h);
}

const drawLabel = (ctx, text, pad, box, bg, color = 'white') => {
    const { x, y, w, h } = box
    const { x: px, y: py } = pad

    const metrics = ctx.measureText(text)
    const tw = metrics.width
    const th = metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent

    const textRect = {
        x: x + px,
        y: y - th,
        w: tw,
        h: th
    }

    const bgRect = {
        x: x,
        y: y - (py * 2) - th,
        w: tw + (px * 2),
        h: th + (py * 2)
    }

    ctx.fillStyle = bg
    ctx.fillRect(bgRect.x, bgRect.y, bgRect.w, bgRect.h)

    ctx.fillStyle = color
    ctx.font = 'normal normal 12px Roboto'
    ctx.fillText(text, textRect.x, textRect.y)
}

const drawBoundingBox = (ctx, canvas, bbox) => {
    const { box, class: label, confidence } = bbox
    const dbox = denormalize(canvas, box)

    const pad = { x: 6, y: 6 }
    const text = `${label} ${confidence.toFixed(2)}`
    const color = label.includes('Nitrogen')
        ? 'orange'
        : label.includes('Phosphorus')
        ? 'purple'
        : label.includes('Potassium')
        ? 'brown' : 'green';

    drawBox(ctx, dbox, color, 2)
    drawLabel(ctx, text, pad, dbox, color, 'white')
}

// ---events
const onVideoFrame = () => {
    const { width, height } = canvasRef.value

    canvasCtx.value.imageSmoothingEnabled = false
    canvasCtx.value.drawImage(videoRef.value, 0, 0, width, height)

    for (const bbox of props.boundingBoxes) {
        drawBoundingBox(canvasCtx.value, canvasSize, bbox)
    }

    emit('paintFrame', canvasRef.value)
    videoRef.value.requestVideoFrameCallback(onVideoFrame)
}

const onResizeCanvas = (size) => {
    canvasSize.width = size.width
    canvasSize.height = size.height
}

// ---watchers
watch(() => props.videoSrcObject, nv => {
    if (!nv || !videoRef.value) return;
    videoRef.value.srcObject = nv
})

// ---hoooks
onMounted(() => {
    videoRef.value.srcObject = props.videoSrcObject
    videoRef.value.addEventListener('play', onVideoFrame)
    canvasCtx.value = canvasRef.value?.getContext('2d')
    observe(canvasRef.value, onResizeCanvas)
})

onUnmounted(() => stop())

//

</script>

<style lang="scss" scoped>

</style>
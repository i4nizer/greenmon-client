<template>
    <v-card class="border pa-1">
        <v-card-text class="overflow-wrap">
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
import { useSize } from '@/composables/size.composable'
import { onMounted, onUnmounted, ref, reactive, watch } from 'vue'

//

// ---events
const emit = defineEmits(['loadImage'])

// ---props
const props = defineProps({
    src: {
        type: String,
        default: "",
    },
    boundingBoxes: {
        type: Array,
        default: [],
    },
})

// ---composables
const { observe: observeCanvas, stop: stopObserveCanvas } = useSize()

// ---refs
const imageRef = ref(new Image())
const canvasRef = ref(null)

// ---data
const canvasCtx = ref(null)
const canvasSize = reactive({ width: 4000, height: 4000 })

// ---state
const state = reactive({ painted: false, resizing: false, visible: true })

// ---observer
const observer = new IntersectionObserver((e) => onIntersect(e), { threshold: 0.1 })

// ---watchers
watch(props, (nv, ov) => {
    state.painted = nv.src != ov.src
    imageRef.value.src = nv.src
})

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
const onLoadImage = async () => {
    if (state.painted || state.resizing || !state.visible) return
    if (!imageRef.value || !canvasRef.value) return

    // get aspect ratio
    const { naturalWidth: imgW, naturalHeight: imgH } = imageRef.value
    
    // crop centered
    const side = Math.min(imgW, imgH)
    const sideX = (imgW - side) / 2
    const sideY = (imgH - side) / 2
    
    const { width, height } = canvasRef.value
    canvasCtx.value.imageSmoothingEnabled = false
    canvasCtx.value.drawImage(imageRef.value, sideX, sideY, side, side, 0, 0, width, height)
    
    emit('loadImage', canvasRef.value)

    for (const bbox of props.boundingBoxes) {
        drawBoundingBox(canvasCtx.value, canvasSize, bbox)
    }

    state.painted = true
}

const onIntersect = async (entries) => {
    entries?.forEach(e => {
        state.visible = e.isIntersecting
        if (e.isIntersecting) onLoadImage()
        else state.painted = false
    })
}

const onResizeCanvas = async (size) => {
    state.painted = false
    state.resizing = true
    canvasSize.width = size.width
    canvasSize.height = size.height
    state.resizing = false
    await new Promise(res => setTimeout(() => res(), 20))
    await onLoadImage()
}

// ---hooks
onMounted(() => {
    imageRef.value.onload = onLoadImage
    imageRef.value.src = props.src
    canvasCtx.value = canvasRef.value?.getContext('2d')
    observeCanvas(canvasRef.value, onResizeCanvas)
    observer.observe(canvasRef.value)
})

onUnmounted(() => {
    stopObserveCanvas()
    observer.disconnect()
})

//

</script>

<style lang="scss" scoped>

</style>
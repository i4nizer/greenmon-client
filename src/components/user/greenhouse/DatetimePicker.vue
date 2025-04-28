<template>
    <v-dialog class="w-100 w-md-50" v-model="dialog">
        <template #activator="{ props: activatorProps }">
            <slot name="activator" :="{ props: activatorProps }"></slot>
        </template>
        <v-card class="overflow-auto">
            <v-card-text class="d-flex flex-wrap justify-center">
                <v-date-picker
                    v-model="datetime.dateStr"
                    @update:model-value="v => datetime.date = getDate(v, datetime.timeStr)"
                ></v-date-picker>
                <v-time-picker
                    use-seconds
                    format="12hr"
                    v-model="datetime.timeStr"
                    @update:model-value="v => datetime.date = getDate(datetime.dateStr, v)"
                ></v-time-picker>
            </v-card-text>
            <v-card-actions class="d-flex flex-wrap justify-center">
                <v-btn
                    text="Cancel"
                    color="red"
                    @click="dialog = false"
                ></v-btn>
                <v-btn
                    text="Okay"
                    color="blue"
                    @click="onOK"
                ></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { reactive, ref, toRaw } from 'vue';


// ---events
const emit = defineEmits(['change'])

// ---props
const props = defineProps({
    date: {
        type: Date,
        default: new Date(),
    },
    dateStr: {
        type: String,
        default: new Date().toISOString().substring(0, 10),
    },
    timeStr: {
        type: String,
        default: new Date().toTimeString().substring(0, 7),
    },
})

// ---data
const dialog = ref(false)
const datetime = reactive({
    date: props.date ? new Date(props.date) : new Date(),
    dateStr: props.dateStr || new Date().toISOString().substring(0, 10),
    timeStr: props.timeStr || new Date().toTimeString().substring(0, 7),
})

// ---actions
const getDate = (dateStr, timeStr) => new Date(`${new Date(dateStr).toISOString().substring(0, 10)}T${timeStr}.000Z`)

// ---events
const onOK = () => {
    const data = { ...toRaw(datetime) }
    emit('change', data)
    dialog.value = false
}


</script>

<style scoped>

</style>
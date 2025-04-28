<template>
    <div class="d-flex flex-wrap align-center ga-1">
        <v-number-input
            hide-details
            label="Interval"
            prefix="Minutes"
            v-model="data.interval"
        ></v-number-input>
        <v-spacer></v-spacer>
        <DatetimePicker 
            class="w-100 d-flex" 
            :date="new Date(data.start)"
            :date-str="data.start.substring(0, 10)"
            :time-str="data.start.substring(11, 19)"
            @change="v => data.start = v.date.toISOString()"
        >
            <template #activator="{ props: activatorProps }">
                <v-btn
                    color="grey-darken-4"
                    :text="date.format(data.start, 'fullDateTime12h')"
                    :="activatorProps"
                ></v-btn>
            </template>
        </DatetimePicker>
        <span>&nbsp;to&nbsp;</span>
        <DatetimePicker 
            class="w-100" 
            :date="new Date(data.end)"
            :date-str="data.end.substring(0, 10)"
            :time-str="data.end.substring(11, 19)"
            @change="v => data.end = v.date.toISOString()"
        >
            <template #activator="{ props: activatorProps }">
                <v-btn
                    color="grey-darken-4"
                    :text="date.format(data.end, 'fullDateTime12h')"
                    :="activatorProps"
                ></v-btn>
            </template>
        </DatetimePicker>
    </div>
</template>

<script setup>
import equal from 'fast-deep-equal';
import { computed, defineAsyncComponent, reactive, toRaw, watch } from 'vue';
import { useDate } from 'vuetify';

const DatetimePicker = defineAsyncComponent(() => import("@/components/user/greenhouse/DatetimePicker.vue"))


// ---events
const emit = defineEmits(['change'])

// ---props
const props = defineProps({
    end: {
        type: String,
        default: new Date().toISOString(),
    },
    start: {
        type: String,
        default: new Date().toISOString(),
    },
    interval: {
        type: Number,
        default: 60 * 24,
    },
})

// ---composables
const date = useDate()

// ---data
const data = reactive({
    end: props.end,
    start: props.start,
    interval: props.interval,
})

// ---getters
const changed = computed(() => !equal(toRaw(data), toRaw(props)))

// ---watchers
watch(data, (nv, ov) => {
    if (!changed) return;
    data.interval = isNaN(data.interval) || data.interval < 5 ? 5 : data.interval
    emit('change', { ...toRaw(nv) })
})



</script>

<style scoped>

</style>
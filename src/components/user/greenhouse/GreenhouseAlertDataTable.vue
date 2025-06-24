<template>
    <v-data-table
        hide-default-footer
        class="border rounded"
        :items="alerts"
        :headers="headers"
        :items-per-page="alerts.length"
    >
        <template #item="{ item, index }">
            <tr :class="index % 2 == 0 ? 'bg-white' : 'bg-grey-lighten-3'">
                <td>
                    <div class="font-weight-bold">{{ item?.title }}</div>
                </td>
                <td>
                    <v-chip :color="getSeverityColorStr(item?.severity)">
                        <v-icon>{{ getSeverityIconStr(item?.severity) }}</v-icon>
                        <span class="ml-2">{{ item?.severity }}</span>
                    </v-chip>
                </td>
                <td>
                    <v-icon 
                        v-tooltip="item?.viewed ? 'Viewed' : 'Not Viewed'"
                        :icon="item?.viewed ? 'mdi-eye' : 'mdi-eye-off'"
                        :color="item?.viewed ? 'blue-grey' : 'grey'"
                    ></v-icon>
                    <v-icon 
                        class="ml-2"
                        v-tooltip="item?.emailed ? 'Emailed' : 'Not Emailed'"
                        :icon="item?.emailed ? 'mdi-email' : 'mdi-email-off'"
                        :color="item?.emailed ? 'indigo' : 'grey'"
                    ></v-icon>
                </td>
                <td>{{ date.format(item?.createdAt, 'fullDateWithWeekday') }}</td>
                <td>
                    <GreenhouseAlertViewDialog
                        class="w-100 w-md-75 w-lg-50"
                        :alert="item"
                    >
                        <template #activator="{ props: activatorProps }">
                            <v-btn
                                text="View"
                                class="border"
                                elevation="0"
                                :="activatorProps"
                            ></v-btn>
                        </template>
                    </GreenhouseAlertViewDialog>
                </td>
            </tr>
        </template>
    </v-data-table>
</template>

<script setup>
import { defineAsyncComponent, reactive } from 'vue'
import { useDate } from 'vuetify'

const GreenhouseAlertViewDialog = defineAsyncComponent(() => import("@/components/user/greenhouse/GreenhouseAlertViewDialog.vue"))

//

// ---props
const props = defineProps({
    alerts: {
        type: Array,
        required: true,
    },
})

// ---composables
const date = useDate()

// ---data
const headers = reactive([
    { title: 'Alert', value: 'title' },
    { title: 'Severity', value: 'severity' },
    { title: 'Status', value: 'status' },
    { title: 'Date', value: 'createdAt' },
    { title: 'Actions', value: 'actions' },
])

// ---actions
const getSeverityIconStr = (severity) => {
    return severity == "Error"
        ? "mdi-close-outline"
        : severity == "Warning"
        ? "mdi-alert-outline"
        : severity == "Success"
        ? "mdi-check-outline"
        : "mdi-information-outline"
}

const getSeverityColorStr = (severity) => {
    return severity == 'Error'
        ? 'red'
        : severity == 'Warning'
        ? 'orange'
        : severity == 'Info'
        ? 'blue'
        : severity == 'Success'
        ? 'green'
        : 'grey'
}

//

</script>

<style scoped>

</style>
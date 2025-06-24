<template>
    <v-card class="pt-3">
        <v-card-title class="pl-7">Alerts</v-card-title>
        <v-card-subtitle class="pl-7">Filter through all system alerts.</v-card-subtitle>
        <v-card-text>
            <v-container fluid>
                <v-row justify="end">
                    <!-- Filter Section -->
                    <v-col cols="12" sm="12" md="6" lg="5">
                        <v-select
                            chips
                            multiple
                            hide-details
                            label="Status"
                            v-model="filter.status"
                            :items="['Viewed', 'Not Viewed', 'Emailed', 'Not Emailed']"
                            @update:model-value="emit('filter', filter)"
                        ></v-select>
                    </v-col>
                    <v-col cols="12" sm="12" md="6" lg="5">
                        <v-select
                            chips
                            multiple
                            hide-details
                            label="Severity"
                            v-model="filter.severity"
                            :items="['Success', 'Info', 'Warning', 'Error']"
                            @update:model-value="emit('filter', filter)"
                        ></v-select>
                    </v-col>
                    <v-col cols="12" sm="8" md="6" lg="2">
                        <v-select
                            chips
                            hide-details
                            label="Limit"
                            variant="outlined"
                            density="compact"
                            v-model="pagination.limit"
                            :items="[25, 50, 100, 150, 200, 250]"
                            @update:model-value="emit('paginate', { ...pagination })"
                        ></v-select>
                    </v-col>
                </v-row>
                <v-row>
                    <!-- Alert List Section -->
                    <v-col cols="12">
                        <GreenhouseAlertDataTable
                            :alerts="alerts"
                        ></GreenhouseAlertDataTable>
                    </v-col>
                </v-row>
                <v-row>
                    <!-- Pagination Section -->
                    <v-col>
                        <v-pagination
                            v-model="pagination.page"
                            :length="Math.ceil(pagination.count == 0 ? 0 : pagination.count / pagination.limit)"
                            :total-visible="5"
                            @update:model-value="emit('paginate', { ...pagination })"
                        ></v-pagination>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { defineAsyncComponent, reactive, watch } from 'vue';

const GreenhouseAlertDataTable = defineAsyncComponent(() => import("@/components/user/greenhouse/GreenhouseAlertDataTable.vue"))

//

// ---events
const emit = defineEmits(['filter', 'paginate'])

// ---props
const props = defineProps({
    alerts: {
        type: Array,
        required: true,
    },
    filter: {
        type: Object,
        required: true,
    },
    pagination: {
        type: Object,
        required: true,
    },
})

// ---data
const filter = reactive({
    status: [...props.filter?.status] || ['Viewed', 'Not Viewed', 'Emailed', 'Not Emailed'],
    severity: [...props.filter?.severity] || ['Success', 'Info', 'Warning', 'Error']
})
const pagination = reactive({
    page: props.pagination?.page || 0,
    limit: props.pagination?.limit || 50,
    count: props.pagination?.count || 0,
})

// ---watchers
watch(props.pagination, nv => pagination.count = nv?.count)



// ---events
// const onFilter = () => emit('filter', {  })

//

</script>

<style scoped>

</style>
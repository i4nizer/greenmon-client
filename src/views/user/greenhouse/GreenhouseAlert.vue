<template>
    <GreenhouseLayout>
        <v-container class="pa-5 py-7" fluid>
            <v-row justify="center" align-content="center">
                <v-img
                    src="https://res.cloudinary.com/dqgnetjlz/image/upload/f_auto,q_auto/v1749725689/bg-doa.png"
                    class="position-fixed top-0 h-100 w-75 w-sm-50 w-md-33 w-lg-25 opacity-50"
                ></v-img>
            </v-row>
            <v-row>
                <v-col>
                    <h3>Greenhouse Alert</h3>
                </v-col>
            </v-row>
            <v-row>
                <!-- Alert Count Total -->
                <v-col v-if="alerts.length > 0" cols="12" xs="12" sm="6" md="4" lg="3" xl="2" xxl="1">
                    <GreenhouseAlertCountCard
                        class="border"
                        :count="pagination?.count"
                        :severity="`Total Alerts`"
                    ></GreenhouseAlertCountCard>
                </v-col>
                <!-- Alert Count Lists -->
                <v-col v-for="k in Object.keys(severities)" cols="12" xs="12" sm="6" md="4" lg="3" xl="2" xxl="1">
                    <GreenhouseAlertCountCard
                        class="border"
                        :count="severities[k]"
                        :severity="k"
                    ></GreenhouseAlertCountCard>
                </v-col>
                <!-- Fallback/emptystate when no alerts -->
                <v-col v-if="alerts.length <= 0">
                    <v-empty-state
                        icon="mdi-alert"
                        text="There are no alert yet."
                        title="No alert yet"
                    ></v-empty-state>
                </v-col>
            </v-row>
            <v-row>
                <!-- Filterable Lists of Alerts -->
                <v-col cols="12">
                    <GreenhouseAlertListCard
                        class="border"
                        :alerts="alerts"
                        :filter="filter"
                        :loading="state.fetching"
                        :disabled="state.fetching"
                        :pagination="pagination"
                        @filter="onFilter"
                        @paginate="onPaginate"
                    ></GreenhouseAlertListCard>
                </v-col>
            </v-row>
        </v-container>
    </GreenhouseLayout>
</template>

<script setup>
import api from "@/utils/api.util";
import { computed, defineAsyncComponent, onBeforeMount, reactive } from "vue";
import { useRoute } from "vue-router";

const GreenhouseLayout = defineAsyncComponent(() => import("@/views/user/greenhouse/GreenhouseLayout.vue"));
const GreenhouseAlertCountCard = defineAsyncComponent(() => import("@/components/user/greenhouse/GreenhouseAlertCountCard.vue"));
const GreenhouseAlertListCard = defineAsyncComponent(() => import("@/components/user/greenhouse/GreenhouseAlertListCard.vue"));

// ---stores


// ---composables
const route = useRoute();

// ---data
const alerts = reactive([])

// ---filtering
const filter = reactive({
    status: ['Viewed', 'Not Viewed', 'Emailed', 'Not Emailed'],
    severity: ['Success', 'Info', 'Warning', 'Error']
})
const pagination = reactive({
    page: 1,
    limit: 25,
    count: 0,
})

// ---getters
const greenhouseId = route.params.greenhouseId;
const severities = computed(() => {
    const sevs = {}
    alerts.forEach(a => Object.keys(sevs).includes(a.severity) ? sevs[a.severity] += 1 : sevs[a.severity] = 0)
    return sevs
})

// ---state
const state = reactive({ fetching: false });

// ---actions
const fetchData = async () => {
    state.fetching = true

    const { status, severity } = filter
    const { page, limit } = pagination
    const [viewed, emailed] = [
        status.includes('Viewed') && !status.includes('Not Viewed') ? true
            : status.includes('Not Viewed') && !status.includes('Viewed') ? false
            : undefined,
        status.includes('Emailed') && !status.includes('Not Emailed') ? true
            : status.includes('Not Emailed') && !status.includes('Emailed') ? false
            : undefined,
    ]

    const url = `/user/greenhouse/alert`
    let query = `?greenhouseId=${greenhouseId}&offset=${(page - 1) * limit}&limit=${limit}`
    query += viewed == undefined ? '' : `&viewed=${viewed}`
    query += emailed == undefined ? '' : `&emailed=${emailed}`
    query += severity.length <= 0 ? '' : `&severity=${severity?.join(',')}`

    await api.get(url + query)
        .then(res => {
            alerts.splice(0, alerts.length)
            alerts.push(...res.data?.alerts)
            pagination.count = res.data.count
        })
        .catch(console.err)
        .finally(_ => state.fetching = false)
}

// ---events
const onFilter = async (f) => {
    filter.status.splice(0, filter.status.length)
    filter.status.push(...f.status)
    filter.severity.splice(0, filter.severity.length)
    filter.severity.push(...f.severity)
    await fetchData()
}

const onPaginate = async (p) => {
    pagination.page = p.page
    pagination.limit = p.limit
    pagination.count = p.count
    await fetchData()
}

// ---hooks
onBeforeMount(async () => await fetchData().catch(err => console.log(err)))

//

</script>

<style lang="scss" scoped></style>

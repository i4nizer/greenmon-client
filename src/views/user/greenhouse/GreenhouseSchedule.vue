<template>
    <GreenhouseLayout>
        <v-container class="pa-5 py-7" fluid>
            <v-row>
                <v-col>
                    Schedule
                </v-col>
            </v-row>
        </v-container>
    </GreenhouseLayout>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const GreenhouseLayout = defineAsyncComponent(() => import("@/views/user/greenhouse/GreenhouseLayout.vue"))



</script>

<style lang="scss" scoped>

</style>
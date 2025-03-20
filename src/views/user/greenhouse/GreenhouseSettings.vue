<template>
    <GreenhouseLayout>
        <v-container fluid>
            <v-row>
                <v-col>
                    Settings
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
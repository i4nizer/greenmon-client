<template>
    <GreenhouseLayout>
        <v-container class="pa-5 py-7" fluid>
            <v-row>
                <v-col>
                    <h3>Greenhouse Lettuce Detection</h3>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="text-end py-0">
                    <v-btn
                        link
                        to="/model/details"
                        text="Try Lettuce Detection"
                    ></v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-empty-state
                        icon="mdi-update"
                        text="This page is still on development."
                        title="Working On It"
                    ></v-empty-state>
                </v-col>
            </v-row>
        </v-container>
    </GreenhouseLayout>
</template>

<script setup>
import { computed, defineAsyncComponent, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const GreenhouseLayout = defineAsyncComponent(() => import("@/views/user/greenhouse/GreenhouseLayout.vue"))

//


//

</script>

<style scoped>

</style>
<template>
    <v-layout full-height>
        <McuNavDrawer></McuNavDrawer>
        <v-main>
            <slot></slot>
        </v-main>
    </v-layout>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';


const McuNavDrawer = defineAsyncComponent(() => import("@/views/user/greenhouse/mcu/McuNavDrawer.vue"))



</script>

<style lang="scss" scoped>

</style>
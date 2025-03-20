<template>
    <v-layout full-height>
        <UserNavDrawer></UserNavDrawer>
        <v-main>
            <slot></slot>
        </v-main>
    </v-layout>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const UserNavDrawer = defineAsyncComponent(() => import("@/views/user/UserNavDrawer.vue"))



</script>

<style lang="scss" scoped>

</style>
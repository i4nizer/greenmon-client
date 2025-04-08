<template>
    <v-card class="border pa-5">
        <v-card-title>
            <span>This tool helps you identify nutrient deficiencies </span>
            <span>in lettuce plants using your camera.</span>
        </v-card-title>
        <v-card-text>
            <span>The detector can identify:</span>
            <br><br>
            <ul class="px-7">
                <li>Healthy Lettuce</li>
                <li>Nitrogen Deficiency</li>
                <li>Phosphorus Deficiency</li>
                <li>Potassium Deficiency</li>
            </ul>
            <br>
            <span>Simply point your camera at a lettuce plant and get real-time analysis.</span>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                to="/model/detect"
                text="Start Detection"
                color="white"
                class="bg-green px-4"
                :loading="btnLoading"
                :disabled="btnLoading"
            ></v-btn>
            <v-spacer></v-spacer>
        </v-card-actions>
    </v-card>
</template>

<script setup>


// ---props
const props = defineProps({
    btnLoading: {
        type: Boolean,
        default: false,
    }
})
</script>

<style lang="scss" scoped>

</style>
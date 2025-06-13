<template>
    <v-layout full-height>
        <!-- Top Navigation -->
        <v-app-bar class="border-b bg-green" elevation="0">
            <v-icon size="large" class="pl-8 pl-md-10">mdi-leaf</v-icon>
            <v-toolbar-title>Greenmon</v-toolbar-title>
            <template #append>
                <v-btn link disabled text="Tutorial"></v-btn>
                <v-btn link disabled text="Contact" class="ml-1"></v-btn>
                <v-btn link disabled text="About" classs="ml-1"></v-btn>
                <v-btn link to="/auth/sign-in" text="Sign In" class="bg-white ml-1 mr-4 mr-md-6"></v-btn>
            </template>
        </v-app-bar>

        <!-- Contents -->
        <v-main>
            <v-container class="pa-0" fluid>
                <v-row class="bg-green-lighten-5 py-5 px-5 px-md-8 px-lg-10" align="center">
                    <v-col cols="12" sm="12" md="6">
                        <v-chip text="Greenhouse Automation" prepend-icon="mdi-lightning-bolt"></v-chip>
                        <h1 class="text-h3 font-weight-black mt-4 my-0">Connect Everything.</h1>
                        <h1 class="text-h3 font-weight-black text-green my-0">Transform Everything.</h1>
                        <p class="text-grey-darken-2 mt-5">
                            Unlock the power of the Internet of Things with our comprehensive platform. Connect devices, analyze data,
                            and automate processes to drive innovation and efficiency.
                        </p>
                        <v-btn
                            link
                            to="/auth/sign-up"
                            size="large"
                            text="Sign Up"
                            color="green"
                            class="mt-5"
                            elevation="0"
                            append-icon="mdi-login"
                        ></v-btn>
                        <v-btn
                            link
                            disabled
                            size="large"
                            text="Tutorial"
                            class="mt-5 ml-2 border"
                            elevation="0"
                            append-icon="mdi-school"
                        ></v-btn>
                    </v-col>
                    <v-col cols="12" sm="12" md="6" class="d-flex justify-center align-center">
                        <v-card class="w-100 pa-10 bg-transparent" elevation="0">
                            <v-card-text>
                                <v-img
                                    src="https://res.cloudinary.com/dqgnetjlz/image/upload/f_auto,q_auto/v1749725720/art-irrigation.png"
                                ></v-img>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row class="bg-white px-5 px-md-8 px-lg-10 my-0" style="min-height: 100dvh" align="center">
                    <v-col cols="12" sm="12" md="6">
                        <v-chip text="Featured Innovation" color="green" prepend-icon="mdi-lightning-bolt"></v-chip>
                        <h1 class="text-h4 font-weight-black mt-4 my-0">
                            <span>Smart IoT Greenhouse:&nbsp;</span>
                            <span class="text-green">Lettuce NPK Deficiency Detection</span>
                        </h1>
                        <p class="text-grey-darken-2 mt-5">
                            Revolutionary AI-powered camera system that automatically detects nutrient deficiencies in lettuce crops,
                            enabling farmers to take immediate action and optimize yield quality.
                        </p>
                        <p class="text-h6 mt-5">How It Works:</p>
                        <v-list>
                            <v-list-item>
                                <template #prepend>
                                    <v-chip text="1" class="font-weight-bold" color="green"></v-chip>
                                </template>
                                <div class="pl-4">
                                    <p>IoT Camera Capture</p>
                                    <p class="text-grey">IoT camera such as esp32cam captures image and sends it to the server.</p>
                                </div>
                            </v-list-item>
                            <v-list-item>
                                <template #prepend>
                                    <v-chip text="2" class="font-weight-bold" color="green"></v-chip>
                                </template>
                                <div class="pl-4">
                                    <p>AI Model Image Analysis</p>
                                    <p class="text-grey">
                                        The machine learning model then processes the image containing lettuce to check for nutrient
                                        deficiencies.
                                    </p>
                                </div>
                            </v-list-item>
                            <v-list-item>
                                <template #prepend>
                                    <v-chip text="3" class="font-weight-bold" color="green"></v-chip>
                                </template>
                                <div class="pl-4">
                                    <p>Alert & Recommendation</p>
                                    <p class="text-grey">
                                        Once deficiencies are found, the user is alerted with the image and given recommendations to
                                        solve the deficiency.
                                    </p>
                                </div>
                            </v-list-item>
                        </v-list>
                        <v-btn
                            link
                            to="/model/details"
                            text="Use Device Camera"
                            class="mt-2 mb-5 border"
                            color="green"
                            elevation="0"
                            append-icon="mdi-camera"
                        ></v-btn>
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                        <v-file-upload
                            v-if="!imageDataUrl"
                            clearable
                            title="Drag and Drop Lettce Image Here"
                            v-model="imageUpload"
                            :density="!imageUpload ? 'default' : 'compact'"
                            :disabled="state.mlLettuceModelLoading"
                            @update:model-value="onImageUpload"
                        ></v-file-upload>
                        <div v-if="imageDataUrl">
                            <ImageDetectionCard
                                class="border"
                                elevation="0"
                                :src="imageDataUrl"
                                :bounding-boxes="imageBoundingBoxes"
                            ></ImageDetectionCard>
                            <v-btn
                                color="white"
                                class="mt-3 w-100 border"
                                elevation="0"
                                :text="state.mlLettuceModelPredicting ? 'Predicting...' : 'Reset'"
                                :loading="state.imageLoading"
                                @click="resetImage"
                            ></v-btn>
                        </div>
                    </v-col>
                </v-row>
                <v-footer class="bg-green-darken-4 pa-5">
                    <span>© 2025 Greenmon. All rights reserved.</span>
                </v-footer>
            </v-container>
        </v-main>
    </v-layout>
</template>

<script setup>
import { techQuotes } from "@/configs/quote.config";
import { mlLettuceModelLoad, mlLettuceModelPredict, mlLettuceModelUnload } from "@/utils/model.util";
import { defineAsyncComponent, onBeforeMount, onBeforeUnmount, reactive, ref } from "vue";

const ImageDetectionCard = defineAsyncComponent(() => import("@/components/user/greenhouse/camera/ImageDetectionCard.vue"));

//

// ---data
const imageUpload = ref(null);
const imageDataUrl = ref(null);
const imageBoundingBoxes = reactive([]);

// ---state
const state = reactive({
    imageLoading: false,
    mlLettuceModelLoading: false,
    mlLettuceModelPredicting: false,
});

// ---actions
const resetImage = () => {
    imageUpload.value = null;
    imageDataUrl.value = null;
    imageBoundingBoxes.splice(0, imageBoundingBoxes.length);
};

// ---events
const onImageLoad = async (image) => {
    if (!image) return;
    imageBoundingBoxes.splice(0, imageBoundingBoxes.length);
    state.imageLoading = false;

    state.mlLettuceModelPredicting = true;
    await mlLettuceModelPredict(image)
        .then((bboxes) => imageBoundingBoxes.push(...bboxes))
        .catch(console.error);
    state.mlLettuceModelPredicting = false;
};

const onImageUpload = async (file) => {
    if (!file) return (imageDataUrl.value = null);
    state.imageLoading = true;

    const image = new Image();
    image.onload = async (e) => await onImageLoad(image);

    const reader = new FileReader();
    reader.onload = async (e) => {
        const dataUrl = e.target.result;
        imageDataUrl.value = dataUrl;
        image.src = dataUrl;
    };
    reader.readAsDataURL(file);
};

// ---hooks
onBeforeMount(async () => {
    state.mlLettuceModelLoading = true;
    await mlLettuceModelLoad().catch(console.error);
    state.mlLettuceModelLoading = false;
});

onBeforeUnmount(async () => {
    mlLettuceModelUnload();
});

//
</script>

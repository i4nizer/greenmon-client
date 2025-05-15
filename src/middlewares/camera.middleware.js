import { useCameraStore } from "@/stores/camera.store";



/** Requires valid cameraId parameter. */
const cameraBeforeEnter = async (to, from, next) => {
    // check cameraId params
    const { cameraId, greenhouseId } = to.params;
    if (!cameraId) return next(`/user/greenhouse/${greenhouseId}/dashboard`);

    // fetch cameras first
    const { cameras, retrieveCamera } = useCameraStore();
    await retrieveCamera(greenhouseId)
        .catch(console.error);

    // not exists
    const cameraIndex = cameras.findIndex((m) => m.id == cameraId);
    if (cameraIndex == -1) return next(`/user/greenhouse/${greenhouseId}/dashboard`);

    return next()
};



export {
    cameraBeforeEnter,
};

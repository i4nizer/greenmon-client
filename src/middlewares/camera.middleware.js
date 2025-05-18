import { useCameraStore } from "@/stores/camera.store";
import { mlLettuceModelLoad } from "@/utils/model.util";
import { wsConnect } from "@/utils/ws.util";

//

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

/** Early establishes web socket connection and loads model. */
const cameraRealtimeBeforeEnter = async (to, from, next) => {
    // connect web socket now
    wsConnect()

    // call for loading ml model
    mlLettuceModelLoad()

    return next()
}

//

export {
    cameraBeforeEnter,
    cameraRealtimeBeforeEnter
};

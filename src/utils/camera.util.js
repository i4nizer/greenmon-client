


/**
 * This returns an array of media devices available.
 */
const getVideoDevices = async () => {
    const permission = await navigator.permissions.query({ name: 'camera' })
    
    if (permission.state != 'granted') {
        await navigator.mediaDevices
            .getUserMedia({ video: true })
            .then((stream) => stream.getTracks())
            .then((tracks) => tracks.forEach((t) => t.stop()))
            .catch(console.error);
    }
    
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((device) => device.kind === "videoinput");
}

/**
 * This returns the stream of the device chosen by ID.
 */
const getVideoDeviceStream = async (deviceId) => {
    const config = { video: { deviceId: { exact: deviceId }, aspectRatio: { ideal: 1 } } };
    return await navigator.mediaDevices.getUserMedia(config);
}



export { getVideoDevices, getVideoDeviceStream }
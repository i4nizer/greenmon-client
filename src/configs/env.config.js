


/**
 * Constant variables used globally.
 */
const env = {
    // Current state
    env: "development",

    // Api info
    apiDomain: "http://localhost:4000",

    // Expiries in milliseconds
    otpLife: 300000,
    apiLife: 604800000,
    accessLife: 900000,
    refreshLife: 604800000,

    // Password reset in ms
    passwordResetDuration: 900000,

    // Otp config
    otpDigits: 6,

    // Model
    modelUrl: "http://localhost:4000/user/model/v1/model.json",
    modelName: "yolov11n-640",
    modelClasses: ['Healthy', 'Nitrogen Deficient', 'Phosphorus Deficient', 'Potassium Deficient'],
    modelInputSize: [640, 640],

    // Web Socket
    webSocketUrl: "ws://localhost:4000/ws-client",
};



export default env;
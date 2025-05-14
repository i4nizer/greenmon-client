


/**
 * Constant variables used globally.
 */
const env = {
    // Current state
    env: "development",

    // Api info
    apiDomain: "https://greenmon-api-production.up.railway.app",

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
    modelUrl: "https://greenmon-api-production.up.railway.app/user/model/v1/model.json",
    modelName: "yolov11n-640",
    modelClasses: ["Healthy", "Nitrogen Deficient", "Phosphorus Deficient", "Potassium Deficient"],
    modelInputSize: [640, 640],

    // Web Socket
    webSocketUrl: "wss://greenmon-api-production.up.railway.app/ws-client",
};



export default env;



/**
 * Constant variables used globally.
 */
const env = {
    // Current state
    env: import.meta.env.VITE_ENV,

    // Api info
    apiDomain: import.meta.env.VITE_API_DOMAIN,

    // Expiries in milliseconds
    otpLife: parseInt(import.meta.env.VITE_OTP_LIFE, 10),
    apiLife: parseInt(import.meta.env.VITE_API_LIFE, 10),
    accessLife: parseInt(import.meta.env.VITE_ACCESS_LIFE, 10),
    refreshLife: parseInt(import.meta.env.VITE_REFRESH_LIFE, 10),

    // Password reset in ms
    passwordResetDuration: parseInt(import.meta.env.VITE_PASSWORD_RESET_DURATION, 10),

    // Otp config
    otpDigits: parseInt(import.meta.env.VITE_OTP_DIGITS, 10),

    // Model
    modelUrl: import.meta.env.VITE_MODEL_URL,
    modelName: import.meta.env.VITE_MODEL_NAME,
    modelClasses: import.meta.env.VITE_MODEL_CLASSES?.split(",") || [],
    modelInputSize: import.meta.env.VITE_MODEL_INPUT_SIZE?.split(",")?.map((s) => parseInt(s, 10)) || [],

    // Web Socket
    webSocketUrl: import.meta.env.VITE_WEBSOCKET_URL,
};



export default env;
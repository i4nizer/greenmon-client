


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
};



export default env;
import env from "@/configs/env.config";

/**
 * @param {"String"|"Number"|"Array"} type The type of field to require.
 */
const required = (type = "String") => {
    const msg = "This field is required.";

    switch (type) {
        case "String":
            return (v) => (typeof v == "string" && !!v.trim()) || msg;
        case "Number":
            return (v) => (!isNaN(v) && v !== null && v !== "") ? true : msg;
        case "Array":
            return (v) => (Array.isArray(v) && v.length > 0) || msg;
        default:
            return (v) => !!v || msg;
    }
};

/**
 * @param {Number} x Minimum number or length before false.
 */
const min = (x) => {
    return (v) =>
        typeof v == "string" && v.length < x
            ? `This field must be ${x} characters or above.`
            : typeof v == "number" && v < x
            ? `This field must be ${x} or greater.`
            : true;
};

/**
 * @param {Number} x Maximum number or length before false.
 */
const max = (x) => {
    return (v) =>
        typeof v == "string" && v.length > x
            ? `This field must be ${x} characters or below.`
            : typeof v == "number" && v > x
            ? `This field must be ${x} or less.`
            : true;
};

/**
 * Uses regex to validate email.
 */
const email = () => {
    return (v) =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v)
        || "Please enter a valid email address";
};



export const useRules = () => {
    return {
        required,
        min,
        max,
        email,
    };
};




const sensorOutputIcons = [
    // General IoT Sensor Icons
    "mdi-access-point",
    "mdi-chip",
    "mdi-radar",
    "mdi-wifi",
    "mdi-signal-variant",

    // Environmental Sensors
    "mdi-thermometer",
    "mdi-thermometer-lines",
    "mdi-air-filter",
    "mdi-weather-windy",
    "mdi-cloud-percent",
    "mdi-water-percent",
    "mdi-molecule",
    "mdi-radiator",

    // Motion & Proximity Sensors
    "mdi-motion-sensor",
    "mdi-run-fast",
    "mdi-gesture-tap",
    "mdi-eye",
    "mdi-human-greeting",
    "mdi-leak",

    // Light & Optical Sensors
    "mdi-brightness-5",
    "mdi-lightbulb-on-outline",

    // Water & Liquid Sensors
    "mdi-water",
    "mdi-water-outline",

    // Gas & Chemical Sensors
    "mdi-gas-cylinder",
    "mdi-flask-outline",

    // Electrical & Energy Sensors
    "mdi-flash",
    "mdi-current-ac",
    "mdi-current-dc",
    "mdi-lightning-bolt",

    // RFID & Proximity Sensors
    "mdi-nfc",
    "mdi-radio-tower",

    // Security & Surveillance Sensors
    "mdi-security",
    "mdi-video",
];



export const useIcons = () => {
    
    // ---expose
    return {
        sensorOutputIcons,
    }
}
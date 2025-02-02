const config = {
    development: {
        baseUrl: 'http://localhost:5001'
    },
    production: {
        baseUrl: window.location.origin
    },
    // Add other environments as needed
};

// Get current environment
const environment = process.env.NODE_ENV || 'production';

// Export the configuration for the current environment
export const currentConfig = config[environment]; 
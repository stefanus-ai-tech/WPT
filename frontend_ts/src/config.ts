// Update config.js to use your backend server
const config = {
    development: {
        baseUrl: 'http://localhost:8081'  // Should match backend port
    },
    production: {
        baseUrl: 'https://wpt.stefanusadri.my.id'
    }
};

// Use window.location to detect environment instead of process.env
const isDevelopment = window.location.hostname === 'localhost' ||
                     window.location.hostname === '127.0.0.1';

export const currentConfig = isDevelopment ? config.development : config.production;

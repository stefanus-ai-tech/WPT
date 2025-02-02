// Update config.js to use your backend server
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';

export const currentConfig = {
    baseUrl: isDevelopment ? 'http://localhost:5001' : 'https://wpt.stefanusadri.my.id'
}; 
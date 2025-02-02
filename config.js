// Update config.js to use a more generic API endpoint
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';

export const currentConfig = {
    baseUrl: isDevelopment ? 'http://localhost:5001' : ''  // Empty string for production to use relative paths
}; 
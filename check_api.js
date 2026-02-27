const axios = require('axios');

async function checkApi() {
    try {
        console.log('Sending request to /api/admin/businesses...');
        // Note: This won't work easily because of auth, but I can check if it even times out 
        // or if the server is up.
        // Actually, I should check the server directly if possible.
    } catch (err) {
        console.error('API Error:', err.message);
    }
}

checkApi();

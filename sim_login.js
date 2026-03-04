const axios = require('axios');

async function testLogin() {
    try {
        const res = await axios.post('http://localhost:3000/api/auth/login', {
            email: 'ads@gmail.com',
            password: 'dummy'
        });
        console.log('Response:', res.data);
    } catch (err) {
        console.log('Error Status:', err.response?.status);
        console.log('Error Data:', err.response?.data);
    }
}

testLogin();

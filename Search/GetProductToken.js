const encodedCredentials = 'Y3M0MDJwcm9qZWN0LTllMWUwZDNhOGU3ODU2MDZjMDRmODMzMGQyOWI4ZTQ1MTE1Nzk0MjMzMjU3MjIzMDk4MDppZldaLVJoNkdELVRXeU03RURKX3M3UzJ6ejNYYUFoUk5CY1FzUGpM';

// Construct Authorization header
const authorizationHeader = `Basic ${encodedCredentials}`;

// Construct request parameters
const tokenUrl = 'https://api.kroger.com/v1/connect/oauth2/token';

// Construct form-urlencoded body
const body = 'grant_type=client_credentials&scope=product.compact';

// Function to fetch access token
async function GetProductToken() {
    try {
        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': authorizationHeader,
            },
            body: body
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch access token: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error);
        throw error;
    }
}

module.exports = GetProductToken;
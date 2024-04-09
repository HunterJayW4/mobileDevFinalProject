const encodedCredentials = 'Y3M0MDJmaW5hbHByb2plY3QtYjc4MGI3YzQzNWZhN2Y3NWY3MGYyNzY1ZGZjMGM1YTgzMzA5NjU4MzYwNTA4MDk4ODU4Ojc0SU00ZWYtUzF2UjFQOXI1YWFsejloQTVKZGg2SmFvSTJ4eVV5b20=';

// Construct Authorization header
const authorizationHeader = `Basic ${encodedCredentials}`;

// Construct request parameters
const tokenUrl = 'https://api.kroger.com/v1/connect/oauth2/token';

// Construct form-urlencoded body
const body = 'grant_type=client_credentials';

// Function to fetch access token
async function fetchAccessToken() {
  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': authorizationHeader
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

module.exports = fetchAccessToken;

const GetAccessToken = require('./GetAccessToken');

// Define Kroger API endpoint URL
const KROGER_API_URL = 'https://api.kroger.com/v1/locations';

// Function to get the Kroger API key asynchronously
async function getKrogerApiKey() {
  try {
    // Call GetAccessToken to obtain the access token
    const accessToken = await GetAccessToken();
    // Construct Kroger API key with obtained access token
    const krogerApiKey = `Bearer ${accessToken}`;
    return krogerApiKey;
  } catch (error) {
    console.error('Error obtaining Kroger API key:', error);
    throw error;
  }
}

// Function to fetch Kroger stores by latitude and longitude
async function SearchStore(latitude, longitude, radius = 20) {
    const url = new URL(KROGER_API_URL);
    url.searchParams.append('filter.lat.near', latitude);
    url.searchParams.append('filter.lon.near', longitude);
    url.searchParams.append('filter.radiusInMiles', radius);
    console.log(url)
    const KROGER_API_KEY = await getKrogerApiKey();
    console.log(KROGER_API_KEY);
  
    const settings = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: KROGER_API_KEY, // Replace with your Kroger API key
      },
    };
  
    try {
      const response = await fetch(url.toString(), settings);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      return null;
    }
  }

// This function can be imported into other JavaScript files for Kroger store searches by latitude and longitude
export default SearchStore;

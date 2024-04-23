import GetProductToken from './GetProductToken';

const GetAccessToken = require('./GetProductToken');

// Define Kroger API endpoint URL
const KROGER_API_URL = 'https://api.kroger.com/v1/products';

// Function to get the Kroger API key asynchronously
async function getKrogerApiKey() {
  try {
    // Call GetAccessToken to obtain the access token
    const accessToken = await GetProductToken();
    // Construct Kroger API key with obtained access token
    const krogerApiKey = `bearer ${accessToken}`;
    return krogerApiKey;
  } catch (error) {
    console.error('Error obtaining Kroger API key:', error);
    throw error;
  }
}

async function SearchTerm(locationId, term) {
    // Get the Kroger API key
    const KROGER_API_KEY = await getKrogerApiKey();
    console.log(KROGER_API_KEY);
    const limit = 100;
    
    // Construct URL with the Kroger API key
    const url = new URL(KROGER_API_URL);
    url.searchParams.append('filter.term', term);
    url.searchParams.append('filter.locationId', locationId);
    url.searchParams.append('filter.limit', 20);
    console.log(url);

    const settings = {
      method: "GET",
      cache: "no-cache",
      headers: {
        Authorization: KROGER_API_KEY, // Replace with your Kroger API key
        "Content-Type": "application/json; charset=utf-8"
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

  export default SearchTerm;
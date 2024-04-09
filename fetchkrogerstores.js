// Define Kroger API endpoint URL
const KROGER_API_URL = 'https://api.kroger.com/v1/locations';
const KROGER_API_KEY = 'Bearer eyJhbGciOiJSUzI1NiIsImprdSI6Imh0dHBzOi8vYXBpLmtyb2dlci5jb20vdjEvLndlbGwta25vd24vandrcy5qc29uIiwia2lkIjoiWjRGZDNtc2tJSDg4aXJ0N0xCNWM2Zz09IiwidHlwIjoiSldUIn0.eyJhdWQiOiJjczQwMmZpbmFscHJvamVjdC1iNzgwYjdjNDM1ZmE3Zjc1ZjcwZjI3NjVkZmMwYzVhODMzMDk2NTgzNjA1MDgwOTg4NTgiLCJleHAiOjE3MTE2Njg1MjksImlhdCI6MTcxMTY2NjcyNCwiaXNzIjoiYXBpLmtyb2dlci5jb20iLCJzdWIiOiI1OTFlMTQ3MC1jNTBkLTUyNWUtOTZlMS0wODg1NDk2NjY2NTQiLCJzY29wZSI6IiIsImF1dGhBdCI6MTcxMTY2NjcyOTMyNjMxODg5NywiYXpwIjoiY3M0MDJmaW5hbHByb2plY3QtYjc4MGI3YzQzNWZhN2Y3NWY3MGYyNzY1ZGZjMGM1YTgzMzA5NjU4MzYwNTA4MDk4ODU4In0.YOo1YIdCwDo3J94YS9r8g274Ro4h_prZIJ8msEqnQGbaU7n0CmCxEUKozRm-fa9VbBVgQ95e8JULSW082VMd7O0LRl58dkKFyJbh9Ya0oTVdJ51b-PWuEqUA0P1F0N8vCoUk1cOawsja9iozqEF_v20ddFnV7XmtTUvUMw_td_oxHQ8t2egevJhHLEND2Quxg-0QZYOICI1MQXply0gFLI5_-vzecGJA_6Y4ejKTJ2B5b-xRNqv2ycEJnoK8EtaBanWD_OA5SSeq3BX5kpFC8yJeulRjw0QC_xL8kiVVW-FCDPk6P7XPhZo7tbnZhLr0Mf0otuR26ABfoRqOWv7F5w';

// Function to fetch Kroger stores by latitude and longitude
async function fetchKrogerStores(latitude, longitude, radius = 20) {
  const url = new URL(KROGER_API_URL);
  url.searchParams.append('filter.lat.near', latitude);
  url.searchParams.append('filter.lon.near', longitude); // Corrected typo here
  url.searchParams.append('filter.radiusInMiles', radius);
  console.log(url)

  const settings = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: KROGER_API_KEY, // Replace with your Kroger API key
    },
  };

  try {
    const response = await fetch(url.toString(), settings);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return null;
  }
}

// Example usage (assuming you have your Kroger API key stored securely)
const latitude = 43.5918765; // Replace with your desired latitude
const longitude = -116.2082928; // Replace with your desired longitude
console.log(latitude)

// Call the function properly and handle the returned Promise
fetchKrogerStores(latitude, longitude)
  .then(data => {
    if (data) {
      // Process the fetched Kroger stores data here
      // Extract store details like Name, LocationID, Address, Opening Hours, etc.
      data.data.forEach(store => {
        const address = `${store.address.addressLine1} ${store.address.city}, ${store.address.state} ${store.address.zipCode}`;
        const phone = store.phone;

        const today = new Date().getDay(); // Get the current day of the week (0 for Sunday, 6 for Saturday)
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const openToday = store.hours[days[today]]; // Access hours for today
        

        console.log(`Store Name: ${store.name}`);
        console.log(`Location ID: ${store.locationId}`);
        console.log(`Address: ${address}`);
        console.log(`Phone: ${phone}`);

        if (openToday) {
          console.log(`Opening Hours: ${openToday.open}`);
          console.log(`Closing Hours: ${openToday.close}`);
        } else {
          console.log('Opening/Closing Hours for today are not available.');
        }
        console.log('-------------------------');
            });
    } else {
      console.error('Failed to fetch Kroger stores data.');
    }
  })
  .catch(error => console.error('Error fetching Kroger stores:', error));

// This function can be imported into other JavaScript files for Kroger store searches by latitude and longitude
export default fetchKrogerStores;

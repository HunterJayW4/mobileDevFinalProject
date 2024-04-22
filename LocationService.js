import * as Location from 'expo-location';

export async function getLocation() {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Location permission not granted');
  }

  let location = await Location.getCurrentPositionAsync({});
  return location;
}
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Keyboard, ScrollView, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getLocation } from './LocationService';
import SearchStore from './Search/SearchStores';
import { Ionicons } from '@expo/vector-icons'; 

const MapScreen = () => {
    const defaultRadius = 20;
    const [userLocation, setUserLocation] = useState(null);
    const [stores, setStores] = useState([]);
    const [radius, setRadius] = useState(defaultRadius.toString());
    const [selectedStore, setSelectedStore] = useState(null);
    const [currentDay, setCurrentDay] = useState('');
    const mapViewRef = useRef(null);

    useEffect(() => {
        const fetchUserLocation = async () => {
            try {
                const location = await getLocation();
                setUserLocation(location.coords);
                fetchNearbyStores(location.coords.latitude, location.coords.longitude, defaultRadius); 
            } catch (error) {
                console.error('Error fetching user location:', error);
            }
        };

        fetchUserLocation();

        // Set the current day when component mounts
        setCurrentDay(getCurrentDay());
    }, []);

    // Function to get the current day
    const getCurrentDay = () => {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const date = new Date();
        return days[date.getDay()];
    };

    const fetchNearbyStores = async (latitude, longitude, radius) => {
        try {
            const storeData = await SearchStore(latitude, longitude, radius);
            if (storeData && storeData.data && Array.isArray(storeData.data) && storeData.data.length > 0) {
                setStores(storeData.data);
            } else {
                console.error('Failed to fetch nearby stores.');
            }
        } catch (error) {
            console.error('Error fetching nearby stores:', error);
        }
    };

    const handleRadiusChange = (value) => {
        setRadius(value);
    };

    const handleSearch = () => {
        if (!isNaN(parseInt(radius))) { 
            Keyboard.dismiss(); 
            const searchRadius = parseInt(radius);
            if (userLocation) {
                fetchNearbyStores(userLocation.latitude, userLocation.longitude, searchRadius);
            }
        } else {
            alert('Please enter a valid number for the radius.'); 
        }
    };

    const handleMarkerPress = (store) => {
        const { latitude, longitude } = store.geolocation;
        mapViewRef.current.animateToRegion({
            latitude,
            longitude,
            latitudeDelta: 0.01, 
            longitudeDelta: 0.01,
        });
        
        // Toggle selection of store marker
        setSelectedStore(selectedStore === store ? null : store);
    };

    const handleDirections = (store) => {
        // Open Google Maps with directions to the store
        const destination = `${store.address.addressLine1}, ${store.address.city}, ${store.address.state} ${store.address.zipCode}`;
        const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
        Linking.openURL(url);
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Set Radius:</Text>
                <TextInput
                    style={styles.input}
                    value={radius}
                    onChangeText={handleRadiusChange}
                    placeholder="Enter radius (in miles)"
                    keyboardType="numeric"
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
            </View>
            {userLocation && (
                <MapView
                    ref={mapViewRef} // Ref for accessing MapView methods
                    style={styles.map}
                    initialRegion={{
                        latitude: userLocation.latitude,
                        longitude: userLocation.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    {userLocation && (
                        <Marker
                            coordinate={{
                                latitude: userLocation.latitude,
                                longitude: userLocation.longitude,
                            }}
                            title="Your Location"
                            pinColor="green" // Customize pin color if needed
                        />
                    )}
                    {stores.map(store => (
                        <Marker
                            key={store.locationId}
                            coordinate={{
                                latitude: store.geolocation.latitude,
                                longitude: store.geolocation.longitude,
                            }}
                            title={store.name}
                            onPress={() => handleMarkerPress(store)}
                        />
                    ))}
                </MapView>
            )}
            <ScrollView style={styles.listContainer}>
                <Text style={styles.listHeader}>Nearby Stores</Text>
                {stores.map(store => (
                    <View key={store.locationId}>
                        <TouchableOpacity onPress={() => handleMarkerPress(store)}>
                            <View style={styles.listItem}>
                                <Text style={styles.storeName}>{store.name}</Text>
                                <Ionicons name="chevron-forward" size={24} color="black" style={selectedStore === store ? styles.rotateIcon : null} />
                            </View>
                        </TouchableOpacity>
                        {selectedStore === store && (
                            <View style={styles.storeDropdown}>
                                <Text style={styles.storeAddress}>
                                    {store.address.addressLine1}, {store.address.city}, {store.address.state} {store.address.zipCode}
                                </Text>
                                <Text style={styles.storeHours}>
                                    Hours:
                                    {store.hours[currentDay] ? (
                                        <Text style={styles.container}>
                                            {` ${store.hours[currentDay].open} - ${store.hours[currentDay].close}`}
                                        </Text>
                                    ) : (
                                        <Text style={{ color: 'red' }}>Closed</Text>
                                    )}
                                </Text>
                                <TouchableOpacity style={styles.directionsButton} onPress={() => handleDirections(store)}>
                                    <Text style={styles.directionsButtonText}>Get Directions</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
    },
    searchButton: {
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    searchButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    map: {
        flex: 1,
    },
    listContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: 400,
    },
    listHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    storeName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    storeDropdown: {
        marginTop: 5,
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 5,
    },
    storeAddress: {
        fontSize: 14,
        marginBottom: 5,
    },
    storeHours: {
        fontSize: 14,
        marginBottom: 5,
    },
    directionsButton: {
        backgroundColor: 'blue',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    directionsButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    rotateIcon: {
        transform: [{ rotate: '90deg' }], 
    },
});

export default MapScreen;

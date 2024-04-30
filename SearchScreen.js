import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import SearchTerm from './Search/SearchTerm';
import { getLocation } from './LocationService';
import SearchStore from './Search/SearchStores';
import Constants from "expo-constants";

const SearchScreen = ({ navigation, route }) => {
    const { searchQuery, username } = route.params;
    const [searchResults, setSearchResults] = useState([]);

    // Safely get the local IP address
    const localIp = Constants.expoConfig?.hostUri?.split(':')?.[0] ?? 'localhost';
    const apiBaseUrl = `http://${localIp}:2000`;

    useEffect(() => {
        if (searchQuery) {
            searchItems(searchQuery);
        }
    }, [searchQuery]);

    const searchItems = async (query) => {
        try {
            const location = await getLocation();
            if (location) {
                const storeData = await SearchStore(location.coords.latitude, location.coords.longitude);
                if (storeData && storeData.data && Array.isArray(storeData.data) && storeData.data.length > 0 && storeData.data[0].locationId) {
                    const locationId = storeData.data[0].locationId;
                    const itemsData = await SearchTerm(locationId, searchQuery);
                    const itemArray = [];
                    if (itemsData.data[0].productId) {
                        for (let index = 0; index < itemsData.data.length; index++) {
                            const itemData = itemsData.data[index];
                            const locationData = storeData.data[0];
                            const image = itemData.images.find(image => image.perspective === 'front' && image.sizes.some(size => size.size === 'medium')).sizes.find(size => size.size === 'medium').url;
                            const description = itemData?.description ?? 'N/A';
                            const brand = itemData?.brand ?? 'N/A';
                            const price = itemData?.items[0]?.price?.regular ?? 'N/A';
                            const locationName = locationData?.name ?? 'N/A';
                            const address = locationData?.address?.addressLine1 ?? 'N/A';
                            const aisle = itemData?.aisleLocations?.[0]?.number ?? 'N/A';
                            const inStock = itemData?.items[0]?.fulfillment?.inStore;

                            itemArray.push({
                                id: index,
                                upc: itemData.productId, // Assuming the UPC is stored under productId
                                image: image,
                                description: description,
                                brand: brand,
                                price: price,
                                locationName: locationName,
                                address: address,
                                aisle: aisle,
                                inStock: inStock,
                            });
                        }
                        setSearchResults(itemArray);
                    }
                }
            }
        } catch (error) {
            console.error('Error searching items:', error);
            Alert.alert('Error', 'Failed to load items');
        }
    };

    const addItemToList = async (item) => {
        // Check if item has a upc property
        if (!item || !item.upc) {
            console.error('Invalid item:', item);
            Alert.alert('Error', 'Invalid item');
            return;
        }
        try {
            console.log('About to fetch');
            const response = await fetch(apiBaseUrl + '/addItem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username, // Assume username is a string variable containing the user's username
                    upc: item.upc, // Make sure the property name matches the actual property in the item object
                    image: item.image,
                    description: item.description,
                    brand: item.brand,
                    price: item.price,
                    inStock: item.inStock,
                    address: item.address,
                    aisle: item.aisle,
                    locationName: item.locationName
                }),
            });
            console.log('Fetch Complete');
            Alert.alert('Success', 'Item added successfully');
        } catch (error) {
            console.error('Error adding item to list:', error);
            Alert.alert('Error', `Failed to add item to list: ${error.message}`);
        }
    };



    return (
        <View style={styles.container}>
            <FlatList
                data={searchResults}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Image
                            source={{ uri: item.image }}
                            style={styles.image}
                            resizeMode="contain"
                        />
                        <View style={styles.textContainer}>
                            <Text style={styles.descriptionText}>{item.description}</Text>
                            <Text style={styles.brandText}>Brand: {item.brand}</Text>
                            {item.inStock ? (
                                <>
                                    <Text style={styles.priceText}>Price: ${item.price}</Text>
                                    <Text style={styles.locationText}>In Stock At: {item.locationName}</Text>
                                    <Text style={styles.addressText}>Address: {item.address}</Text>
                                    <Text style={styles.aisleText}>Aisle: {item.aisle}</Text>
                                </>
                            ) : (
                                <Text style={styles.outOfStockText}>Out of Stock!</Text>
                            )}
                        </View>
                        <TouchableOpacity style={styles.addButton} onPress={() => addItemToList(item)}>
                            <Text style={styles.addButtonText}>Add to List</Text>
                        </TouchableOpacity>
                    </View>
                )}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
    },
    itemContainer: {
        flexDirection: 'column',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        marginVertical: 10,
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginBottom: 10,
    },
    textContainer: {
        flex: 1,
    },
    descriptionText: {
        marginBottom: 5,
    },
    brandText: {
        color: 'gray',
        marginBottom: 5,
    },
    priceText: {
        fontWeight: 'bold',
        color: 'green',
        marginBottom: 5,
    },
    locationText: {
        marginBottom: 5,
    },
    addressText: {
        marginBottom: 5,
    },
    aisleText: {
        marginBottom: 5,
    },
    outOfStockText: {
        fontWeight: 'bold',
        color: 'red',
        marginBottom: 5,
    },
    addButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SearchScreen;

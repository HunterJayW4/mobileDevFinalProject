import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import SearchTerm from './Search/SearchTerm';
import { getLocation } from './LocationService';
import SearchStore from './Search/SearchStores';

const SearchScreen = ({ navigation, route }) => {
    const { searchQuery, username } = route.params;
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (searchQuery) {
            searchItems(searchQuery);
        }
    }, [searchQuery]);

    const searchItems = async (query) => {
        try {
            const location = await getLocation();
            if (location) {
                const storeData = await SearchStore(location.coords.latitude, location.coords.longitude, 20);
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
                            const outOfStock = !inStock;

                            itemArray.push({
                                id: index,
                                upc: itemData.productId, // Assuming the UPC is stored under productId
                                image,
                                description,
                                brand,
                                price,
                                locationName,
                                address,
                                aisle,
                                inStock,
                                outOfStock
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
        try {
            const response = await fetch('http://192.168.240.101:2000/addItem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username, // Assume username is a string variable containing the user's username
                    upc: item.upc // Make sure the property name matches the actual property in the item object
                }),
            });

            if (response.ok) {
                Alert.alert('Success', 'Item added successfully');
            } else {
                // Retrieve the response body to get detailed error info from the server
                const errorData = await response.json();  // Assumes the server responds with JSON data
                console.error('API responded with a non-ok status:', response.status);
                console.error('Error details:', errorData);
                throw new Error(`Failed to add item: ${errorData.message || 'Unknown error'}`);
            }
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

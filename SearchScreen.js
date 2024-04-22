import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import SearchTerm from './Search/SearchTerm'; // Import your SearchItems function
import { getLocation } from './LocationService';
import SearchStore from './Search/SearchStores';

const SearchScreen = ({ navigation, route }) => {
    const { searchQuery } = route.params;
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        // Perform search when the component mounts or when searchQuery changes
        if (searchQuery) {
            searchItems(searchQuery);
        }
    }, [searchQuery]);

    const searchItems = async (query) => {
        try {
            const location = await getLocation();
            if(location){
                const storeData = await SearchStore(location.coords.latitude, location.coords.longitude);
                if (storeData && storeData.data && Array.isArray(storeData.data) && storeData.data.length > 0 && storeData.data[0].locationId) {
                    const locationId = storeData.data[0].locationId;
                    const itemsData = await SearchTerm(locationId, searchQuery);
                    const itemArray = [];
                    if(itemsData.data[0].productId){
                        for(let index = 0; index < itemsData.data.length; index++){
                            const itemData = itemsData.data[index];
                            const locationData = storeData.data[0]; // Assuming you are fetching only one location data
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
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Search Results</Text>
            <FlatList
                data={searchResults}
                renderItem={({ item }) => (
                    <View style={styles.container}>
                        <Image
                            source={{ uri: item.image }}
                            style={styles.image}
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
        backgroundColor: 'lightgrey',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalContent: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        marginBottom: 10, // Added margin bottom for better spacing
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 20,
    },
    textContainer: {
        flex: 1,
        maxWidth: '60%',
    },
    descriptionText: {
        flexWrap: 'wrap',
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
});

export default SearchScreen;
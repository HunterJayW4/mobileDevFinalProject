import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Button } from 'react-native';
import { getLocation } from './LocationService';
import SearchStore from './Search/SearchStores';
import SearchTerm from './Search/SearchTerm'; // Import your SearchItems function

const SearchScreen = ({ navigation, route }) => {
    const { searchQuery } = route.params;
    const [searchResults, setSearchResults] = useState([]);
    const [isSearched, setSearch] = useState(false);

    useEffect(() => {
        // Perform search when the component mounts or when searchQuery changes
        if (searchQuery) {
            searchItems(searchQuery);
        }
    }, [searchQuery]);

    const searchItems = async (query) => {
        try {
            const location = await getLocation();
            if(location && !isSearched){
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
                        setSearch(true);
                    }
                }
            }
        } catch (error) {
            console.error('Error searching items:', error);
        }
    };

    const addItem = () => {

    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Search Results for {searchQuery}</Text>
            <FlatList
                data={searchResults}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Image
                            source={{ uri: item.image }}
                            style={styles.image}
                        />
                        <View style={styles.itemContent}>
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
                            <TouchableOpacity onPress={addItem} style={styles.addItemButton}>
                                <Text style={styles.addText}>Add Item</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={addItem} style={styles.addItemButton}>
                                <Text style={styles.addText}>Find Store</Text>
                            </TouchableOpacity>
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
        backgroundColor: '#D3D3D3',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    addItemButton: {
        marginTop: 15,
        padding: 5,
        backgroundColor: 'blue',
        borderRadius: 10,
        width: '50%',
    },
    addText: {
        fontSize: 15,
        fontWeight: 'bold',
        paddingVertical: 10,
        paddingHorizontal: 10,
        textAlign: 'center',
        color: 'white',
        backgroundColor: 'blue',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        paddingVertical: 20,
        textAlign: 'center',
        marginBottom: 5,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 10,
        padding: 10,
        width: '100%',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 20,
    },
    itemContent: {
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
});


export default SearchScreen;

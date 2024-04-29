import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, Button, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import LoadHomeScreenData from './LoadHomeScreen';
import Constants from 'expo-constants';


const HomeScreen = ({ route }) => {
    const { username } = route.params;
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigation = useNavigation();

    // Safely get the local IP address
    const localIp = Constants.expoConfig?.hostUri?.split(':')?.[0] ?? 'localhost';
    const apiBaseUrl = `http://${localIp}:2000`;

    const fetchData = useCallback(async () => {
        try {
            const response = await fetch(`${apiBaseUrl}/getItems?username=${encodeURIComponent(username)}`);
            const upcCodes = await response.json();
            if (response.ok) {
                const items = await LoadHomeScreenData(upcCodes);
                setProducts(items);
            } else {
                throw new Error('Failed to fetch items');
            }
        } catch (error) {
            console.error('Error loading items:', error);
            Alert.alert('Error', error.message || 'Failed to load items');
        }
    }, [username]);

    useFocusEffect(fetchData);

    const handleAddItem = (newItem) => {
        setProducts((prevProducts) => [...prevProducts, newItem]);
    };

    const handleDeleteItem = async (upc) => {
        try {
            console.log(`Attempting to delete item with UPC: ${upc} for user: ${username}`);

            // Make an API call to the server to remove the item
            const response = await fetch(apiBaseUrl + '/removeItem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, upc })
            });

            const result = await response.json();

            // Log the response from the server for debugging
            console.log('Server response:', result);

            if (!response.ok) {
                throw new Error(result.error || 'Failed to delete item');
            }

            // Log success for debugging
            console.log(`Successfully deleted item with UPC: ${upc}`);

            // Reload the data after deleting
            await fetchData();
        } catch (error) {
            console.error('Error deleting item:', error);
            Alert.alert('Error', error.message || 'Failed to delete item');
        }
    };


    const handleBarcodeScanned = (data) => {
        handleAddItem(data);
    };

    const handleSearch = () => {
        navigation.navigate('Search', { searchQuery: searchQuery, username: username });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{username}'s List</Text>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInputTop}
                    placeholder="Search items..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                />
                <Button title="Search" onPress={handleSearch} style={styles.searchButton} />
            </View>
            <FlatList
                data={products}
                keyExtractor={(item, index) => index.toString()}
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
                            <Text style={styles.priceText}>Price: ${item.price}</Text>
                            <Text style={styles.locationText}>In Stock At: {item.locationName}</Text>
                            <Text style={styles.addressText}>Address: {item.address}</Text>
                            <Text style={styles.aisleText}>Aisle: {item.aisle}</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleDeleteItem(item.upc)}>
                            <Text style={styles.deleteText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />


            <View style={styles.buttonContainer}>
                <Button title="Scan Barcode" onPress={() => navigation.navigate('Camera', { onBarcodeScanned: handleBarcodeScanned, username: username })} style={styles.button} />
                <Button title="Locate Stores" onPress={() => navigation.navigate('Stores')} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 20,
    },
    searchInputTop: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'gray',
        paddingHorizontal: 10,
        paddingVertical: 8, // Increased padding for taller input box
        borderRadius: 8,
        marginRight: 10, // Right margin for spacing between input and button
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 1.5,
        elevation: 3,
    },
    searchButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        backgroundColor: '#007AFF', // Default iOS button color
        color: '#fff',
        borderRadius: 8,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
        padding: 10,
        marginVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
        elevation: 2,
        borderRadius: 5,
    },
    deleteText: {
        color: 'red',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginTop: 10,
        marginBottom: 30,
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        elevation: 3,
    },
    // Additional styles for product details
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginBottom: 10,
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
    },
    descriptionText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    brandText: {
        fontSize: 14,
        color: 'grey',
    },
    priceText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'green',
    },
    locationText: {
        fontSize: 14,
        color: 'black',
    },
    addressText: {
        fontSize: 14,
        color: 'grey',
    },
    aisleText: {
        fontSize: 14,
        color: 'black',
    },
    outOfStockText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'red',
    },
});

export default HomeScreen;
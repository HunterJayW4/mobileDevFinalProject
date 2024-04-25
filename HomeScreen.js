import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Button, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = ({ route }) => {
    const { username } = route.params;
    const [items, setItems] = useState([]);
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');

    const handleAddItem = (newItem) => {
        setItems((prevItems) => [...prevItems, newItem]);
    };

    const handleDeleteItem = (index) => {
        setItems((prevItems) => prevItems.filter((item, i) => i !== index));
    };

    const addTestItem = () => {
        const testItem = `Item ${items.length + 1}`;
        handleAddItem(testItem);
    };

    const handleBarcodeScanned = (data) => {
        handleAddItem(data);
    };

    const handleSearch = () => {
        // Pass both searchQuery and username to the SearchScreen
        navigation.navigate('Search', { searchQuery: searchQuery, username: username });
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>{username}'s List</Text>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInputTop}
                    placeholder="Search items..."
                    onChangeText={(text) => setSearchQuery(text)}
                    value={searchQuery}
                />
                <Button title="Search" onPress={handleSearch} style={styles.searchButton} />
            </View>
            <FlatList
                data={items}
                renderItem={({ item, index }) => (
                    <View style={styles.listItem}>
                        <Text>{item}</Text>
                        <TouchableOpacity onPress={() => handleDeleteItem(index)}>
                            <Text style={styles.deleteText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
            <View style={styles.buttonContainer}>
                <Button title="Add Test Item" onPress={addTestItem} style={styles.button} />
                <Button title="Scan Barcode" onPress={() => navigation.navigate('Camera', { onBarcodeScanned: handleBarcodeScanned })} style={styles.button} />
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
    listItem: {
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
        position: 'absolute',
        bottom: 50,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
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
});

export default HomeScreen;

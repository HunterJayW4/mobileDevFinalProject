import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Button, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SearchScreen = ({ searchData }) => {
    const { searchTerm } = route.params;
    const [items, setItems] = useState([]); // Initialize an empty array for items
    const navigation = useNavigation(); // Get the navigation object

    // Function to handle adding new items
    const handleAddItem = (newItem) => {
        setItems((prevItems) => [...prevItems, newItem]);
    };

    // Function to handle deleting items
    const handleDeleteItem = (index) => {
        setItems((prevItems) => prevItems.filter((item, i) => i !== index));
    };

    // Function to add a test item
    const addTestItem = () => {
        const testItem = `Item ${items.length + 1}`;
        handleAddItem(testItem);
    };

    // Function to handle barcode scanning
    const handleBarcodeScanned = (data) => {
        handleAddItem(data);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{username}'s List</Text>
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
                <Button title="Add Test Item" onPress={addTestItem} />
                <Button title="Scan Barcode" onPress={() => navigation.navigate('Camera', { onBarcodeScanned: handleBarcodeScanned })} />
            </View>
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
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    deleteText: {
        color: 'red',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 50,
    },
});

export default HomeScreen;
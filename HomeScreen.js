import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Button, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = ({ route }) => {
    const { username } = route.params;
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
        backgroundColor: '#f5f5f5', // Background color for the entire screen
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20, // Adds padding around the outer container
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333', // Optionally set text color for better contrast
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white', // Set the background color to white for list items
        width: '100%', // Ensures full width within the padded container
        padding: 10, // Padding inside each list item
        marginVertical: 5, // Adds vertical spacing between items
        shadowColor: '#000', // Shadow for 3D effect, optional
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
        elevation: 2, // Elevation for Android (shadow equivalent)
        borderRadius: 5, // Rounded corners for list items
    },
    deleteText: {
        color: 'red',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 50,
        width: '100%', // Ensure the buttons span the full width of the screen
        paddingHorizontal: 20, // Padding on the sides for the buttons, matches the container padding
    },
});


export default HomeScreen;
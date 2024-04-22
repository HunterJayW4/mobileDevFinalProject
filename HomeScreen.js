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
        navigation.navigate('Search', { searchQuery: searchQuery });
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
                <Button title="Add Test Item" onPress={addTestItem} style={styles.button} />
                <Button title="Scan Barcode" onPress={() => navigation.navigate('Camera', { onBarcodeScanned: handleBarcodeScanned })} style={styles.button} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search items..."
                    onChangeText={(text) => setSearchQuery(text)}
                    value={searchQuery}
                />
                <Button title="Search" onPress={handleSearch} style={styles.button} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
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
        flexDirection: 'row', // Set flexDirection to row to align children horizontally
        justifyContent: 'space-around', // Distributes space evenly around each button
        paddingHorizontal: 20,
    },
    button: {
        flex: 1, // Each button will take an equal portion of the container
    },
    searchInput: {
        flex: 1, // Ensure the input also takes an equal portion of the space
        borderWidth: 1,
        borderColor: 'gray',
        paddingHorizontal: 10,
        marginRight: 10, // Optional margin for spacing
    },
});

export default HomeScreen;

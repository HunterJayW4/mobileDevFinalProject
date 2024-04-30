import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Modal, Button, Image } from 'react-native';
import { Camera } from 'expo-camera';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import SearchStore from './Search/SearchStores';
import SearchItems from './Search/SearchItems';

const CameraScreen = ({ route }) => {
    const { username } = route.params;
    const [item, setItem] = useState(null);
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
    const [showPopup, setShowPopup] = useState(false);
    const [processingBarcodeResult, setProcessingBarcodeResult] = useState(false);
    const [popupItems, setPopupItems] = useState([]);
    const [popupData, setPopupData] = useState(null);
    const [barcodeData, setBarcodeData] = useState(null);
    const [itemData, setItemData] = useState(null);
    const [locationData, setLocationData] = useState(null);
    const [invalidBarcodeScanned, setInvalidBarcodeScanned] = useState(false);
    const localIp = Constants.expoConfig?.hostUri?.split(':')?.[0] ?? 'localhost';
    const apiBaseUrl = `http://${localIp}:2000`;

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera permissions to make this work!');
            }
        })();
    }, []);

    const addItemToList = async () => {
        // Check if item has a upc property
        if (!itemData || !itemData.data[0]?.productId) {
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
                    upc: itemData.data[0].productId, // Make sure the property name matches the actual property in the item object
                    image: "https://www.kroger.com/product/images/large/front/0" + barcodeData.slice(0, -1),
                    description: itemData?.data[0]?.description ?? 'N/A',
                    brand: itemData?.data[0]?.brand ?? 'N/A',
                    price: itemData?.data[0]?.items[0]?.price?.regular,
                    inStock: itemData?.data[0]?.items[0]?.fulfillment?.inStore,
                    address: locationData?.data?.[0]?.address?.addressLine1 ?? 'N/A',
                    aisle: itemData?.data[0].aisleLocations?.[0]?.number ?? 'N/A',
                    locationName: locationData?.data?.[0]?.name ?? 'N/A'
                }),
            });
            console.log('Fetch Complete');
            Alert.alert('Success', 'Item added successfully');
        } catch (error) {
            console.error('Error adding item to list:', error);
            Alert.alert('Error', `Failed to add item to list: ${error.message}`);
        }
    };


    const getLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                return;
            }
    
            const location = await Location.getCurrentPositionAsync({});
            return location;
        } catch (error) {
            console.error('Error getting location:', error);
            Alert.alert('Error', `Failed to get location: ${error.message}`);
        }
    };

    const toggleCameraType = () => {
        setCameraType(
            cameraType === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
        );
    };

    const handleBarcodeScanned = async ({ data }) => {
        setBarcodeData(data);
        if(data.length != 13){
            setInvalidBarcodeScanned(true);
            return;
        }
        if (processingBarcodeResult) return;
        setInvalidBarcodeScanned(false);
        try {
            setProcessingBarcodeResult(true);
            const location = await getLocation();
            if (location) {
                const storeData = await SearchStore(location.coords.latitude, location.coords.longitude);
                if (storeData && storeData.data && Array.isArray(storeData.data) && storeData.data.length > 0 && storeData.data[0].locationId) {
                    const locationId = storeData.data[0].locationId;
                    const itemsData = await SearchItems(locationId, data);
                    if(itemsData.data[0]?.productId){
                        setLocationData(storeData);
                        setItemData(itemsData);
                        setPopupItems(itemsData);
                        setPopupData(data);
                        setShowPopup(true);

                    } else {
                        setInvalidBarcodeScanned(true);
                    }
                } else {
                    console.error('Failed to fetch store data or location ID is undefined.');
                }
            } else {
                console.error('Failed to get user location.');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setInvalidBarcodeScanned(true);
        } finally {
            setProcessingBarcodeResult(false);
        }
    };

    const closePopup = () => {
        setShowPopup(false);
        setInvalidBarcodeScanned(false);
    };

    return (
        <View style={styles.container}>
            <Camera
                style={styles.camera}
                type={cameraType}
                barCodeScannerSettings={['upc_a', 'upc_e', 'upc_ean']}
                onBarCodeScanned={showPopup ? undefined : handleBarcodeScanned}
            />
            <View style={styles.buttonContainer}>
                <Button title="Flip Camera" onPress={toggleCameraType} />
            </View>
            <Modal
                visible={showPopup}
                transparent={true}
                animationType="slide"
                onRequestClose={closePopup}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Image
                            source={{ uri: barcodeData ? "https://www.kroger.com/product/images/large/front/0" + barcodeData.slice(0, -1) : null}}
                            style={styles.image}
                        />
                        <View style={styles.textContainer}>
                            <Text style={styles.descriptionText}>{itemData?.data[0]?.description ?? 'N/A'}</Text>
                            <Text style={styles.brandText}>Brand: {itemData?.data[0]?.brand ?? 'N/A'}</Text>
                            {itemData?.data[0]?.items[0]?.fulfillment?.inStore ? (
                                <>
                                    <Text style={styles.priceText}>Price: ${itemData?.data[0]?.items[0]?.price?.regular}</Text>
                                    <Text style={styles.locationText}>In Stock At: {locationData?.data?.[0]?.name ?? 'N/A'}</Text>
                                    <Text style={styles.addressText}>Address: {locationData?.data?.[0]?.address?.addressLine1 ?? 'N/A'}</Text>
                                    <Text style={styles.aisleText}>Aisle: {itemData?.data[0].aisleLocations?.[0]?.number ?? 'N/A'}</Text>
                                </>
                            ) : (
                                <Text style={styles.outOfStockText}>Out of Stock!</Text>
                            )}
                        </View>
                    </View>
                    <TouchableOpacity style={styles.addButton} onPress={() => addItemToList()}>
                        <Text style={styles.addButtonText}>Add to List</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={closePopup} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            <Modal
                visible={invalidBarcodeScanned}
                transparent={true}
                animationType="slide"
                onRequestClose={closePopup}
            >
                <View style={styles.invalidBarcodeContainer}>
                    <View style={styles.invalidBarcodeContent}>
                        <Text style={styles.invalidBarcodeMessage}>Item not found near you. Ensure you are scanning valid barcode. Please try again!</Text>
                        <TouchableOpacity onPress={closePopup} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        position: 'absolute',
        right: 0,
        top: 0,
        margin: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
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
    addButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: 'blue',
        borderRadius: 5,
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: 'blue',
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
    },
    outOfStockText: {
        fontWeight: 'bold',
        color: 'red',
        marginBottom: 5,
    },
    invalidBarcodeContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    invalidBarcodeContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    invalidBarcodeMessage: {
        marginBottom: 20,
        textAlign: 'center',
    },
});

export default CameraScreen;
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { getLocation } from './LocationService';
import SearchStore from './Search/SearchStores';  // Update import paths as needed
import SearchTerm from './Search/SearchTerm';

const KROGER_API_URL = 'https://api.kroger.com/v1/products'; // Example API URL

async function getStoreData(latitude, longitude) {
    try {
        const storeResponse = await SearchStore(latitude, longitude);
        if (storeResponse && storeResponse.data.length > 0) {
            return storeResponse.data[0]; // Return the first store
        }
        throw new Error('No stores found at this location.');
    } catch (error) {
        console.error('Error fetching store data:', error);
        throw error;
    }
}

async function getProductDetails(locationId, upc) {
    try {
        const itemsData = await SearchTerm(locationId, upc);
        if (itemsData && itemsData.data.length > 0) {
            const item = itemsData.data[0];
            return {
                upc: item.productId,
                image: item.images.find(img => img.perspective === 'front' && img.sizes.some(size => size.size === 'medium')).sizes.find(size => size.size === 'medium').url,
                description: item.description || 'N/A',
                brand: item.brand || 'N/A',
                price: item.items[0]?.price?.regular || 'N/A',
            };
        }
        throw new Error('Product details not found for UPC: ' + upc);
    } catch (error) {
        console.error(`Error fetching details for UPC: ${upc}`, error);
        throw error;
    }
}

async function LoadHomeScreenData(upcCodes) {
    try {
        const location = await getLocation();
        const storeData = await getStoreData(location.coords.latitude, location.coords.longitude);
        const productsDetails = await Promise.all(upcCodes.map(upc => getProductDetails(storeData.locationId, upc)));
        return productsDetails.filter(product => product); // Filter undefined/null results
    } catch (error) {
        console.error('Error loading home screen data:', error);
        throw error; // Rethrow to handle in UI
    }
}

export default LoadHomeScreenData;

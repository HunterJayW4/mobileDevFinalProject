import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen'; // Adjust the path as necessary
import Register from './Register'; // Make sure the path to Register.js is correct
import LoginScreen from './LoginScreen'; // If App is a screen you intend to navigate to, ensure it doesn't recursively include the Navigator
import CameraScreen from './CameraScreen'; // Open when scanning barcodes
import SearchScreen from './SearchScreen'; // Opens search of items

const Stack = createNativeStackNavigator();

function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="Camera" component={CameraScreen} />
                <Stack.Screen name="Search" component={SearchScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigator;

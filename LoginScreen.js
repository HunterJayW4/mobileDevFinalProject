import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    // Safely get the local IP address
    const localIp = Constants.expoConfig?.hostUri?.split(':')?.[0] ?? 'localhost';
    const apiBaseUrl = `http://${localIp}:2000`;

    const handleLogin = async () => {
        console.log('Login attempt started');
        try {
            const response = await fetch(`${apiBaseUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                navigation.navigate('Home', { username: username });
                console.log(`Login successful for username: ${username}`);
            } else {
                console.warn(`Login failed for username: ${username}, status: ${response.status}`);
                Alert.alert('Login Failed', data.error || 'Invalid username or password!');
            }
        } catch (error) {
            console.error('Login request error:', error);
            Alert.alert('Connection Error', 'Failed to connect to the server.');
        }
    };

    const handleRegister = () => {
        console.log('Navigating to Register screen');
        navigation.navigate('Register');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to GroceryHound</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                onChangeText={setUsername}
                value={username}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                onChangeText={setPassword}
                value={password}
                secureTextEntry={true}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.buttonLeft]} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.buttonRight]} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// Styles for your LoginScreen component...
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 145,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '80%',
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingLeft: 10,
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
    },
    buttonLeft: {
        marginRight: 1,
    },
    buttonRight: {
        marginLeft: 1,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

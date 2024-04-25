import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleLogin = async () => {
        console.log('Login attempt started'); // Log the start of a login attempt
        try {
            const response = await fetch('http://192.168.240.101:2000/login', {
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
            if (response.status === 200) {
                navigation.navigate('Home', { username: username });
                console.log(`Login successful for username: ${username}`); // Log successful login
            } else {
                console.warn(`Login failed for username: ${username}, status: ${response.status}`); // Log failed login attempt
                alert(data.error || 'Invalid username or password!');
            }
        } catch (error) {
            console.error('Login request error:', error); // Log exceptions
            alert('Failed to connect to the server.');
        }
    };

    const handleRegister = () => {
        console.log('Navigating to Register screen'); // Log navigation event
        navigation.navigate('Register');
    };

    const handleContinueAsGuest = () => {
        console.log('Continue as Guest clicked', { username: "Guest" });
        navigation.navigate('Home', { username: "Guest" });
    };

    return (
        <View style={styles.container}>
            <Image source={require('./assets/groceryhoundlogo.png')} style={styles.logo} />
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
                <TouchableOpacity style={[styles.button, styles.continueButton]} onPress={handleContinueAsGuest}>
                    <Text style={styles.buttonText}>Continue As Guest</Text>
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
    continueButton: {
        backgroundColor: 'green', // Adjust color as needed
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logo: {
        width: 300, 
        height: 100, 
        resizeMode: 'contain', 
        marginBottom: 20,
    },
    
});

import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HomeScreen from "./HomeScreen";

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigation = useNavigation(); // Use the useNavigation hook to get navigation

    const handleLogin = async () => {
        try {
            const response = await fetch('http://10.0.0.40:2000/login', { // Replace with your server's IP and port
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
                setIsLoggedIn(true);
                navigation.navigate('Home', { username: username });
                console.log("Login Successful");
            } else {
                alert(data.error || 'Invalid username or password!');
            }
        } catch (error) {
            console.error('Login request error:', error);
            alert('Failed to connect to the server.');
        }
    };


    const handleRegister = () => {
        navigation.navigate('Register');
    };

    // Render method with TextInput for username and password, and TouchableOpacities for login and register
    return (
        <View style={styles.container}>
            {!isLoggedIn ? (
                <>
                    <Text style={styles.title}>Welcome to GroceryHound</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        onChangeText={text => setUsername(text)}
                        value={username}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        onChangeText={text => setPassword(text)}
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
                </>
            ) : (
                <HomeScreen username={username} />
            )}
        </View>
    );
}

// Styles for your LoginScreen component...
// Styles remain unchanged
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
        justifyContent: 'space-around', // This will distribute space evenly around the buttons.
        width: '80%', // Adjust the width as necessary to fit your layout.
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
        marginVertical: 10, // Keep vertical margin, remove horizontal margin
    },
    // New styles for left and right buttons:
    buttonLeft: {
        marginRight: 1, // Add some spacing to the right of the left button
    },
    buttonRight: {
        marginLeft: 1, // Add some spacing to the left of the right button
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
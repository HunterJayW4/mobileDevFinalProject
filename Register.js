// Register.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';

export default function Register({ navigation }) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [fullName, setFullName] = useState('');

    const handleSubmit = async () => {
        console.log("Attempting to submit registration form");

        if (password !== repeatPassword) {
            console.log("Validation failed: Passwords do not match");
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        console.log("Preparing to send request to the server");
        console.log("Payload:", { email, username, password, fullName }); // Log the data being sent; remove or mask sensitive data like password in a production environment

        try {
            const response = await fetch('http://10.0.0.40:2000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    username: username,
                    password: password, // Note: Password should be hashed on the server before storing
                    fullName: fullName,
                }),
            });

            console.log("Response received from the server:", response.status);

            if (response.ok) {
                console.log("Registration successful");
                Alert.alert('Success', 'Registration Successful');
                navigation.navigate('Login');
            } else {
                console.log("Failed to register, server responded with status:", response.status);
                const errorResponse = await response.text(); // or response.json() if response is expected to be JSON
                console.log("Error response body:", errorResponse);
                throw new Error('Failed to register');
            }
        } catch (error) {
            console.log("Network or server error:", error.message);
            Alert.alert('Error', error.message);
        }
    };



    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={setEmail}
                value={email}
            />
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
            <TextInput
                style={styles.input}
                placeholder="Repeat Password"
                onChangeText={setRepeatPassword}
                value={repeatPassword}
                secureTextEntry={true}
            />
            <TextInput
                style={styles.input}
                placeholder="Full Name"
                onChangeText={setFullName}
                value={fullName}
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
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
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

// HomeScreen.js
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const HomeScreen = ({ username }) => (
    <View style={styles.container}>
        <Text style={styles.title}>Home Screen</Text>
        <Text>Welcome, {username}!</Text>
    </View>
);

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
});

export default HomeScreen;

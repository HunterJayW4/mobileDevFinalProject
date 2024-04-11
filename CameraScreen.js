import React, { useEffect, useState } from 'react';
import { Button, View, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';

const CameraScreen = ({ onBarcodeScanned }) => {
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera permissions to make this work!');
            }
        })();
    }, []);

    const toggleCameraType = () => {
        setCameraType(
            cameraType === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
        );
    };

    return (
        <View style={styles.container}>
            <Camera
                style={styles.camera}
                type={cameraType}
                onBarCodeScanned={({ data }) => onBarcodeScanned(data)}
            />
            <View style={styles.buttonContainer}>
                <Button title="Flip Camera" onPress={toggleCameraType} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
});

export default CameraScreen;
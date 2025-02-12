import React from 'react';
import { View, Text, StyleSheet } from 'react-native';



const CameraScreen = () => {
    return (
        <View style = {StyleSheet.container}>
            <Text style = {StyleSheet.text}>
                FashionApp
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});


import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CameraScreen() {
    return (
        <View style = {styles.container}>
            <Text style = {styles.text}>FashionApp</Text>
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
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

//export default CameraScreen; //this is the default export
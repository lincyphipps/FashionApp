import React from 'react';
import { View, Text, StyleSheet } from 'react-native-web';


const Login = () => {
    return (
        <View style={header.container}>
            <Text style={styles.text}>Hello, React Native!</Text>
            </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFEF8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Login() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Hello, React Native!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFEF8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 20,
        //fontWeight: 'bold',
    },
});

//export default Login; //this is the default export
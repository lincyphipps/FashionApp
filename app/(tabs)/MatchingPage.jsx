import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MatchingPage() { 
    return (
        <View style={styles.title_container}>
            <Text style={styles.title_text}>Welcome to FashionApp</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    title_container: {
        flex: 1,
        backgroundColor: '#D0BCFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title_text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

//export default MatchingPage; //this is the default export
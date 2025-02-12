import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Closet = () => {
    return (
        <View style={styles.titleContainer}>
            <Text style={styles.title}>My Closet</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    titleContainer: {
        flex: 1,
        backgroundColor: '#E8DEF8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});
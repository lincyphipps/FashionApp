import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function Login() {
    return (
        <View style={styles.main_head}>   {/* title at top*/}
            <View style={styles.header}>
                <Text style={styles.headerText}>Fashion App</Text>
            </View>

            <View style={styles.menu}>  {/*email and password square*/}
                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input} placeholder="Value" placeholderTextColor="#aaa" />

                <Text style={styles.label}>Password</Text>
                <TextInput style={styles.input} placeholder="Value" placeholderTextColor="#aaa" secureTextEntry />

                {/* Sign In Button */}
            <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>

                {/* Forgot Password Link */}
                <Text style={styles.forgotPassword}>Forgot password?</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    main_head: {
        flex: 1,
        backgroundColor: '#FFFEF8',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    header: {
        backgroundColor: '#C9A7F5',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        marginBottom: 40,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },

    menu: {
        width: '100%',
        maxWidth: 350,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    label: {
        fontSize: 14,
        color: '#555',
        marginBottom: 5,
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#F9F9F9',
    },
    button: {
        backgroundColor: '#A078B6', // Muted lavender for the button
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    forgotPassword: {
        textAlign: 'center',
        color: '#555',
        textDecorationLine: 'underline',
    },
});

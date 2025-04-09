import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { useRouter } from 'expo-router';
import { LogBox } from 'react-native';

// Hide specific warning
LogBox.ignoreLogs([
  'Function components cannot be given refs', // match exact message
]);

export default function Login() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleLogin = async () => {
        console.log('Logging in with:', email, password);
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          console.log('Signed in:', userCredential.user);
          router.replace('/(tabs)/MainMenuScreen');
        } catch (error) {
          console.error('Login error:', error.code, error.message);
          alert('Login failed: ' + error.message);
          setErrorMsg(error.message);
        }
      };          

    const handleCreateAccount = () => {
        router.push('/CreateAccount');
    };
    
    return (
        // title at the top 
        <View style={styles.main_head}>   
            <View style={styles.header}>
                <Text style={styles.headerText}>Fashion App</Text>
            </View>

            {/*email and password square*/}
            <View style={styles.menu}>  
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Your Email"
                    placeholderTextColor="#aaa"
                    value={email}
                    onChangeText={setEmail}
                    />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Your Password"
                    placeholderTextColor="#aaa"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                {/* Sign In Button */}
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>

                {/* Forgot Password Link */}
                <TouchableOpacity style={{ alignItems: 'center', marginBottom: 8 }}>
                <Text style={styles.forgotPassword}>Forgot password?</Text>
                </TouchableOpacity>

                 {/* Sign Up Button */}
                 <TouchableOpacity onPress={handleCreateAccount} style={styles.newAccButton}>
                    <Text style={styles.newAccButtonText}>New? Create Account</Text>
                </TouchableOpacity>

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
        padding: 20,
    },
    header: {
        backgroundColor: '#C9A7F5',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
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
        shadowOpacity: 0.3,
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
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    forgotPassword: {
        color: '#555',
        textDecorationLine: 'underline',
        marginBottom: 8,
    },
    newAccButton: {
        backgroundColor: '#fff', // Muted lavender for the button
        paddingVertical: 10,
        borderRadius: 5,
        borderColor: '#A078B6',
        borderWidth: 1,
        alignItems: 'center',
        marginBottom: 8,
    },
    newAccButtonText: {
        color: '#A078B6',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

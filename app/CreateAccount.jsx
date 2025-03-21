import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';

const CreateAccount = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();

    const handleRegister = () => {  // password / field confirmation
        if(!email || !password || !confirmPassword) {  // if any of these fields are not filled out -> alert
            Alert.alert('Error', 'All fields are required.');
            return;
        }
        if(password !== confirmPassword) {  // if password and confirmpassword dont match -> alert
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }
        if(password.length < 8) {
            Alert.alert('Error', 'Password must be at least 8 characters long.');
            return;
        }
        
        //registration login
        Alert.alert('Success', 'Account created successfully!');
        router.push('/Login');  // redirect to login
    }

    return (
        <View style={styles.container}>
            <View style={styles.menu}>  {/*email and password square*/}
                <Text style={styles.title}>Create Account</Text>

                {/* Registration Form */}
                <Text style={styles.label}>Email</Text>
                <TextInput 
                    style={styles.input} 
                    placeholder="Enter Your Email" 
                    placeholderTextColor="#aaa" 
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address" 
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
                <TextInput 
                    style={styles.input} 
                    placeholder="Confirm Your Password" 
                    placeholderTextColor="#aaa" 
                    secureTextEntry
                    value={confirmPassword} 
                    onChangeText={setConfirmPassword}
                />

                {/* Register Button */}
                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFEF8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
    color: '#A078B6',
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
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateAccount;

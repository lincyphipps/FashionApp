import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function CreateAccount() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      {/* Registration Form */}
      <TextInput style={styles.input} placeholder="Enter Your Email" placeholderTextColor="#aaa" />
      <TextInput style={styles.input} placeholder="Enter Your Password" placeholderTextColor="#aaa" secureTextEntry />
      <TextInput style={styles.input} placeholder="Confirm Your Password" placeholderTextColor="#aaa" secureTextEntry />

      {/* Register Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
    backgroundColor: '#A078B6',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

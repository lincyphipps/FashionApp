import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../src/screens/firebaseConfig";
import * as AppleAuthentication from "expo-apple-authentication";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Proceed to your app's main screen after successful login
      Alert.alert("Success", "Logged in successfully!");
    } catch (error) {
      Alert.alert("Login error", error.message);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      // Handle the credential and sign the user in with your backend
      Alert.alert("Apple Sign In", `Signed in as ${credential.email || "user"}`);
    } catch (error) {
      if (error.code === "ERR_CANCELED") {
        Alert.alert("Apple Sign In", "Sign in canceled");
      } else {
        Alert.alert("Apple Sign In Error", error.message);
      }
    }
  };

  const handleCreateAccount = () => {
    router.push("/CreateAccount");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

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

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.appleButton} onPress={handleAppleSignIn}>
          <Text style={styles.appleButtonText}>Sign In with Apple</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleCreateAccount} style={styles.newAccButton}>
          <Text style={styles.newAccButtonText}>New? Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFEF8",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  menu: {
    width: "100%",
    maxWidth: 350,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#F9F9F9",
  },
  button: {
    backgroundColor: "#A078B6",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  appleButton: {
    backgroundColor: "#000",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  appleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  newAccButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderRadius: 5,
    borderColor: "#A078B6",
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 8,
  },
  newAccButtonText: {
    color: "#A078B6",
    fontSize: 16,
    fontWeight: "bold",
  },
});
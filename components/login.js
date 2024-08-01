import React, { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

const Login = () => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [userError, setUserError] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigation = useNavigation();

  const login = async (fname, lname, email) => {
    try {
      const response = await fetch('http://localhost:8000/v1/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fname, lname, email }),
      });

      if (response.ok) {
        const { token } = await response.json();
        await AsyncStorage.setItem('token', token);

        navigation.navigate('Game');
      } else {
        const errorData = await response.json();
        if (errorData.message === "user not found") {
          setLoginError("User not found. Please check your details.");
          // Clear form fields
          setFname("");
          setLname("");
          setEmail("");
        } else {
          console.error('Login failed:', response.statusText);
          setLoginError("Login failed. Please try again.");
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoginError("An error occurred. Please try again.");
    }
  };

  const handleLogin = () => {
    // Reset errors
    setUserError('');
    setEmailError('');
    setLoginError('');

    // Check for valid first and last names
    if (!validName(fname) || !validName(lname)) {
      setUserError('First name and last name are required');
      return;
    }

    // Check for valid email
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    // Proceed with login if all inputs are valid
    if (validName(fname) && validName(lname) && validateEmail(email)) {
      login(fname, lname, email);
    }
  };

  const validName = (name) => {
    return name.trim() !== "";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Image
          source={require('../assets/images/who-logo.jpg')} // Replace with your image path
          style={styles.logo}
        />
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/bags.png')} // Replace with your image path
            style={styles.image}
          />
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.label}>
            First Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setFname(text)}
            value={fname}
            placeholder="Enter first name"
            placeholderTextColor="#666"
          />
          <Text style={styles.label}>
            Last Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setLname(text)}
            value={lname}
            placeholder="Enter last name"
            placeholderTextColor="#666"
          />
          <Text style={styles.label}>
            Email ID <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setEmail(text)}
            value={email}
            onBlur={() => {
              if (!validateEmail(email)) {
                setEmailError("Please enter a valid email address");
              } else {
                setEmailError('');
              }
            }}
            placeholder="Enter your email ID"
            placeholderTextColor="#666"
          />
          {userError ? <Text style={styles.errorText}>{userError}</Text> : null}
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate('Registration')}
          >
            <Text style={styles.registerButtonText}>Not registered yet? <Text style={styles.registerLink}>Click here</Text></Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff', // Light blue background
  },
  topContainer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  bottomContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: '80%', // Adjusted width for responsiveness
    height: 80, // Fixed height
    resizeMode: 'contain',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: '80%', // Adjusted width for responsiveness
    height: '80vh', // Adjusted height for browser view
    resizeMode: 'contain',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#A7C7E7', // Brighter blue color
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginLeft: 20,
    alignItems: 'center',
    width: '80%',
    height:'90%', // Adjusted width for responsiveness
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: "center",
    color: '#fff',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#fff',
  },
  required: {
    color: 'yellow',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
    width: '100%',
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6082B6',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  registerButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  registerLink: {
    textDecorationLine: 'underline',
  },
});

export default Login;

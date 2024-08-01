import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Modal } from 'react-native';
import Login from './login'; // Assuming Login component is in the same directory
import RegistrationScreen from './registration';

const Welcome = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [registration,setRegistration] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const toggleRegistration = () => {
    setRegistration(!registration);
  };

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        {/* Left side */}
        <View style={styles.navLeft}>
          <Text style={styles.gameName}>train-waste</Text>
          <Text style={[styles.navText, styles.activeNav]}>Home</Text>
          <Text style={styles.navText}>About</Text>
        </View>
        {/* Right side */}
        <View style={styles.navRight}>
          <TouchableOpacity style={styles.navButton} onPress={toggleModal}>
            <Text style={styles.navButtonText}>Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={toggleRegistration}>
            <Text style={styles.navButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Body */}
      <View style={styles.body}>
        {/* Left side */}
        <View style={styles.leftSide}>
          <Text style={styles.smallText}>Welcome to the</Text>
          <Text style={styles.largeText}>Waste Management Training System</Text>
          <Text style={styles.smallText}>Join us to make a difference!</Text>
        </View>
        {/* Right side */}
        <View style={styles.rightSide}>
          <Image source={require("../assets/images/who-logo.jpg")} style={styles.logo} />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Together we can make a difference!</Text>
      </View>

      {/* Login Modal */}
      <Login visible={modalVisible} closeModal={toggleModal} />
      <RegistrationScreen visible={registration} closeModal={toggleRegistration}/>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff', // Very light blue and white background
  },
  navbar: {
    height: 60,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007acc',
    marginRight: 20,
  },
  navText: {
    fontSize: 16,
    color: '#007acc',
    marginRight: 20,
  },
  activeNav: {
    color: '#004080',
    fontWeight: 'bold',
  },
  navRight: {
    flexDirection: 'row',
  },
  navButton: {
    marginLeft: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#007acc',
    borderRadius: 5,
  },
  navButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  leftSide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallText: {
    fontSize: 14,
    color: '#333333',
    marginVertical: 10,
  },
  largeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginVertical: 20,
  },
  rightSide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  footer: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#333333',
  },
});

export default Welcome;

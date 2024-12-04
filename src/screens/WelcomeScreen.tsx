import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const WelcomeScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../assets/img/logo.png')} style={styles.logo} />
      
      {/* App Name */}
      <Text style={styles.appName}>FinTracker</Text>

      {/* Slogan */}
      <Text style={styles.slogan}>
        "Take care of order, and order will take care of you." - Saint Augustine
      </Text>

      {/* Buttons */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signUpButton}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF9F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  appName: {
    fontSize: 46,
    fontWeight: 'bold',
    color: '#00D09E',
    marginBottom: 10,
  },
  slogan: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: '#00D09E',
    paddingVertical: 15,
    width: '60%',
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 10,
  },
  signUpButton: {
    backgroundColor: '#6DB6FE',
    paddingVertical: 15,
    width: '60%',
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotText: {
    color: '#093030',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default WelcomeScreen;

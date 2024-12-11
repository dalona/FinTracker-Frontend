import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import api from '../api/api';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Por favor, completa todos los campos.');
      return;
    }

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token } = response.data.data;
      
      await AsyncStorage.setItem('token', token);
      navigation.navigate('Home');
    } catch (error: any) {
      console.error(error)
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Ocurrió un error. Por favor, intenta nuevamente.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#BDBDBD"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#BDBDBD"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signUpButton} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.signUpText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.fingerprintText}>
        Use <Text style={styles.highlight}>Fingerprint</Text> To Access
      </Text>

      <View style={styles.socialContainer}>
        <TouchableOpacity>
          <Image source={require('../assets/img/facebook-icon.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require('../assets/img/google-icon.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>
          Don't have an account? <Text style={styles.highlight}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#00D09E',
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    welcome: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 20,
    },
    inputContainer: {
      width: '100%',
      marginBottom: 20,
    },
    input: {
      height: 50,
      backgroundColor: '#fff',
      borderRadius: 10,
      paddingHorizontal: 15,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
    },
    button: {
      backgroundColor: '#4CAF50',
      paddingVertical: 15,
      width: '100%',
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: 10,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    forgotText: {
      color: '#007BFF',
      textAlign: 'center',
      marginBottom: 10,
    },
    signUpButton: {
      backgroundColor: '#C8F7C5',
      paddingVertical: 15,
      width: '100%',
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: 20,
    },
    signUpText: {
      color: '#4CAF50',
      fontSize: 18,
      fontWeight: 'bold',
    },
    fingerprintText: {
      color: '#333',
      marginBottom: 20,
    },
    highlight: {
      color: '#007BFF',
      fontWeight: 'bold',
    },
    socialContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 20,
    },
    icon: {
      width: 40,
      height: 40,
      marginHorizontal: 10,
    },
    registerText: {
      color: '#333',
      textAlign: 'center',
    },
  });

export default LoginScreen;

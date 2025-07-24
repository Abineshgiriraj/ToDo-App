import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
// import * as AuthSession from 'expo-auth-session';
import { Ionicons } from '@expo/vector-icons';

// Ensure WebBrowser is redirected properly
// WebBrowser.maybeCompleteAuthSession();

// Configure providers
const googleConfig = {
  clientId: '784611844734-2mf9bapufdbsv3dpij2l7ld4e6fsanb1.apps.googleusercontent.com',
  redirectUri: 'mytodoapp://redirect', // Simplified for now
  scopes: ['profile', 'email']
};

const appleConfig = {
  clientId: 'YOUR_APPLE_CLIENT_ID',
  redirectUri: 'mytodoapp://redirect', // Simplified for now
  scopes: ['name', 'email']
};

const facebookConfig = {
  clientId: 'YOUR_FACEBOOK_APP_ID',
  redirectUri: 'mytodoapp://redirect', // Simplified for now
  scopes: ['public_profile', 'email']
};

const twitterConfig = {
  clientId: 'YOUR_TWITTER_CLIENT_ID',
  redirectUri: 'mytodoapp://redirect', // Simplified for now
  scopes: ['tweet.read', 'users.read']
};

function LoginScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Log redirect URI for debugging purposes
  React.useEffect(() => {
    console.log('Google OAuth Redirect URI:', googleConfig.redirectUri);
    // Correctly log discovery endpoint
    console.log('Expo Auth Session Discovery URL:', 'https://accounts.google.com');
  }, []);

  // Google login
  // Commented out for now to fix dependency issues
  /*
  const [googleRequest, googleResponse, promptGoogleAsync] = AuthSession.useAuthRequest(
    {
      clientId: googleConfig.clientId,
      redirectUri: googleConfig.redirectUri,
      scopes: googleConfig.scopes,
    },
    { authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth' }
  );
  */
  const googleRequest = null;
  const googleResponse = null;
  const promptGoogleAsync = () => {
    console.log('Google login temporarily disabled');
    router.push('/task-list');
  };

  // Apple login
  // Commented out for now to fix dependency issues
  /*
  const [appleRequest, appleResponse, promptAppleAsync] = AuthSession.useAuthRequest(
    {
      clientId: appleConfig.clientId,
      redirectUri: appleConfig.redirectUri,
      scopes: appleConfig.scopes,
    },
    { authorizationEndpoint: 'https://appleid.apple.com/auth/authorize' }
  );
  */
  const appleRequest = null;
  const appleResponse = null;
  const promptAppleAsync = () => {
    console.log('Apple login temporarily disabled');
    router.push('/task-list');
  };

  // Facebook login
  // Commented out for now to fix dependency issues
  /*
  const [fbRequest, fbResponse, promptFbAsync] = AuthSession.useAuthRequest(
    {
      clientId: facebookConfig.clientId,
      redirectUri: facebookConfig.redirectUri,
      scopes: facebookConfig.scopes,
    },
    { authorizationEndpoint: 'https://www.facebook.com/v12.0/dialog/oauth' }
  );
  */
  const fbRequest = null;
  const fbResponse = null;
  const promptFbAsync = () => {
    console.log('Facebook login temporarily disabled');
    router.push('/task-list');
  };

  // Twitter login
  // Commented out for now to fix dependency issues
  /*
  const [twitterRequest, twitterResponse, promptTwitterAsync] = AuthSession.useAuthRequest(
    {
      clientId: twitterConfig.clientId,
      redirectUri: twitterConfig.redirectUri,
      scopes: twitterConfig.scopes,
    },
    { authorizationEndpoint: 'https://twitter.com/i/oauth2/authorize' }
  );
  */
  const twitterRequest = null;
  const twitterResponse = null;
  const promptTwitterAsync = () => {
    console.log('Twitter login temporarily disabled');
    router.push('/task-list');
  };

  // Handle login response - Commented out for now to fix dependency issues
  // Simplified version that just redirects to task list
  const handleLoginResponse = (response) => {
    setIsLoading(false);
    console.log('Login response received, redirecting to task list');
    router.replace('/task-list');
  };
  
  /* Original implementation - kept for reference
  const handleLoginResponseOriginal = async (response) => {
    setIsLoading(false);
    console.log('Handling login response:', JSON.stringify(response, null, 2));
    
    if (response?.type === 'success') {
      try {
        // Get the access token
        const accessToken = response.authentication?.accessToken || response.params?.access_token;
        
        if (!accessToken) {
          console.error('No access token found in response', response);
          Alert.alert('Login Error', 'Could not retrieve access token');
          return;
        }
        
        console.log('Successfully obtained access token');
        
        // Fetch user info using the access token
        try {
          const userInfoResponse = await fetch(
            'https://www.googleapis.com/userinfo/v2/me',
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          
          if (!userInfoResponse.ok) {
            throw new Error(`Failed to fetch user info: ${userInfoResponse.status}`);
          }
          
          const userInfo = await userInfoResponse.json();
          console.log('User info retrieved:', userInfo);
        
          // Show user info in an alert
          Alert.alert(
            'Login Successful',
            `Welcome ${userInfo.name}!\nEmail: ${userInfo.email}`,
            [
              {
                text: 'Continue',
                onPress: () => {
                  // Navigate to task-list screen on success
                  router.replace('/task-list');
                },
              },
            ]
          );
        } catch (fetchError) {
          console.error('Error fetching user info:', fetchError);
          Alert.alert(
            'Login Successful',
            'Could not retrieve your profile information, but you are logged in.',
            [
              {
                text: 'Continue',
                onPress: () => {
                  // Navigate to task-list screen on success despite fetch error
                  router.replace('/task-list');
                },
              },
            ]
          );
        }
      } catch (error) {
        console.error('Error in login process:', error);
        Alert.alert('Login Error', 'There was a problem with the login process. Please try again.');
      }
    } else if (response?.type === 'cancel') {
      // User cancelled the login flow
      Alert.alert('Login Cancelled', 'You cancelled the login process.');
    } else {
      // Show error message
      Alert.alert('Login Failed', response?.error?.message || 'Could not complete login');
    }
  };
  */

  // Login handlers - Simplified for now to bypass authentication
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      console.log('Bypassing Google login for now');
      
      // Simulate a delay
      setTimeout(() => {
        setIsLoading(false);
        router.replace('/task-list');
      }, 1000);
    } catch (error) {
      console.error('Google login error:', error);
      setIsLoading(false);
      Alert.alert('Login Error', 'There was a problem connecting to Google. Please try again later.');
    }
  };

  const handleAppleLogin = async () => {
    try {
      setIsLoading(true);
      console.log('Bypassing Apple login for now');
      
      // Simulate a delay
      setTimeout(() => {
        setIsLoading(false);
        router.replace('/task-list');
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', error.message);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setIsLoading(true);
      console.log('Bypassing Facebook login for now');
      
      // Simulate a delay
      setTimeout(() => {
        setIsLoading(false);
        router.replace('/task-list');
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', error.message);
    }
  };

  const handleTwitterLogin = async () => {
    try {
      setIsLoading(true);
      console.log('Bypassing Twitter login for now');
      
      // Simulate a delay
      setTimeout(() => {
        setIsLoading(false);
        router.replace('/task-list');
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', error.message);
    }
  };

  // Handle manual sign in
  const handleManualSignIn = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email/username and password');
      return;
    }
    
    // Simulate login - just show the entered credentials
    Alert.alert(
      'Sign In Attempt',
      `Attempting to sign in with:\nEmail/Username: ${email}\nPassword: ${password}`,
      [
        {
          text: 'OK',
          onPress: () => {
            // Simulate successful login
            router.replace('/task-list');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.googleButton]} 
            onPress={handleGoogleLogin}
          >
            <Ionicons name="logo-google" size={24} color="white" />
            <Text style={styles.buttonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.appleButton]} 
            onPress={handleAppleLogin}
          >
            <Ionicons name="logo-apple" size={24} color="white" />
            <Text style={styles.buttonText}>Continue with Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.facebookButton]} 
            onPress={handleFacebookLogin}
          >
            <Ionicons name="logo-facebook" size={24} color="white" />
            <Text style={styles.buttonText}>Continue with Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.twitterButton]} 
            onPress={handleTwitterLogin}
          >
            <Ionicons name="logo-twitter" size={24} color="white" />
            <Text style={styles.buttonText}>Continue with X</Text>
          </TouchableOpacity>
          
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or sign in manually</Text>
            <View style={styles.divider} />
          </View>
          
          <TextInput
            style={styles.input}
            placeholder="Email or Username"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <TouchableOpacity 
            style={[styles.button, styles.signInButton]} 
            onPress={handleManualSignIn}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          
          <View style={styles.signUpPromptContainer}>
            <Text style={styles.signUpPromptText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/sign-up')}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: '#666',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 10,
    fontSize: 16,
  },
  googleButton: {
    backgroundColor: '#DB4437',
  },
  appleButton: {
    backgroundColor: '#000000',
  },
  facebookButton: {
    backgroundColor: '#4267B2',
  },
  twitterButton: {
    backgroundColor: '#1DA1F2',
  },
  signInButton: {
    backgroundColor: '#4CAF50',
    marginTop: 10,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#888',
    fontSize: 14,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  loading: {
    marginTop: 20,
  },
  signUpPromptContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  signUpPromptText: {
    fontSize: 16,
    color: '#666',
  },
  signUpLink: {
    fontSize: 16,
    color: '#4285F4',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
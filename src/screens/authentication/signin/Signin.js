import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  Dimensions,
  Pressable,
} from 'react-native';
import { Button, TextField, Box, HStack, Divider } from 'native-base';
import { Formik } from 'formik';
import * as yup from 'yup';
import User from '../../../../assets/svg/user.svg';
import Visibility from '../../../../assets/svg/visibility.svg';
import VisibilityOff from '../../../../assets/svg/visibility-off.svg';
import Logo from '../../../../assets/images/logo.png';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import { userLogin } from '../../../services/user';

GoogleSignin.configure({
  webClientId:
    '981130236786-uc3nte8l7ki5bbhipgd7kmo3sdlkmqqt.apps.googleusercontent.com',
}); // from android/app/google-services.json

const Login = ({ navigation }) => {
  const windowHeight = Dimensions.get('window').height;

  const LoginSchema = yup.object().shape({
    email: yup
      .string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Invalid email',
      )
      .required('Please enter email'),
    password: yup
      .string()
      .matches(/^.{6,}$/, 'Password must be of six characters')
      .required('Please enter password'),
  });

  const [values, setValues] = useState({
    showPassword: false,
    showLoader: false,
  });

  const { showPassword, showLoader } = values;

  const [message, setMessage] = useState({
    type: '',
    text: '',
  });

  const handleShowPassword = () => {
    setValues({ ...values, showPassword: !showPassword });
  };

  const onGoogleButtonPress = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const { accessToken, idToken } = await GoogleSignin.signIn();

      const credential = auth.GoogleAuthProvider.credential(
        idToken,
        accessToken,
      );
      const response = await auth().signInWithCredential(credential);

      console.log({ response: response.additionalUserInfo });

      return { message: 'logged in' };
    } catch (err) {
      console.log(err);
      return { err: err.message };
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setMessage({
        type: '',
        text: '',
      });
    }, 3000);
  }, [message]);

  return (
    <View style={styles.container}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image source={Logo} style={{ alignSelf: 'center' }} />
      </View>
      <View style={styles.bottomcontainer}>
        <Modal transparent={true} visible={true}>
          <View style={[styles.bottomSheet, { height: windowHeight * 0.6 }]}>
            <View>
              <Box
                style={{
                  backgroundColor: 'white',
                  height: '100%',
                  marginTop: 10,
                  borderRadius: 30,
                }}>
                <Formik
                  initialValues={{ email: '', password: '' }}
                  onSubmit={async formvalues => {
                    setValues({ ...values, showLoader: true });
                    const fcmtoken = await messaging().getToken();
                    const response = await userLogin({
                      email: formvalues.email,
                      password: formvalues.password,
                      fcmtoken,
                    });

                    if (response.success) {
                      navigation.navigate('Parent');
                    }

                    if (response.error) {
                      setMessage(response.error);
                    }

                    setValues({ ...values, showLoader: false });
                  }}
                  validationSchema={LoginSchema}>
                  {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                  }) => (
                    <View style={{ padding: 15 }}>
                      <Text
                        style={{
                          alignSelf: 'center',
                          fontSize: 30,
                          fontFamily: 'Poppins-Medium',
                          color: '#002851',
                        }}>
                        Sign in
                      </Text>
                      <View style={{ marginTop: 10 }}>
                        <TextField
                          placeholder="Enter your email"
                          style={{ fontFamily: 'Poppins-Regular' }}
                          onChangeText={handleChange('email')}
                          onBlur={handleBlur('email')}
                          value={values.email}
                          errorMessage={errors.email}
                          InputLeftElement={
                            <View style={{ margin: 5 }}>
                              <User width={25} height={25} />
                            </View>
                          }
                          helperText={
                            errors.email && (
                              <Text
                                style={{
                                  fontFamily: 'Poppins-Regular',
                                  color: 'red',
                                }}>
                                {errors.email}
                              </Text>
                            )
                          }
                        />
                      </View>
                      <View>
                        <TextField
                          placeholder="Enter password"
                          type={showPassword ? 'text' : 'password'}
                          style={{ fontFamily: 'Poppins-Regular' }}
                          onChangeText={handleChange('password')}
                          onBlur={handleBlur('password')}
                          value={values.password}
                          errorMessage={errors.password}
                          InputRightElement={
                            <Pressable onPress={() => handleShowPassword()}>
                              {showPassword ? (
                                <View style={{ margin: 5 }}>
                                  <VisibilityOff width={25} height={25} />
                                </View>
                              ) : (
                                <View style={{ margin: 5 }}>
                                  <Visibility width={25} height={25} />
                                </View>
                              )}
                            </Pressable>
                          }
                          helperText={
                            errors.password && (
                              <Text
                                style={{
                                  fontFamily: 'Poppins-Regular',
                                  color: 'red',
                                }}>
                                {errors.password}
                              </Text>
                            )
                          }
                        />
                      </View>

                      <View>
                        {Boolean(message.type) ? (
                          <View
                            style={[
                              styles.message,
                              {
                                backgroundColor: '#ff5a5f',
                              },
                            ]}>
                            <Text
                              style={{
                                fontFamily: 'Poppins-Regular',
                                color: 'white',
                              }}>
                              {message.text}
                            </Text>
                          </View>
                        ) : null}
                      </View>

                      <View>
                        <Button
                          onPress={handleSubmit}
                          style={{ marginTop: 5, backgroundColor: '#002851' }}
                          isLoading={showLoader}>
                          <HStack direction="row">
                            <Text
                              style={{
                                fontFamily: 'Poppins-Medium',
                                color: '#e7e5e4',
                                fontSize: 15,
                              }}>
                              Signin
                            </Text>
                          </HStack>
                        </Button>
                      </View>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          marginTop: 5,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Divider
                          width={15}
                          style={{ width: '45%', backgroundColor: 'black' }}
                        />
                        <Text
                          style={{
                            margin: 5,
                            fontWeight: '600',
                            fontFamily: 'Poppins-Medium',
                            color: 'black',
                          }}>
                          Or
                        </Text>
                        <Divider
                          style={{ width: '45%', backgroundColor: 'black' }}
                        />
                      </View>
                      <View>
                        <GoogleSigninButton
                          onPress={() =>
                            onGoogleButtonPress().then(() =>
                              console.log('Signed in with Google!'),
                            )
                          }
                          color={GoogleSigninButton.Color.Dark}
                          style={{
                            width: '100%',
                            height: 50,
                            alignContent: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        />
                      </View>
                      {/* <Pressable onPress={() => navigation.navigate('Signup')}>
                        <View style={{ marginTop: 15 }}>
                          <Text
                            style={{
                              textAlign: 'center',
                              fontFamily: 'Poppins-Medium',
                            }}>
                            New to MedConnect?{' '}
                            <Text
                              style={{
                                fontWeight: 700,
                                color: '#0080ff',
                                textDecorationLine: 'underline',
                              }}>
                              Signup
                            </Text>{' '}
                          </Text>
                        </View>
                      </Pressable> */}
                    </View>
                  )}
                </Formik>
              </Box>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -310,
    justifyContent: 'center',
    backgroundColor: '#4db8ff',
  },
  bottomcontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  message: {
    height: 40,
    width: '100%',
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

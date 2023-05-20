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
import { Button, TextField, Box, HStack } from 'native-base';
import SelectDropdown from 'react-native-select-dropdown';
import { Formik } from 'formik';
import * as yup from 'yup';
import User from '../../../../assets/svg/user.svg';
import MailIcon from '../../../../assets/svg/mail-icon.svg';
import Visibility from '../../../../assets/svg/visibility.svg';
import VisibilityOff from '../../../../assets/svg/visibility-off.svg';
import Logo from '../../../../assets/images/logo.png';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { userRegister } from '../../../services/user';

const Signup = ({ navigation }) => {
  const windowHeight = Dimensions.get('window').height;

  const LoginSchema = yup.object().shape({
    name: yup.string().required('Please enter name'),
    email: yup
      .string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Invalid email',
      )
      .required('Please enter email'),
    phoneNumber: yup
      .string()
      .matches(/^[1-9][0-9]{9}$/, 'Invalid phone number')
      .required('Please enter phone number'),
    role: yup.string().required('Please select role'),
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

  const [showAlertModal, setShowAlertModal] = useState(false);

  const handleShowPassword = () => {
    setValues({ ...values, showPassword: !showPassword });
  };

  const roles = [
    { title: 'Patient', value: 'patient' },
    { title: 'Doctor', value: 'doctor' },
    { title: 'Pharmacy', value: 'pharmacy' },
    { title: 'Pathology', value: 'pathology' },
  ];

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
          <View style={[styles.bottomSheet, { height: windowHeight * 0.7 }]}>
            <View style={{ width: '100%' }}>
              <Box
                style={{
                  backgroundColor: 'white',
                  height: '100%',
                  marginTop: 10,
                  borderRadius: 30,
                }}>
                <Formik
                  initialValues={{
                    name: '',
                    email: '',
                    password: '',
                    role: '',
                    phoneNumber: '',
                  }}
                  onSubmit={async formvalues => {
                    setValues({ ...values, showLoader: true });
                    const response = await userRegister({
                      ...formvalues,
                    });

                    if (response.success) {
                      setMessage(response.success);
                    }

                    if (response.error) {
                      setMessage(response.error);
                    }

                    if (response.trigger) {
                      setShowAlertModal(true);
                    }
                    setValues({ ...values, showLoader: false });
                  }}
                  validationSchema={LoginSchema}>
                  {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    setValues,
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
                        Sign up
                      </Text>
                      <View style={{ marginTop: 10 }}>
                        <TextField
                          placeholder="Enter your name"
                          style={{ fontFamily: 'Poppins-Regular' }}
                          onChangeText={handleChange('name')}
                          onBlur={handleBlur('name')}
                          value={values.name}
                          errorMessage={errors.name}
                          InputLeftElement={
                            <View style={{ margin: 5 }}>
                              <User width={25} height={25} />
                            </View>
                          }
                          helperText={
                            errors.name && (
                              <Text
                                style={{
                                  fontFamily: 'Poppins-Regular',
                                  color: 'red',
                                }}>
                                {errors.name}
                              </Text>
                            )
                          }
                        />
                      </View>
                      <View>
                        <TextField
                          placeholder="Enter your email"
                          style={{ fontFamily: 'Poppins-Regular' }}
                          onChangeText={handleChange('email')}
                          onBlur={handleBlur('email')}
                          value={values.email}
                          errorMessage={errors.email}
                          InputLeftElement={
                            <View style={{ margin: 5 }}>
                              <MailIcon width={25} height={25} />
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
                          placeholder="Enter your phone number"
                          style={{ fontFamily: 'Poppins-Regular' }}
                          onChangeText={handleChange('phoneNumber')}
                          onBlur={handleBlur('phoneNumber')}
                          value={values.phoneNumber}
                          errorMessage={errors.phoneNumber}
                          InputLeftElement={
                            <View style={{ margin: 5 }}>
                              <Text style={{ fontFamily: 'Poppins-Medium' }}>
                                +91
                              </Text>
                            </View>
                          }
                          helperText={
                            errors.phoneNumber && (
                              <Text
                                style={{
                                  fontFamily: 'Poppins-Regular',
                                  color: 'red',
                                }}>
                                {errors.phoneNumber}
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
                        <SelectDropdown
                          defaultButtonText={
                            <Text style={{ fontFamily: 'Poppins-Regular' }}>
                              Choose role
                            </Text>
                          }
                          data={roles}
                          onSelect={formvalues =>
                            setValues({ ...values, role: formvalues.value })
                          }
                          renderDropdownIcon={isOpened => {
                            return (
                              <FontAwesomeIcon
                                name={isOpened ? 'chevron-up' : 'chevron-down'}
                                color={'black'}
                                size={18}
                              />
                            );
                          }}
                          renderCustomizedRowChild={(item, index) => {
                            return (
                              <View key={index}>
                                <Text
                                  style={{
                                    fontFamily: 'Poppins-Regular',
                                    margin: 5,
                                  }}>
                                  {item.title}
                                </Text>
                              </View>
                            );
                          }}
                          buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem.title;
                          }}
                          buttonStyle={{
                            width: '100%',
                            borderRadius: 5,
                            borderColor: errors.role ? 'red' : '#979dac',
                            borderWidth: 0.5,
                          }}
                        />
                      </View>

                      <View>
                        {Boolean(message.type) ? (
                          <View
                            style={[
                              styles.message,
                              {
                                backgroundColor:
                                  message.type === 'success'
                                    ? '#83c5be'
                                    : '#ff5a5f',
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
                          style={{ marginTop: 10, backgroundColor: '#002851' }}
                          isLoading={showLoader}>
                          <HStack direction="row">
                            <Text
                              style={{
                                fontFamily: 'Poppins-Medium',
                                color: '#e7e5e4',
                                fontSize: 15,
                              }}>
                              Signup
                            </Text>
                          </HStack>
                        </Button>
                      </View>

                      <View style={{ marginTop: 15 }}>
                        <Pressable onPress={() => navigation.navigate('Login')}>
                          <Text
                            style={{
                              textAlign: 'center',
                              fontFamily: 'Poppins-Medium',
                            }}>
                            Already registered?{' '}
                            <Text
                              style={{
                                fontWeight: 700,
                                color: '#0080ff',
                                textDecorationLine: 'underline',
                              }}>
                              Signin
                            </Text>{' '}
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  )}
                </Formik>
              </Box>
            </View>
          </View>
        </Modal>
      </View>

      {showAlertModal ? (
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 'black', opacity: 0.5 },
          ]}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={true}
            style={[StyleSheet.absoluteFill]}>
            <View>
              <View style={styles.modalView}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    textAlign: 'center',
                  }}>
                  You have been registered with MedConnect! Our Admin will
                  reachout to you for further procedure
                </Text>
                <View>
                  <Button
                    style={{
                      width: '100%',
                      marginTop: 10,
                      backgroundColor: '#002851',
                    }}
                    onPress={() => setShowAlertModal(false)}>
                    <View
                      style={{
                        width: '100%',
                        justifyContent: 'center',
                        display: 'flex',
                        flexDirection: 'row',
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Poppins-Regular',
                          color: 'white',
                        }}>
                        Close
                      </Text>
                    </View>
                  </Button>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      ) : null}
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -500,
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

  modalView: {
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    height: 170,
  },
});

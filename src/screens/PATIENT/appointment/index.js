import React, { useState, Fragment } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Button, Alert, HStack, VStack, Box, useToast } from 'native-base';
import { PanGestureHandler } from 'react-native-gesture-handler';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useFormik } from 'formik';
import * as yup from 'yup';
import remove from 'lodash.remove';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Appointment from './Appointment';
import { predictDiease } from '../../../services/patient';
import Searchbar from './searchbar/Seachbar';
import { useNavigation } from '../../../context/context';

const AppointmentIndex = () => {
  const validationSchema = yup.object({
    symptom: yup
      .string()
      .matches(/^(?=.*[^\s])[\s\S]*$/, 'invalid')
      .required('Please provide symptom'),
  });

  const toast = useToast();
  const [symptoms, setSymptoms] = useState([]);
  const [showAppointments, setShowAppointments] = useState(true);
  const [showLoader, setShowLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [dieaseObj, setDieaseObj] = useState({});
  const [activeStatus, setActiveStatus] = useState('');

  const formik = useFormik({
    validationSchema,
    initialValues: {
      symptom: '',
    },
  });

  const handleSymptomsSubmission = async () => {
    try {
      if (symptoms.length === 0) {
        toast.show({
          render: () => {
            return (
              <Alert w="100%" status="error">
                <VStack space={2} flexShrink={1} w="100%">
                  <HStack
                    flexShrink={1}
                    space={2}
                    justifyContent="space-between">
                    <HStack space={2} flexShrink={1}>
                      <Alert.Icon mt="1" />
                      <Text
                        fontSize="md"
                        color="#1f2937"
                        style={{ fontFamily: 'Poppins-Regular' }}>
                        Please add some symptoms
                      </Text>
                    </HStack>
                  </HStack>
                </VStack>
              </Alert>
            );
          },
        });
      } else {
        setShowLoader(true);
        const response = await predictDiease({ symptoms });
        if (response.diease) {
          setDieaseObj({
            predictedDiease: response.diease,
            symptoms,
          });
          setOpen(!open);
        }
        setShowLoader(false);
      }
    } catch (err) {
      console.log(err);
      setShowLoader(false);
    }
  };

  const handleAddSymptom = params => {
    try {
      setSymptoms(prevstate => [...prevstate, params]);
      formik.handleReset();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteSymptom = params => {
    try {
      const temp = remove(symptoms, st => {
        return st !== params;
      });
      setSymptoms(temp);
    } catch (err) {
      console.log(err);
    }
  };

  const handleActiveStatus = tempStatus => {
    try {
      if (tempStatus === activeStatus) {
        setActiveStatus('');
      } else setActiveStatus(tempStatus);
    } catch (err) {
      console.log(err);
    }
  };

  const getLocalStorrage = async () => {
    try {
      const localstorage = await AsyncStorage.getItem('user');
      console.log(localstorage);
    } catch (err) {
      console.log(err);
    }
  };

  //   const _onGestureEvent = event => {
  //     if (event.nativeEvent.translationY < 0) {
  //       // Swipe up detected
  //       console.log('Swipe up detected _onGestureEvent');
  //     }
  //   };

  const _onHandlerStateChange = event => {
    if (event.nativeEvent.translationY < 0) {
      // Swipe up detected
      //   console.log('Swipe up detected _onHandlerStateChange');
      if (Object.values(dieaseObj).length > 0) {
        /* this check make sure that the diease has
		already being predicted once */
        setOpen(true);
      }
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Searchbar
        formik={formik}
        showAppointments={showAppointments}
        setShowAppointments={setShowAppointments}
        handleAddSymptom={handleAddSymptom}
        dieaseObj={dieaseObj}
        isOpen={open}
        setIsOpen={setOpen}
      />

      {showAppointments ? (
        <>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 10,
              marginTop: 0,
              width: '95%',
            }}>
            {['BOOKED', 'CONFIRMED', 'COMPLETED'].map((st, index) => (
              <View style={{ width: '30%', zIndex: 9999 }} key={index}>
                <Button
                  style={{
                    backgroundColor:
                      activeStatus === st ? '#002851' : '#e5e5e5',
                    borderRadius: 10,
                  }}
                  onPress={() => handleActiveStatus(st)}>
                  <Text
                    style={{
                      fontFamily: 'Poppins-Regular',
                      color: activeStatus === st ? 'white' : '#a3a3a3',
                    }}>
                    {st}
                  </Text>
                </Button>
              </View>
            ))}
          </View>

          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontFamily: 'Poppins-Regular' }}>
              Showing{' '}
              {activeStatus ? (
                <Text style={{ fontFamily: 'Poppins-Bold' }}>
                  {activeStatus}
                </Text>
              ) : (
                <Text style={{ fontFamily: 'Poppins-Bold' }}>ALL</Text>
              )}{' '}
              appointments
            </Text>
          </View>
        </>
      ) : null}

      {showAppointments ? (
        <Appointment activeStatus={activeStatus} />
      ) : (
        <Fragment>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              margin: 10,
              zIndex: -1,
            }}>
            <Button
              style={{
                backgroundColor: '#002851',
                width: '100%',
                borderRadius: 10,
              }}
              onPress={handleSymptomsSubmission}
              isLoading={showLoader}>
              <Text style={{ fontFamily: 'Poppins-Regular', color: 'white' }}>
                Predict diease
              </Text>
            </Button>
          </View>

          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              margin: 10,
              marginTop: 15,
              zIndex: -1,
            }}>
            <Text style={{ fontFamily: 'Poppins-Regular' }}>
              Added symptoms ({symptoms.length}/5)
            </Text>
            {symptoms.length ? (
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  marginTop: 5,
                }}>
                {symptoms.map((symptom, index) => (
                  <View
                    style={{ width: '100%', marginTop: 2, height: 40 }}
                    key={index}>
                    <Box
                      style={{
                        backgroundColor: '#e2e8f0',
                        padding: 1,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        height: '100%',
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Poppins-Regular',
                          marginLeft: 5,
                        }}>
                        {symptom}
                      </Text>
                      <Pressable onPress={() => handleDeleteSymptom(symptom)}>
                        <MaterialIcon name="close" size={20} />
                      </Pressable>
                    </Box>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
          <PanGestureHandler
            // onGestureEvent={_onGestureEvent}
            onHandlerStateChange={_onHandlerStateChange}>
            <View
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </PanGestureHandler>
        </Fragment>
      )}
    </View>
  );
};

export default AppointmentIndex;

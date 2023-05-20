import React, { useState, useCallback, useEffect, Fragment } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  Stack,
  Button,
  Spinner,
  Center,
  HStack,
  Divider,
  Actionsheet,
  Box,
  VStack,
  Alert,
} from 'native-base';
import { fetchAppointments } from '../../../services/user';
import { confirmAppointment } from '../../../services/doctor';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import dayjs from 'dayjs';
import Doctor from '../../../../assets/svg/patient.svg';
import { useNavigation } from '../../../context/context';

const months = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
};

const ConfirmationDrawer = ({
  open,
  setOpen,
  predictedDiease,
  symptoms,
  scheduledTime,
  appointmentId,
}) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showConfirmationLoader, setShowConfirmationLoader] = useState(false);

  const formatScheduledDate = () => {
    try {
      const date = scheduledTime.split('T')[0];
      const [year, month, day] = date.split('-');
      const formattedDate = day + ' ' + months[parseInt(month)] + ', ' + year;
      return formattedDate;
    } catch (err) {
      console.log(err);
    }
  };

  const handleConfirmation = async () => {
    try {
      setShowConfirmationLoader(true);
      const response = await confirmAppointment({ appointmentId });
      console.log(response);
      if (response.success) {
        setIsConfirmed(true);
        setShowConfirmationLoader(false);
        setTimeout(() => {
          setOpen(false);
        }, 2000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Actionsheet isOpen={open} onClose={() => setOpen(false)}>
      <Actionsheet.Content>
        <Box w="100%" h={80} px={4}>
          {isConfirmed ? (
            <Alert
              w="100%"
              variant="left-accent"
              colorScheme="success"
              status="success">
              <VStack space={2} flexShrink={1} w="100%">
                <HStack
                  flexShrink={1}
                  space={2}
                  alignItems="center"
                  justifyContent="space-between">
                  <HStack space={2} flexShrink={1} alignItems="center">
                    <Alert.Icon />
                    <Text
                      color="#1f2937"
                      style={{ fontFamily: 'Poppins-Medium' }}>
                      Thank you for confirmation!
                    </Text>
                  </HStack>
                </HStack>
              </VStack>
            </Alert>
          ) : (
            <VStack style={{ width: '100%' }}>
              <View
                style={{
                  alignItems: 'center',
                  height: 80,
                  display: 'flex',
                  flexDirection: 'row',
                }}>
                <View>
                  <MaterialIcon name="calendar-today" size={30} />
                </View>
                <View>
                  <Text
                    style={{
                      fontFamily: 'Poppins-Medium',
                      textAlign: 'center',
                      fontSize: 25,
                      marginTop: 1,
                    }}>
                    {' '}
                    Confirm appointment ?{' '}
                  </Text>
                </View>
              </View>
              <ScrollView style={{ height: 115 }}>
                {symptoms.map((symptom, index) => (
                  <View key={index} style={{ marginTop: 2 }}>
                    <Box style={{ backgroundColor: '#e5e5e5' }}>
                      <Text
                        style={{ fontFamily: 'Poppins-Regular', margin: 5 }}>
                        {symptom}
                      </Text>
                    </Box>
                  </View>
                ))}
              </ScrollView>
              <View>
                <Text
                  style={{
                    textAlign: 'left',
                    fontFamily: 'Poppins-Regular',
                    fontSize: 20,
                  }}>
                  ● {predictedDiease}
                </Text>

                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: 'Poppins-Regular',
                    fontSize: 20,
                  }}>
                  {formatScheduledDate()} |{' '}
                  {dayjs(scheduledTime).format('hh:mm a')}
                </Text>
              </View>
              <View>
                <Button
                  style={{ backgroundColor: '#002851' }}
                  isLoading={showConfirmationLoader}
                  onPress={() => handleConfirmation()}>
                  <Text
                    style={{
                      fontFamily: 'Poppins-Medium',
                      color: 'white',
                    }}>
                    Confirm
                  </Text>
                </Button>
              </View>
            </VStack>
          )}
        </Box>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

const AppointmentCard = ({ appointment }) => {
  const { appointmentId, patient, scheduledTime, status, predictedDiease } =
    appointment;
  const [open, setOpen] = useState(false);
  const { navigation } = useNavigation();

  const handleClick = () => {
    try {
      if (status === 'BOOKED') {
        setOpen(true);
      } else {
        navigation.navigate('Message', {
          roomId: appointmentId,
          name: patient.name,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  //   useEffect(() => {
  //     console.log(appointment);
  //   }, []);

  return (
    <Fragment>
      <Pressable onPress={() => handleClick()}>
        <View
          style={{
            width: '95%',
            height: 160,
            backgroundColor: '#3b82f6',
            borderRadius: 5,
            elevation: 5,
            margin: 10,
            marginTop: 1,
          }}>
          <View
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}>
            <View>
              <Stack
                direction="row"
                space={5}
                style={{
                  width: '100%',
                  height: '75%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignContent: 'center',
                }}>
                <Center size={20} bgColor="white" style={{ borderRadius: 100 }}>
                  <Doctor width="50%" />
                </Center>

                <Center
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}>
                  <HStack direction="column">
                    <Text
                      style={{
                        color: 'white',
                        fontFamily: 'Poppins-Bold',
                        fontSize: 20,
                        textAlign: 'justify',
                      }}>
                      {patient.name}
                    </Text>
                    <Text
                      style={{
                        color: '#d4d4d4',
                        fontFamily: 'Poppins-Regular',
                      }}>
                      {predictedDiease}
                    </Text>
                  </HStack>

                  <MaterialIcon
                    name="chevron-right"
                    size={20}
                    style={{ color: 'white', marginLeft: '10%' }}
                  />
                </Center>
              </Stack>

              <Divider
                style={{
                  width: '90%',
                  alignSelf: 'center',
                  backgroundColor: '#e5e5e5',
                }}
              />

              <Stack
                direction="row"
                space={5}
                style={{
                  width: '80%',
                  alignSelf: 'center',
                  marginTop: 5,
                }}>
                {status === 'BOOKED' ? (
                  <View style={{ width: '100%' }}>
                    <Center
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                      }}>
                      <MaterialIcon
                        name="pending-actions"
                        size={20}
                        color="white"
                      />
                      <Text
                        style={{
                          fontFamily: 'Poppins-Regular',
                          marginTop: 5,
                          marginLeft: 5,
                          color: 'white',
                        }}>
                        Confirmation pending
                      </Text>
                    </Center>
                  </View>
                ) : (
                  <Fragment>
                    <Center
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                      }}>
                      <AntDesignIcon name="calendar" size={20} color="white" />
                      <Text
                        style={{
                          fontFamily: 'Poppins-Regular',
                          marginTop: 5,
                          marginLeft: 5,
                          color: 'white',
                        }}>
                        {dayjs(scheduledTime).format('DD/MM/YYYY')}
                      </Text>
                    </Center>
                    <Center
                      style={{
                        marginLeft: 'auto',
                        display: 'flex',
                        flexDirection: 'row',
                      }}>
                      <MaterialIcon name="alarm" size={20} color="white" />
                      <Text
                        style={{
                          fontFamily: 'Poppins-Regular',
                          marginTop: 5,
                          marginLeft: 5,
                          color: 'white',
                        }}>
                        {dayjs(scheduledTime).format('hh:mm')} -{' '}
                        {dayjs(scheduledTime)
                          .add(15, 'minute')
                          .format('hh:mm A')}
                      </Text>
                    </Center>
                  </Fragment>
                )}
              </Stack>
            </View>
          </View>
        </View>
      </Pressable>
      {open ? (
        <ConfirmationDrawer open={open} setOpen={setOpen} {...appointment} />
      ) : null}
    </Fragment>
  );
};

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [activeStatus, setActiveStatus] = useState('');

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    handleFetchAppointments();
    // const response = handleFetchAppointments();
    // if (response) {
    //   setRefreshing(false);
    // }
    setRefreshing(false);
  }, []);

  const handleFetchAppointments = async () => {
    try {
      setShowLoader(true);
      if (activeStatus) {
        const response = await fetchAppointments({ status: activeStatus });
        setAppointments(response.appointments);
      } else {
        const response = await fetchAppointments();
        setAppointments(response.appointments);
      }
      setShowLoader(false);
      return true;
    } catch (err) {
      console.log(err);
      return true;
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

  useEffect(() => {
    handleFetchAppointments();
  }, [activeStatus]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          margin: 10,
          width: '95%',
        }}>
        {['BOOKED', 'CONFIRMED', 'COMPLETED'].map((st, index) => (
          <View style={{ width: '30%', zIndex: 9999 }} key={index}>
            <Button
              style={{
                backgroundColor: activeStatus === st ? '#002851' : '#e5e5e5',
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
      {showLoader ? (
        <View>
          <Spinner size={30} />
        </View>
      ) : (
        <View>
          <View style={{ margin: 10 }}>
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

          {appointments?.map((appointment, index) => (
            <AppointmentCard key={index} appointment={appointment} />
          ))}
        </View>
      )}
      {!showLoader && appointments?.length === 0 && (
        <View>
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              textAlign: 'center',
              fontSize: 20,
            }}>
            No appointments found
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default Appointment;

import React, { Fragment, useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import {
  Actionsheet,
  Box,
  Image,
  Stack,
  Button,
  PresenceTransition,
  VStack,
  HStack,
  Spinner,
  Skeleton,
  useToast,
  Alert,
} from 'native-base';
import { PanGestureHandler } from 'react-native-gesture-handler';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import DatePicker from 'react-native-date-picker';
import dayjs from 'dayjs';
import { suggestDoctors, bookappointment } from '../../../services/patient';
import { getPendingAppointments } from '../../../services/doctor';
import Calendar from '../../../../assets/svg/calendar.svg';
import DoctorLogo from '../../../../assets/images/doctorLogo.png';
import { months } from '../../../constants/constants';

const ConfirmationDrawer = ({ open, setOpen, appointmentObj }) => {
  const { scheduledTime } = appointmentObj;
  const [showConfirmationLoader, setShowConfirmationLoader] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

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

      const response = await bookappointment({
        email: appointmentObj.doctor.email,
        scheduledTime: appointmentObj.scheduledTime,
        symptoms: appointmentObj.symptoms,
        predictedDiease: appointmentObj.predictedDiease,
      });

      if (response.success) {
        setShowConfirmationLoader(false);
        setIsConfirmed(true);
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
        <Box w="100%" h={80}>
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
                      Appointment booked! Please wait for confirmation
                    </Text>
                  </HStack>
                </HStack>
              </VStack>
            </Alert>
          ) : (
            <VStack style={{ width: '100%' }}>
              <View>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    textAlign: 'center',
                    fontSize: 25,
                  }}>
                  {' '}
                  Confirm appointment ?{' '}
                </Text>
              </View>
              <View style={{ alignItems: 'center', height: 120 }}>
                <Calendar width="20%" height="70%" />
              </View>
              <View>
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: 'Poppins-Regular',
                    fontSize: 20,
                  }}>
                  {appointmentObj.predictedDiease}
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: 'Poppins-Bold',
                    fontSize: 20,
                  }}>
                  {dayjs(appointmentObj.scheduledTime).format('hh:mm a')} | Dr.{' '}
                  {appointmentObj.doctor.name.split(' ')[0]}
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: 'Poppins-Regular',
                    fontSize: 20,
                  }}>
                  {formatScheduledDate()}
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

const DoctorCard = ({
  name,
  hospital,
  email,
  rating,
  handleSlotSelection,
  date,
}) => {
  const [showLoader, setShowLoader] = useState(true);

  const timings = [
    `${date}T10:00:00`,
    `${date}T10:30:00`,
    `${date}T11:00:00`,
    `${date}T11:30:00`,
    `${date}T12:00:00`,
    `${date}T13:00:00`,
    `${date}T13:30:00`,
    `${date}T14:00:00`,
  ];

  const [pendingAppointments, setPendingAppointments] = useState([]);

  const handleGetPendingAppointments = async () => {
    try {
      setShowLoader(true);
      const response = await getPendingAppointments({
        email,
        date: dayjs(date).format('YYYY-MM-DD'),
      });
      const tempAppointmentTimings = response.appointments?.map(appointment =>
        dayjs(appointment.scheduledTime).format('hh:mm a'),
      );
      setPendingAppointments(tempAppointmentTimings);
      setShowLoader(false);
    } catch (err) {
      console.log(err);
    }
  };

  const isAlreayAppointed = timing => {
    try {
      const temp = pendingAppointments.filter(pa => pa === timing)[0];
      return Boolean(temp);
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  useEffect(() => {
    handleGetPendingAppointments();
  }, [date, email]);

  return (
    <Box
      style={{
        width: '100%',
        backgroundColor: 'white',
        elevation: 5,
        borderRadius: 5,
      }}>
      <Stack direction="column" style={{ width: '100%', paddingBottom: 5 }}>
        <View>
          <Image
            source={DoctorLogo}
            alt="doctor"
            style={{ height: 200, borderRadius: 5 }}
          />
        </View>

        <View style={{ margin: 15 }}>
          <View>
            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 20 }}>
              Dr. {name}
            </Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            {Array.from({ length: parseInt(rating) }).map((i, index) => (
              <Text
                style={{ fontFamily: 'Poppins-Medium', fontSize: 20 }}
                key={index}>
                ⭐
              </Text>
            ))}
          </View>
          <View>
            <Text style={{ fontFamily: 'Poppins-Regular' }}>{hospital}</Text>
          </View>
        </View>

        {showLoader ? (
          <>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                padding: 1,
              }}>
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton
                  style={{ width: 100, margin: 1.5 }}
                  rounded="md"
                  key={index}
                />
              ))}
            </View>
          </>
        ) : (
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              padding: 1,
            }}>
            {timings?.map((t, index) => (
              <Button
                key={index}
                style={{
                  margin: 1.5,
                  width: 100,
                  ...(isAlreayAppointed(dayjs(t).format('hh:mm a'))
                    ? { backgroundColor: '#e5e5e5', color: '#a8a29e' }
                    : {
                        backgroundColor: '#002851',
                        color: '#FFFFFF',
                      }),
                }}
                onPress={() =>
                  handleSlotSelection({
                    time: t,
                    doctor: { name, hospital, email },
                  })
                }
                disabled={isAlreayAppointed(dayjs(t).format('hh:mm a'))}>
                <Text style={{ fontFamily: 'Poppins-Regular', color: 'white' }}>
                  {dayjs(t).format('hh:mm a')}
                </Text>
              </Button>
            ))}
          </View>
        )}
      </Stack>
    </Box>
  );
};

const Doctors = ({ route }) => {
  const { dieaseObj } = route.params;

  const [doctorIndex, setDoctorIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(true);
  const [date, setDate] = useState(new Date());
  const [openConfirmationDrawer, setOpenConfirmationDrawer] = useState(false);
  const [openDateTime, setOpenDateTime] = useState(false);
  const [appointmentObj, setAppointmentObj] = useState({});
  const [showLoader, setShowLoader] = useState(false);
  const [suggestedDoctors, setSuggestedDoctors] = useState([]);

  const handleGetDoctors = async () => {
    try {
      setShowLoader(true);
      const response = await suggestDoctors({ dieaseObj });
      setSuggestedDoctors(response.doctors);
      setShowLoader(false);
    } catch (err) {
      console.log(err);
    }
  };

  onHandlerStateChange = event => {
    try {
      if (event.nativeEvent.translationX < 0) {
        if (doctorIndex + 1 < suggestedDoctors.length) {
          setDoctorIndex(c => c + 1);
          setIsOpen(true);
        }
      }

      if (event.nativeEvent.translationX > 0) {
        if (doctorIndex - 1 !== -1) {
          setDoctorIndex(c => c - 1);
          setIsOpen(true);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSlotSelection = ({ time, doctor }) => {
    try {
      setAppointmentObj({
        scheduledTime: time,
        doctor: doctor,
      });
      setOpenConfirmationDrawer(true);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleGetDoctors();
  }, []);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  return (
    <>
      <PanGestureHandler onHandlerStateChange={onHandlerStateChange}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {showLoader ? (
            <Spinner size={30} />
          ) : (
            <Fragment>
              <DatePicker
                mode="date"
                date={date}
                onDateChange={setDate}
                style={{ backgroundColor: 'none' }}
                open={openDateTime}
                onCancel={() => setOpenDateTime(false)}
                onConfirm={d => {
                  setDate(d);
                  setOpenDateTime(false);
                }}
                minimumDate={new Date()}
                modal
              />

              <Text
                style={{ fontFamily: 'Poppins-Regular', textAlign: 'center' }}>
                Showing available timings on
              </Text>

              <Pressable onPress={() => setOpenDateTime(true)}>
                <Box
                  style={{
                    elevation: 10,
                    backgroundColor: '#002851',
                    borderRadius: 5,
                    width: 100,
                    marginTop: 10,
                    height: 40,
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Poppins-Medium',
                      padding: 2,
                      borderRadius: 2,
                      textAlign: 'center',
                      color: 'white',
                    }}>
                    {dayjs(date).format('DD/MM/YYYY')}
                  </Text>
                </Box>
              </Pressable>

              <View style={{ width: '90%', marginTop: 10 }}>
                <PresenceTransition
                  visible={isOpen}
                  initial={{
                    opacity: 0,
                    translateX: -20,
                  }}
                  animate={{ opacity: 1, translateX: 0 }}
                  exit={{ opacity: 0, translateX: 20 }}>
                  <DoctorCard
                    {...suggestedDoctors[doctorIndex]}
                    handleSlotSelection={handleSlotSelection}
                    date={dayjs(date).format('YYYY-MM-DD')}
                  />
                </PresenceTransition>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginTop: 15,
                }}>
                {Array.from({ length: suggestedDoctors.length }).map(
                  (_, index) => (
                    <View style={{ margin: 2 }} key={index}>
                      <FontAwesomeIcon
                        name={index === doctorIndex ? 'circle' : 'circle-o'}
                      />
                    </View>
                  ),
                )}
              </View>
            </Fragment>
          )}
        </View>
      </PanGestureHandler>
      {openConfirmationDrawer && (
        <ConfirmationDrawer
          open={openConfirmationDrawer}
          setOpen={setOpenConfirmationDrawer}
          appointmentObj={{ ...appointmentObj, ...dieaseObj }}
        />
      )}
    </>
  );
};

export default Doctors;

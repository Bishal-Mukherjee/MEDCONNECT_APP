import axios from 'axios';
import { REACT_APP_SERVER_URL } from './url';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const confirmAppointment = async ({ appointmentId }) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios({
      url: `${REACT_APP_SERVER_URL}/api/doctor/confirmappointment`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      data: { appointmentId },
    });
    return { success: response.data.message };
  } catch (err) {
    console.log(err);
    return { err: err.message };
  }
};

export const getPendingAppointments = async ({ email, date }) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios({
      url: `${REACT_APP_SERVER_URL}/api/doctor/getappointmentsbytime`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      data: { email, date },
    });
    return {
      success: 'appointments_fetched',
      appointments: response.data.appointments,
    };
  } catch (err) {
    console.log(err);
    return {
      err: err.message,
    };
  }
};

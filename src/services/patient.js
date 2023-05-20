import axios from 'axios';
import { REACT_APP_ML_SERVER_URL, REACT_APP_SERVER_URL } from './url';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const predictDiease = async ({ symptoms }) => {
  try {
    const response = await axios({
      url: REACT_APP_ML_SERVER_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { symptoms },
    });
    return {
      diease: response.data.predictedDiease,
      symptoms: response.data.symptoms,
      message: response.data.message,
    };
  } catch (err) {
    console.log(err);
    return { err: err.message };
  }
};

export const suggestDoctors = async ({ dieaseObj }) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios({
      url: `${REACT_APP_SERVER_URL}/api/patient/suggestdoctors`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      data: { ...dieaseObj },
    });
    return response.data;
  } catch (err) {
    console.log(err);
    return {
      error: err.message,
    };
  }
};

export const bookappointment = async ({
  email,
  scheduledTime,
  symptoms,
  predictedDiease,
}) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios({
      url: `${REACT_APP_SERVER_URL}/api/patient/bookappointment`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      data: {
        email,
        scheduledTime,
        symptoms,
        predictedDiease,
      },
    });
    return { success: response.data.message };
  } catch (err) {
    console.log(err);
    return {
      error: err.message,
    };
  }
};

export const fetchAppointments = async ({ status }) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios({
      url: `${REACT_APP_SERVER_URL}/api/users/getappointments/${status}`,
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
    return {
      err: err.message,
    };
  }
};

export const getActivePharmacy = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios({
      url: `${REACT_APP_SERVER_URL}/api/pharmacy/getactivepharmacy`,
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });
    return { stores: response.data.stores };
  } catch (err) {
    console.log(err);
    return { error: err.message };
  }
};

export const placeOrder = async formData => {
  try {
    // console.log({ ...formData });
    // const response = await fetch('http://your-backend-url/upload', {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'multipart/form-data',
    //   },
    //   body: formData,
    // });
    // const data = await response.json();
    // console.log('Upload successful:', data);

    const token = await AsyncStorage.getItem('token');

    // axios.post(`${REACT_APP_SERVER_URL}/api/pharmacy/placeorder`, formData, {
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'multipart/form-data',
    //     Authorization: token,
    //   },
    // });

    // console.log(formData);

    // const response = await axios({
    //   url: `${REACT_APP_SERVER_URL}/api/pharmacy/placeorder`,
    //   method: 'POST',
    //   headers: {
    //     'Content-Type':
    //       'multipart/form-data;boundary=66dda854-922c-47c9-a768-42bb7b2bdf1a',
    //     Authorization: token,
    //   },
    //   data: formData._parts,
    // });

    // console.log(response);
    // return { stores: response.data.stores };
  } catch (error) {
    console.log('Error uploading document:', error);
  }
};

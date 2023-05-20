import axios from 'axios';
import { REACT_APP_SERVER_URL } from './url';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const userLogin = async ({ email, password, fcmtoken }) => {
  try {
    const response = await axios({
      url: `${REACT_APP_SERVER_URL}/api/users/login`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { email, password, fcmtoken },
    });

    if (response.data.error) {
      return {
        error: {
          type: 'error',
          text: response.data.error,
        },
      };
    } else {
      const { user } = response.data;
      const tempuser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        designation: user.designation,
        gender: user.gender,
      };

      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(tempuser));

      return {
        success: 'login_success',
      };
    }
  } catch (err) {
    console.log(err.message);
    return {
      error: {
        type: 'error',
        text: 'Something went wrong!',
      },
    };
  }
};

export const userRegister = async ({ name, email, password, role }) => {
  try {
    const response = await axios({
      url: `${REACT_APP_SERVER_URL}/api/users/register`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { name, email, password, designation: role, isupdating: false },
    });

    console.log(response.data);

    if (response.data.message === 'profile_created') {
      return {
        success: {
          type: 'success',
          text: 'Registered successfully',
        },
      };
    }

    if (response.data.message === 'profile_exists') {
      return {
        error: {
          type: 'error',
          text: 'User already exists',
        },
      };
    }

    if (response.data.message === 'doctor_profile_created') {
      return {
        trigger: {
          type: 'success',
        },
      };
    }
  } catch (err) {
    console.log(err.message);
    return {
      error: {
        type: 'error',
        text: 'Something went wrong!',
      },
    };
  }
};

export const fetchAppointments = async params => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios({
      url: `${REACT_APP_SERVER_URL}/api/users/getappointments`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      data: { ...params },
    });
    return response.data;
  } catch (err) {
    console.log(err);
    return {
      err: err.message,
    };
  }
};

export const getChatRooms = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios({
      url: `${REACT_APP_SERVER_URL}/api/users/getchatrooms`,
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });
    return { success: 'rooms_fetched', rooms: response.data.rooms };
  } catch (err) {
    console.log(err);
    return {
      err: err.message,
    };
  }
};

export const getRoomMessages = async ({
  roomId,
  skip,
  clientMessagesCount,
}) => {
  try {
    const token = await AsyncStorage.getItem('token');

    const response = await axios({
      url: `${REACT_APP_SERVER_URL}/api/users/getroommessages?skip=${skip}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      data: { roomId, clientMessagesCount },
    });

    return {
      success: 'messages_fetched',
      messages: response.data.messages,
      // totalMessages: response.data.totalMessages,
    };
  } catch (err) {
    console.log(err);
  }
};

export const validatetokens = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const fcmtoken = await AsyncStorage.getItem('fcmtoken');
    const user = JSON.parse(await AsyncStorage.getItem('user'));

    if (user) {
      await axios({
        url: `${REACT_APP_SERVER_URL}/api/users/validatetokens`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: { jwttoken: token, fcmtoken, email: user.email },
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const getorders = async () => {
  try {
    const designation = 'user';
    const { email } = JSON.parse(await AsyncStorage.getItem('user'));
    const response = await axios({
      url: `${REACT_APP_SERVER_URL}/api/pharmacy/getorders/${designation}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { email },
    });

    return {
      orders: response.data.orders,
    };
  } catch (err) {
    console.log(err);
    return {
      error: err.message,
    };
  }
};

export const getuserdetails = async () => {
  try {
    const { email } = JSON.parse(await AsyncStorage.getItem('user'));
    const response = await axios({
      url: `${REACT_APP_SERVER_URL}/api/users/userdetails`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { email },
    });
    return { user: response.data.user };
  } catch (err) {
    console.log(err);
    return {
      error: err.message,
    };
  }
};

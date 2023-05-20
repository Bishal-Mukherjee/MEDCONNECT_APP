import axios from 'axios';
import { REACT_APP_SERVER_URL } from './url';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const placeOrder = async orderObj => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios({
      url: `${REACT_APP_SERVER_URL}/api/pharmacy/placeorder`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      data: orderObj,
    });

    if (response.data.message) {
      return {
        success: {
          text: 'Order placed successfully',
          type: 'success',
        },
      };
    }
  } catch (err) {
    console.log(err);
    return {
      error: err.message,
    };
  }
};

export const getorders = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios({
      url: `${REACT_APP_SERVER_URL}/api/pharmacy/placeorder`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      data: orderObj,
    });

    if (response.data.message) {
      return {
        success: {
          text: 'Order placed successfully',
          type: 'success',
        },
      };
    }
  } catch (err) {
    console.log(err);
    return {
      error: err.message,
    };
  }
};

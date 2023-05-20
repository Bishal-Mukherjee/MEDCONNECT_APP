/* this context involves Socket and Firebase FCM */

import React, { useContext, createContext, useMemo, useEffect } from 'react';
import io from 'socket.io-client';
import { REACT_APP_SERVER_URL } from '../services/url';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validatetokens } from '../services/user';

const Context = createContext();

export function useSocket() {
  return useContext(Context);
}

export const SocketProvider = ({ children }) => {
  const { Provider } = Context;

  const socket_connection = useMemo(() => io.connect(REACT_APP_SERVER_URL), []);

  const handleGetFcm = async () => {
    try {
      const existingToken = await AsyncStorage.getItem('fcmtoken');
      if (!existingToken) {
        const fcmtoken = await messaging().getToken();
        await AsyncStorage.setItem('fcmtoken', fcmtoken);
      } else {
        console.log('existingToken->', existingToken);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleGetFcm();
    validatetokens();
  }, []);

  useEffect(() => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Received background message:', remoteMessage);
    });
  }, []);

  const contextObj = {
    socket_connection,
  };

  return <Provider value={contextObj}>{children}</Provider>;
};

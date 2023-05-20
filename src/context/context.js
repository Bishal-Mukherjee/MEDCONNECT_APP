import React, {
  useState,
  useContext,
  createContext,
  useEffect,
  useMemo,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';
import { REACT_APP_SERVER_URL } from '../services/url';
import messaging from '@react-native-firebase/messaging';
import { validatetokens } from '../services/user';

const Context = createContext({ navigation: null, user: {} });

export function useNavigation() {
  return useContext(Context);
}

export const NavigatorContext = ({ navigation, children }) => {
  const { Provider } = Context;
  const [user, setUser] = useState({});
  const [fcmToken, setFcmToken] = useState('');

  const socket_connection = useMemo(() => io.connect(REACT_APP_SERVER_URL), []);

  const handleGetUser = async () => {
    try {
      const tempUser = JSON.parse(await AsyncStorage.getItem('user'));
      setUser(tempUser);
    } catch (err) {
      console.log(err);
    }
  };

  const handleGetFcm = async () => {
    try {
      const existingToken = await AsyncStorage.getItem('fcmtoken');
      if (!existingToken) {
        const tempfcmtoken = await messaging().getToken();
        await AsyncStorage.setItem('fcmtoken', tempfcmtoken);
        setFcmToken(tempfcmtoken);
      } else {
        console.log('existingToken->', existingToken);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleGetUser();
    handleGetFcm();
    validatetokens();
  }, []);

  useEffect(() => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Received background message:', remoteMessage);
    });
  }, []);

  const contextObj = {
    navigation,
    user,
    fcmToken,
    socket_connection,
  };
  return <Provider value={contextObj}>{children}</Provider>;
};

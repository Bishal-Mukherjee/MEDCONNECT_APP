import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HStack, Spinner } from 'native-base';

const Splash = ({ navigation }) => {
  const handleLoginCheck = async () => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (user) {
        navigation.navigate('Parent');
      } else {
        navigation.navigate('Login');
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleLoginCheck();
  }, [navigation]);

  return (
    <View style={{ backgroundColor: '#cffafe', height: '100%' }}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          marginTop: '60%',
        }}>
        <Image source={require('../../assets/images/logo.png')} />
        <View style={{ marginTop: 5 }}>
          <HStack space={2} alignItems="center">
            <Spinner size={30} color="#06b6d4" />
          </HStack>
        </View>
      </View>
    </View>
  );
};

export default Splash;

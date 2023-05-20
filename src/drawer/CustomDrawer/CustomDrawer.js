import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Avatar, Box, HStack, Spinner } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '../../context/context';
// import UserImage from '../../../assets/images/userImage.png';

const UserBox = () => {
  const { user } = useNavigation();
  return (
    <Box
      style={{
        margin: 10,
        backgroundColor: '#e5e5e5',
        height: 70,
        borderRadius: 5,
        display: 'flex',
      }}>
      <HStack
        style={{
          alignItems: 'center',
          height: '100%',
        }}>
        <Avatar
          source={{
            uri: 'https://cdn.pixabay.com/photo/2017/06/09/23/22/avatar-2388584_960_720.png',
          }}
          style={{ marginLeft: 10 }}
        />
        <View>
          <Text
            style={{
              fontFamily: 'Poppins-Medium',
              marginLeft: 15,
              fontSize: 15,
            }}>
            {user.name}
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins-Medium',
              marginLeft: 15,
              fontSize: 10,
              marginTop: -5,
              textTransform: 'capitalize',
            }}>
            {user.designation}
          </Text>
        </View>
      </HStack>
    </Box>
  );
};

const LogoutBox = ({ navigation }) => {
  const [showLoader, setShowLoader] = useState(false);

  const handleLogout = async () => {
    try {
      setShowLoader(true);
      setTimeout(async () => {
        await AsyncStorage.clear();
        navigation.navigate('Login');
        setShowLoader(false);
      }, 1500);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Pressable
      style={{
        margin: 10,
        backgroundColor: '#ffe4e6',
        height: 40,
        borderRadius: 5,
        display: 'flex',
      }}
      onPress={() => handleLogout()}>
      <HStack
        style={{
          alignItems: 'center',
          height: '100%',
        }}>
        <View style={{ marginLeft: 15 }}>
          {showLoader ? (
            <Spinner color="#737373" />
          ) : (
            <MaterialIcons name="logout" size={20} />
          )}
        </View>

        <Text
          style={{
            fontFamily: 'Poppins-Medium',
            marginLeft: 15,
            fontSize: 15,
          }}>
          Logout
        </Text>
      </HStack>
    </Pressable>
  );
};

export const CustomDrawer = ({ props, navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <UserBox />
      <DrawerContentScrollView {...props} style={{ marginTop: 10 }}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <LogoutBox navigation={navigation} />
    </View>
  );
};

import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import { CustomDrawer } from './CustomDrawer/CustomDrawer';
import { CustomHeader } from './CustomHeader/CustomHeader';

// PATIENT
import Appointments from '../screens/PATIENT/appointment/index';
import Consultation from '../screens/PATIENT/consultation/Consultation';
import ChatNavigator from '../screens/PATIENT/chat/ChatNavigator';
import Pharmacy from '../screens/PATIENT/pharmacy/Pharmacy';
import Pathology from '../screens/PATIENT/pathology/Pathology';
import Profile from '../screens/PATIENT/profile/Profile';
import Doctors from '../screens/PATIENT/doctors/Doctor';
import Message from '../screens/PATIENT/chat/Message/Message';

// DOCTOR
import DocAppointments from '../screens/DOCTOR/appointment/Appointment';
import DocChatNavigator from '../screens/DOCTOR/chat/ChatNavigator';
import DocMessage from '../screens/DOCTOR/chat/Message/Message';

import { useNavigation } from '../context/context';

const DrawerNavigator = createDrawerNavigator();

const Drawer = () => {
  const { user, navigation } = useNavigation();

  return (
    <>
      {user.designation === 'patient' && (
        <DrawerNavigator.Navigator
          drawerContent={props => (
            <CustomDrawer props={props} navigation={navigation} />
          )}
          //   screenListeners={{
          //     drawerItemPress: e => {
          //       handleLoginCheck();
          //     },
          //   }}
          initialRouteName="Profile">
          <DrawerNavigator.Screen
            name="Appointments"
            component={Appointments}
            options={{
              headerShown: true,
              header: params => (
                <CustomHeader params={params} disableMessageIcon={true} />
              ),
              drawerIcon: () => <AntDesignIcon name="calendar" size={20} />,
              drawerLabelStyle: {
                fontFamily: 'Poppins-Regular',
                marginLeft: -10,
              },
            }}
          />
          <DrawerNavigator.Screen
            name="Consultation"
            component={Consultation}
            options={{
              headerShown: true,
              header: params => (
                <CustomHeader params={params} disableMessageIcon={true} />
              ),
              drawerIcon: () => <FontistoIcon name="doctor" size={20} />,
              drawerLabelStyle: {
                fontFamily: 'Poppins-Regular',
                marginLeft: -10,
              },
            }}
          />
          <DrawerNavigator.Screen
            name="Pharmacy"
            component={Pharmacy}
            options={{
              headerShown: true,
              header: params => (
                <CustomHeader params={params} disableMessageIcon={true} />
              ),
              drawerIcon: () => <AntDesignIcon name="medicinebox" size={20} />,
              drawerLabelStyle: {
                fontFamily: 'Poppins-Regular',
                marginLeft: -10,
              },
            }}
          />
          <DrawerNavigator.Screen
            name="Pathology Lab"
            component={Pathology}
            options={{
              headerShown: true,
              header: params => (
                <CustomHeader params={params} disableMessageIcon={true} />
              ),
              drawerIcon: () => <FontistoIcon name="laboratory" size={20} />,
              drawerLabelStyle: {
                fontFamily: 'Poppins-Regular',
                marginLeft: -10,
              },
            }}
          />
          <DrawerNavigator.Screen
            name="Profile"
            component={Profile}
            options={{
              headerShown: true,
              header: params => (
                <CustomHeader params={params} disableMessageIcon={true} />
              ),
              drawerIcon: () => <AntDesignIcon name="user" size={20} />,
              drawerLabelStyle: {
                fontFamily: 'Poppins-Regular',
                marginLeft: -10,
              },
            }}
          />
          <DrawerNavigator.Screen
            name="Messages"
            component={ChatNavigator}
            options={{
              headerShown: true,
              drawerItemStyle: { display: 'none' },
              header: params => (
                <CustomHeader params={params} disableMessageIcon={false} />
              ),
            }}
          />
          <DrawerNavigator.Screen
            name="Message"
            component={Message}
            options={{
              headerShown: false,
              drawerItemStyle: { display: 'none' },
              header: params => (
                <CustomHeader params={params} disableMessageIcon={false} />
              ),
            }}
          />
          <DrawerNavigator.Screen
            name="Doctors"
            component={Doctors}
            options={{
              headerShown: true,
              drawerItemStyle: { display: 'none' },
              header: params => (
                <CustomHeader params={params} disableMessageIcon={true} />
              ),
            }}
          />
        </DrawerNavigator.Navigator>
      )}

      {user.designation === 'doctor' && (
        <DrawerNavigator.Navigator
          drawerContent={props => (
            <CustomDrawer props={props} navigation={navigation} />
          )}
          screenListeners={{
            drawerItemPress: e => {
              handleLoginCheck();
            },
          }}>
          <DrawerNavigator.Screen
            name="Appointments"
            component={DocAppointments}
            options={{
              headerShown: true,
              header: params => (
                <CustomHeader params={params} disableMessageIcon={true} />
              ),
              drawerIcon: () => <AntDesignIcon name="calendar" size={20} />,
              drawerLabelStyle: {
                fontFamily: 'Poppins-Regular',
                marginLeft: -10,
              },
            }}
          />
          <DrawerNavigator.Screen
            name="Messages"
            component={DocChatNavigator}
            options={{
              headerShown: true,
              drawerItemStyle: { display: 'none' },
              header: params => (
                <CustomHeader params={params} disableMessageIcon={false} />
              ),
            }}
          />
          <DrawerNavigator.Screen
            name="Message"
            component={DocMessage}
            options={{
              headerShown: false,
              header: params => (
                <CustomHeader params={params} disableMessageIcon={true} />
              ),
              drawerIcon: () => <AntDesignIcon name="calendar" size={20} />,
              drawerItemStyle: { display: 'none' },
              drawerLabelStyle: {
                fontFamily: 'Poppins-Regular',
                marginLeft: -10,
              },
            }}
          />
        </DrawerNavigator.Navigator>
      )}
    </>
  );
};

export default Drawer;

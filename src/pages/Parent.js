import React from 'react';
import DrawerNavigator from '../drawer/Drawer';
import { NavigatorContext } from '../context/context';

const Parent = ({ navigation }) => {
  return (
    <NavigatorContext navigation={navigation}>
      <DrawerNavigator />
    </NavigatorContext>
  );
};

export default Parent;

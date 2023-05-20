import React from 'react';
import { NativeBaseProvider } from 'native-base';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import StackNavigatior from './src/routes/routes';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NativeBaseProvider>
        <StackNavigatior />
      </NativeBaseProvider>
    </GestureHandlerRootView>
  );
};

export default App;

import 'react-native-gesture-handler';  // corrigido import para string sem ./ (mais padrão)
import React, { JSX } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import Routes from './src/routes/index.routes';

export default function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Routes />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});

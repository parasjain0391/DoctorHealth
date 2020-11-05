/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */



// Calling both screen CallLog and SingleLog



import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

//import {View} from 'react-native';
import CurrentWork from './CurrentWork';
import StatusUpdate from './StatusUpdate';
import { NavigationParams } from 'react-navigation';
const Stack = createStackNavigator();
interface Props extends NavigationParams {}
interface States {}
export default class Work extends React.Component<Props, States> {
  render() {
    return (
      <Stack.Navigator initialRouteName="CurrentWork">
        <Stack.Screen
          name="CurrentWork"
          component={CurrentWork}
          options={{title: 'Current Work'}}
        />
        <Stack.Screen
          name="StatusUpdate"
          component={StatusUpdate}
          options={{title: 'Status Update'}}
        />
      </Stack.Navigator>
    );
  }
}

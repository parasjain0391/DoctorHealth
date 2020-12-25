/* eslint-disable prettier/prettier */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import CurrentWork from './CurrentWork';
import { NavigationParams } from 'react-navigation';

// Calling both screen CallLog and SingleLog
// it is a component of the HomeScreen
// Default screen is the CurrentWork Screen


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
      </Stack.Navigator>
    );
  }
}

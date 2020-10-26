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

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

//import {View} from 'react-native';
import CallLog from './CallLog';
import SingleLog from './SingleLog';
import { NavigationParams } from 'react-navigation';
const Stack = createStackNavigator();
interface Props extends NavigationParams {}
interface States {}
export default class CallHistory extends React.Component<Props, States> {
  render() {
    return (
      <Stack.Navigator initialRouteName="CallLog">
        <Stack.Screen
          name="CallLog"
          component={CallLog}
          options={{title: 'Call Log'}}
        />
        <Stack.Screen
          name="SingleLog"
          component={SingleLog}
          options={{title: 'Log Detail'}}
        />
      </Stack.Navigator>
    );
  }
}

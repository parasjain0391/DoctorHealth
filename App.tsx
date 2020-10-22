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

// @ts-ignore
import {NavigationContainer} from '@react-navigation/native';
//import {View} from 'react-native';
import Login from './Screens/Login';
import Homescreen from './Screens/Homescreen';
const Stack = createStackNavigator();
interface Props {}
interface States {}
export default class App extends React.Component<Props, States> {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={Login}
            options={{title: 'Login'}}
          />
          <Stack.Screen
            name="Homescreen"
            component={Homescreen}
            options={{title: 'Doctor Health'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

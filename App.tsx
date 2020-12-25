import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
// @ts-ignore
import {NavigationContainer} from '@react-navigation/native';
//import {View} from 'react-native';
import Login from './Screens/Login';
import Homescreen from './Screens/Homescreen';
import StatusUpdate from './Screens/StatusUpdate';
import NAList from './Screens/NAList';
import NATodayList from './Screens/NATodayList';
import PriceIssueList from './Screens/PriceIssueList';
import ReportAwaitedList from './Screens/ReportAwaitedList';
import InterestedList from './Screens/InterestedList';

const Stack = createStackNavigator();
interface Props {}
interface States {}
export default class App extends React.Component<Props, States> {
  render() {
    return (
      // stack navigator for login screen and others
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
          <Stack.Screen
            name="StatusUpdate"
            component={StatusUpdate}
            options={{title: 'Status Update'}}
          />
          <Stack.Screen
            name="NA List"
            component={NAList}
            options={{title: 'NA List'}}
          />
          <Stack.Screen
            name="NA Today List"
            component={NATodayList}
            options={{title: 'NA Today List'}}
          />
          <Stack.Screen
            name="Price Issue List"
            component={PriceIssueList}
            options={{title: 'Price Issue List'}}
          />
          <Stack.Screen
            name="Interested List"
            component={InterestedList}
            options={{title: 'Interested List'}}
          />
          <Stack.Screen
            name="Report Awaited List"
            component={ReportAwaitedList}
            options={{title: 'Report Awaited List'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

/* eslint-disable prettier/prettier */
import React from 'react';
import CallLog from './CallLog';
import CurrentWork from './CurrentWork';
import Settings from './Settings';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();
interface Props {
    navigation:any,
}
interface States {}
export default class Homescreen extends React.Component<Props,States> {
    render() {
        return (
            <Tab.Navigator initialRouteName="Current Work">
                <Tab.Screen name="Current Work" component={CurrentWork} />
                <Tab.Screen name="CallLog" component={CallLog} />
                <Tab.Screen name="Settings" component={Settings} />
            </Tab.Navigator>
        );
    }
}

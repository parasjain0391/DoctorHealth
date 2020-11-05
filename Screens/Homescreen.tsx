/* eslint-disable prettier/prettier */
import React from 'react';
import CallHistory from './CallHistory';
import Work from './Work';
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
            <Tab.Navigator initialRouteName="Work">
                <Tab.Screen name="Work" component={Work} />
                <Tab.Screen name="Call History" component={CallHistory} />
                <Tab.Screen name="Settings" component={Settings} />
            </Tab.Navigator>
        );
    }
}

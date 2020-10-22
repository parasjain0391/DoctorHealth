/* eslint-disable prettier/prettier */
import React from 'react';
import { Text, View } from 'react-native';

interface Props {
    navigation:any;
}
interface States {}

export default class SingleLog extends React.Component<Props,States> {
    render() {
        return (
            <View>
                <Text>SingleLog Screen</Text>
            </View>
        );
    }
}

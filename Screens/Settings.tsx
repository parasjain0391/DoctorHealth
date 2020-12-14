/* eslint-disable prettier/prettier */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationParams } from 'react-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { FAB } from 'react-native-paper';
interface Props extends NavigationParams {}
interface States {}
// Settign page that can be used to logout
export default class Setting extends React.Component<Props,States> {
    constructor(props:Props) {
        super(props);
    }
    async viewNotAnswereed(navigation:any){
        const r:any = await AsyncStorage.getItem('role');
        if (r !== 'NA Handler'){
            Alert.alert('Only NA Handler can access NA Patients');
        } else {
            navigation.navigate('NA List');
        }
    }
    async viewInterested(navigation: any) {
        const uid:any = await AsyncStorage.getItem('uid');
        navigation.navigate('Interested List',{uid:uid});
    }
    async viewReportAwaited(navigation: any) {
        const uid:any = await AsyncStorage.getItem('uid');
        navigation.navigate('Report Awaited List',{uid:uid});
    }
    async viewPriceIssue(navigation: any) {
        const r:any = await AsyncStorage.getItem('role');
        if (r !== 'Price Negotiator'){
            Alert.alert('Only Price Negotiator can access Price Issue Patient');
        } else {
            navigation.navigate('Price Issue List');
        }
    }
    //remove the email, password and uid from the phone memory
    async logout(navigation:any) {
        console.log('Logout');
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('password');
        await AsyncStorage.removeItem('uid');
    }
    //render a single button for the logout
    render() {
        return (
            <View style={styles.container}>
                <FAB
                style={styles.fab}
                label="Report Awaited List"
                icon="clipboard-text"
                onPress={()=>{this.viewReportAwaited(this.props.navigation);}}
                />
                <FAB
                style={styles.fab}
                label="Interested List"
                icon="clipboard-text"
                onPress={()=>{this.viewInterested(this.props.navigation);}}
                />
                <FAB
                style={styles.fab}
                label="NA List"
                icon="clipboard-text"
                onPress={()=>{this.viewNotAnswereed(this.props.navigation);}}
                />
                <FAB
                style={styles.fab}
                label="Price Issue List"
                icon="clipboard-text"
                onPress={()=>{this.viewPriceIssue(this.props.navigation);}}
                        />
                <FAB
                style={styles.fab}
                label="Logout"
                icon="clipboard-text"
                onPress={()=>{this.logout(this.props.navigation);}}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    fab: {
        alignSelf:'center',
        backgroundColor:'#33ff49',
        marginVertical:20,
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
    },
});

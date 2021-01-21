/* eslint-disable prettier/prettier */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationParams } from 'react-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { FAB } from 'react-native-paper';
import database from '@react-native-firebase/database';
import moment from 'moment';
interface Props extends NavigationParams {}
interface States {}
// Settign page that can be used to logout
export default class Setting extends React.Component<Props,States> {
    uid:any
    ref:any
    role:any
    constructor(props:Props) {
        super(props);
        this.ref = '';
        this.uid = '';
        this.role = '';
    }
    async componentDidMount(){
        this.role = await AsyncStorage.getItem('role');
        this.uid = await AsyncStorage.getItem('uid');
        this.ref = database().ref('/work/Pending/' + String(this.uid));
    }
    viewNotAnswered(navigation:any){
        if (this.role !== 'NA Handler'){
            Alert.alert('Only NA Handler can access NA Patients');
        } else {
            navigation.navigate('NA List');
        }
    }
    viewNotAnsweredToday(navigation:any){
        navigation.navigate('NA Today List');
    }
    viewInterested(navigation: any) {
        navigation.navigate('Interested List',{uid:this.uid});
    }
    viewReportAwaited(navigation: any) {
        navigation.navigate('Report Awaited List',{uid:this.uid});
    }
    viewCampaignList(navigation: any) {
        navigation.navigate('Select Campaign List',{uid:this.uid});
    }
    viewPriceIssue(navigation: any) {
        if (this.role !== 'Price Negotiator'){
            Alert.alert('Only Price Negotiator can access Price Issue Patient');
        } else {
            navigation.navigate('Price Issue List');
        }
    }
    unassignPatient() {
        Alert.alert(
            'Unassigned Task',
            'Are you sure that you want to unassign all the task?',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              { text: 'OK', onPress: () => {this.updateDatabase();} },
            ],
            { cancelable: false }
          );
    }
    updateDatabase(){
        this.ref
        .once('value')
        .then((snapshot:any)=>{
            if (!snapshot.exists()){
                Alert.alert('You have no assigned task');
            } else {
                var count = 0;
                //console.log(snapshot.val());
                snapshot.forEach((element:any) => {
                    //console.log('/work/' + String(element.child('listName').val()));
                    //console.log(element.val());
                    var call = {
                        'phoneNumber': element.key,
                        'timestamp': new Date().getTime(),
                        'rawType': '',
                        'type': '',
                        'duration': '',
                        'name': '',
                        'dateTime': moment().format('YYYY-MM-DD'),
                    };
                    count++;
                    //console.log(element.val() + ' is unassigned');
                    database()
                    .ref('/work/' + String(element.child('listName').val()))
                    .child(element.key)
                    .set(call);
                });
                this.ref.set(null);
                database()
                .ref('/doctorPerformance/' + String(this.uid))
                .once('value')
                .then((sshot)=>{
                    database()
                    .ref('/doctorPerformance/' + String(this.uid))
                    .child('Pending')
                    .set(sshot.child('Pending').val() - count);
                    database()
                    .ref('/doctorPerformance/' + String(this.uid))
                    .child(moment().format('YYYY-MM-DD'))
                    .child('Assigned Rejected')
                    .set(sshot.child(moment().format('YYYY-MM-DD')).child('Assigned Rejected').val() + count);
                })
                .catch((err:any)=>{console.log(String(err));});
            }
        })
        .catch((err:any)=>{console.log(String(err));});
    }
    //remove the email, password and uid from the phone memory
    async logout(navigation:any) {
        console.log('Logout');
        navigation.reset({
            index: 0,
            routes: [{ name: 'LoginTrial' }],
        });
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('role');
        await AsyncStorage.removeItem('password');
        await AsyncStorage.removeItem('uid');
    }
    //render a single button for the logout
    render() {
        return (
            <View style={styles.container}>
                <FAB
                style={styles.fab}
                label="Campaigns List"
                icon="clipboard-text"
                onPress={()=>{this.viewCampaignList(this.props.navigation);}}
                />
                <FAB
                style={styles.fab}
                label="Interested List"
                icon="clipboard-text"
                onPress={()=>{this.viewInterested(this.props.navigation);}}
                />
                <FAB
                style={styles.fab}
                label="NA Today List"
                icon="clipboard-text"
                onPress={()=>{this.viewNotAnsweredToday(this.props.navigation);}}
                />
                <FAB
                style={styles.fab}
                label="NA List"
                icon="clipboard-text"
                onPress={()=>{this.viewNotAnswered(this.props.navigation);}}
                />
                <FAB
                style={styles.fab}
                label="Price Issue List"
                icon="clipboard-text"
                onPress={()=>{this.viewPriceIssue(this.props.navigation);}}
                />
                <FAB
                style={styles.fab}
                label="Unassigned All Patients"
                icon="clipboard-text"
                onPress={()=>{this.unassignPatient();}}
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
        marginVertical:15,
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
    },
});

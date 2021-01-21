/* eslint-disable prettier/prettier */
import React from 'react';
import {Alert, StyleSheet, View, Platform, PermissionsAndroid, ScrollView } from 'react-native';
import { NavigationParams, SafeAreaView } from 'react-navigation';
// @ts-ignore
import RadioButtonRN from 'radio-buttons-react-native';
import { Button } from 'react-native-elements';
import database from '@react-native-firebase/database';
// @ts-ignore
import CallLogs from 'react-native-call-log';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
const styles = StyleSheet.create({
    body: {
      backgroundColor: 'white',
      justifyContent:'flex-end',
      fontSize:18,
    },
    buttonarea: {
        flexDirection:'row',
        justifyContent:'space-evenly',
        marginVertical:4,
        paddingHorizontal:10,
    },
    radioButtonArea: {
      fontSize: 24,
      fontWeight: '600',
      justifyContent:'center',
      alignContent:'center',
    },
    radioText: {
        fontSize:18,
        fontWeight: '600',
    },
    radioBox: {
        marginHorizontal:20,
    },
    button: {
        marginHorizontal:10,
        justifyContent:'center',
        alignSelf:'stretch',
    },
    buttontitle: {
        fontSize:20,
    },
  });

interface Props extends NavigationParams {
  navigation:any
}
interface States {
    calls: {
        dateTime: string;
        duration: number;
        name: string;
        phoneNumber: number;
        rawType: number;
        timestamp: string;
        type: string;
      }[];
 }
export default class StatusUpdate extends React.Component<Props, States> {
    newStatus:string;
    previousStatus:string;
    timeSpent:number;
    callCount:number;
    _isMounted:boolean;
    constructor(props:Props) {
        super(props);
        this.state = {
            calls: [],
          };
        this.newStatus = 'Pending';
        this.previousStatus = '';
        this.callCount = 0;
        this.timeSpent = 0;
        this._isMounted = false;
    }
    componentDidMount(){
        this._isMounted = true;
        this._isMounted && this.getCallLogs();
    }
    componentDidUpdate(){
        this._isMounted && this.getCallLogs();
    }
    componentWillUnmount(){
        this._isMounted = false;
    }
    // Update the performance varaiable of the doctor
    updatePerformance(rec:any){
        const datePerformanceRef = database()
        .ref('/doctorPerformance/' + String(rec.doctoruid) + '/' + String(rec.statusUpdateDate));
        datePerformanceRef
        .once('value')
        .then((snapshot)=>{
            if (!snapshot.exists()){
                var freshPerformance = { 'Order Confirmed':0,
                                    'Interested':0,
                                    'Not Answered':0,
                                    'Not Answered 2':0,
                                    'Price Issue':0,
                                    'Report Awaited':0,
                                    'Not Interested':0,
                                    'Assigned':0,
                                    'Time Spent':0,
                                    'Calls Made':0,
                                    'Finally Confirmed':0,
                                    'Order Declined':0,
                                    'Assigned Rejected':0,
                                    'Repeat':0,
                                    'Existing Patients':0,
                                    'Appointments':0,
                                    'Call Back':0,
                                };
                database()
                .ref('/doctorPerformance/' + String(rec.doctoruid) + '/' + String(moment().format('YYYY-MM-DD')))
                .set(freshPerformance)
                .catch((err)=>{console.log(String(err));});
            }
            console.log(snapshot.val());
            let count = snapshot.child(String(this.newStatus)).val() + 1;
            let timeSpent = snapshot.child('Time Spent').val() + rec.timeSpent;
            let callcount = snapshot.child('Calls Made').val() + rec.callsMade;
            datePerformanceRef
            .child(String(this.newStatus))
            .set(count)
            .then(()=>{
                datePerformanceRef
                .update({
                    'Time Spent': timeSpent,
                    'Calls Made': callcount,
                })
                .catch((err)=>{console.log(String(err));});
                if (String(this.previousStatus) === 'Pending'){
                    database()
                    .ref('/doctorPerformance/' + String(rec.doctoruid))
                    .child('Pending')
                    .once('value')
                    .then((snap)=>{
                        let pc = snap.val() - 1;
                        database()
                        .ref('/doctorPerformance/' + String(rec.doctoruid))
                        .child('Pending')
                        .set(pc);
                    })
                    .catch((err)=>{console.log(String(err));});
                } else if ((this.previousStatus) === 'Not Answered' && rec.statusUpdateDate === moment().format('YYYY-MM-DD')) {
                    database()
                    .ref('/doctorPerformance/' + String(rec.doctoruid) + '/' + String(rec.statusUpdateDate))
                    .child('Not Answered')
                    .once('value')
                    .then((snap)=>{
                        let pc = snap.val() - 1;
                        database()
                        .ref('/doctorPerformance/' + String(rec.doctoruid) + '/' + String(rec.statusUpdateDate))
                        .child('Not Answered')
                        .set(pc);
                    })
                    .catch((err)=>{console.log(String(err));});
                }
            })
            .catch((err)=>{console.log(String(err));});
        })
        .catch((err)=>{console.log(String(err));});
    }
    // updates the status of the patient in the database
    async updateStatus(patient:any) {
        if (this.newStatus === 'Pending'){
            Alert.alert('Please select an different(new) status of the patient');
        } else {
            //Previosu Status is stored for decrement in count
            this.previousStatus = String(patient.status);
            // code to calculate the time spend on that patient on call
            this.state.calls.forEach((call)=>{
                call.phoneNumber = call.phoneNumber % 10000000000;
                if (String(call.phoneNumber) === String(patient.phoneNumber)){
                    this.timeSpent += call.duration;
                    this.callCount++;
                }
            });
            var uid = await AsyncStorage.getItem('uid');
            var rec:any = {
                phoneNumber: patient.phoneNumber,
                doctoruid: uid,
                statusUpdateDate: patient.statusUpdateDate,
                statusUpdateTime: patient.statusUpdateTime,
                timeSpent:this.timeSpent,
                callsMade:this.callCount,
                status:this.newStatus,
                assignedTo:patient.assignedTo,
                timeStamp:moment().unix(),
            };
            //Code to delete the work
            database()
            .ref('/work/' + String(this.previousStatus) + '/' + String(patient.doctoruid) )
            .child(patient.phoneNumber)
            .set(null)
            .then(()=>{this.updatePerformance(rec);});  //update the performance
            // code to record the data of the patient
            rec.statusUpdateDate = moment().format('YYYY-MM-DD');
            rec.statusUpdateTime = moment().format('LT');
            database()
            .ref('/records/' + String(rec.doctoruid) + '/' + String(rec.statusUpdateDate) + '/' + String(rec.status))
            .child(rec.phoneNumber)
            .set(rec);
            // code to update the data for special profile
            database()
            .ref('/work/' + String(rec.status) + '/' + String(rec.doctoruid))
            .child(rec.phoneNumber)
            .set(rec);
            console.log('Status is updated as ' + this.newStatus);
            this.props.navigation.goBack();
            //this.props.navigation.navigate('CurrentWork');
        }
        //change data in the database
    }
    //get the calllog from the phone and take permission
    async getCallLogs() {
        if (Platform.OS !== 'ios') {
            try {
                //Ask for runtime permission
                const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
                {
                    title: 'Call Log Example',
                    message: 'Access your call logs',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                CallLogs.load(10).then((calls: any) => this._isMounted && this.setState({calls}));
                } else {
                Alert.alert('Call Log permission denied');
                }
            } catch (e) {
                Alert.alert(e);
            }
        } else {
                Alert.alert('Sorry! You can’t get call logs in iOS devices because of the security concern',);
        }
    }
    render() {
      const { patient } = this.props.route.params;
      const data = [
            {
                label:'Order Confirmed',
            },
            {
                label:'Not Answered',
            },
            {
                label:'Interested',
            },
            {
                label:'Report Awaited',
            },
            {
                label:'Price Issue',
            },
            {
                label:'Not Interested',
            },
            {
                label:'Repeat',
            },
            {
                label:'Existing Patients',
            },
            {
                label:'Appointments',
            },
            {
                label:'Call Back',
            },
            {
                label:'Not Answered 2',
            },
      ];
      return (
        <SafeAreaView>
        <ScrollView>
        <View>
            <View>
                <RadioButtonRN
                data={data}
                selectedBtn={(value:any) => {this.newStatus = value.label;}}
                animationTypes={['zoomIn']}
                duration={5}
                textStyle={styles.radioText}
                boxStyle={styles.radioText}
                />
            </View>
            <View style={styles.buttonarea}>
            <Button
                onPress={()=>{this.props.navigation.goBack();}}
                title="Cancel"
                type="outline"
                buttonStyle={styles.button}
                titleStyle={styles.buttontitle}
            />
            <Button
                onPress={()=>{this._isMounted && this.updateStatus(patient);}}
                title="Save"
                type="solid"
                buttonStyle={styles.button}
                titleStyle={styles.buttontitle}
            />
            </View>
        </View>
        </ScrollView>
        </SafeAreaView>
      );
    }
}

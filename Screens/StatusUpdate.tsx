/* eslint-disable prettier/prettier */
import React from 'react';
import {Alert, StyleSheet, View } from 'react-native';
import { NavigationParams, SafeAreaView } from 'react-navigation';
// @ts-ignore
import RadioButtonRN from 'radio-buttons-react-native';
import { Button } from 'react-native-elements';
import database from '@react-native-firebase/database';
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
interface States { }
export default class StatusUpdate extends React.Component<Props, States> {
    newStatus:string;
    time:any;
    turnAround:any;
    constructor(props:Props) {
        super(props);
        this.time = {'date':'','year':'','month':'','hours':'','min':'','sec':'','timestamp':''};
        this.newStatus = 'Pending';
        this.turnAround = {'hours':'00','min':'00','sec':'00'};
    }
    // updates the status of the patient in the database
    updateStatus(patient:any) {
        if (this.newStatus === 'Pending') {
            Alert.alert('Please select a new status of the patient');
        } else {
            this.time.date = new Date().getDate(); //Current Date
            this.time.month = new Date().getMonth() + 1; //Current Month
            this.time.year = new Date().getFullYear(); //Current Year
            this.time.hours = new Date().getHours(); //Current Hours
            this.time.min = new Date().getMinutes(); //Current Minutes
            this.time.sec = new Date().getSeconds(); //Current Seconds
            this.time.timestamp = new Date().getTime();
            patient.status = this.newStatus;
            patient.statusUpdateTime = this.time;
            //calculate turn around time
            var difference:number = patient.statusUpdateTime.timestamp - patient.assignedTime.timestamp;
            console.log(difference);
            difference = Math.floor(difference / 1000);
            console.log(difference);
            this.turnAround.sec = difference % 60;
            difference = Math.floor(difference / 60);
            console.log(difference);
            this.turnAround.min = difference % 60;
            difference = Math.floor(difference / 60);
            console.log(difference);
            this.turnAround.hours = difference / 24;
            patient.turnAroundTime = this.turnAround;
            console.log(patient);
            database()
            .ref('/work/' + patient.uid)
            .child(patient.phoneNumber)
            .set(patient);
            console.log('Status is updated as ' + this.newStatus);
            this.props.navigation.navigate('CurrentWork');
        }
        //change data in the database
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
                label:'Not Interested',
            },
      ];
      return (
        <SafeAreaView>
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
                onPress={()=>{this.props.navigation.navigate('CurrentWork');}}
                title="Cancel"
                type="outline"
                buttonStyle={styles.button}
                titleStyle={styles.buttontitle}
            />
            <Button
                onPress={()=>{this.updateStatus(patient);}}
                title="Save"
                type="solid"
                buttonStyle={styles.button}
                titleStyle={styles.buttontitle}
            />
            </View>
        </View>
        </SafeAreaView>
      );
    }
}

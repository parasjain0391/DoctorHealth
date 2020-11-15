/* eslint-disable prettier/prettier */
import React from 'react';
import {Alert, StyleSheet, View } from 'react-native';

import { NavigationParams, SafeAreaView } from 'react-navigation';
// @ts-ignore
import RadioButtonRN from 'radio-buttons-react-native';
import { Button } from 'react-native-elements';
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
    constructor(props:Props) {
        super(props);
        this.newStatus = 'Pending';
    }
    updateStatus() {
        if (this.newStatus === 'Pending') {
            Alert.alert('Please select a new status of the patient');
        } else {
            console.log('Status is updated as ' + this.newStatus);
            this.props.navigation.navigate('CurrentWork');
        }
        //change data in the database
        //the patient should also be reduced from the stack
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
                onPress={()=>{this.updateStatus();}}
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

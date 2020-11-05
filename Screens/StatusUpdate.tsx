/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet, View } from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import { NavigationParams } from 'react-navigation';
// @ts-ignore
import RadioButtonRN from 'radio-buttons-react-native';
import { Button } from 'react-native-elements';
const styles = StyleSheet.create({
    body: {
      backgroundColor: Colors.white,
      justifyContent:'space-around',
      flex:1,
    },
    buttonarea: {
        flex:1,
        flexDirection:'row',
        justifyContent:'space-around',
        alignContent:'center',
        alignItems:'center',
    },
    radioButtonArea: {
      fontSize: 24,
      fontWeight: '600',
      color: Colors.black,
      justifyContent:'center',
      alignContent:'center',
    },
    radioText: {
        fontSize:18,
        fontWeight: '600',
        marginVertical:10,
    },
    radioBox: {
        marginHorizontal:20,
    },
    button: {
        marginVertical:10,
        marginHorizontal:20,
        paddingVertical:10,
        paddingHorizontal:20,
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
        this.newStatus = 'pending';
    }
    updateStatus() {
        console.log('Status is updated as ' + this.newStatus);
        this.props.navigation.navigate('CurrentWork');
        //change data in the database
        //the patient should also be reduced from the stack
    }
    render() {
      const {patient} = this.props.route.params;
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
        <View style={styles.body}>
            <View style={styles.radioButtonArea}>
                <RadioButtonRN
                data={data}
                selectedBtn={(value:any) => {this.newStatus = value.label;}}
                animationTypes={['zoomIn']}
                duration={50}
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
                type="outline"
                buttonStyle={styles.button}
                titleStyle={styles.buttontitle}
            />
            </View>
        </View>
      );
    }
}

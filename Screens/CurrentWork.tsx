/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
// @ts-ignore
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import { ListItem, Button, Icon} from  'react-native-elements';


// All information from the server database is read, write and updated in this file


interface Props {
    navigation:any,
}
interface States {
    // Patient information in the server
    patients: {
        phoneNumber:string;
        Status:string;
    } [],
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      padding: 10,
    },
    button: {
        flex: 1,
        backgroundColor: 'white',
        paddingVertical: 0,
        paddingHorizontal: 17,
    },
    titleText: {
      fontSize: 22,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    textStyle: {
      fontSize: 16,
      marginVertical: 10,
      color: '#33ff49',
    },
  });

export default class CurrentWork extends React.Component<Props,States> {
    constructor(props: Props) {
        super(props);
        // Get patient information from the server
        this.state = {
            patients: [{'phoneNumber':'7011012043','Status':'pending'},
            {'phoneNumber':'6546776727','Status':'pending'},
            {'phoneNumber':'6546776726','Status':'pending'},
            {'phoneNumber':'6546776725','Status':'pending'},
            {'phoneNumber':'6546776724','Status':'pending'},
            {'phoneNumber':'6546776723','Status':'pending'},
            {'phoneNumber':'6546776722','Status':'pending'}],
        };
    }

    // Missing function for updating patient information in the server

    renderPatients() {
        return this.state.patients.map(patient =>{
            return <ListItem key={patient.phoneNumber}
                    onPress={() => {console.log(patient);}}
                    bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title>{patient.phoneNumber}</ListItem.Title>
                    </ListItem.Content>
                    <Button
                        icon={
                            <Icon
                            name="ellipsis-v"
                            type="font-awesome"
                            size={22}
                        />}
                        buttonStyle={styles.button}
                        type="clear"
                        onPress={() => {console.log(patient);}}
                    />
                    <Button
                        icon={
                            <Icon
                            name="call"
                            size={22}
                        />}
                        type="clear"
                        onPress={() => {RNImmediatePhoneCall.immediatePhoneCall(patient.phoneNumber);}}
                    />
                    {/* <Button title="Call" onPress={() => {console.log(patient);}}/> */}
                </ListItem>;
        });
    }
    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={{flex:1, backgroundColor:'white'}}>{this.renderPatients()}</View>
                </ScrollView>
            </View>
        );
    }
}

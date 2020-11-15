/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
// @ts-ignore
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import { ListItem, Button, Icon } from  'react-native-elements';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
// All information from the server database is read, write and updated in this file


interface Props {
    navigation:any,
}
interface States {
    // Patient information in the server
    patients:any [],
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
    modalVisible:boolean;
    constructor(props: Props) {
        super(props);
        this.modalVisible = false;
        this.state = {
            patients: [],
        };
    }
    componentDidMount() {
        database()
        .ref('/admin/assignedwork')
        .once('value')
        .then((snapshot) => {
            const patients:any = [];
            snapshot.forEach((item:any)=>{
                var i = item.val();
                i.phoneNumber = item.key;
                patients.push(i);
                console.log(i);
            });
            this.setState({ patients: patients });
            console.log(this.state.patients);
          })
        .catch(err => {console.log(err);});
    }
    // Missing function for updating patient information in the server
    toggleOverlay(visible:boolean) {
        this.modalVisible = !visible;
    }
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
                        onPress={()=> this.props.navigation.navigate('StatusUpdate',{patient})}
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

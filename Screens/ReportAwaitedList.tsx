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
export default class ReportAwaitedList extends React.Component<Props,States> {
    uid:any
    date:any
    _isMounted:boolean
    constructor(props: Props) {
        super(props);
        this.state = {
            patients: [],
        };
        this.date = new Date();
        this._isMounted = false;
    }
    componentDidMount() {
        this._isMounted = true;
        this._isMounted && this.getuid();
        this._isMounted && this.loadPatient();
    }
    // get the work detail if changes are made in the database
    componentDidUpdate() {
        this._isMounted && this.loadPatient();
    }
    componentWillUnmount(){
        this._isMounted = false;
    }
    async getuid(){
        this.uid = await AsyncStorage.getItem('uid');
    }
    loadPatient(){
        const patients:any = [];
        database()
        .ref('/work/Report Awaited/' + String(this.uid))
        .once('value')
        .then((snapshot) => {
            if (snapshot.exists()){
                snapshot.forEach((patient:any)=>{
                    var i = patient.val();
                    //load the Report Awaited Cases of the Doctor
                    patients.push(i);
                });
                this.setState({ patients: patients });
            }
        })
        .catch(err => {console.log(String(err));});
    }
    //UI element of the patient
    renderPatients() {
        return this.state.patients.map(patient =>{
            return <ListItem key={patient.phoneNumber}
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
                        // Go to StatusUpdate page
                        onPress={()=> this.props.navigation.navigate('StatusUpdate', {patient})}
                    />
                    <Button
                        icon={
                            <Icon
                            name="call"
                            size={22}
                        />}
                        type="clear"
                        // Make direct call to the number
                        onPress={() => {RNImmediatePhoneCall.immediatePhoneCall(patient.phoneNumber);}}
                    />
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

/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
// @ts-ignore
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import { ListItem, Button, Icon } from  'react-native-elements';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
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
export default class NATodayList extends React.Component<Props,States> {
    uid:any
    _isMounted:boolean
    ref:any
    constructor(props: Props) {
        super(props);
        this.state = {
            patients: [],
        };
        this._isMounted = false;
        this.ref = '';
    }
    async componentDidMount() {
        this._isMounted = true;
        this.uid = await AsyncStorage.getItem('uid');
        this.ref = database().ref('/work/Not Answered/' + String(this.uid));
        this.ref
        .on('value',(snapshot:any)=>{this.loadList(snapshot);});
    }
    componentWillUnmount(){
        this._isMounted = false;
        this.ref.off();
    }
    loadList(snapshot:any){
        const patients:any = [];
        if ( snapshot.exists()){
            snapshot.forEach((patient:any)=>{
                if (patient.child('statusUpdateDate').val() === moment().format('YYYY-MM-DD'))
                {    var p = patient.val();
                    patients.push(p);
                }
            });
        } else {
            Alert.alert('There is NO Not Answered call today');
            this.props.navigation.goBack();
        }
        this._isMounted && this.setState({ patients: patients });
    }
    //UI element of the patient
    renderPatients() {
        return this.state.patients.map(patient =>{
            return <ListItem key={patient.phoneNumber}
                    bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title>{patient.phoneNumber}</ListItem.Title>
                        <ListItem.Subtitle>{patient.statusUpdateDate} {patient.statusUpdateTime}</ListItem.Subtitle>
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
                        onPress={()=> this.props.navigation.navigate('StatusUpdate',{patient})}
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

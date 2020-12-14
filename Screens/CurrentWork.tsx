/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
// @ts-ignore
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import { ListItem, Button, Icon } from  'react-native-elements';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationParams} from 'react-navigation';
// All information from the server database is read, write and updated in this file


interface Props extends NavigationParams {
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
        this.uid = 'Empty';
    }
    async componentDidMount() {
        this.uid = await AsyncStorage.getItem('uid');
        this._isMounted = true;
        this.ref = database().ref('/work/Pending/' + String(this.uid));
        this._isMounted && this.ref
        .once('value')
        .then((snapshot:any)=>{this.loadWork(snapshot);})
        .catch((err:any)=>{console.log(String(err));});
        this.ref
        .on('value',(snapshot:any)=>{this.loadWork(snapshot);});
    }
    componentWillUnmount(){
        this._isMounted = false;
        this.ref.off();
    }
    loadWork(snapshot:any){
        const patients:any = [];
        snapshot.forEach((item:any)=>{
            var i = item.val();
            i.phoneNumber = item.key;
            patients.push(i);
        });
        console.log(patients);
        this.setState({ patients: patients });
    }
    //UI element of the patient
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
                        // Go to StatusUpdate page
                        onPress={()=> this.props.navigation.navigate('StatusUpdate',{previousPage:'Current Work',patient})}
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

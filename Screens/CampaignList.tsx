/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { NavigationParams } from 'react-navigation';
// @ts-ignore
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import { ListItem, Button, Icon } from  'react-native-elements';
import database from '@react-native-firebase/database';
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
export default class CampaignList extends React.Component<Props,States> {
    _isMounted:boolean
    uid:any
    ref:any
    constructor(props: Props) {
        super(props);
        this.state = {
            patients: [],
        };
        const {uid} = this.props.route.params;
        this.uid = uid;
        this._isMounted = false;
        this.ref = '';

    }
    componentDidMount() {
        this._isMounted = true;
        const {listName} = this.props.route.params;
        this.ref = database().ref('/work/' + String(listName) + '/' + String(this.uid));
        this.ref
        .on('value',(snapshot:any)=>{this.loadList(snapshot);});
    }
    componentWillUnmount() {
        this._isMounted = false;
        this.ref.off();
    }
    loadList(snapshot:any) {
        const patients:any = [];
        if (snapshot.exists()){
            snapshot.forEach((patient:any)=>{
                var i = patient.val();
                //load the Report Awaited Cases of the Doctor
                patients.push(i);
            });
        } else {
            Alert.alert('There is NO Patient in this list');
            this.props.navigation.goBack();
        }
        this._isMounted && this.setState({ patients: patients });
    }
    //UI element of the patient
    renderPatients() {
        return this.state.patients.map(patient =>{
            return <ListItem key={String(patient.phoneNumber)}
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

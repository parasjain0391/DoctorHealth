/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
// import all the components we are going to use
import {Platform, StyleSheet, PermissionsAndroid, Alert, ScrollView, View} from 'react-native';
// import CallLogs API
// @ts-ignore
import CallLogs from 'react-native-call-log';
import { ListItem, Icon } from 'react-native-elements';
import { NavigationParams } from 'react-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
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

interface Props extends NavigationParams {
  navigation: any;
}
interface State {
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
export default class CallLog extends React.Component<Props, State> {
  _isMounted:boolean;
  uid:string;

  // get the uid of the pa
  async getuid() {
    const uid:any = await AsyncStorage.getItem('uid');
    return uid;
  }

  // constructor of the class
  constructor(props: Props) {
    super(props);
    this._isMounted = false;
    this.uid = 'null';
    this.state = {
      calls: [],
    };
  }
  // this will stop the other fucntion from working if the screen is deleted
  componentWillUnmount() {
    this._isMounted = false;
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
          CallLogs.load(100).then((calls: any) => this._isMounted && this.setState({calls}));
          this.getuid().then(u=> {this.uid = u;}).catch(()=>{console.log('Error in getting the uid from async storage');});
        } else {
          Alert.alert('Call Log permission denied');
        }
      } catch (e) {
        Alert.alert(e);
      }
    } else {
      Alert.alert(
        'Sorry! You can’t get call logs in iOS devices because of the security concern',
      );
    }
  }
  componentDidMount() {
    this._isMounted = true;
    this._isMounted && this.getCallLogs();
  }

  //this will update the call log in realtime in both screen and the database
  componentDidUpdate() {
    CallLogs.load(100).then((calls: any) => this._isMounted && this.setState({calls}));
    //No need for below code due to no need for call log
    // if (this.uid !== 'null') {
    //   database()
    //   .ref('/users/' + String(this.uid))
    //   .set(this.state.calls);
    //   .then(() => console.log('Data set.'));
    //  //The console print is removed due to extra screen space in node
    //}
  }
  // return the correct icon according to the call type
  getCallIcon(type:string) {
    if (type === 'INCOMING'){
      return <Icon
      name="call-received"
      size={22}
      color="#2E86C1"
      />;
    } else if (type === 'OUTGOING'){
      return <Icon
      name="call-made"
      size={22}
      color="#33ff49"
      />;
    } else if (type === 'MISSED'){
      return <Icon
      name="call-missed"
      size={22}
      color="#ff0000"
      />;
    } else {
      return;
    }
  }
  // the UI element of the calllog
  renderCalls() {
    return this.state.calls.map(call => {
      call.phoneNumber = call.phoneNumber % 10000000000;
      return <ListItem key={call.timestamp}
          onPress={()=> this.props.navigation.navigate('SingleLog',{call:call})}
          bottomDivider>
          <ListItem.Content>
          <ListItem.Title>{String(call.phoneNumber)}</ListItem.Title>
          <ListItem.Subtitle>{call.dateTime}</ListItem.Subtitle>
          </ListItem.Content>
          {this.getCallIcon(call.type)}
        </ListItem>;
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={{flex:1, backgroundColor:'white'}}>{this.renderCalls()}</View>
          {/* Only Load 100 Logs
          Need to add a button to load all call*/}
        </ScrollView>
      </View>
    );
  }
}

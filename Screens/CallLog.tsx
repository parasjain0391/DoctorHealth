/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
// import all the components we are going to use
import {Platform, StyleSheet, PermissionsAndroid, Alert, ScrollView, View} from 'react-native';
// import CallLogs API
// @ts-ignore
import CallLogs from 'react-native-call-log';
import { ListItem} from 'react-native-elements';
import { NavigationParams } from 'react-navigation';
import database from '@react-native-firebase/database';
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
  constructor(props: Props) {
    super(props);
    this._isMounted = false;
    this.state = {
      calls: [],
    };
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
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
  componentDidUpdate() {
    CallLogs.load(100).then((calls: any) => this._isMounted && this.setState({calls}));
    database()
    .ref('/paras/calllog')
    .set(this.state.calls)
    .then(() => console.log('Data set.' + this.state.calls));
  }
  renderCalls() {
    return this.state.calls.map(call => {
      return <ListItem key={call.timestamp}
          onPress={()=> this.props.navigation.navigate('SingleLog',{call:call})}
          bottomDivider>
          <ListItem.Content>
          <ListItem.Title>{(call.name === null) ? call.phoneNumber : call.name}</ListItem.Title>
          <ListItem.Subtitle>{call.phoneNumber}</ListItem.Subtitle>
          </ListItem.Content>
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
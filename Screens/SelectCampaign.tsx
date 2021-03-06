/* eslint-disable prettier/prettier */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationParams } from 'react-navigation';
import {ListItem } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
interface Props extends NavigationParams{}
interface States {
    item: any [],
}
export default class SelectCampaign extends React.Component<Props,States> {
    _isMounted:boolean
    uid:any
    constructor(props:Props) {
        super(props);
        this.state = {
            item: [{'name':'Report Awaited'},
                {'name':'Call Back'},
                {'name':'Appointments'},
                {'name':'Repeat'},
                {'name':'Existing Patients'},
            ],
        };
        this._isMounted = false;
    }
    // called when the screen is loaded and gets the doctors information form the database
    componentDidMount() {
        this._isMounted = true;
        const {uid} = this.props.route.params;
        this.uid = uid;
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    renderList() {
        return this.state.item.map(item => {
          return <ListItem key={item.name}
              onPress={()=> {console.log(String(item.name) + ' List is selected to be opened');
                this.props.navigation.navigate('Campaign List',{listName:String(item.name),uid:this.uid});}}
              bottomDivider>
              <ListItem.Content>
              <ListItem.Title>{item.name}</ListItem.Title>
              </ListItem.Content>
            </ListItem>;
        });
    }
    render() {
        return (
            <View style={styles.body}>
                <ScrollView>
                    {this.renderList()}
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    fab: {
        alignSelf:'flex-end',
        position:'absolute',
        bottom:10,
        right:10,
    },
    body: {
        justifyContent:'flex-end',
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
        justifyContent:'flex-end',
    },
    itleText: {
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

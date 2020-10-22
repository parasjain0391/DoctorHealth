/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Input, Button } from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import { NavigationParams } from 'react-navigation';
interface Props extends NavigationParams{
}
interface States {
        email:string,
        password:string,
}

const styles = StyleSheet.create({
    body: {
        flex:1,
        backgroundColor: '#f5fcff',
    },
    input: {
        flex:1,
        justifyContent:'center',
        alignContent:'center',
    },
    button: {
        flex:1,
    },
});
export default class Login extends React.Component<Props,States> {
    constructor(props: Props) {
        super(props);
        this.state = {
                email: '',
                password: '',
        };
    }
    loginSuccess(UserCredential: any) {
        console.log(UserCredential);
        this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'Homescreen' }],
          });
    }
    loginHandler() {
        try {
            auth().signInWithEmailAndPassword(this.state.email.trim(), this.state.password)
            .then(UserCredential=>this.loginSuccess(UserCredential),(err:any)=>{console.log(err);});
        } catch (e:any) {
            console.log(e);
            Alert.alert('Login Problem!!!');
        }
    }
    render() {
        return (
            <View style={styles.body}>
                <View style={styles.button}>
                    <Input
                        containerStyle= {{ marginVertical: 10}}
                        placeholder="E-mail"
                        value={this.state.email}
                        leftIcon={{ type:'font-awesome', name:'envelope'}}
                        onChangeText={(text) => this.setState({ email : text })} />
                    <Input
                        secureTextEntry={true}
                        placeholder="Password"
                        value={this.state.password}
                        leftIcon={{ type:'font-awesome', name:'key'}}
                        onChangeText={(text) => this.setState({ password : text })} />
                </View>
                <View style={styles.button}>
                    <Button
                        title="Login"
                        buttonStyle={{ backgroundColor:'#33ff49' }}
                        containerStyle={{ margin:10 }}
                        onPress={() => {
                            this.loginHandler();
                        }}
                    />
                </View>
            </View>
        );
    }
}

/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Input, Button } from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import { setUser, getUser } from './asyncStorage';
interface Props {
    navigation:any,

}
interface States {
    user:{
        email:string,
        password:string,
    },
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
export default class LoginT extends React.Component<Props,States> {
    constructor(props: Props) {
        super(props);
        this.state = {
            user: {
                email: '',
                password: '',
            },
        };
    }
    // componentDidMount() {
    //     if (this.state.user !== null) {

    //     }
    // }
    loginSuccess(UserCredential: any) {
        console.log(UserCredential);
        setUser(this.state.user);
        this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'Homescreen' }],
          });
    }
    loginHandler() {
        try {
            auth().signInWithEmailAndPassword(this.state.user.email.trim(), this.state.user.password)
            .then(UserCredential=>this.loginSuccess(UserCredential),(err:any)=>{console.log(err);});
        } catch (e:any) {
            console.log(e);
            Alert.alert('Login Problem!!!');
        }
    }
    newLogin() {
        return (
            <View style={styles.body}>
                <View style={styles.button}>
                    <Input
                        containerStyle= {{ marginVertical: 10}}
                        placeholder="E-mail"
                        value={this.state.user.email}
                        leftIcon={{ type:'font-awesome', name:'envelope'}} />
                        onChangeText={(text:string) => {this.setState({ user: {email : text, password : this.state.user.password,},)}} />
                    <Input
                        secureTextEntry={true}
                        placeholder="Password"
                        value={this.state.user.password}
                        leftIcon={{ type:'font-awesome', name:'key'}} />
                        onChangeText={(text:string) => this.setState({ user: {email : this.state.user.email, password : text,},)}} />
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
    loggedIn(user:any) {
        console.log(user);
        if (user === null){
            console.log('Code reached loggedin if');
            this.newLogin;
        } else {
            this.state.user.email = user.email;
            this.state.user.password = user.password;
            return this.loginHandler();
        }
    }
    render() {
        return (
            <View>
                {getUser().then((user:any)=>{ this.loggedIn(user);},(e)=>{console.log(e + ' error 1');})}
            </View>
        );
    }
}

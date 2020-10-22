/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-community/async-storage';

export let getEmail = async () => {
    let email: string|null = await AsyncStorage.getItem('email');
    return email;
};

export let getPassword = async () => {
    let password: string|null = await AsyncStorage.getItem('password');
    return password;
};
export let getUser = async () => {
    let user: any = await AsyncStorage.getItem('user');
    return JSON.parse(user);
};
export const setUser = async (user:any = {email:undefined, password:undefined}) => {
    await AsyncStorage.setItem('user',JSON.stringify(user));
};

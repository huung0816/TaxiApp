import { SafeAreaView, StyleSheet, View, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import React, { useState } from "react";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import API from "./API";
import AsyncStorage from "@react-native-async-storage/async-storage";


function Register(): JSX.Element {

    const navigation = useNavigation<StackNavigationProp<ParamListBase>>()

    const onRegister = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken') || ""
    API.register(userId, userPw, `${fcmToken}`) 
    .then(response => {
        let {code, message} = response.data[0]
        let title = "알림"
        if (code == 0) {
            //회원가입 완료되었으니 로그인화면으로 이동
            navigation.pop()
        }
        else {
            title = "오류"
        }

        //성공이든 실패든 Alert를 띄워줌
        Alert.alert(title, message, [{
            text:"확인",
            onPress: () => console.log('cancel pressed'),
            style: 'cancel'
        }]) 
    })
    .catch(err => {
        console.log(JSON.stringify(err))
    })
}
    console.log("--Register()");

    const [userId, setUserId] = useState('');
    const [userPw, setUserPw] = useState('');
    const [userPw2, setUserPw2] = useState('');
    const [disable, setDisable] = useState(false)

    const isDisable = () => {
        if (userId && userPw && userPw2 &&
            (userPw == userPw2)) {
                return false
            }else {
                return true
            }
    }
    
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.container, {justifyContent:'flex-end'}]}>
                <Icon name="taxi" color={'#3498db'} size={80} />
            </View>
            <View style={[styles.container, {flex: 2}]}>
                <TextInput
                    style={styles.input}
                    placeholder="아이디"
                    onChangeText={newId => setUserId(newId)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="비밀번호"
                    secureTextEntry={true}
                    onChangeText={newPw => setUserPw(newPw)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="비밀번호 확인"
                    secureTextEntry={true}
                    onChangeText={newPw2 => setUserPw2(newPw2)}
                />
            </View>
            <View style={[styles.container, {justifyContent: 'flex-start'}]}>
                <TouchableOpacity disabled={isDisable()} onPress={onRegister} style={isDisable() ? styles.buttonDisable : styles.button}>
                    <Text style={styles.buttonText}>회원가입</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },

    input: {
        width: '70%',
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        marginVertical: 10,
        padding: 10
    },

    button: {
        backgroundColor: '#3498db',
        width: '70%',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5
    },

    buttonDisable: {
        backgroundColor: 'gray',
        width: '70%',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5
    },

    buttonText: {
        color:'white',
        fontSize: 16,
        textAlign: 'center'
    },
});

export default Register;                

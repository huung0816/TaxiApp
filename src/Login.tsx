import { SafeAreaView, StyleSheet, Text, TouchableOpacity, TextInput, View, Alert} from "react-native";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/FontAwesome";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "./API";


function Login(): JSX.Element {
    console.log("--Intro()")

    const onLogin = async () => {
        let fcmToken = await AsyncStorage.getItem('fcmToken') || ""
        API.login(userId, userPw, `${fcmToken}`)
        .then(response => {
        console.log("API login / data =" + JSON.stringify(response.data[0]))
        let {code, message} = response.data[0]
        console.log("API login / code =" + code + ",message =" + message)
        if (code == 0) {
            gotoMain()
        }
        else {
            Alert.alert('오류', message, [{
                text: '확인',
                onPress: () => console.log("Cancel Pressed"),
                style: 'cancel',
            }])
        }
    })
    .catch(err => {
        console.log(JSON.stringify(err))
    })
}


    const [userId, setuserId] = useState('')
    const [userPw, setUsertPw] = useState('')
    const [disable, setDisable] = useState(true)

    const onIdChange = (newId: string) => {
        newId && userPw ? setDisable(false) : setDisable(true)
        setuserId(newId)
    }
    const onPwChange = (newPw: string) => {
        newPw && userId ? setDisable(false) : setDisable(true)
        setUsertPw(newPw)
    }

    const navigation = useNavigation<StackNavigationProp<ParamListBase>>()
    
    const gotoRegister = () => {
        navigation.push('Register')
    }

    const gotoMain = () => {
        AsyncStorage.setItem('userId', userId).then(() => {
            navigation.push('Main')
        })
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <Icon name="taxi" size={80} color={'#3498db'}/>
            </View>
            <View style={styles.container}>
                <TextInput style={styles.input} placeholder={"아이디"} onChangeText={onIdChange}/>
                <TextInput style={styles.input} placeholder={"비밀번호"} secureTextEntry={true} onChangeText={onPwChange}/>
            </View>
            <View style={styles.container}>
                <TouchableOpacity style={[disable ? styles.buttonDisable : styles.button, {marginBottom: 5}]} disabled={disable} onPress={onLogin}>
                    <Text style={styles.buttoonText}>로그인</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={gotoRegister}>
                    <Text style={styles.buttoonText}>회원가입</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
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

    buttoonText: {
        color:'white',
        fontSize: 16,
        textAlign: 'center'
    },

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
    }
})

export default Login
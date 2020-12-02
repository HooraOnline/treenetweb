import React, {Component} from 'react';
import {persistStore, pStore} from "../src/stores";
import ResponsiveLayout from "../src/components/layouts/ResponsiveLayout";
import translate from "../src/language/translate";
import {doDelay, mapNumbersToEnglish, navigation, showMassage,} from "../src/utils";
import images from "../public/static/assets/images";
import {Image, Text, TouchableOpacity, View,} from "../src/react-native";
import FloatingLabelTextInput from "../src/components/FloatingLabelTextInput";
import {loginApi, postQuery} from "../dataService/apiService";
import LoadingPopUp from "../src/components/LoadingPopUp";
import {IoMdEye, IoMdEyeOff} from "react-icons/io";
import {
    bg1,
    bgScreen,
    bgSuccess,
    bgWhite,
    border,
    orange1,
    primaryDark, success,
    textDisabled,
    textItem
} from "../src/constants/colors";
import Api from "../dataService/apiCaller";
import Router from "next/router";
//import Pagination from 'docs/src/modules/components/Pagination';
//const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

export default class RegisterPassword extends Component {
    constructor() {
        super();
        this.state = {
            showMenu:false,
            isWide:false,
            mobileValidation:false,
            countryCode:'+98',
            invitationLink:'',

            showPassword:false,
            passwordValidation:false,
            passwor2dValidation:false,
            usernameValidation:false,
            username:'',
            password:'',

        };
    }
    componentDidMount() {
        doDelay(30)
            .then(()=>{


                this.user= navigation.getParam('user');
                if (persistStore.apiToken) {
                    navigation.replace(+pStore.cUser.userKey);
                }
               /* else if (persistStore.userRegisterbefor) {
                    navigation.replace('/login');
                } */
                else if(!this.user){
                    navigation.replace('/home');
                    return translate('required_invitationLink');
                }
            })
        let self=this;
        $.getJSON('https://api.ipdata.co/?api-key=92c9cd9137ca4bd296e2a749b8cd3a7908cb960766c10013cd108f26', function (data) {
            console.log(JSON.stringify(data, null, 2));
            self.geoInfo = JSON.stringify(data, null, 2);
        });
        $.getJSON('https://ipapi.co/json/', function (data) {
            self.geo = JSON.stringify(data, null, 2);
        });

    }
    nextPage(){
        navigation.navigate('edit_profile', {
            user: this.user,
        });
    }


    isValid() {
        return this.state.passwordValidation &&  this.state.passwor2dValidation ;
    }



    checkValidation() {
       /* if (!this.state.username) {
            this.setState({usernameValidation: false});
            return translate('registerPassword_enter_username');
        }
        if (this.state.username.length<3) {
            this.setState({usernameValidation: false});
            return translate('registerPassword_username_can_not_be_les_than');
        }*/

        if (!this.state.password) {
            this.setState({passwordValidation: false});
            return translate('registerPassword_enter_password');
        }
        const passReg=/(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/;
       /* if( !passReg.test(this.state.password)){
            return "پسورد شما باید حداقل ۶ حرف بوده و شامل حروف کوچک و بزرگ و کاراکترهای خاص باشد.";
        }*/

        if (this.state.password.length<6) {
            this.setState({passwordValidation: false});
            return translate('registerPassword_password_can_not_be_les_than');
        }
        if (this.state.password!==this.state.password2) {
            this.setState({passwordValidation: false});
            return translate('registerPassword_password_and_repeat_not_equal');
        }
    }



    registerUser() {
        const msg = this.checkValidation();
        if (msg) {
            showMassage(msg, 'info');
            return;
        }
        try {
            this.user.geoInfo = JSON.parse(this.geoInfo);
            this.user.geo = JSON.parse(this.geo);
            this.user.password=this.state.password;

        } catch (e) {

        }

        this.setState({loading: true, loadingMessage: 'در حال ساخت شبکه تری نت شما...'});
        
        postQuery('members/me/register', this.user)
            .then(member => {
                /*self.user = member;
                persistStore.apiToken = member.token;
                Api.setToken(member.token);
                pStore.cUser=member
                persistStore.userRegisterbefor = true;
                this.setState({loading: false});
                this.user=member;
                this.nextPage()*/
                this.onLogin(member.username)
            })
            .catch(err => {
                showMassage("خطا در ساخت شبکه تری نت شما.",'error');
            })
            .finally(()=>{
                this.setState({loading: false});
            })

    }


    async onLogin(username) {
        this.setState({loading: true});
        const data={};
        const fullMobile=this
        loginApi(username,this.user.password)
            .then(res=>{
                this.onSuccessLogin(res);
                this.setState({loading:false});
            })
            .catch(err=>{

                this.setState({loading:false});
                navigation.replace('/login');
            })
    }
    onSuccessLogin=(user)=>{
       global.width=null;//reset new panel width
       navigation.replace('/invitationCard');
    }


    render() {
        //const { height, width } = useWindowDimensions();

        return (

            <ResponsiveLayout title={`Treenetgram`}   loading={this.state.loading} loadingMessage={this.state.loadingMessage} style={{margin:0}}>
                <View
                    style={{flex: 1, backgroundColor: bgScreen, alignItems: 'center', padding: 10, paddingTop: '5%',}}>
                    <Image
                        source={images.tree}
                        style={{maxWidth: '25%', maxHeight: '25%',}}
                    />
                    <Text
                        style={{
                            marginTop: 5,
                            marginBottom: 10,
                            fontSize: 25,
                            fontWeight: 800,
                            fontFamily: 'IRANYekanFaNum-Bold',
                            color: orange1
                        }}>
                        Treenetgram
                    </Text>

                    <View id='form' style={{width:'100%',maxWidth:500,marginTop:3,padding:16}}   >
                         {/* <Text style={{ textAlign:'center', marginTop:30,fontSize:12,color:bgWhite}}>{translate("for_start_enter_your_phone_number")}</Text>*/}
                        <Text
                            style={{
                                alignItems:'center',
                                marginTop:2,
                                fontSize:12,
                                fontFamily: 'IRANYekanFaNum-Bold',
                                textAlign:'justify',
                                color:bg1,
                                marginBottom:10

                            }}>
                            {translate("یک رمز عبور برای شبکه خود انتخاب و همیشه بخاطر بسپارید.")}
                        </Text>

                        {/*<View
                            style={{
                                flexDirection: 'row',
                                marginTop: 34,
                                position:'relative',

                            }}
                        >
                            <FloatingLabelTextInput
                                ref={input => {
                                    this.labelInput = input;
                                }}
                                dir={'ltr'}
                                reverse={persistStore.isRtl}
                                placeholder={translate('registerPassword_username_example')}
                                style={{flex: 1, marginTop: 0}}
                                labelStyle={{color: bgSuccess, marginTop: -19}}
                                editable={true}
                                multiline={false}
                                maxLength={50}
                                floatingLabelEnable={true}
                                labelAlign={'left'}
                                keyboardType="default"
                                returnKeyType="done"
                                numberOfLines={1}
                                underlineSize={4}
                                underlineColor={this.state.usernameValidation ? bgSuccess : primaryDark}
                                isAccept={this.state.usernameValidation}
                                textInputStyle={{
                                    fontWeight: 'normal',
                                    fontFamily:'IRANYekanRegular',
                                    color: bg1,
                                    fontSize:12,
                                    paddingStart: 4,
                                    paddingTop: 1,
                                    paddingBottom: 3,
                                    //paddingLeft:35,
                                    textAlign: 'left',
                                }}

                                value={this.state.username}
                                onChangeText={ async (text) =>{
                                    const usernameReg =/^[a-zA-Z0-9_.]+$/;
                                    if(text && !usernameReg.test(text)){
                                        showMassage(translate('registerPassword_username_rule'),'info');
                                        this.setState({
                                            usernameValidation: false,
                                            username:this.state.username,
                                        })

                                        return;
                                    }

                                    const usernameReg2 =/^\d+$/;
                                    if(text && usernameReg2.test(text.substring(0,1))){
                                        showMassage(translate('registerPassword_username_rule2'),'info');
                                        this.setState({
                                            usernameValidation: false,
                                            username:'',
                                        })
                                        return;
                                    }
                                    if(text.length>2){
                                        this.setState({checkingPassword:true});
                                        postQuery('Members/me/checkUserNameExist',{username:text})
                                            .then((usernameExist)=>{
                                                this.setState({usernameValidation:!usernameExist});
                                            })
                                            .finally(()=>this.setState({checkingPassword:false}))

                                    }else{
                                        this.setState({usernameValidation:false});
                                    }
                                    this.setState({
                                        username: text,
                                    })
                                }
                                }


                            />
                            <View
                                style={{position: 'absolute', start: 30, bottom: 8}}
                            >
                                    {this.state.checkingPassword &&(
                                        <Image
                                            source={images.ic_search}
                                            style={{height: 24, width: 24,
                                                //tintColor: textItem
                                            }}
                                        />
                                    )}
                            </View>
                        </View>*/}
                       {/* {this.state.username.length>3 && this.state.usernameValidation==false &&(
                                <Text style={{marginTop:4, color:primaryDark,fontSize:12}} >{translate('registerPassword_username_is_reserved')}</Text>
                            )
                        }*/}

                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: 34,
                                position:'relative',

                            }}
                        >
                            <FloatingLabelTextInput
                                //dir={'ltr'}
                                //reverse={persistStore.isRtl}
                                type={this.state.showPassword ? 'text' : 'password'}
                                placeholder={translate('رمز عبور')}
                                floatingLabelEnabled={true}
                                floatingOffsetX={0}
                                floatingLabelFont={{color: textItem}}
                                editable={true}
                                multiline={false}
                                floatingLabelEnable={true}
                                labelAlign={'left'}
                                maxLength={100}
                                keyboardType="default"
                                returnKeyType="done"
                                numberOfLines={1}
                                labelStyle={{ marginTop: -17}}
                                textInputStyle={{
                                    fontWeight: 'normal',
                                    fontFamily: 'IRANYekanRegular',
                                    color: bg1,
                                    fontSize:12,
                                    paddingStart: 4,
                                    paddingTop: 1,
                                    //textAlign: 'left',
                                    //paddingLeft:35,
                                }}
                                underlineSize={1}
                                underlineColor={this.state.passwordValidation ? bgSuccess : primaryDark}
                                isAccept={this.state.passwordValidation}
                                style={{flex: 1,marginTop:0}}
                                onChangeText={text => {
                                    //this.checkValidation();
                                    text = mapNumbersToEnglish(text);
                                    const passReg =/^[a-zA-Z0-9~`!@#$%^&*()_-{\]\[}|\\?/<.>,+=-]+$/;
                                    if(text && !passReg.test(text)){
                                        showMassage(translate('registerPassword_password_rule'),'info');
                                        this.setState({
                                            passwordValidation: false,
                                            password:this.state.password,
                                        });
                                        return;
                                    }
                                    this.setState({
                                        password: text,
                                        passwordValidation: text.length<6?false:true,
                                    });
                                }}
                                highlightColor={primaryDark}
                                value={this.state.password}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({showPassword: !this.state.showPassword});
                                }}
                                style={{position: 'absolute', end: 30, bottom:4}}
                            >
                                {
                                    this.state.showPassword ?
                                        <IoMdEye color={primaryDark} size={24}/>
                                        : <IoMdEyeOff color={primaryDark} size={24}/>
                                }
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: 34,
                                position:'relative',
                            }}
                        >
                            <FloatingLabelTextInput
                                //dir={'ltr'}
                                //reverse={persistStore.isRtl}
                                type={this.state.showPassword ? 'text' : 'password'}
                                placeholder={translate('registerPassword_password_repeat')}
                                floatingLabelEnabled={true}
                                floatingOffsetX={0}
                                floatingLabelFont={{color: textItem}}
                                editable={true}
                                multiline={false}
                                maxLength={100}
                                floatingLabelEnable={true}
                                labelAlign={'left'}
                                labelStyle={{marginTop: -17}}
                                keyboardType="default"
                                returnKeyType="done"
                                numberOfLines={1}
                                textInputStyle={{
                                    fontWeight: 'normal',
                                    fontFamily: 'IRANYekanRegular',
                                    color: bg1,
                                    fontSize:12,
                                    paddingStart: 4,
                                    paddingTop: 1,
                                    //textAlign: 'left',
                                    //paddingLeft:35,
                                }}
                                underlineColor={this.state.passwor2dValidation ? bgSuccess : primaryDark}
                                isAccept={this.state.passwor2dValidation}
                                underlineSize={1}

                                style={{flex: 1}}
                                onChangeText={text => {
                                    //this.checkValidation();
                                    text = mapNumbersToEnglish(text);
                                    this.setState({
                                        password2: text,
                                        passwor2dValidation:text==this.state.password?true:false,

                                    });
                                }}
                                highlightColor={primaryDark}
                                value={this.state.password2}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({showPassword: !this.state.showPassword});
                                }}
                                style={{position: 'absolute', end: 30, bottom:4}}
                            >
                                {
                                    this.state.showPassword ?
                                        <IoMdEye color={primaryDark} size={24}/>
                                        : <IoMdEyeOff color={primaryDark} size={24}/>
                                }
                            </TouchableOpacity>
                        </View>




                        <TouchableOpacity
                            style={{
                                flex: 1,
                                marginTop: 40,
                                borderColor: orange1,
                                borderWidth: 0,
                                padding: 0,
                                paddingTop: 0,
                                borderRadius: 12,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor:this.isValid()?orange1:textDisabled,
                            }}
                            onPress={() =>this.registerUser()}
                        >
                            <Text style={{
                                fontSize:14,
                                color: bgWhite,
                                fontWeight: 500,
                                paddingVertical: 12
                            }}>{translate('confirm')}</Text>
                        </TouchableOpacity>



                    </View>
                </View>
                <LoadingPopUp
                    visible={this.state.loading}
                    message={this.state.loadingMessage}
                />
            </ResponsiveLayout>
        )
    }


}



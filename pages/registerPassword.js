import React, {Component} from 'react';
import {userStore,persistStore } from "../src/stores";
import Router from "next/router";
import ResponsiveLayout from "../src/components/layouts/ResponsiveLayout";
import {MenuItem, Select} from '@material-ui/core';
import translate from "../src/language/translate";
import {LNGList} from "../src/language/aaLngUtil";
import {
    deviceWide, doDelay, getCookie,
    getUrlParameter,
    mapNumbersToEnglish,
    navigation,
    saveCookie,
    showMassage,

} from "../src/utils";
import images from "../public/static/assets/images";
import {
    bgWhite,
    border,
    placeholderTextColor,
    lightRed,
    textItemBlack,
    gr1,
    gr2,
    gr3,
    gr4,
    gr5,
    gr6,
    gr7,
    gr8,
    gr9,
    gr10,
    borderSeparate, primaryDark, textItem
} from "../src/constants/colors";
import {View, TouchableOpacity, Text, Image, Platform,} from "../src/react-native";
import FloatingLabelTextInput from "../src/components/FloatingLabelTextInput";
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import {postQuery, saveEntity} from "../dataService/dataService";
import {ListDialogPopUp} from "../src/components";
import LoadingPopUp from "../src/components/LoadingPopUp";
import {fa} from "../src/language/fa";
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
            repeateMobileValidation:true,
            showPassword:false,

        };
    }
    componentDidMount() {
        doDelay(30)
            .then(()=>{
                this.user= navigation.getParam('user');
            })

    }
    next(){
        navigation.navigate('registerUserProperty', {
            user: this.user,
        });
    }
    perevius() {
        navigation.navigate('fastRegister', {
            user:this.user,
        });
    }
    checkUserNotRefreshPage = () => {
        if (!userStore.RoleID) {
            Router.push('/Main');
        }
    }




    isValid() {
        return mobileValidation;
    }
    checkValidation() {
        if (!this.state.userName) {
            this.setState({userNameValidation: false});
            return translate('نام شبکه را وارد کنید.');
        }

        if (!this.state.password) {
            this.setState({passwordValidation: false});
            return translate('رمز عبور را وارد کنید.');
        }
        const passReg=/(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/;
       /* if( !passReg.test(this.state.password)){
            return "پسورد شما باید حداقل ۸ حرف بوده و شامل حروف کوچک و بزرگ و کاراکترهای خاص باشد.";
        }*/

        if (this.state.password.length<6) {
            this.setState({passwordValidation: false});
            return translate('پسورد نباید کمتر از ۶ حرف باشد.');
        }
        if (this.state.password!==this.state.password2) {
            this.setState({passwordValidation: false});
            return translate('پسورد و تکرار آن مساوی نیست.');
        }
    }
    updateUsernameAndPassword(){

        const msg=this.checkValidation();
        if(msg){
            showMassage(msg,'info')
            return;
        }

        const data=this.user;

        this.setState({loading:true});
        postQuery('Members/me/updateUsernameAndPassword',data)
            .then(res=>{
                console.log(res);
                this.next();
            })
            .catch(err=>{

            })
            .finally(()=>{
                this.setState({loading:false});
            })
    }

    render() {
        //const { height, width } = useWindowDimensions();

        return (

            <ResponsiveLayout title={`صفحه اصلی`}  style={{margin:0}}>
                <View style={{flex:1,backgroundColor:gr9,alignItems:'center',padding:10,paddingTop:'5%',}} >
                    <Image
                        source={images.tree}
                        style={{maxWidth: '40%', maxHeight: '40%',}}
                    />
                    <Text
                        style={{
                            marginTop:5,
                            marginBottom:10,
                            fontSize:25,
                            fontWeight:800,
                            fontFamily: 'IRANYekanFaNum-Bold',
                            color:gr3
                        }}>
                        Treenetgram
                    </Text>

                    <View id='form' style={{width:'100%',maxWidth:300,marginTop:30}}   >
                         {/* <Text style={{ textAlign:'center', marginTop:30,fontSize:14,color:bgWhite}}>{translate("for_start_enter_your_phone_number")}</Text>*/}
                        <Text
                            style={{
                                alignItems:'center',
                                marginTop:2,
                                fontSize:14,
                                fontFamily: 'IRANYekanFaNum-Bold',
                                textAlign:'justify',
                                color:gr3,

                            }}>
                            {translate("یک نام منحصر بفرد و یک کلمه عبور برای شبکه خود انتخاب کنید.")}
                        </Text>
                        <FloatingLabelTextInput
                            dir={'ltr'}
                            ref={input => {
                                this.labelInput = input;
                            }}
                            placeholder={translate('نام کاربری-مثال ahmad_azizi')}
                            style={{flex:1, marginTop:20}}

                            labelStyle={{color:gr3}}
                            editable={true}
                            multiline={false}
                            maxLength={50}
                            floatingLabelEnable={true}
                            keyboardType="default"
                            returnKeyType="done"
                            numberOfLines={1}
                            tintColor={
                                this.state.userNameValidation ? placeholderTextColor : lightRed
                            }
                            textInputStyle={{
                                fontWeight: 'normal',
                                fontFamily:'IRANYekanRegular',
                                color: gr2,
                                fontSize: 14,
                                paddingStart: 4,
                                paddingTop: 1,
                                paddingBottom: 3,
                                //textAlign: 'right',
                            }}
                            underlineSize={1}
                            value={this.state.userName}
                            onChangeText={text =>{
                                const usernameReg =/^[a-zA-Z0-9_]+$/;


                                if(text && !usernameReg.test(text)){
                                    showMassage('فقط از حروف و اعداد انگلیسی و کاراکتر زیر خط ـ استفاده شود','info');
                                    this.setState({
                                        userNameValidation: false,
                                        userName:this.state.userName,
                                    })
                                    return;
                                }

                                const usernameReg2 =/^\d+$/;
                                if(text && usernameReg2.test(text.substring(0,1))){

                                    showMassage('حرف اول نام کاربری نمی تواند عدد باشد.','info');
                                    this.setState({
                                        userNameValidation: false,
                                        userName:'',
                                    })
                                    return;
                                }

                                this.setState({
                                    userName: text,
                                    userNameValidation: true,
                                })
                            }
                            }
                            highlightColor={primaryDark}

                        />
                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: 34,
                                position:'relative',

                            }}
                        >
                            <FloatingLabelTextInput
                                dir={'ltr'}
                                type={this.state.showPassword ? 'text' : 'password'}
                                placeholder={translate('رمز عبور شبکه-مثال Ali65*4#5')}
                                floatingLabelEnabled={true}
                                floatingOffsetX={0}
                                floatingLabelFont={{color: textItem}}
                                editable={true}
                                multiline={false}
                                maxLength={100}
                                keyboardType="default"
                                returnKeyType="done"
                                numberOfLines={1}
                                labelStyle={{color:gr1}}
                                tintColor={
                                    this.state.userPassValidation ? textItem : lightRed
                                }
                                textInputStyle={{
                                    fontWeight: 'normal',
                                    fontFamily:'IRANYekanRegular',
                                    color:gr3,
                                    fontSize: 14,
                                    paddingStart: 4,
                                    paddingTop: 1,
                                    paddingBottom: 3,
                                    paddingLeft:35,
                                }}
                                underlineSize={1}
                                style={{flex: 1}}
                                onChangeText={text => {
                                    //this.checkValidation();
                                    const passReg =/^[a-zA-Z0-9~`!@#$%^&*()_-{\]\[}|\\?/<.>,+=-]+$/;
                                    if(text && !passReg.test(text)){
                                        showMassage('فقط از حروف انگلیسی اعداد و کاراکترهای خاص مانند @،*،&،% استفاده شود','info');
                                        this.setState({
                                            passwordValidation: false,
                                            password:this.state.password,
                                        });
                                        return;
                                    }
                                    this.setState({
                                        password: text,
                                        passwordValidation: true,
                                    });
                                }}
                                highlightColor={primaryDark}
                                value={this.state.password}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({showPassword: !this.state.showPassword});
                                }}
                                style={{position: 'absolute', end: 5, top: -2}}
                            >
                                <Image
                                    source={this.state.showPassword ? images.ic_ShowPassword : images.ic_HidePassword}
                                    style={{height: 24, width: 24, tintColor: textItem}}
                                />
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
                                dir={'ltr'}
                                type={this.state.showPassword ? 'text' : 'password'}
                                placeholder={translate('تکرار رمز عبور')}
                                floatingLabelEnabled={true}
                                floatingOffsetX={0}
                                floatingLabelFont={{color: textItem}}
                                editable={true}
                                multiline={false}
                                maxLength={100}
                                labelStyle={{color:gr1}}
                                keyboardType="default"
                                returnKeyType="done"
                                numberOfLines={1}
                                tintColor={
                                    this.state.userPassValidation ? textItem : lightRed
                                }
                                textInputStyle={{
                                    fontWeight: 'normal',
                                    fontFamily:'IRANYekanRegular',
                                    color:gr3,
                                    fontSize: 14,
                                    paddingStart: 4,
                                    paddingTop: 1,
                                    paddingBottom: 3,
                                    paddingLeft:35,
                                }}
                                underlineSize={1}

                                style={{flex: 1}}
                                onChangeText={text => {
                                    //this.checkValidation();
                                    this.setState({
                                        password2: text,

                                    });
                                }}
                                highlightColor={primaryDark}
                                value={this.state.password2}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({showPassword: !this.state.showPassword});
                                }}
                                style={{position: 'absolute', end: 5, top: -2}}
                            >
                                <Image
                                    source={this.state.showPassword ? images.ic_ShowPassword : images.ic_HidePassword}
                                    style={{height: 24, width: 24, tintColor: textItem}}
                                />
                            </TouchableOpacity>
                        </View>




                        <TouchableOpacity
                            style={{
                                flex:1,
                                marginTop:40,
                                borderColor: gr5,
                                borderWidth:1,
                                padding:0,
                                paddingTop:0,
                                borderRadius:12,
                                alignItems:'center',
                                justifyContent:'center',
                            }}
                            onPress={() =>this.updateUsernameAndPassword()}
                        >
                            <Text style={{fontSize:16,color:gr1,fontWeight:500,paddingVertical:12}}>{translate('confirm')}</Text>
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



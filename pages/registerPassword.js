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

    lightRed,
    textItemBlack,
    bgr10,
    bgr9,
    bgr8,
    bgr7,
    bgr6,
    bbgr6,
    bbgr7,
    bbgr8,
    bbgr9,
    bbgr10,
    borderSeparate, primaryDark, textItem, grayVD7, grL5
} from "../src/constants/colors";
import {View, TouchableOpacity, Text, Image, Platform,} from "../src/react-native";
import FloatingLabelTextInput from "../src/components/FloatingLabelTextInput";
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import {postQuery, saveEntity} from "../dataService/apiService";
import {ListDialogPopUp} from "../src/components";
import LoadingPopUp from "../src/components/LoadingPopUp";
import {fa} from "../src/language/fa";
//import Pagination from 'docs/src/modules/components/Pagination';
//const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
import { FaBeer } from 'react-icons/fa';

import { IoMdEyeOff,IoMdEye,IoIosBulb } from "react-icons/io";
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
            })

    }
    nextPage(){
        navigation.navigate('registerUserProperty', {
            user: this.user,
        });
    }


    isValid() {
        return mobileValidation;
    }
    checkValidation() {
        if (!this.state.username) {
            this.setState({usernameValidation: false});
            return translate('registerPassword_enter_username');
        }
        if (this.state.username.length<3) {
            this.setState({usernameValidation: false});
            return translate('registerPassword_username_can_not_be_les_than');
        }

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
    updateUsernameAndPassword(){

        const msg=this.checkValidation();
        if(msg){
            showMassage(msg,'info')
            return;
        }

        const data={id:this.user.id,username:this.state.username,password:this.state.password};

        this.setState({loading:true});
        postQuery('Members/me/updateUsernameAndPassword',data)
            .then(res=>{
                console.log(res);
                this.nextPage();
                this.setState({loading:false});
            })
            .catch(err=>{
                this.setState({loading:false});
            })

    }

    render() {
        //const { height, width } = useWindowDimensions();

        return (

            <ResponsiveLayout title={`Treenet`}   loading={this.state.loading} loadingMessage={this.state.loadingMessage} style={{margin:0}}>
                <View style={{flex:1,backgroundColor:bbgr9,alignItems:'center',padding:10,paddingTop:'5%',}} >
                    <Image
                        source={images.tree}
                        style={{maxWidth: '25%', maxHeight: '25%',}}
                    />
                    <Text
                        style={{
                            marginTop:5,
                            marginBottom:10,
                            fontSize:25,
                            fontWeight:800,
                            fontFamily: 'IRANYekanFaNum-Bold',
                            color:bgr7
                        }}>
                        Treenetgram
                    </Text>

                    <View id='form' style={{width:'100%',maxWidth:500,marginTop:3,padding:16}}   >
                         {/* <Text style={{ textAlign:'center', marginTop:30,fontSize:14,color:bgWhite}}>{translate("for_start_enter_your_phone_number")}</Text>*/}
                        <Text
                            style={{
                                alignItems:'center',
                                marginTop:2,
                                fontSize:14,
                                fontFamily: 'IRANYekanFaNum-Bold',
                                textAlign:'justify',
                                color:bgr10,

                            }}>
                            {translate("registerPassword_decription1")}
                        </Text>
                        <Text
                            style={{
                                alignItems:'center',
                                marginTop:2,
                                fontSize:14,
                                fontFamily: 'IRANYekanFaNum-Bold',
                                textAlign:'justify',
                                color:bgr10,

                            }}>
                            {translate("registerPassword_decription2")}
                        </Text>
                        <View
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
                                reverse={global.isRtl}
                                placeholder={translate('registerPassword_username_example')}
                                style={{flex:1, marginTop:0}}
                                labelStyle={{color:bgr8,marginTop:-19}}
                                editable={true}
                                multiline={false}
                                maxLength={50}
                                floatingLabelEnable={true}
                                labelAlign={'left'}
                                keyboardType="default"
                                returnKeyType="done"
                                numberOfLines={1}
                                underlineSize={4}
                                underlineColor={this.state.usernameValidation ? bgr8 : primaryDark}
                                isAccept={this.state.usernameValidation}
                                textInputStyle={{
                                    fontWeight: 'normal',
                                    fontFamily:'IRANYekanRegular',
                                    color: bgr10,
                                    fontSize: 14,
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
                        </View>
                        {this.state.username.length>3 && this.state.usernameValidation==false &&(
                                <Text style={{marginTop:4, color:primaryDark,fontSize:12}} >{translate('registerPassword_username_is_reserved')}</Text>
                            )
                        }

                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: 34,
                                position:'relative',

                            }}
                        >
                            <FloatingLabelTextInput
                                dir={'ltr'}
                                reverse={global.isRtl}
                                type={this.state.showPassword ? 'text' : 'password'}
                                placeholder={translate('registerPassword_password_example')}
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
                                labelStyle={{color:bgr8,marginTop:-17}}
                                textInputStyle={{
                                    fontWeight: 'normal',
                                    fontFamily:'IRANYekanRegular',
                                    color:bgr10,
                                    fontSize: 14,
                                    paddingStart: 4,
                                    paddingTop: 1,
                                    //textAlign: 'left',
                                    //paddingLeft:35,
                                }}
                                underlineSize={4}
                                underlineColor={this.state.passwordValidation ? bgr8 : primaryDark}
                                isAccept={this.state.passwordValidation}
                                style={{flex: 1,marginTop:0}}
                                onChangeText={text => {
                                    //this.checkValidation();
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
                                style={{position: 'absolute', start: 30, bottom:4}}
                            >
                                {
                                    this.state.showPassword?
                                        <IoMdEye color={bgr8}  size={24} />
                                        :<IoMdEyeOff color={bgr8}  size={24}/>
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
                                dir={'ltr'}
                                reverse={global.isRtl}
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
                                labelStyle={{color:bgr8,marginTop:-17}}
                                keyboardType="default"
                                returnKeyType="done"
                                numberOfLines={1}
                                textInputStyle={{
                                    fontWeight: 'normal',
                                    fontFamily:'IRANYekanRegular',
                                    color:bgr10,
                                    fontSize: 14,
                                    paddingStart: 4,
                                    paddingTop: 1,
                                    //textAlign: 'left',
                                    //paddingLeft:35,
                                }}
                                underlineColor={this.state.passwor2dValidation ? bgr8 : primaryDark}
                                isAccept={this.state.passwor2dValidation}
                                underlineSize={1}

                                style={{flex: 1}}
                                onChangeText={text => {
                                    //this.checkValidation();
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
                                style={{position: 'absolute', start: 30, bottom:4}}
                            >
                                {
                                    this.state.showPassword?
                                        <IoMdEye color={bgr8}  size={24} />
                                        :<IoMdEyeOff color={bgr8}  size={24} />
                                }
                            </TouchableOpacity>
                        </View>




                        <TouchableOpacity
                            style={{
                                flex:1,
                                marginTop:40,
                                borderColor: bgr6,
                                borderWidth:1,
                                padding:0,
                                paddingTop:0,
                                borderRadius:12,
                                alignItems:'center',
                                justifyContent:'center',
                            }}
                            onPress={() =>this.updateUsernameAndPassword()}
                        >
                            <Text style={{fontSize:16,color:bgr8,fontWeight:500,paddingVertical:12}}>{translate('confirm')}</Text>
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



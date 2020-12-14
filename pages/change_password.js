import React, { Component } from 'react';
import { persistStore, pStore, userStore } from "../src/stores";
import PanelLayout from "../src/components/layouts/PanelLayout";
import { SwitchTextMulti, Toolbar } from "../src/components";
import { getTabWidth, mapNumbersToEnglish, navigation, showMassage } from "../src/utils";
import images from "../public/static/assets/images";
import {
    bg1,
    textItemBlack,
    bgWhite,
    border,
    bgSuccess,
    orange1,
    primaryDark,
    textItem,
    textDisabled,
} from "../src/constants/colors";
import { Image, Platform, Text, TouchableOpacity, View, } from "../src/react-native";
import translate from "../src/language/translate";
import { logoutApi, postQuery } from "../dataService/apiService";
import FloatingLabelTextInput from "../src/components/FloatingLabelTextInput";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

export default class change_password extends Component {
    constructor() {
        super();
        this.state = {
            password: '',
            showPassword: false,
            passwordValidation: false,
            passwor2dValidation: false,
            userKeyValidation: false,
            countryCode: userStore.countryCode,
            userKey: '',
            shortMobile: userStore.shortMobile,
            email: userStore.email || '',
            fullName: userStore.fullName || '',
            age: userStore.age,
            gender: Number(userStore.gender || 0),
        };

    }

    async componentDidMount() {

    }

    isValid() {
        return this.state.passwordValidation &&  this.state.passwor2dValidation ;
    }

    checkValidation() {

        if (!this.state.password) {
            this.setState({ passwordValidation: false });
            return translate('registerPassword_enter_password');
        }
        const passReg = /(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/;
        /* if( !passReg.test(this.state.password)){
             return "پسورد شما باید حداقل ۶ حرف بوده و شامل حروف کوچک و بزرگ و کاراکترهای خاص باشد.";
         }*/
         if( this.state.password.length<6){
            return "پسورد شما باید حداقل 6 کاراکتر باشد.";
        }

        if (this.state.password.length < 6) {
            this.setState({ passwordValidation: false });
            return translate('registerPassword_password_can_not_be_les_than');
        }
        if (this.state.password !== this.state.password2) {
            this.setState({ passwordValidation: false });
            return translate('registerPassword_password_and_repeat_not_equal');
        }


        // if(!this.state.shortMobile){
        //     this.setState({shortMobileValidation: false});
        //     return translate('موبایل خود را وارد کنید.')
        // }
        // if (this.state.shortMobile && this.state.shortMobile.length < 10) {
        //     this.setState({shortMobileValidation: false});
        //     return translate('the_number_of_mobile_is_not_valid');
        // }

        // const shortMobileReg = /^9[0-9]{9}$/i;
        // if (this.state.shortMobile && !shortMobileReg.test(this.state.shortMobile)){
        //     //this.setState({shortMobileValidation: false});
        //     return translate('invalid_shortMobile_number'); ;
        // }

        // const emailReg = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/
        // if (this.state.email && !emailReg.test(this.state.email)){
        //     //this.setState({emailReg: false});
        //     return translate('fastRegister_invalid_email_format');
        // }
        // if (!this.state.fullName){

        //     return translate('نام خود را وارد کنید.');
        // }
        // if (!this.state.age){
        //     return translate('سن را وارد کنید');
        // }

    }
    updatePassword = () => {

        const msg = this.checkValidation();
        if (msg) {
            showMassage(msg, 'warning')
            return;
        }

        const data = {
            userKey: this.state.userKey,
            password: this.state.password,
            showNotifAction: true,
        };

        this.setState({ loading: true, loadingMessage: 'در حال اجرا' });
        postQuery('Members/me/updatePassword', data)
            .then(res => {
                console.log(res);
                //navigation.replace(pStore.cUser.userKey);
                this.setState({ loading: false });

                //setTimeout(() => showMassage('رمز عبور با موفقیت تغییر کرد. لطفا با رمز جدید وارد شوید.', 'success'), 1500);
                
                logoutApi();
                navigation.replaceTo('login',{chp:1});
            })
            .catch(err => {
                this.setState({ loading: false });
            })
    }


    render() {
        const toolbarStyle = {
            start: {
                content: images.ic_back,
                onPress: () => navigation.goBack(),
            },
            title: 'تغییر رمز عبور',

        };



        return (
            <PanelLayout
                loading={this.state.loading}
                loadingMessage={this.state.loadingMessage}
                title={`Treenetgram`}
                showNotifAction={false}
                showMenu={this.state.showMenu}
                onRef={(initDrawer) => this.initDrawer = initDrawer}
                onCloseMenu={() => this.setState({ showMenu: false })}
                style={{ alignItems: 'center' }}
                header={
                    <Toolbar
                        customStyle={toolbarStyle}
                        isExpand={this.state.showAccountSelect}
                    />
                }
                footer={
                    <TouchableOpacity
                        onPress={this.updatePassword}
                        disabled={!this.isValid()}
                        style={{ alignItems: 'center', justifyContent: 'center', padding: 15, backgroundColor:this.isValid()?primaryDark:textDisabled }}>
                        <Text style={{ color: bgWhite }} >ذخیره</Text>
                    </TouchableOpacity>
                }>
                <View style={{ flex: 1,  paddingHorizontal: 13, paddingVertical: 50, paddingHorizontal: 24 }} >
                    <View id='form' style={{ width: '100%', maxWidth: 500,alignSelf:'center' }}   >
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
                                placeholder={translate('رمز عبور جدید')}
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

                                style={{flex: 1,marginTop:24}}
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




                    </View>
                    <Text
                        style={{
                            marginTop: 30,
                            fontSize: 12,
                            fontFamily: 'IRANYekanFaNum-Bold',
                            textAlign: 'right',
                            fontWeight: 800
                        }}>
                        {translate("نکات مهم پسورد")}
                    </Text>
                    <Text
                        style={{
                            marginTop: 2,
                            fontSize: 12,
                            fontFamily: 'IRANYekanFaNum-Bold',
                           // textAlign: 'justify',
                        }}>
                        {translate("دقت کنید که بعد از تغییر پسورد لازم است دوباره وارد سیستم شوید بنابراین پسورد جدید را به خاطر بسپارید.")}
                    </Text>
                    <Text
                        style={{
                            marginTop: 2,
                            fontSize: 12,
                            fontFamily: 'IRANYekanFaNum-Bold',
                            textAlign: 'justify',
                        }}>
                        {translate("شماره موبایل و رمز عبور شما سند مالکیت شبکه شما می باشد. بنابراین یک رمز قوی برای آن انتخاب کرده و همیشه بخاطر داشته باشید.")}
                    </Text>
                    <Text
                        style={{
                            marginTop: 2,
                            fontSize: 12,
                            fontFamily: 'IRANYekanFaNum-Bold',
                            textAlign: 'justify',
                        }}>
                        {translate("رمز عبور حداقل باید 6 کاراکتر بوده و می تواند شامل اعداد و حروف انگلیسی باشد . البته می توانید از کاراکترهای خاص (مانند !@#$%^&*_) برای قویتر کردن رمز عبور خود استفاده کنید. (مثال: ali_345 یا Ahm@d_678)")}
                    </Text>


                    <Text
                        style={{
                            marginTop: 2,
                            fontSize: 12,
                            fontFamily: 'IRANYekanFaNum-Bold',
                            textAlign: 'justify',
                        }}>
                        {translate("نکته مهم: پسورد به حروف کوچک و بزرگ حساس است. پس اگر از حروف بزرگ انگلیسی هم در پسورد خود استفاده می کنید، در زمان ورود دقیقا به همان شکل وارد کنید. ")}
                    </Text>
                </View>
            </PanelLayout>
        )
    }

}



import React, {Component} from 'react';
import {userStore,persistStore } from "../src/stores";
import {permissionId} from '../src/constants/values';
import Router from "next/router";
import PanelLayout from "../src/components/layouts/PanelLayout";
import {DropDownList, Toolbar, CardUnitInfo, PopupBase, ImageSelector, SwitchTextMulti} from "../src/components";

import accountsStore from "../src/stores/Accounts";
import {deviceWide, doDelay, getTabWidth, logger, mapNumbersToEnglish, navigation, showMassage} from "../src/utils";
import images from "../public/static/assets/images";
import PopupState, {bindTrigger, bindPopover} from 'material-ui-popup-state';
import {getUserBalance} from "../src/network/Queries";
import {
    bgItemRed,
    bgScreen,
    bgWhite,
    textItemRed,
    borderSeparate,
    border,
    primary,
    primaryDark,
    bg1,
    bg3,
    textItem,
    bg5,
    bg9,
    textItemBlack,
    placeholderTextColor,
    lightRed,
    bg2,
    bg4,
    grL5,
    bg8,
    bg10,
    itemListText
} from "../src/constants/colors";
import accounting from "accounting";
import NavFooterButtons from "../src/components/layouts/footerButtons";
import NavBar from "../src/components/layouts/NavBar";
import {View, TouchableOpacity, Text, Image, Platform, TextInput,} from "../src/react-native";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCogs, faCompass, faMapMarkerAlt, faUser} from "@fortawesome/free-solid-svg-icons";
import translate from "../src/language/translate";
import {getUserProfileApi, logoutApi, postQuery} from "../dataService/apiService";
import Api from "../dataService/apiCaller";
import FloatingLabelTextInput from "../src/components/FloatingLabelTextInput";
import { IoMdEyeOff,IoMdEye,IoIosBulb } from "react-icons/io";
import ResponsiveLayout from "../src/components/layouts/ResponsiveLayout";

const HOME_TYPE = 1;
export default class change_username_password extends Component {
    constructor() {
        super();
        this.state = {
            password:'',
            showPassword:false,
            passwordValidation:false,
            passwor2dValidation:false,
            usernameValidation:false,
            countryCode:userStore.countryCode,
            username:'',
            shortMobile:userStore.shortMobile,
            email:userStore.email ||'',
            firstName:userStore.firstName ||'',
            lastName:userStore.lastName ||'',
            age:userStore.age ,
            gender:Number(userStore.gender ||0),
        };

    }

    async componentDidMount() {

    }

    checkValidation() {
        if(this.state.usernameReserved){
            this.setState({usernameValidation: false});
            return translate('این نام کاربری قبلا گرفته شده است.');
        }
        if (!this.state.username ) {
            this.setState({usernameValidation: false});
            return translate('registerPassword_enter_username');
        }
        if (this.state.username==persistStore.username) {
            this.setState({usernameValidation: false});
            return translate('نام کاربری پیشفرض را عوض کنید.');
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


        if(!this.state.shortMobile){
            this.setState({shortMobileValidation: false});
            return translate('موبایل خود را وارد کنید.')
        }
        if (this.state.shortMobile && this.state.shortMobile.length < 10) {
            this.setState({shortMobileValidation: false});
            return translate('the_number_of_mobile_is_not_valid');
        }

        const shortMobileReg = /^9[0-9]{9}$/i;
        if (this.state.shortMobile && !shortMobileReg.test(this.state.shortMobile)){
            //this.setState({shortMobileValidation: false});
            return translate('invalid_shortMobile_number'); ;
        }

        const emailReg = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/
        if (this.state.email && !emailReg.test(this.state.email)){
            //this.setState({emailReg: false});
            return translate('fastRegister_invalid_email_format');
        }
        if (!this.state.firstName){

            return translate('نام خود را وارد کنید.');
        }
        if (!this.state.lastName){
            //this.setState({emailReg: false});
            return translate('نام خانوادگی خود را وارد کنید.');
        }
        if (!this.state.age){
            return translate('سن را وارد کنید');
        }

    }
    updateUsernameAndPassword=()=>{

        const msg=this.checkValidation();
        if(msg){
            showMassage(msg,'warning')
            return;
        }

        const data={
            username:this.state.username,
            password:this.state.password,
            showNotifAction:true,
        };
        if(this.state.shortMobile){
            data.mobile=this.state.countryCode+'-'+this.state.shortMobile;
        }
        if(this.state.email){
            data.email=this.state.email;
        }
        if(this.state.firstName){
            data.firstName=this.state.firstName;
        }
        if(this.state.lastName){
            data.lastName=this.state.lastName;
        }
        if(this.state.age){
            data.age=this.state.age;
        }
        if(this.state.gender!==undefined){
            data.gender=Number(this.state.gender);
        }


        this.setState({loading:true,loadingMessage:'در حال اجرا'});
        postQuery('Members/me/updateUsernameAndPassword',data)
            .then(res=>{
                console.log(res);
                navigation.replace('Profile');
                this.setState({loading:false});
                showMassage('مشخصات با موفقیت ویرایش شد.','success')
            })
            .catch(err=>{
                this.setState({loading:false});
            })

    }
    setProfileImage=(fileName)=>{
        const data={profileImage:fileName}
        postQuery('Members/me/setProfileImage',data)
            .then(res=>{
                profileImage:res.profileImage;
                this.setState({loading:false});
            })
            .catch(err=>{
                this.setState({loading:false});
            })
    }

    render() {
        const toolbarStyle = {
            start: {
                content: images.ic_back,
                onPress: ()=>navigation.goBack(),
            },
            title: 'تغییر رمز موقت و مشخصات شبکه',

        };



        return (
            <PanelLayout
                loading={this.state.loading}
                loadingMessage={this.state.loadingMessage}
                title={`Treenetgram`}
                showNotifAction={false}
                showMenu={this.state.showMenu}
                onRef={(initDrawer)=>this.initDrawer=initDrawer}
                onCloseMenu={()=>this.setState({showMenu:false})}
                style={{alignItems:'center'}}
                header={
                    <Toolbar
                        customStyle={toolbarStyle}
                        isExpand={this.state.showAccountSelect }
                    />
                }
                footer={
                    <TouchableOpacity
                        onPress={this.updateUsernameAndPassword}
                        style={{alignItems:'center',justifyContent:'center',padding:15, backgroundColor:primaryDark}}>
                        <Text style={{color:bgWhite}} >ذخیره</Text>
                    </TouchableOpacity>
                }>
                <View style={{flex:1,alignItems:'center',paddingHorizontal:13,paddingTop:10,}} >


                    <View id='form' style={{width:'100%',maxWidth:500,marginTop:3,}}   >

                        <Text
                            style={{
                                marginTop:2,
                                fontSize:14,
                                fontFamily: 'IRANYekanFaNum-Bold',
                                textAlign:'justify',
                            }}>
                            {translate("registerPassword_decription1")}
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
                                reverse={persistStore.isRtl}
                                placeholder={translate('registerPassword_username_example')}
                                style={{flex:1, marginTop:10}}
                                labelStyle={{color:bg3,marginTop:-19}}
                                editable={true}
                                multiline={false}
                                maxLength={50}
                                floatingLabelEnable={true}
                                labelAlign={'left'}
                                keyboardType="default"
                                returnKeyType="done"
                                numberOfLines={1}
                                underlineSize={4}
                                underlineColor={this.state.usernameValidation ? bg3 : primaryDark}
                                isAccept={this.state.usernameValidation}
                                textInputStyle={{
                                    fontWeight: 'normal',
                                    fontFamily:'IRANYekanRegular',
                                    color: bg1,
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
                                    text = mapNumbersToEnglish(text);
                                    if(text && !usernameReg.test(text)){
                                        showMassage(translate('registerPassword_username_rule'),'warning');
                                        this.setState({
                                            usernameValidation: false,
                                            username:this.state.username,
                                        })

                                        return;
                                    }

                                    const usernameReg2 =/^\d+$/;
                                    if(text && usernameReg2.test(text.substring(0,1))){
                                        showMassage(translate('registerPassword_username_rule2'),'warning');
                                        this.setState({
                                            usernameValidation: false,
                                            username:'',
                                        })
                                        return;
                                    }
                                    if(text.length>2){
                                        this.setState({checkingPassword:true});
                                        postQuery('Members/me/checkUserNameExist',{username:text,currentUsername:userStore.username})
                                            .then((usernameExist)=>{
                                                this.setState({usernameReserved:usernameExist,usernameValidation:!usernameExist});
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
                        {this.state.usernameReserved && userStore.username!=this.state.username && (
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
                                reverse={persistStore.isRtl}
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
                                labelStyle={{color:bg3,marginTop:-17}}
                                textInputStyle={{
                                    fontWeight: 'normal',
                                    fontFamily:'IRANYekanRegular',
                                    color:bg1,
                                    fontSize: 14,
                                    paddingStart: 4,
                                    paddingTop: 1,
                                    //textAlign: 'left',
                                    //paddingLeft:35,
                                }}
                                underlineSize={4}
                                underlineColor={this.state.passwordValidation ? bg3 : primaryDark}
                                isAccept={this.state.passwordValidation}
                                style={{flex: 1,marginTop:0}}
                                onChangeText={text => {
                                    //this.checkValidation();
                                    const passReg =/^[a-zA-Z0-9~`!@#$%^&*()_-{\]\[}|\\?/<.>,+=-]+$/;
                                    text = mapNumbersToEnglish(text);
                                    if(text && !passReg.test(text)){
                                        showMassage(translate('registerPassword_password_rule'),'warning');
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
                                        <IoMdEye color={bg3}  size={24} />
                                        :<IoMdEyeOff color={bg3}  size={24}/>
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
                                reverse={persistStore.isRtl}
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
                                labelStyle={{color:bg3,marginTop:-17}}
                                keyboardType="default"
                                returnKeyType="done"
                                numberOfLines={1}
                                textInputStyle={{
                                    fontWeight: 'normal',
                                    fontFamily:'IRANYekanRegular',
                                    color:bg1,
                                    fontSize: 14,
                                    paddingStart: 4,
                                    paddingTop: 1,
                                    //textAlign: 'left',
                                    //paddingLeft:35,
                                }}
                                underlineColor={this.state.passwor2dValidation ? bg3 : primaryDark}
                                isAccept={this.state.passwor2dValidation}
                                underlineSize={3}

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
                                        <IoMdEye color={bg3}  size={24} />
                                        :<IoMdEyeOff color={bg3}  size={24} />
                                }
                            </TouchableOpacity>
                        </View>
                        <View id='form' style={{width:'100%',maxWidth:500,marginTop:40}}   >


                            <View dir={"ltr"} style={{flexDirection:'row',marginTop:5,borderColor: bg5,borderWidth:2, borderRadius:8,backgroundColor:bgWhite,}}>
                                <Text style={{
                                    fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum' : 'IRANYekanRegular(FaNum)',
                                    fontSize: 16,
                                    color: border,

                                    padding:5,
                                    alignSelf: 'center',
                                }}>{this.state.countryCode}</Text>
                                <FloatingLabelTextInput
                                    dir={'ltr'}
                                    labelAlign={'left'}
                                    reverse={persistStore.isRtl}
                                    style={{flex:1,paddingHorizontal:5,paddingVertical:5,paddingTop:7}}
                                    placeholder={translate("fastRegister_mobile_number")}
                                    value={this.state.shortMobile}
                                    onChangeText={text => {
                                        if(text.length>1 && text.indexOf(0)==0){
                                            text=text.substring(1);
                                        }

                                        const acceptReg =/^[0-9~.]+$/;
                                        const shortMobileReg = /^9[0-9]{9}$/i;
                                        text = mapNumbersToEnglish(text);
                                        if(acceptReg.test(text)){
                                            this.setState({ shortMobile:text, shortMobileValidation:shortMobileReg.test(text)});
                                        }else{
                                            //showMassage(translate('fastRegister_onlyEnglish_number'),'warning');
                                        }
                                        if(!text){
                                            this.setState({ shortMobile:'', shortMobileValidation:false});
                                        }

                                    }}
                                    numberOfLines={1}
                                    isAccept={this.state.shortMobileValidation}
                                    textInputStyle={{
                                        fontFamily: 'IRANYekanFaNum-Bold',
                                        fontSize: 16,
                                        fontWeight:800,
                                        color: textItemBlack,
                                        paddingStart: 4,
                                        paddingTop: 1,
                                        paddingBottom: 10,
                                        //textAlign: 'left',
                                    }}
                                    underlineSize={0}

                                    multiline={false}
                                    maxLength={10}
                                    //autoFocus={true}
                                    keyboardType="number-pad"
                                    returnKeyType="done"

                                />

                            </View>
                            <View dir={"ltr"} style={{flexDirection:'row',marginTop:10,borderColor: bg5,borderWidth:2, borderRadius:8,backgroundColor:bgWhite,}}>

                                <FloatingLabelTextInput
                                    labelAlign={'left'}
                                    dir={'ltr'}
                                    reverse={persistStore.isRtl}
                                    style={{flex:1,paddingHorizontal:5,paddingVertical:5,paddingTop:7}}
                                    placeholder={translate("fastRegister_email_address")}
                                    value={this.state.email}
                                    onChangeText={text => {
                                        const acceptReg =/^[a-zA-Z0-9~@.]+$/;
                                        const emailReg=/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                        text = mapNumbersToEnglish(text);
                                        if(acceptReg.test(text)){
                                            this.setState({ email:text, emailValidation:emailReg.test(text)});
                                        }else{
                                            showMassage(translate('fastRegister_only_english_number_special_charachter'),'warning');
                                        }
                                        if(!text){
                                            this.setState({ email:'', emailValidation:false});
                                        }
                                    }}
                                    numberOfLines={1}

                                    isAccept={this.state.emailValidation}
                                    textInputStyle={{
                                        fontFamily: 'IRANYekanFaNum-Bold',
                                        fontSize: 16,
                                        fontWeight:800,
                                        color: textItemBlack,
                                        paddingStart: 4,
                                        paddingTop: 1,
                                        paddingBottom: 10,
                                        //textAlign: 'left',
                                    }}
                                    underlineSize={0}

                                    multiline={false}
                                    maxLength={100}
                                    //autoFocus={true}
                                    returnKeyType="done"

                                />


                            </View>
                        </View>

                        <View id='userProperty' >


                            <View  style={{marginTop:0,  padding:10}}  >
                                <FloatingLabelTextInput
                                    ref={input => {
                                        this.labelInput = input;
                                    }}
                                    labelAlign={'left'}
                                    placeholder={translate('firstName')}
                                    style={{flex:1, marginTop:20}}
                                    labelStyle={{color:bg3}}
                                    editable={true}
                                    multiline={false}
                                    maxLength={70}
                                    floatingLabelEnable={true}
                                    keyboardType="default"
                                    returnKeyType="done"
                                    numberOfLines={1}
                                    tintColor={
                                        this.state.firstNameValidation ? placeholderTextColor : lightRed
                                    }
                                    textInputStyle={{
                                        fontWeight: 'normal',
                                        fontFamily:
                                            Platform.OS === 'ios'
                                                ? 'IRANYekan-ExtraBold'
                                                : 'IRANYekanExtraBold',
                                        color: bg2,
                                        fontSize: 16,
                                        paddingStart: 4,
                                        paddingTop: 1,
                                        paddingBottom: 3,
                                        //textAlign: 'right',
                                    }}
                                    underlineSize={1}

                                    onChangeText={text =>
                                        this.setState({
                                            firstName: text,
                                            firstNameValidation: true,
                                        })
                                    }
                                    highlightColor={primaryDark}
                                    value={this.state.firstName}
                                />
                                <FloatingLabelTextInput
                                    ref={input => {
                                        this.labelInput = input;
                                    }}
                                    labelAlign={'left'}
                                    placeholder={translate('lastName')}
                                    style={{flex:1, marginTop:20}}
                                    labelStyle={{color:bg3}}
                                    editable={true}
                                    multiline={false}
                                    maxLength={70}
                                    floatingLabelEnable={true}
                                    keyboardType="default"
                                    returnKeyType="done"
                                    numberOfLines={1}
                                    tintColor={
                                        this.state.lastNameValidation ? placeholderTextColor : lightRed
                                    }
                                    textInputStyle={{
                                        fontWeight: 'normal',
                                        fontFamily:
                                            Platform.OS === 'ios'
                                                ? 'IRANYekan-ExtraBold'
                                                : 'IRANYekanExtraBold',
                                        color: bg2,
                                        fontSize: 16,
                                        paddingStart: 4,
                                        paddingTop: 1,
                                        paddingBottom: 3,
                                        //textAlign: 'right',
                                    }}
                                    underlineSize={1}

                                    onChangeText={text =>
                                        this.setState({
                                            lastName: text,
                                            lastNameValidation: true,
                                        })
                                    }
                                    highlightColor={primaryDark}
                                    value={this.state.lastName}
                                />
                                <FloatingLabelTextInput
                                    labelAlign={'left'}
                                    reverse={persistStore.isRtl}
                                    placeholder={translate('age')}
                                    style={{flex:1, marginTop:20}}
                                    labelStyle={{color:bg3}}
                                    editable={true}
                                    multiline={false}
                                    maxLength={2}
                                    floatingLabelEnable={true}
                                    keyboardType="number-pad"
                                    returnKeyType="done"
                                    numberOfLines={1}
                                    textInputStyle={{
                                        fontWeight: 'normal',
                                        fontFamily:'IRANYekanExtraBold',
                                        color: bg2,
                                        fontSize: 16,
                                        paddingRight: 10,
                                        paddingTop: 1,
                                        paddingBottom: 3,
                                        //textAlign: 'right',
                                    }}
                                    underlineSize={1}
                                    value={this.state.age}
                                    onChangeText={text =>{
                                        const acceptReg =/^\d+$/;;
                                        const ageReg=/^\d+$/;
                                        text = mapNumbersToEnglish(text);
                                        if(acceptReg.test(text)){
                                            this.setState({ age:text, ageValidation:ageReg.test(text)});
                                        }else{
                                            //showMassage(translate('بصورت عددی وارد کنید '),'warning');
                                        }
                                        if(!text){
                                            this.setState({ age:'', ageValidation:false});
                                        }

                                    }

                                    }
                                    tintColor={
                                        this.state.ageValidation ? placeholderTextColor : lightRed
                                    }
                                    highlightColor={primaryDark}
                                    unit={translate('year')}
                                    unitStyle={{color:bg4}}
                                    keyboardType="number-pad"
                                />

                                <View style={{flex:1,alignItems:'center',marginTop:30}}>
                                    <SwitchTextMulti
                                        style={{width:300}}
                                        selectedIndex={this.state.gender}
                                        onSelect={index => {
                                            this.setState({gender: index});
                                            //this.checkValidation();
                                        }}
                                        data={[
                                            translate('woman'),
                                            translate('man'),
                                        ]}
                                        backgroundActive={primaryDark}
                                        backgroundInactive={'#fff'}
                                        itemWidth={getTabWidth(300, 2,1)}
                                        activeTextStyle={{
                                            paddingVertical: 6,
                                        }}
                                        inactiveTextStyle={{
                                            paddingVertical: 6,
                                        }}
                                    />
                                </View>
                            </View>

                        </View>
                    </View>
                </View>
            </PanelLayout>
        )
    }

}



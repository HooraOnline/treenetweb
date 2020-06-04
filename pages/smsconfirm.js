import React, {Component} from 'react';
import MainContent from "./home/MainContent";
import {userStore,persistStore } from "../src/stores";
import {permissionId} from '../src/constants/values';
import Router from "next/router";
import ResponsiveLayout from "../src/components/layouts/ResponsiveLayout";
import {DropDownList,Toolbar,CardUnitInfo,PopupBase,ImageSelector} from "../src/components";

import accountsStore from "../src/stores/Accounts";
import {
    deviceWide,
    getUrlParameter,
    inputNumberValidation,
    logger,
    mapNumbersToEnglish,
    navigation,
    showMassage
} from "../src/utils";
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
    placeholderTextColor,
    lightRed,
    textItem,
    subTextItem,
    textItemBlack,
    borderLight,
    lightGrey,
    textGray,
    gr10, gr3, gr8, gr9, gr5, gr1, gr2
} from "../src/constants/colors";
import accounting from "accounting";
import NavFooterButtons from "../src/components/layouts/footerButtons";
import NavBar from "../src/components/layouts/NavBar";
import {View, TouchableOpacity, Text, Image, Platform,} from "../src/react-native";
import FloatingLabelTextInput from "../src/components/FloatingLabelTextInput";
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import {postQuery, saveEntity} from "../dataService/dataService";
//import Pagination from 'docs/src/modules/components/Pagination';
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const HOME_TYPE = 1
export default class smsconfirm extends Component {
    constructor() {
        super();
        //globalState.changeStatusBarColor(primaryDark);
        //StatusBar.setTranslucent(false);

        this.state = {
            focus:1,
            invitationLink:'',
        };
    }


    checkUserNotRefreshPage = () => {
        if (!userStore.RoleID) {
            Router.push('/Main');
        }
    }

    manageMenuVisible=()=>{
        let isWide=deviceWide();
        persistStore.showMenu=persistStore.showMenu==false?false:isWide;
        this.setState({isWide:isWide,showMenu:isWide?persistStore.showMenu:false});
     }



    isValid() {
        return mobileValidation;
    }
    checkValidation() {
        if(!this.state.mobile){
            this.setState({mobileValidation: false});
            return 'شماره موبایل خود را وارد کنید.'
        }
        if(this.state.mobile.indexOf(0)=='0'){
            return 'شماره موبایل را بدون صفر وارد کنید';
        }
        if (this.state.mobile.length < 10) {
            this.setState({mobileValidation: false});
            return 'تعداد ارقام شماره موبایل کم است';
        }

        const mobileReg = /^9[0-9]{9}$/i
        if (!mobileReg.test(this.state.mobile)){
            //this.setState({mobileValidation: false});
            return 'فرمت موبایل نادرست';
        }

    }
    registerPhone(){

        const msg=this.checkValidation();
        if(msg){
            showMassage(msg,'پیام','info')
            return;
        }

        if(!this.regentCode){

            showMassage('برای ثبت نام، باید از طریق لینک دعوت وارد سایت شوید','پیام','info');
        }
        const data={
            mobile:this.state.countryCode+this.state.mobile,
            regentCode:this.regentCode
        }

        postQuery('Members/registerMe',data)
          .then(res=>{
              console.log(res);
              this.setState({invitationLink:'https://treenet.biz?regentCode='+res.invitationCode});
          })
          .catch(err=>{
              console.log(err);
          })
    }

    componentDidMount() {
        navigation.getParam('user');

    }

    render() {
        //const { height, width } = useWindowDimensions();
        return (

            <ResponsiveLayout title={`Enter Confirm code`}  style={{margin:0}}>

                <View style={{flex:1,backgroundColor:gr9,alignItems:'center',padding:16,paddingTop:'5%',}} >
                    <Image
                        source={images.tree}
                        style={{maxWidth: '50%', maxHeight: '50%',}}
                    />
                    <Text
                        style={{
                            marginTop:20,
                            marginBottom:30,
                            fontSize:50,
                            fontWeight:800,
                            fontFamily: 'IRANYekanFaNum-Bold',
                            color:gr3
                        }}>
                        Treenet
                    </Text>

                    <View id='form' >
                        <Text
                            style={{
                                marginTop:10,
                                fontSize:16,
                                fontWeight:800,
                                fontFamily: 'IRANYekanFaNum-Bold',
                                color:gr3,
                                alignSelf:'center'
                            }}>
                            Enter sms code
                        </Text>

                        <View id='sms code' style={{marginTop:10, flexDirection:'row',justifyContent:'center', marginHorizontal:10}}  >
                            {/*  <Text style={{marginTop:20,fontSize:14,color:bgWhite}}>Enter your phone number</Text>*/}
                            <View style={{width:50,marginHorizontal:2,}} >
                                <FloatingLabelTextInput
                                    dir={'ltr'}
                                    autoFocus={this.state.focus==1}
                                    style={{ borderColor: gr5,borderWidth:2,paddingVertical:5, borderRadius:8,backgroundColor:bgWhite}}
                                    //placeholder=""
                                    value={this.state.code1}
                                    onChangeText={text => {
                                        text = mapNumbersToEnglish(text);
                                        this.setState({ code1:text, code1Validation: true,focus:2});
                                    }}
                                    numberOfLines={1}
                                    tintColor={
                                        this.state.code1Validation ? placeholderTextColor : lightRed
                                    }
                                    textInputStyle={{
                                        fontFamily: 'IRANYekanFaNum-Bold',
                                        fontSize: 20,
                                        fontWeight:800,
                                        color: textItemBlack,
                                        paddingStart: 4,
                                        paddingTop: 6,
                                        paddingBottom: 5,
                                        textAlign: 'center',

                                    }}
                                    underlineSize={0}

                                    multiline={false}
                                    maxLength={1}
                                    //autoFocus={true}
                                    keyboardType="number-pad"
                                    returnKeyType="done"

                                />

                            </View>
                            <View style={{width:50,marginHorizontal:2,}} >
                                <FloatingLabelTextInput
                                    dir={'ltr'}
                                    autoFocus={this.state.focus==2}
                                    style={{ borderColor: gr5,borderWidth:2,paddingVertical:5, borderRadius:8,backgroundColor:bgWhite}}
                                    //placeholder=""
                                    value={this.state.code2}
                                    onChangeText={text => {
                                        text = mapNumbersToEnglish(text);
                                        this.setState({ code2:text, code2Validation: true,focus:3});
                                    }}
                                    numberOfLines={1}
                                    tintColor={
                                        this.state.code1Validation ? placeholderTextColor : lightRed
                                    }
                                    textInputStyle={{
                                        fontFamily: 'IRANYekanFaNum-Bold',
                                        fontSize: 20,
                                        fontWeight:800,
                                        color: textItemBlack,
                                        paddingStart: 4,
                                        paddingTop: 6,
                                        paddingBottom: 5,
                                        textAlign: 'center',
                                    }}
                                    underlineSize={0}

                                    multiline={false}
                                    maxLength={1}
                                    //autoFocus={true}
                                    keyboardType="number-pad"
                                    returnKeyType="done"

                                />

                            </View>
                            <View style={{width:50,marginHorizontal:2,}} >
                                <FloatingLabelTextInput
                                    dir={'ltr'}
                                    autoFocus={this.state.focus==3}
                                    style={{ borderColor: gr5,borderWidth:2,paddingVertical:5, borderRadius:8,backgroundColor:bgWhite}}
                                    //placeholder=""
                                    value={this.state.code3}
                                    onChangeText={text => {
                                        text = mapNumbersToEnglish(text);
                                        this.setState({ code3:text, code3Validation: true,focus:4});
                                    }}
                                    numberOfLines={1}
                                    tintColor={
                                        this.state.code1Validation ? placeholderTextColor : lightRed
                                    }
                                    textInputStyle={{
                                        fontFamily: 'IRANYekanFaNum-Bold',
                                        fontSize: 20,
                                        fontWeight:800,
                                        color: textItemBlack,
                                        paddingStart: 4,
                                        paddingTop: 6,
                                        paddingBottom: 5,
                                        textAlign: 'center',
                                    }}
                                    underlineSize={0}

                                    multiline={false}
                                    maxLength={1}
                                    //autoFocus={true}
                                    keyboardType="number-pad"
                                    returnKeyType="done"

                                />

                            </View>
                            <View style={{width:50,marginHorizontal:2,}} >
                                <FloatingLabelTextInput
                                    dir={'ltr'}
                                    autoFocus={this.state.focus==4}
                                    style={{ borderColor: gr5,borderWidth:2,paddingVertical:5, borderRadius:8,backgroundColor:bgWhite}}
                                    //placeholder=""
                                    value={this.state.code4}
                                    onChangeText={text => {
                                        text = mapNumbersToEnglish(text);
                                        this.setState({ code4:text, code3Validation: true,focus:5});
                                    }}
                                    numberOfLines={1}
                                    tintColor={
                                        this.state.code1Validation ? placeholderTextColor : lightRed
                                    }
                                    textInputStyle={{
                                        fontFamily: 'IRANYekanFaNum-Bold',
                                        fontSize: 20,
                                        fontWeight:800,
                                        color: textItemBlack,
                                        paddingStart: 4,
                                        paddingTop: 6,
                                        paddingBottom: 5,
                                        textAlign: 'center',
                                    }}
                                    underlineSize={0}

                                    multiline={false}
                                    maxLength={1}
                                    //autoFocus={true}
                                    keyboardType="number-pad"
                                    returnKeyType="done"

                                />

                            </View>

                        </View>
                        <TouchableOpacity
                            style={{
                                marginTop:15,
                                borderColor: gr5,
                                borderWidth:1,
                                padding:10,
                                paddingTop:10,
                                paddingHorizontal:30,
                                borderRadius:6,
                                alignItems:'center',
                                justifyContent:'center',

                            }}
                            onPress={() =>this.registerPhone()}
                        >
                            <Text style={{fontSize:20,color:gr1,fontWeight:500}}>Confirm</Text>
                        </TouchableOpacity>
                    </View>


                    {this.state.invitationLink &&(
                        <View>
                            <Text
                                style={{
                                    marginTop:10,
                                    fontSize:16,
                                    fontWeight:800,
                                    fontFamily: 'IRANYekanFaNum-Bold',
                                    color:gr3
                                }}>
                                ثبت نام شما با موفقیت انجام شد. با کد دعوت زیر می توانید از دوستان خود دعوت کنید تا شاخه درخت شما شوند.
                            </Text>
                            <Text
                                style={{
                                    marginTop:10,
                                    fontSize:16,
                                    fontWeight:800,
                                    fontFamily: 'IRANYekanFaNum-Bold',
                                    color:gr3
                                }}>
                                {this.state.invitationLink}
                            </Text>
                        </View>
                    )}

                </View>

            </ResponsiveLayout>


        )
    }

}


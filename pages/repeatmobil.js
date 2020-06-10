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
    borderSeparate
} from "../src/constants/colors";
import {View, TouchableOpacity, Text, Image, Platform,} from "../src/react-native";
import FloatingLabelTextInput from "../src/components/FloatingLabelTextInput";
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import {postQuery, saveEntity} from "../dataService/dataService";
import {ListDialogPopUp} from "../src/components";
//import Pagination from 'docs/src/modules/components/Pagination';
//const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

export default class Repeatmobil extends Component {
    constructor() {
        super();
        this.state = {
            showMenu:false,
            isWide:false,
            mobileValidation:false,
            countryCode:'+98',
            invitationLink:'',
            repeateMobileValidation:true

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
        console.log(this.user);
        if(!this.state.mobile){
            this.setState({mobileValidation: false});
            return translate('شماره موبایل خود را مجددا وارد کنید.')
        }
        if (this.state.mobile.length < 10) {
            this.setState({mobileValidation: false});
            return translate('the_number_of_mobile_is_not_valid');
        }

        const mobileReg = /^9[0-9]{9}$/i
        if (!mobileReg.test(this.state.mobile)){
            //this.setState({mobileValidation: false});
            return translate('invalid_mobile_number'); ;
        }

        if(this.user.mobile!==this.state.countryCode+this.state.mobile){
            this.setState({mobileValidation: false,repeateMobileValidation:false});
            return translate('شماره موبایل و تکرار آن یکی نیست')
        }

    }
    registerPhone(){

        const msg=this.checkValidation();
        if(msg){
            showMassage(msg,'info')
            return;
        }

        const data=this.user;

        postQuery('Members/me/register',data)
            .then(res=>{
                console.log(res);
                this.next();
            })
            .catch(err=>{
                console.log('errrrrrrrrrrrrrr=',err);
                if(err.code==142){
                    this.setState({registerBefore:true})
                }
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
                            {translate("جهت اطمینان، شماره موبایل خود را مجددا وارد کنید. شماره موبایل سند مالکیت شبکه شماست. در صورتی که عمدا یا اشتباها شماره فرد دیگری را وارد کنید، به محض ورود آن شخص به تری نت و اثبات مالکیت از طریق تایید پیامکی، شما مالکیت شبکه خود را از دست داده و شبکه شما به شماره او منتقل میشود.")}
                        </Text>

                         <View dir={"ltr"} style={{flexDirection:'row',marginTop:10,borderColor: gr5,borderWidth:2, borderRadius:8,backgroundColor:bgWhite,}}>
                            <Text style={{
                                fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum' : 'IRANYekanRegular(FaNum)',
                                fontSize: 16,
                                color: border,

                                padding:5,
                                alignSelf: 'center',
                            }}>{this.state.countryCode}</Text>
                            <FloatingLabelTextInput
                                dir={'ltr'}
                                style={{flex:1,paddingHorizontal:5,paddingVertical:5,paddingTop:7}}
                                placeholder={translate("شماره موبایل خود را مجددا وارد کنید.")}
                                value={this.state.mobile}
                                onChangeText={text => {
                                    if(text.length>1 && text.indexOf(0)==0){
                                        text=text.substring(1);
                                    }
                                    text = mapNumbersToEnglish(text);
                                    this.setState({ mobile:text, mobileValidation: true,});
                                }}
                                onFocus={()=>this.setState({repeateMobileValidation:true})}
                                numberOfLines={1}
                                tintColor={
                                    this.state.currentPriceValidation ? placeholderTextColor : lightRed
                                }
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

                        <TouchableOpacity
                            style={{
                                flex:1,
                                marginTop:15,
                                borderColor: gr5,
                                borderWidth:1,
                                padding:0,
                                paddingTop:0,
                                borderRadius:12,
                                alignItems:'center',
                                justifyContent:'center',
                            }}
                            onPress={() =>this.registerPhone()}
                        >
                            <Text style={{fontSize:16,color:gr1,fontWeight:500,paddingVertical:12}}>{translate('confirm')}</Text>
                        </TouchableOpacity>
                        {(!this.state.repeateMobileValidation ||this.state.registerBefore) &&(
                            <TouchableOpacity
                                style={{
                                    flex:1,
                                    marginTop:15,
                                    borderColor: gr5,
                                    borderWidth:1,
                                    padding:0,
                                    paddingTop:0,
                                    borderRadius:12,
                                    alignItems:'center',
                                    justifyContent:'center',
                                }}
                                onPress={() =>this.perevius()}
                            >
                                <Text style={{fontSize:16,color:gr1,fontWeight:500,paddingVertical:12}}>{translate('اصلاح شماره مرحله قبل')}</Text>
                            </TouchableOpacity>
                        )
                        }


                    </View>
                </View>
            </ResponsiveLayout>
        )
    }


}



import React, {Component} from 'react';
import {persistStore} from "../src/stores";
import ResponsiveLayout from "../src/components/layouts/ResponsiveLayout";
import translate from "../src/language/translate";
import {doDelay, mapNumbersToEnglish, navigation, showMassage,} from "../src/utils";
import images from "../public/static/assets/images";
import {Image, Platform, Text, TouchableOpacity, View,} from "../src/react-native";
import FloatingLabelTextInput from "../src/components/FloatingLabelTextInput";

import {postQuery,} from "../dataService/apiService";
import LoadingPopUp from "../src/components/LoadingPopUp";
import {bgScreen, bgWhite, border, bgSuccess, orange1, textItemBlack} from "../src/constants/colors";
//import SwipeableViews from 'react-swipeable-views';
//import { autoPlay } from 'react-swipeable-views-utils';
//import Pagination from 'docs/src/modules/components/Pagination';
//const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

export default class FastRegister extends Component {
    constructor() {
        super();
        this.state = {
            countryCode:'+98',
            invitationLink:'',
            mobile:'',
            email:''
        };
    }

    componentDidMount() {
        doDelay(30)
            .then(()=>{
                this.user= navigation.getParam('user');
            })
    }
    isValid() {
        return mobileValidation;
    }
    checkValidation() {
        if(!this.state.mobile && !this.state.email){
            this.setState({mobileValidation: false});
            return translate('fastRegister_atleast_fill_one')
        }
        if (this.state.mobile && this.state.mobile.length < 10) {
            this.setState({mobileValidation: false});
            return translate('the_number_of_mobile_is_not_valid');
        }

        const mobileReg = /^9[0-9]{9}$/i;
        if (this.state.mobile && !mobileReg.test(this.state.mobile)){
            //this.setState({mobileValidation: false});
            return translate('invalid_mobile_number'); ;
        }

        const emailReg = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/
        if (this.state.email && !emailReg.test(this.state.email)){
            //this.setState({emailReg: false});
            return translate('fastRegister_invalid_email_format');
        }

    }
    registerPhone(){
        const msg=this.checkValidation();
        if(msg){
            showMassage(msg,'info')
            return;
        }
        const user={};
        if(this.state.mobile){
            user.mobile=this.state.countryCode+this.state.mobile;
        }
        if(this.state.email){
            user.email=this.state.email;
        }
        user.regentCode=this.user.regentCode;
        this.setState({loading:true});
        postQuery('Members/me/register',user)
            .then(res=>{
                this.nextPage(res);
                this.setState({loading:false});
            })
            .catch(err=>{
                if(err.key=='mobile_was_verified_before'){
                    this.setState({registerBefore:true})
                }
                this.setState({loading:false});
            })

    }
    nextPage(res){
        navigation.navigate('registerPassword', {
            user: res,
        });
    }

    render() {
        //const { height, width } = useWindowDimensions();

        return (

            <ResponsiveLayout title={`Treenetgram`} style={{margin: 0}}>
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

                    <View id='form' style={{width:'100%',maxWidth:500,marginTop:40}}   >
                        <Text
                            style={{
                                alignItems: 'center',
                                marginTop: 2,
                                fontSize:12,
                                fontFamily: 'IRANYekanFaNum-Bold',
                                textAlign: 'justify',
                                color: bgSuccess,
                            }}>
                            {translate('fastRegister_desc')}
                        </Text>
                        <Text
                            style={{
                                marginTop: 10,
                                fontSize:14,
                                fontWight: 800,
                                fontFamily: 'IRANYekanFaNum-Bold',
                                color: bgSuccess,
                            }}>
                            {translate('fastRegister_atleast_fill_one_down')}
                        </Text>
                        <View dir={"ltr"} style={{
                            flexDirection: 'row',
                            marginTop: 10,
                            borderColor: orange1,
                            borderWidth: 2,
                            borderRadius: 8,
                            backgroundColor: bgWhite,
                        }}>
                            <Text style={{
                                fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum' : 'IRANYekanRegular(FaNum)',
                                fontSize:14,
                                color: border,

                                padding: 5,
                                alignSelf: 'center',
                            }}>{this.state.countryCode}</Text>
                            <FloatingLabelTextInput
                                dir={'ltr'}
                                reverse={persistStore.isRtl}
                                style={{flex:1,paddingHorizontal:5,paddingVertical:5,paddingTop:7}}
                                placeholder={translate("fastRegister_mobile_number")}
                                value={this.state.mobile}
                                onChangeText={text => {
                                    if(text.length>1 && text.indexOf(0)==0){
                                        text=text.substring(1);
                                    }

                                    const acceptReg =/^[0-9~.]+$/;
                                    const mobileReg = /^9[0-9]{9}$/i;
                                    if(acceptReg.test(text)){
                                        text = mapNumbersToEnglish(text);
                                        this.setState({ mobile:text, mobileValidation:mobileReg.test(text)});
                                    }else{
                                        showMassage(translate('fastRegister_onlyEnglish_number'),'info');
                                    }
                                    if(!text){
                                        this.setState({ mobile:'', mobileValidation:false});
                                    }

                                }}
                                numberOfLines={1}
                                isAccept={this.state.mobileValidation}
                                textInputStyle={{
                                    fontFamily: 'IRANYekanFaNum-Bold',
                                    fontSize:14,
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
                        <View dir={"ltr"} style={{
                            flexDirection: 'row',
                            marginTop: 10,
                            borderColor: orange1,
                            borderWidth: 2,
                            borderRadius: 8,
                            backgroundColor: bgWhite,
                        }}>

                            <FloatingLabelTextInput
                                dir={'ltr'}
                                reverse={persistStore.isRtl}
                                style={{flex: 1, paddingHorizontal: 5, paddingVertical: 5, paddingTop: 7}}
                                placeholder={translate("fastRegister_email_address")}
                                value={this.state.email}
                                onChangeText={text => {
                                    const acceptReg = /^[a-zA-Z0-9~@.]+$/;
                                    const emailReg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                    if(acceptReg.test(text)){
                                        this.setState({ email:text, emailValidation:emailReg.test(text)});
                                    }else{
                                        showMassage(translate('fastRegister_only_english_number_special_charachter'),'info');
                                    }
                                    if(!text){
                                        this.setState({ email:'', emailValidation:false});
                                    }
                                }}
                                numberOfLines={1}

                                isAccept={this.state.emailValidation}
                                textInputStyle={{
                                    fontFamily: 'IRANYekanFaNum-Bold',
                                    fontSize:14,
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

                        <TouchableOpacity
                            style={{
                                flex: 1,
                                marginTop: 15,
                                borderColor: orange1,
                                borderWidth: 1,
                                padding: 0,
                                paddingTop: 0,
                                borderRadius: 12,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onPress={() =>this.registerPhone()}
                        >
                            <Text style={{
                                fontSize:14,
                                color: bgSuccess,
                                fontWeight: 500,
                                paddingVertical: 12
                            }}>{translate('confirm')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <LoadingPopUp
                    visible={this.state.loading}
                    message={this.state.loadingMessage || translate('...')}
                />
            </ResponsiveLayout>
        )
    }

}



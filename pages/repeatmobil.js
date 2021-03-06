import React, {Component} from 'react';
import {userStore} from "../src/stores";
import Router from "next/router";
import ResponsiveLayout from "../src/components/layouts/ResponsiveLayout";
import translate from "../src/language/translate";
import {doDelay, mapNumbersToEnglish, navigation, showMassage,} from "../src/utils";
import images from "../public/static/assets/images";
import {Image, Platform, Text, TouchableOpacity, View,} from "../src/react-native";
import FloatingLabelTextInput from "../src/components/FloatingLabelTextInput";
import {postQuery} from "../dataService/apiService";
import LoadingPopUp from "../src/components/LoadingPopUp";
import {bgScreen, bgWhite, border, bgSuccess, orange1, textItemBlack,} from "../src/constants/colors";
//import Pagination from 'docs/src/modules/components/Pagination';
//const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

export default class Repeatmobil extends Component {
    constructor() {
        super();
        this.state = {
            showMenu:false,
            isWide:false,
            repeateMobileValidation:false,
            repeateEmailValidation:false,
            repeateMobileValidation2:true,
            repeateEmailValidation2:true,
            countryCode:'+98',
            invitationLink:'',


        };
    }
    componentDidMount() {
        doDelay(30)
            .then(()=>{
                this.user= navigation.getParam('user');
                this.setState({run:1})
            })

    }
    next(res){
        this.user.id=res.id;
        navigation.navigate('registerPassword', {
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
        return repeateMobileValidation;
    }
    checkValidation() {

        if(this.user.mobile && this.user.mobile!==this.state.countryCode+this.state.mobile){
            this.setState({repeateMobileValidation: false,repeateMobileValidation2: false});
            return translate('شماره موبایل وارد شده با شماره موبایل مرحله قبل مساوی نیست')
        }
        if(this.user.email && this.user.email!==this.state.email){
            this.setState({repeateEmailValidation: false,repeateEmailValidation2: false});
            return translate('ایمیل وارد شده با ایمیل مرحله قبل مساوی نیست')
        }

    }
    registerPhone(){

        const msg=this.checkValidation();
        if(msg){
            showMassage(msg,'info')
            return;
        }

        const data=this.user;

        this.setState({loading:true});
        postQuery('Members/me/register',data)
            .then(res=>{
                console.log('res===========',res);
                this.next(res);
            })
            .catch(err=>{
                if(err.key=='mobile_was_verified_before'){
                    this.setState({registerBefore:true})
                }
            })
            .finally(()=>{
                this.setState({loading:false});
            })
    }

    render() {
       if(!this.user){
           return null;
       }
        return (
            <ResponsiveLayout title={`Treenetgram`}  loading={this.state.loading} loadingMessage={this.state.loadingMessage} run={this.state.run}  style={{margin:0}}>
                <View
                    style={{flex: 1, backgroundColor: bgScreen, alignItems: 'center', padding: 10, paddingTop: '5%',}}>
                    <Image
                        source={images.tree}
                        style={{maxWidth: '25%', maxHeight: '24%',}}
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

                    <View id='form' style={{width:'100%',maxWidth:500,marginTop:30}}   >
                         {/* <Text style={{ textAlign:'center', marginTop:30,fontSize:12,color:bgWhite}}>{translate("for_start_enter_your_phone_number")}</Text>*/}
                        <Text
                            style={{
                                alignItems: 'center',
                                marginTop: 2,
                                fontSize:12,
                                fontFamily: 'IRANYekanFaNum-Bold',
                                textAlign: 'justify',
                                color: bgSuccess,

                            }}>
                            {translate("جهت اطمینان از صحت ورود اطلاعات در مرحله قبل، اطلاعات تماس خود را مجددا وارد کنید. ")}
                        </Text>


                        {this.user.mobile &&(
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
                                    style={{flex:1,paddingHorizontal:5,paddingVertical:5,paddingTop:7}}
                                    placeholder={translate("شماره موبایل خود را مجددا وارد کنید.")}
                                    value={this.state.mobile}
                                    onChangeText={text => {
                                        if(text.length>1 && text.indexOf(0)==0){
                                            text=text.substring(1);
                                        }
                                        const mobileReg = /^9[0-9]{9}$/i;
                                        text = mapNumbersToEnglish(text);
                                        this.setState({ mobile:text, repeateMobileValidation: this.user.mobile==this.state.countryCode+text ,});
                                    }}
                                    numberOfLines={1}
                                    isAccept={this.state.repeateMobileValidation}
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
                        )}

                        {this.user.email &&(
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
                                    style={{flex: 1, paddingHorizontal: 5, paddingVertical: 5, paddingTop: 7}}
                                    placeholder={translate("ایمیل خود را مجددا وارد کنید.")}
                                    value={this.state.email}
                                    onChangeText={text => {
                                        this.setState({email: text, repeateEmailValidation: this.user.email == text,});
                                    }}
                                    onFocus={() => this.setState({repeateEmailValidation: true})}
                                    numberOfLines={1}
                                    isAccept={this.state.repeateEmailValidation}
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
                        )}


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
                        {(!this.state.repeateMobileValidation2 || !this.state.repeateEmailValidation2 || this.state.registerBefore) &&(
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
                                onPress={() =>this.perevius()}
                            >
                                <Text style={{
                                    fontSize:14,
                                    color: bgSuccess,
                                    fontWeight: 500,
                                    paddingVertical: 12
                                }}>{translate('اصلاح اطلاعات مرحله قبل')}</Text>
                            </TouchableOpacity>
                        )
                        }




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



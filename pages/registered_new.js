import React, {Component} from 'react';
import ResponsiveLayout from "../src/components/layouts/ResponsiveLayout";
import translate from "../src/language/translate";
import {doDelay, mapNumbersToEnglish, navigation, showMassage,} from "../src/utils";
import images from "../public/static/assets/images";
import {
    bg1,
    bgScreen,
    bgWhite,
    border,
    lightGrey,
    orange1,
    primaryDark,
    textItem,
    textItemBlack
} from "../src/constants/colors";
import {Image, Platform, Text, TouchableOpacity, View,} from "../src/react-native";
import {loginApi} from "../dataService/apiService";
import LoadingPopUp from "../src/components/LoadingPopUp";
import Router from "next/router";
import FloatingLabelTextInput from "../src/components/FloatingLabelTextInput";
import {persistStore} from "../src/stores";


export default class registered_new extends Component {
    constructor() {
        super();
        this.state = {
            countryCode:'+94',
        };
    }

    componentDidMount() {
        doDelay(100)
            .then(() => {
                this.user = navigation.getParam('user');
                debugger;
                console.log('new user',this.user);
                if(this.user){
                    debugger
                    this.setState({countryCode:this.user.geoInfo.calling_code,username:this.user.username,password:this.user.tempPassword})
                }

            })

    }
    onSuccessLogin=(user)=>{
        global.width=null;

        //Router.replace('/mypage');
       navigation.navigate('/registerPassword');
    }
    login() {
        this.setState({loading: true});
        this.setState({loading:true});
        debugger
        loginApi(this.state.username,this.state.password,this.state.mobile)
            .then(res=>{
                console.log(res);
                this.onSuccessLogin(res);

                this.setState({loading:false});
            })
            .catch(err=>{
                this.setState({loading:false});
            })
    }

    nextPage() {
        navigation.navigate('registerPassword', {
            user: this.user,
        });
    }

    render() {
        //const { height, width } = useWindowDimensions();

        return (

            <ResponsiveLayout title={`Treenetgram`} loading={this.state.loading} loadingMessage={this.state.loadingMessage} style={{margin: 0}}>
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

                    <View id='form'
                          style={{
                              width: '100%',
                              alignItems:'center',
                              maxWidth: 500,
                              marginTop: 3,
                              padding: 16,
                          }}>
                        {/* <Text style={{ textAlign:'center', marginTop:30,fontSize:14,color:bgWhite}}>{translate("for_start_enter_your_phone_number")}</Text>*/}
                        <Text
                            style={{
                                alignItems: 'center',
                                marginTop: 2,
                                fontSize: 14,
                                fontFamily: 'IRANYekanFaNum-Bold',
                                textAlign: 'justify',
                                color: bg1,

                            }}>
                            {/*{translate(" شبکه درختی شما با نام کاربری و رمز عبور موقتی زیر ساخته شد. لطفا بعد از ورود نام کاربری و رمز عبور موقت خود را تغییر دهید.")}*/}
                            {translate("شماره موبایل خود را وارد کنید.")}
                        </Text>
                    <View style={{
                        width: '100%',
                        maxWidth:350,
                        alignSelf:'center',
                        borderWidth: 1,
                        borderColor: orange1,
                        borderRadius: 12,
                        marginTop: 30,
                        padding: 10,
                        borderStyle: 'dotted',
                        paddingVertical: 20,
                    }}>
                        {/*<View
                            style={{
                                flexDirection: 'row',

                            }}
                        >
                            <Text
                                style={{
                                    alignItems: 'center',
                                    marginTop: 2,
                                    fontSize: 14,
                                    fontFamily: 'IRANYekanFaNum',
                                    textAlign: 'justify',
                                    color: bg1,

                                }}>
                                {translate("نام کاربری شما:")}
                            </Text>
                            <Text
                                style={{
                                    alignItems: 'center',
                                    marginTop: 2,
                                    fontSize: 16,
                                    fontWeight: 800,
                                    paddingHorizontal: 10,
                                    fontFamily: 'IRANYekanFaNum-Bold',
                                    color: primaryDark,

                                }}>
                                {this.state.username}
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: 10,

                            }}
                        >
                            <Text
                                style={{
                                    alignItems: 'center',
                                    fontSize: 14,
                                    fontFamily: 'IRANYekanFaNum',
                                    textAlign: 'justify',
                                    color: bg1,

                                }}>
                                {translate("رمز عبور شما:")}
                            </Text>
                            <Text
                                style={{
                                    alignItems: 'center',
                                    fontSize: 16,
                                    fontWeight: 800,
                                    paddingHorizontal: 10,
                                    fontFamily: 'IRANYekanFaNum-Bold',
                                    color: primaryDark,

                                }}>
                                {this.state.password}
                            </Text>
                        </View>*/}
                        <View dir={"ltr"} style={{
                            flexDirection: 'row',
                            marginTop: 10,
                            borderColor: orange1,
                            borderWidth: 2,
                            borderRadius: 8,
                            backgroundColor: bgWhite,
                            alignItems:'center'
                        }}>
                            <Text style={{
                                fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum' : 'IRANYekanRegular(FaNum)',
                                fontSize: 16,
                                padding: 5,
                                alignSelf: 'center',
                                marginHorizontal:5,
                            }}>+</Text>
                            <FloatingLabelTextInput
                                dir={'ltr'}
                                reverse={persistStore.isRtl}
                                style={{width:15,paddingHorizontal:3,paddingVertical:5,paddingTop:7}}
                                placeholder={translate("کد")}
                                value={this.state.countryCode}

                                onChangeText={text => {
                                    text = mapNumbersToEnglish(text);
                                    debugger
                                    if(isNaN(Number(text))){
                                        this.setState({ countryCode:''});
                                    }else{
                                        this.setState({ countryCode:text});
                                    }

                                }}
                                numberOfLines={1}
                                //isAccept={this.state.countryCode}
                                textInputStyle={{
                                    fontFamily: 'IRANYekanFaNum-Bold',
                                    fontSize: 14,
                                    fontWeight:800,
                                    color: textItemBlack,
                                    paddingStart: 4,
                                    paddingTop: 1,
                                    paddingBottom: 10,
                                    //textAlign: 'left',
                                }}
                                underlineSize={0}

                                multiline={false}
                                maxLength={2}
                                //autoFocus={true}
                                keyboardType="number-pad"
                                returnKeyType="done"

                            />
                           <View style={{width:1,height:20,backgroundColor:lightGrey}}/>
                            <FloatingLabelTextInput
                                dir={'ltr'}
                                autoFocus={true}
                                reverse={persistStore.isRtl}
                                style={{flex:1,width:'100%',paddingHorizontal:5,paddingEnd:6, paddingVertical:5,paddingTop:7}}
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
                                    }else if(text){
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
                                marginTop: 20,
                                //borderColor: orange1,
                                backgroundColor: orange1,
                                //borderWidth: 1,
                                width: 200,
                                paddingTop: 0,
                                borderRadius: 8,
                                maxWidth: 300,
                                alignSelf:'center',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            disabled={!this.state.mobileValidation}
                            onPress={() => this.login()}
                        >
                            <Text style={{
                                fontSize: 16,
                                color: bgWhite,
                                fontWeight: 500,
                                paddingVertical: 8
                            }}>{translate('تایید')}</Text>
                        </TouchableOpacity>
                    </View>

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



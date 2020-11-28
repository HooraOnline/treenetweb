import React, {PureComponent} from 'react';
import {Animated, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from '../src/react-native';
import images from "../public/static/assets/images";
import {
    textItemBlack,
    bgScreen,
    border,
    bgSuccess,
    lightRed,
    primaryDark,
    subTextItem,
    textItem, textGray, orange1, bgWhite, lightGrey,
} from '../src/constants/colors';
import {globalState, persistStore,} from '../src/stores';
import {getWidth, mapNumbersToEnglish, showMassage,} from '../src/utils';
import {FloatingLabelTextInput, LoadingPopUp} from '../src/components';
import translate from "../src/language/translate";
import {LNGList} from "../src/language/aaLngUtil";
import Router from 'next/router'
import BaseLayout from "../src/components/layouts/BaseLayout";
import LinearProgress from "@material-ui/core/LinearProgress";
import {IoMdEye, IoMdEyeOff} from "react-icons/io";
import {loginApi} from "../dataService/apiService";

const loginInput = [];
export default class LoginPage extends PureComponent {
    constructor(props) {
        super(props);
        //StatusBar.setTranslucent(true);
        globalState.changeStatusBarColor('rgba(255,255,255,0)');
        this.topPosition = (global.height / 7) * 2;
        this.animatedHeight = new Animated.Value(global.height);
        this.animatedWidth = new Animated.Value(global.width);
        this.animatedBorderRadius = new Animated.Value(0);
        this.animatedLogoSize = new Animated.Value(120);
        this.animatedLogoPosition = new Animated.Value(this.topPosition);
        this.animatedLoginOpacity = new Animated.Value(0);
        this.state = {
            haveNewVersion: false,
            newVersionUrl: null,
            username: '',
            usernameValidation: true,

            password: '',
            passwordValidation: true,


            showLogin: false,
            showPassword: false,
            language: LNGList[0],
            languageIndex: LNGList[0].index,
            loading:false,
            vpn:true,
            countryCode:"98",
        };
    }
    async componentDidMount() {
        this.setState({
            progressWidth: getWidth() - 50,
            boxWidth: getWidth() > 500 ? 400 : getWidth() - 50,
            bgImage: getWidth() > 600 ? images.bg_loginweb : images.bg_login
        });
        this.getUserGeo();
        this.showLogin();
    }

    getUserGeo(){
        let self=this;
        self.setState({loadingGeo:true});
        let vpn=false;
        $.getJSON('https://api.ipdata.co/?api-key=92c9cd9137ca4bd296e2a749b8cd3a7908cb960766c10013cd108f26', function(data) {
            self.geoInfo=data
            
            let countryCode=self.geoInfo.calling_code;
            if( countryCode!=='98'){
                vpn=true;
            }else{
                vpn=false;
            }
            self.setState({countryCode: countryCode ,vpn:vpn});
        })
        .done(function(res) { console.log(res)})
        .fail(function(e) { 
            //vpn=true;
        })
        .always(function() {self.setState({loadingGeo:false}) });
       
 
    }
    showLogin() {
        setTimeout(() => {
            //this.animatedSplash();
            this.setState({showLogin: true});
        }, 1500);
    }
    keyPress=(e)=>{
        if(e.keyCode === 13){
            this.onLogin()
        }
    }

    checkValidation() {
        return this.state.username.length >2  && this.state.password.length >5;
    }

    onSuccessLogin=(user)=>{
        global.width=null;//reset new panel width
        Router.replace('/mypage');
    }

    async onLogin() {
        if(this.state.countryCode.length <1  || this.state.password.length<6){
            return ;
        }
        this.setState({loading: true});
        const data={};
        this.setState({loading:true});
        const userName=this.state.countryCode+this.state.username;
        loginApi(userName,this.state.password)
            .then(res=>{
                this.onSuccessLogin(res);
                this.setState({loading:false});
            })
            .catch(err=>{

                this.setState({loading:false});
            })
    }

    render() {
        if (!this.state.showLogin) {
            return (
                <BaseLayout title={'لاگین'} loading={this.state.loading} loadingMessage={this.state.loadingMessage} maxWidth={'100%'} style={{
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '100% auto',
                    backgroundPosition: 'center top',
                    backgroundAttachment: 'fixed',
                    justifyContent: 'center',
                    backgroundImage: "url(" + this.state.bgImage + ")",
                }}>minHeight: '100%',

                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        backgroundPosition: "top center",
                    }}>
                        <ScrollView
                            // keyboardDismissMode='on-drag'
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={this.state.showLogin}
                            style={{
                                flexGrow: 0,
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                //backgroundColor: 'rgba(255,255,255,.8)',
                            }}>
                            <View
                                style={{
                                    width: this.state.boxWidth,
                                    borderRadius: 30,//this.animatedBorderRadius,
                                    backgroundColor: 'rgba(255,255,255,.8)',
                                    marginTop: 0,
                                    justifyContent: 'center',
                                    position: 'relative'
                                }}>
                                <View
                                    style={[styles.logoContainer, {
                                        marginTop: 0,// this.animatedLogoPosition,
                                        position: 'absolute',
                                        top: -60,
                                    }]}>
                                    <Image source={images.logo} style={{
                                        width: 100,
                                        height: 100,
                                    }}/>

                                </View>
                                <Text style={{
                                    paddingTop: 100,
                                    fontWeight: 1000,
                                    fontSize: 25,
                                    alignSelf: 'center',
                                    color: bgSuccess,
                                    fontFamily: 'IRANYekan-ExtraBold'
                                }}>Treenetgram</Text>
                                <View
                                    style={{
                                        // position: 'absolute',
                                        //bottom:0,
                                        flex: 1,
                                        height: '100%',
                                        marginTop: 100,
                                    }}>

                                    <LinearProgress style={{width: this.state.progressWidth, maxWidth: 400}}
                                                    color="secondary"></LinearProgress>

                                    <Text
                                        style={{
                                            marginTop: 16,
                                            marginBottom: 16,
                                            textAlign: 'center',
                                            color: textItem,
                                        }}
                                    >{'نسخه ' + '1.0.0'}</Text>
                                </View>
                            </View>
                        </ScrollView>

                    </View>
                    <style jsx global>{`
                        .MuiLinearProgress-barColorSecondary {
                           background-color: ${primaryDark} !important;
                         }
                         .MuiLinearProgress-colorSecondary {
                                background-color: ${border} !important;
                            }
                    `}</style>
                </BaseLayout>
            )
        }
        return (

            <BaseLayout title={'لاگین'} maxWidth={'100%'} style={{
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% auto',
                backgroundPosition: 'center top',
                backgroundAttachment: 'fixed',
                backgroundImage: "url(" + this.state.bgImage + ")",
                justifyContent: 'center',
            }}>

                <ScrollView
                    // keyboardDismissMode='on-drag'
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={this.state.showLogin}
                    style={{
                        flexGrow: 0,
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <View
                        style={{
                            width: this.state.boxWidth,
                            borderRadius: 30,//this.animatedBorderRadius,
                            backgroundColor: 'rgba(255,255,255,.8)',
                            marginTop: 0,
                            position: 'relative',

                        }}>
                        <View
                            style={[styles.logoContainer, {
                                marginTop: 0,// this.animatedLogoPosition,
                                position: 'absolute',
                                top: -35,
                            }]}>
                            <Image source={images.logo} style={{
                                width: 70,//this.animatedLogoSize,
                                height: 70,// this.animatedLogoSize,
                            }}/>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                opacity: 1,// this.animatedLoginOpacity,
                            }}>
                            <View style={{
                                flex: 1,
                                margin: 24,
                            }}>
                                <Text style={{
                                    marginTop: 30,
                                    fontSize: 20,
                                    fontFamily: 'IRANYekanExtraBold',
                                    textAlign: 'center',
                                    color:textItemBlack,
                                }}>
                                    {translate('login_top')}
                                </Text>
                                <Text style={{
                                    marginTop: 6,
                                    marginBottom: 20,
                                    fontSize: 16,
                                    fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Light' : 'IRANYekanLight(FaNum)',
                                    textAlign: 'center',
                                }}>
                                    {
                                       /* translate('login_enter_your_user_name')*/
                                    }
                                </Text>
                                { this.state.vpn &&
                                    <Text
                                        style={{
                                            alignItems: 'center',
                                            marginBottom: 15,
                                            fontSize: 11,
                                            fontFamily: 'IRANYekanFaNum-Bold',
                                            textAlign: 'justify',
                                            color: orange1,

                                        }}>
                                        {/*{translate(" شبکه درختی شما با نام کاربری و رمز عبور موقتی زیر ساخته شد. لطفا بعد از ورود نام کاربری و رمز عبور موقت خود را تغییر دهید.")}*/}
                                        {translate(`اگر فیلتر شکن شما روشن است کد کشور(${this.state.countryCode}+) را اصلاح کنید.`)}
                                    </Text>
                                }

                          <View dir={"ltr"} 
                            style={{
                                flexDirection: 'row',
                                marginTop: 0, 
                            }}>

                            <Text style={{
                                fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum' : 'IRANYekanRegular(FaNum)',
                                fontSize: 16,
                               
                                alignSelf: 'center',
                                marginHorizontal:5,
                                marginBottom:0,
                            }}>+</Text>
                            <FloatingLabelTextInput
                                dir={'ltr'}
                                reverse={persistStore.isRtl}
                                style={{width:20,marginTop:4}}
                                placeholder={translate("کد")}
                                value={this.state.countryCode}

                                onChangeText={text => {
                                    text = mapNumbersToEnglish(text);

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
                                    fontSize: 12,
                                    fontWeight:800,
                                    color: textItemBlack,
                                    paddingStart: 4,
                                    paddingTop: 1,
                                    paddingBottom: 10,
                                    //textAlign: 'left',
                                }}
                                underlineSize={0}

                                multiline={false}
                                maxLength={3}
                                //autoFocus={true}
                                keyboardType="number-pad"
                                returnKeyType="done"

                            />
                           
                               <FloatingLabelTextInput
                                    refInput={input => loginInput[0] = input}
                                    dir={'ltr'}
                                    reverse={persistStore.isRtl}
                                    floatingLabelEnable={false}
                                    floatingOffsetX={0}
                                    floatingLabelFont={{color: textItem}}
                                    editable={true}
                                    multiline={false}
                                    maxLength={50}
                                    //keyboardType="numeric"
                                    returnKeyType="next"
                                    onSubmitEditing={() => loginInput[1].focus()}
                                    style={{textAlign: persistStore.isRtl ? 'right' : 'left',}}
                                    numberOfLines={1}
                                    maxLength={10}
                                    tintColor={
                                        this.state.usernameValidation ? textItem : lightRed
                                    }
                                    textInputStyle={{
                                        fontWeight: 'normal',
                                        fontFamily: Platform.OS === 'ios' ? 'IRANYekan-ExtraBold' : 'IRANYekanExtraBold',
                                        color: textItemBlack,
                                        fontSize: 14,
                                        paddingStart: 4,
                                        paddingTop: 1,
                                        paddingBottom: 3,
                                        textAlign:  'left',
                                    }}
                                    underlineSize={1}
                                    placeholder={translate('شماره موبایل')}

                                    style={{flex: 1}}
                                    onChangeText={text => {
                                       

                                        if(text.length>1 && text.indexOf(0)==0){
                                            text=text.substring(1);
                                        }
    
                                        const acceptReg =/^[0-9~.]+$/;
                                        const mobileReg = /^9[0-9]{9}$/i;
                                        text = mapNumbersToEnglish(text);
                                        if(acceptReg.test(text)){
                                            this.setState({ username:text,mobileIsRegister:false, usernameValidation:mobileReg.test(text)});
                                        }else if(text){
                                            showMassage(translate('fastRegister_onlyEnglish_number'),'info');
                                        }
                                        if(!text){
                                            this.setState({ username:'', usernameValidation:false});
                                        }

                                    }}
                                    highlightColor={primaryDark}
                                    value={this.state.username}
                                />

                           

                        </View>
                           
                                

                                <View
                                    style={{
                                        flexDirection: 'row',
                                        marginTop: 24,
                                        position:'relative',
                                    }}
                                >
                                    <FloatingLabelTextInput
                                        refInput={input => loginInput[1] = input}
                                        dir={'ltr'}
                                        reverse={persistStore.isRtl}
                                        type={this.state.showPassword ? 'text' : 'password'}
                                        floatingLabelEnable={false}
                                        floatingOffsetX={0}
                                        floatingLabelFont={{color: textItem}}
                                        editable={true}
                                        multiline={false}
                                        maxLength={100}
                                        onKeyDown={(e)=>this.keyPress(e)}
                                        keyboardType="default"
                                        returnKeyType="done"
                                        numberOfLines={1}
                                        tintColor={
                                            this.state.passwordValidation ? textItem : lightRed
                                        }
                                        textInputStyle={{
                                            fontWeight: 'normal',
                                            fontFamily: 'IRANYekan-ExtraBold',
                                            color: textItemBlack,
                                            fontSize: 14,
                                            paddingStart: 4,
                                            paddingTop: 1,
                                            paddingBottom: 3,
                                            textAlign: 'left',
                                        }}
                                        underlineSize={1}
                                        placeholder={
                                            translate('رمز ورود')
                                        }
                                        style={{flex: 1,paddingLeft:2}}
                                        onChangeText={text => {
                                            this.checkValidation();
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
                                        style={{position: 'absolute', start: 5, bottom:4}}
                                    >
                                        {
                                            this.state.showPassword ?
                                                <IoMdEye color={bgSuccess} size={24}/>
                                                : <IoMdEyeOff color={textItemBlack} size={24}/>
                                        }
                                    </TouchableOpacity>
                                </View>
                                
                            </View>

                            {this.state.loading &&
                            <LinearProgress style={{marginTop: 25, width: this.state.progressWidth - 10, maxWidth: 400}}
                                            color="secondary"></LinearProgress>
                            }
                            <TouchableOpacity
                                onPress={() => this.onLogin()}
                                style={{
                                    paddingVertical: 10,
                                    alignItems: 'center',
                                    borderWidth: 1,
                                    borderColor: subTextItem,
                                    borderRadius: 10,
                                    marginHorizontal: 24,
                                    marginTop: 10,
                                    marginBottom: 24,
                                    backgroundColor: this.checkValidation() ? primaryDark : 'transparent',
                                }}
                            >
                                <Text style={{
                                    fontSize: 16,
                                    fontFamily: Platform.OS === 'ios' ? 'IRANYekan-ExtraBold' : 'IRANYekanExtraBold',
                                    color: this.checkValidation() ? 'white' : subTextItem,
                                }}
                                >
                                    {
                                        translate('ورود')
                                    }
                                </Text>
                            </TouchableOpacity>
                           
                        </View>
                    </View>
                </ScrollView>
                <LoadingPopUp visible={this.state.loading} login={true} message="در حال بررسی و ورود ..."/>
                <style jsx global>{`
                        .MuiLinearProgress-barColorSecondary {
                           background-color: ${primaryDark} !important;
                         }
                         .MuiLinearProgress-colorSecondary {
                                background-color: ${border} !important;
                            }
                    `}</style>
            </BaseLayout>

        );
    }








}

const styles = StyleSheet.create({
    container: {},
    background: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        resizeMode: 'stretch',
        justifyContent: 'center',
        // marginBottom: 16,
    },
    logoContainer: {
        position: 'absolute',
        borderRadius: 25,
        padding:5,
        alignSelf: 'center',
        elevation: 7,
        shadowColor: textItemBlack,
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.5,
        backgroundColor: bgScreen
    },
    logo: {
        height: 60,
        width: 60,
    },
});

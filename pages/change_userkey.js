import React, {Component} from 'react';
import {persistStore, pStore, userStore} from "../src/stores";
import PanelLayout from "../src/components/layouts/PanelLayout";
import {SwitchTextMulti, Toolbar} from "../src/components";
import {getTabWidth, mapNumbersToEnglish, navigation, showMassage} from "../src/utils";
import images from "../public/static/assets/images";
import {
    bg1,
    textDisabled,
    bgWhite,
    border,
    bgSuccess,
    orange1,
    primaryDark,
    textItem,
} from "../src/constants/colors";
import {Image, Platform, Text, TouchableOpacity, View,} from "../src/react-native";
import translate from "../src/language/translate";
import {postQuery} from "../dataService/apiService";
import FloatingLabelTextInput from "../src/components/FloatingLabelTextInput";
import {IoMdEye, IoMdEyeOff} from "react-icons/io";

export default class change_password extends Component {
    constructor() {
        super();
        this.state = {
            password:'',
            showPassword:false,
            passwordValidation:false,
            passwor2dValidation:false,
            userKeyValidation:false,
            countryCode:userStore.countryCode,
            userKey:pStore.cUser.userKey,
           
          
        };

    }

    async componentDidMount() {

    }

    checkValidation() {
        if(this.state.userKeyReserved){
            this.setState({userKeyValidation: false});
            return translate('این نام کاربری قبلا گرفته شده است.');
        }
        if (!this.state.userKey ) {
            this.setState({userKeyValidation: false});
            return translate('registerPassword_enter_userKey');
        }
        if (this.state.userKey==persistStore.userKey) {
            this.setState({userKeyValidation: false});
            return translate('نام کاربری فعلی را عوض کنید.');
        }
        if (this.state.userKey.length<3) {
            this.setState({userKeyValidation: false});
            return translate('registerPassword_userKey_can_not_be_les_than');
        }
        this.setState({userKeyValidation: true});
    }
  
    updateuserKey=()=>{

        const msg=this.checkValidation();
        if(msg){
            showMassage(msg,'warning')
            return;
        }

        const data={
            userKey:this.state.userKey,
           
            showNotifAction:true,
        };
       

        this.setState({loading:true,loadingMessage:'در حال اجرا'});
        postQuery('Members/me/updateuserKey',data)
            .then(res=>{
                console.log(res);
                pStore.cUser.userKey=this.state.userKey;
                this.setState({loading:false});
                navigation.navigateTo(pStore.cUser.userKey);
                setTimeout(()=>showMassage('نام کاربری با موفقیت تغییر کرد.','success'),1000)
              
                
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
            title: 'تغییر نام کاربری',

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
                        onPress={this.updateuserKey}
                        disabled={!this.state.userKeyValidation}
                        style={{alignItems:'center',justifyContent:'center',padding:15, backgroundColor:this.state.userKeyValidation?primaryDark:textDisabled}}>
                        <Text style={{color:bgWhite}} >ذخیره</Text>
                    </TouchableOpacity>
                }>
                <View style={{flex:1,alignItems:'center',paddingHorizontal:13,paddingTop:10,}} >


                    <View id='form' style={{width:'100%',maxWidth:500,marginTop:3,}}   >

                        <Text
                            style={{
                                marginTop:16,
                                fontSize:12,
                                fontFamily: 'IRANYekanFaNum-Bold',
                                textAlign:'justify',
                            }}>
                            {translate("نام کاربری مشخصه منحصربفرد شما در ترینتگرام است. از این بخش می توانید  نام کاربری کنونی خود را به یک نام کاربری مناسب که بیشترین ارتباط را با شما یا کسب و کار شما دارد تغییر دهید.")}
                        </Text>
                        <Text
                            style={{
                                marginTop:16,
                                fontSize:12,
                                fontFamily: 'IRANYekanFaNum-Bold',
                                textAlign:'justify',
                            }}>
                            {translate("نام کاربری باید به انگلیسی باشد.البته از کاراکترهای نقطه و زیر خط (. _) و اعداد نیز می توانید استفاده کنید.")}
                        </Text>
                        <Text
                            style={{
                                marginTop:16,
                                fontSize:12,
                                fontFamily: 'IRANYekanFaNum-Bold',
                                textAlign:'justify',
                                color:textItem
                            }}>
                            {translate("مثال: ali.ahmadi_44")}
                        </Text>

                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: 50,
                                position:'relative',

                            }}
                        >
                            <FloatingLabelTextInput
                                ref={input => {
                                    this.labelInput = input;
                                }}
                                dir={'ltr'}
                                reverse={persistStore.isRtl}
                                placeholder={translate('نام کاربری')}
                                style={{flex: 1, marginTop: 10}}
                                labelStyle={{color: textItem, marginTop: -19}}
                                editable={true}
                                multiline={false}
                                maxLength={50}
                                floatingLabelEnable={true}
                                labelAlign={'left'}
                                keyboardType="default"
                                returnKeyType="done"
                                numberOfLines={1}
                                underlineSize={4}
                                underlineColor={this.state.userKeyValidation ? bgSuccess : primaryDark}
                                isAccept={this.state.userKeyValidation}
                                textInputStyle={{
                                    fontWeight: 'normal',
                                    fontFamily:'IRANYekanRegular',
                                    color: bg1,
                                    fontSize:12,
                                    paddingStart: 4,
                                    paddingTop: 1,
                                    paddingBottom: 3,
                                    //paddingLeft:35,
                                    textAlign: 'left',
                                }}

                                value={this.state.userKey}
                                onChangeText={ async (text) =>{
                                    const userKeyReg =/^[a-zA-Z0-9_.]+$/;
                                    text = mapNumbersToEnglish(text);
                                    if(text && !userKeyReg.test(text)){
                                        showMassage(translate('registerPassword_userKey_rule'),'warning');
                                        this.setState({
                                            userKeyValidation: false,
                                            userKey:this.state.userKey,
                                        })

                                        return;
                                    }

                                    const userKeyReg2 =/^\d+$/;
                                    if(text && userKeyReg2.test(text.substring(0,1))){
                                        showMassage(translate('registerPassword_userKey_rule2'),'warning');
                                        this.setState({
                                            userKeyValidation: false,
                                            userKey:'',
                                        })
                                        return;
                                    }
                                    if(text.length>2){
                                        this.setState({checkingPassword:true});
                                        postQuery('Members/me/checkuserKeyExist',{userKey:text,currentUserKey:userStore.userKey})
                                            .then((userKeyExist)=>{
                                                this.setState({userKeyReserved:userKeyExist,userKeyValidation:!userKeyExist});
                                            })
                                            .finally(()=>this.setState({checkingPassword:false}))

                                    }else{
                                        this.setState({userKeyValidation:false});
                                    }
                                    this.setState({
                                        userKey: text,
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
                        {this.state.userKeyReserved && pStore.cUser.userKey!=this.state.userKey && (
                            <Text style={{marginTop:4, color:primaryDark,fontSize:12}} >{translate('registerPassword_userKey_is_reserved')}</Text>
                        )
                        }

                        
                    </View>
                </View>
            </PanelLayout>
        )
    }

}



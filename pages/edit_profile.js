import React, {Component} from 'react';
import PanelLayout from "../src/components/layouts/PanelLayout";

import {
    doDelay,
    navigation,
    showMassage,
    getTabWidth, mapNumbersToEnglish
} from "../src/utils";
import images from "../public/static/assets/images";
import {
    placeholderTextColor,
    lightRed,
    gr10,
    gr3,
    gr8,
    gr9,
    gr5,
    gr1, gr2,
    primaryDark, gr4, bgWhite
} from "../src/constants/colors";
import {View, TouchableOpacity, Text, Image, Platform,} from "../src/react-native";
import {FloatingLabelTextInput, SwitchTextMulti, Toolbar} from "../src/components";
import {getUserProfileApi, postQuery, saveEntity} from "../dataService/apiService";
import translate from "../src/language/translate";
import LoadingPopUp from "../src/components/LoadingPopUp";
import {userStore} from "../src/stores";

export default class edit_profile extends Component {
    constructor() {
        super();
        this.state = {
            focus:1,
            invitationLink:'',
        };
    }
    componentDidMount() {

        this.getProfile();
    }
    getProfile(){

        getUserProfileApi()
            .then(user=>{
                this.setState({
                    username:user.username,
                    firstName:user.firstName,
                    lastName:user.lastName,
                    biarthDate:user.biarthDate,
                    profileImage:user.profileImage,
                    gender:user.gender,
                    age:user.biarthDate?new Date().getFullYear()-new Date(userStore.biarthDate).getFullYear():'',

                });
            })
            .catch(err=>{
                this.setState({loading:false});
            });
    }
    isValid() {
        return mobileValidation;
    }
    checkValidation=()=> {
        if(!this.state.firstName ){
            this.setState({firsNameValidation: false});
            return translate('enter_your_firstName');
        }
        if(!this.state.lastName ){
            this.setState({firsNameValidation: false});
            return translate('enter_your_lastName');
        }
        if(!this.state.age ){
            this.setState({ageValidation: false});
            return translate('enter_your_age');
        }
        if(!this.state.gender ){
            this.setState({genderValidation: false});
            return translate('select_your_gender');
        }

    }
    registerUserProps=()=>{
        const msg=this.checkValidation();
        if(msg){
            showMassage(msg,'info')
            return;
        }
        const data={
            firstName:this.state.firstName,
            lastName:this.state.lastName,
            age:this.state.age,
            gender:this.state.gender,
        }
        this.setState({loading:true});
        postQuery('Members/me/initProfile',data)
          .then(res=>{
              navigation.navigate('profile');
              this.setState({loading:false});
          })
          .catch(err=>{
              console.log(err);
              this.setState({loading:false});
          })
    }


    render() {
        const toolbarStyle = {
            start: {
                content: images.ic_back,
                onPress: ()=>navigation.goBack(),
            },
            title: 'ویرایش پروفایل',

        };
        return (
            <PanelLayout title={`Enter Confirm code`}   loading={this.state.loading} loadingMessage={this.state.loadingMessage}
                         style={{margin:0}}
                         header={
                             <Toolbar
                                 customStyle={toolbarStyle}
                                 isExpand={this.state.showAccountSelect }
                             />
                         }
                         footer={
                             <TouchableOpacity
                                 onPress={this.registerUserProps}
                                 style={{alignItems:'center',justifyContent:'center',padding:15, backgroundColor:primaryDark}}>
                                 <Text style={{color:bgWhite}} >ذخیره</Text>
                             </TouchableOpacity>
                         }>
            >
                <View style={{flex:1,alignItems:'center',padding:16,paddingTop:'5%',}} >

                    <View id='form' >
                        <Text
                            style={{
                                marginTop:20,
                                fontSize:16,
                                fontWeight:800,
                                fontFamily: 'IRANYekanFaNum-Bold',
                                color:gr3,
                                alignSelf:'center'
                            }}>
                           { translate('ویرایش پروفایل')}
                        </Text>

                        <View  style={{marginTop:10,  padding:10}}  >
                            <FloatingLabelTextInput
                                ref={input => {
                                    this.labelInput = input;
                                }}
                                placeholder={translate('firstName')}
                                style={{flex:1, marginTop:40}}
                                labelStyle={{color:gr3}}
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
                                    color: gr2,
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
                                placeholder={translate('lastName')}
                                style={{flex:1, marginTop:40}}
                                labelStyle={{color:gr3}}
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
                                    color: gr2,
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
                                placeholder={translate('age')}
                                style={{flex:1, marginTop:40}}
                                labelStyle={{color:gr3}}
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
                                    color: gr2,
                                    fontSize: 16,
                                    paddingStart: 4,
                                    paddingTop: 1,
                                    paddingBottom: 3,
                                    //textAlign: 'right',
                                }}
                                underlineSize={1}
                                value={this.state.age}
                                onChangeText={text =>{
                                    const reg=/^\d+$/;

                                    if(reg.test(text)){
                                        text = mapNumbersToEnglish(text);
                                        this.setState({
                                            age: text,
                                            ageValidation: true,
                                        })
                                    }else{

                                        this.setState({
                                            age: this.state.age?this.state.age:'',
                                        })
                                    }



                                }

                                }
                                tintColor={
                                    this.state.ageValidation ? placeholderTextColor : lightRed
                                }
                                highlightColor={primaryDark}
                                unit={translate('year')}
                                unitStyle={{color:gr4}}
                                keyboardType="number-pad"
                            />

                            <View style={{flex:1,alignItems:'center',marginTop:30}}>
                                <SwitchTextMulti
                                    style={{width:300}}
                                    activeIndex={this.state.gender}
                                    onActivate={val => {
                                        this.setState({gender: Number(val)});
                                        //this.checkValidation();
                                    }}
                                    data={[
                                        translate('onselect'),
                                        translate('man'),
                                        translate('woman'),
                                    ]}
                                    backgroundActive={primaryDark}
                                    backgroundInactive={'#fff'}
                                    itemWidth={getTabWidth(300, 3,1)}
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
            </PanelLayout>
        )
    }

}



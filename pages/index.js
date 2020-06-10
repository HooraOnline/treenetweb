import React, {Component} from 'react';
import {userStore,persistStore } from "../src/stores";
import Router from "next/router";
import ResponsiveLayout from "../src/components/layouts/ResponsiveLayout";
import {MenuItem, Select} from '@material-ui/core';
import translate from "../src/language/translate";
import {LNGList} from "../src/language/aaLngUtil";
import {
    deviceWide, getCookie,
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
import Link from "next/link";
//import Pagination from 'docs/src/modules/components/Pagination';
//const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

export default class Index extends Component {
    constructor() {
        super();
        this.state = {
            showMenu:false,
            isWide:false,
            mobileValidation:false,
            countryCode:'+98',
            invitationLink:'',
            languageIndex: LNGList[0].index,
        };
    }



    componentDidMount() {
        this.applyRTLfromUserLanguage();
        this.invitationCode=getUrlParameter('invitationCode');
    }
    checkValidation() {
        if (!this.invitationCode) {
            this.setState({invitationCodeValidation: false});
            return translate('required_invitationLink');
        }
    }
    nextPage(){
        const msg=this.checkValidation();
        if(msg){
            showMassage(msg,'info')
            return;
        }
        navigation.navigate('fastRegister', {
            user: {regentCode:this.invitationCode},
        });
    }
    async applyRTLfromUserLanguage() {
        let lng = getCookie('lng');
        if (lng) {
            global.slanguage = lng.key;
            global.isRtl = lng.rtl;
            this.setState({languageIndex: lng.index});

        }
    }

    async applyLanguage(lng) {
        global.slanguage = lng.key;
        global.isRtl = lng.rtl;
        this.setState({languageIndex: lng.index});
        saveCookie('lng', lng);

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

                    <View id='form' style={{width:'100%',paddingHorizontal:5,marginTop:10, paddingBottom:20, alignItems:'center'}}   >
                        <ListDialogPopUp
                            style={{
                                minWidth:150
                            }}
                            selectedItemStyle={{
                                backgroundColor:gr5,
                            }}
                            title={translate('Select_Your_Language')}
                            snake
                            items={LNGList}
                            selectedItem={this.state.languageIndex}
                            height={global.height/2}
                            validation={true}
                            searchField={"title"}
                            selectedItemCustom={
                                <View
                                    style={{
                                        color:gr10,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginHorizontal: 8,
                                        marginVertical: 8,


                                    }}>


                                    <Text
                                        style={{
                                            fontFamily:'IRANYekanFaNum-Bold',
                                            paddingTop:2,
                                        }}>
                                        {this.state.languageIndex!==undefined
                                            ? LNGList[this.state.languageIndex].title
                                            :translate('Select_Your_Language')}
                                    </Text>
                                </View>
                            }
                            onValueChange={item =>  this.applyLanguage(item, item.index)}
                            itemComponent={(item,index) =>{
                                return (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            paddingHorizontal: 8,
                                            alignItems: 'center',
                                            borderBottomWidth: 0.5,
                                            borderColor: borderSeparate,
                                        }}>

                                        <Text style={{paddingVertical: 16}}>
                                            {item.title}
                                        </Text>

                                    </View>
                                )
                            } }
                        />
                        <Text
                            style={{
                                alignItems:'center',
                                marginTop:25,
                                fontSize:17,
                                fontWeight:700,
                                fontFamily: 'IRANYekanRegular',
                                color:gr3,
                                marginBottom:5
                            }}>
                            {translate("from_local_power_to_global_power")}
                        </Text>
                        <Text
                            style={{
                                alignItems:'center',
                                marginTop:2,
                                fontSize:18,
                                fontWeight:800,
                                fontFamily: 'IRANYekanFaNum-Bold',
                                color:gr3,

                            }}>
                            {translate("make_your_global_network")}
                        </Text>
                        <View style={{padding:'4%',marginTop:25,}}>
                            <Text
                                style={{
                                    alignItems:'center',
                                    fontSize:16,
                                    fontFamily: 'IRANYekanRegular',
                                    color:gr3,
                                    textAlign:'justify',
                                    marginBottom:5
                                }}>
                                {
                                    translate('treenetDesl')
                                }
                            </Text>
                            <Text
                                style={{
                                    alignItems:'center',
                                    fontSize:16,
                                    fontFamily: 'IRANYekanRegular',
                                    color:gr3,
                                    textAlign:'justify',
                                    marginBottom:5
                                }}>
                                { translate('treenetDes2')}

                            </Text>
                            <Text
                                style={{
                                    alignItems:'center',
                                    fontSize:16,
                                    fontFamily: 'IRANYekanRegular',
                                    color:gr3,
                                    textAlign:'justify',
                                    marginBottom:5
                                }}>
                                { translate('treenetDes3')}

                            </Text>
                            <Text
                                style={{
                                    alignItems:'center',
                                    fontSize:16,
                                    fontFamily: 'IRANYekanRegular',
                                    color:gr3,
                                    textAlign:'justify',
                                    marginBottom:5
                                }}>
                                { translate('treenetDes4')}
                            </Text>

                            <Text
                                style={{
                                    alignItems:'center',
                                    fontSize:16,
                                    fontFamily: 'IRANYekanRegular',
                                    color:gr3,
                                    textAlign:'justify',

                                }}>
                                { translate('treenetDes5')}

                            </Text>

                            <Text
                                style={{
                                    alignItems:'center',
                                    marginTop:0,
                                    fontSize:16,
                                    fontFamily: 'IRANYekanRegular',
                                    textAlign:'justify',
                                    color:gr3,

                                }}>
                                { translate('treenetDes6')}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={{
                                flex:1,
                                marginTop:25,
                                borderColor: gr5,
                                borderWidth:1,
                                padding:0,
                                paddingTop:0,
                                borderRadius:12,
                                alignItems:'center',
                                justifyContent:'center',
                            }}
                            onPress={() =>this.nextPage()}
                        >
                            <Text style={{fontSize:16,color:gr1,fontWeight:500,paddingVertical:12, paddingHorizontal:20,}}>{translate('start_network')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ResponsiveLayout>
        )
    }

}



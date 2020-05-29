import React, {Component} from 'react';
import MainContent from "./home/MainContent";
import {userStore,persistStore } from "../src/stores";
import {permissionId} from '../src/constants/values';
import Router from "next/router";
import ResponsiveLayout from "../src/components/layouts/ResponsiveLayout";
import {DropDownList,Toolbar,CardUnitInfo,PopupBase,ImageSelector} from "../src/components";

import accountsStore from "../src/stores/Accounts";
import {deviceWide, inputNumberValidation, logger} from "../src/utils";
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
    gr10, gr3, gr8,gr9
} from "../src/constants/colors";
import accounting from "accounting";
import NavFooterButtons from "../src/components/layouts/footerButtons";
import NavBar from "../src/components/layouts/NavBar";
import {View, TouchableOpacity, Text, Image, Platform,} from "../src/react-native";
import FloatingLabelTextInput from "../src/components/FloatingLabelTextInput";
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
//import Pagination from 'docs/src/modules/components/Pagination';
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const HOME_TYPE = 1
export default class Main extends Component {
    constructor() {
        super();
        //globalState.changeStatusBarColor(primaryDark);
        //StatusBar.setTranslucent(false);

        this.state = {
            selected: HOME_TYPE,
            showAccountSelect: false,
            loadingBalance: false,
            showPasswordChangePopUp: false,
            anchorEl: null,
            showMenu:false,
            isWide:false,
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



    componentDidMount() {




    }

    registerPhone(){

    }

    render() {
        //const { height, width } = useWindowDimensions();

        return (

            <ResponsiveLayout title={`صفحه اصلی`}  style={{margin:0}}>
              {/*  <AutoPlaySwipeableViews  enableMouseEvents style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column', width:'100%',height:'30%',backgroundColor:gr10, }}>
                    <View style={{flex:1,alignItems:'center',padding:10,justifyContent:'center' }}>
                        <Image
                            source={images.tree}
                            style={{maxWidth: 120, maxHeight: 120,margin: 'auto'}}
                        />
                    </View>
                    <View style={{flex:1,alignItems:'center',padding:10,justifyContent:'center' }}>
                        <Image
                            source={images.tree}
                            style={{maxWidth: 120, maxHeight: 120,margin: 'auto'}}
                        />
                    </View>
                </AutoPlaySwipeableViews >*/}
                <View style={{flex:1,backgroundColor:gr9,alignItems:'center',padding:16,paddingTop:'5%',}} >
                    <Image
                        source={images.tree}
                        style={{maxWidth: '50%', maxHeight: '50%',}}
                    />
                    <Text
                        style={{
                            marginTop:20,
                            fontSize:20,
                            fontWeight:800,
                            fontFamily: 'IRANYekanFaNum-Bold',
                            color:gr3
                        }}>
                        Grow like a tree by
                    </Text>
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
                  {/*  <Text style={{marginTop:20,fontSize:14,color:bgWhite}}>Enter your phone number</Text>*/}
                    <FloatingLabelTextInput
                        dir={'ltr'}
                        placeholder="Enter your phone number"
                        onChangeText={text => {
                            this.setState({ phoneNumber:text, phoneValidation: true,});
                        }}
                        numberOfLines={1}
                        tintColor={
                            this.state.currentPriceValidation ? placeholderTextColor : lightRed
                        }
                        textInputStyle={{
                            fontWeight: 'normal',
                            fontFamily: 'IRANYekanFaNum-Bold',
                            fontSize: 20,
                            color: textItemBlack,
                            paddingStart: 4,
                            paddingTop: 1,
                            paddingBottom: 10,
                            //textAlign: 'left',
                        }}
                        underlineSize={0}
                        style={{marginTop:10,borderColor: border,borderWidth:1,paddingHorizontal:5,paddingVertical:5, borderRadius:8,backgroundColor:bgWhite}}
                        multiline={false}
                        maxLength={11}
                        autoFocus={true}
                        keyboardType="number-pad"
                        returnKeyType="done"
                        adornment={<Text dir={'ltr'} style={{
                            fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum' : 'IRANYekanRegular(FaNum)',
                            fontSize: 20,
                            color: border,
                            marginStart: 4,
                            alignSelf: 'center',
                            width:60,
                        }}>+98 </Text>}

                        value={this.state.phoneNumber}
                    />
                    <TouchableOpacity
                        style={{
                            marginTop:20,
                            borderColor: textGray,
                            borderWidth:1,
                            padding:10,
                            paddingTop:15,
                            paddingHorizontal:30,
                            borderRadius:6,
                            alignItems:'center',
                            justifyContent:'center',

                        }}
                        onPress={() =>this.registerPhone()}
                    >
                        <Text style={{fontSize:20,color:bgWhite,fontWeight:500}}>Build my Tree</Text>
                    </TouchableOpacity>

                </View>

            </ResponsiveLayout>


        )
    }

}



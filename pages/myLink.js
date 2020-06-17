import React, {Component} from 'react';
import {userStore,persistStore } from "../src/stores";
import {permissionId} from '../src/constants/values';
import Router from "next/router";
import PanelLayout from "../src/components/layouts/PanelLayout";
import {DropDownList,Toolbar,CardUnitInfo,PopupBase,ImageSelector} from "../src/components";

import accountsStore from "../src/stores/Accounts";
import {deviceWide, doDelay, logger, showMassage} from "../src/utils";
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
    grL5, gr8, gr10, gr3, gr4, itemListText
} from "../src/constants/colors";
import accounting from "accounting";
import NavFooterButtons from "../src/components/layouts/footerButtons";
import NavBar from "../src/components/layouts/NavBar";
import {View, TouchableOpacity, Text, TextInput,} from "../src/react-native";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCogs, faCompass, faMapMarkerAlt, faUser} from "@fortawesome/free-solid-svg-icons";
import translate from "../src/language/translate";
import copy from "copy-to-clipboard";


const HOME_TYPE = 1
export default class MyLink extends Component {
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
            forms:[]
        };
    }




    componentDidMount() {

    }
    copyLink=()=> {
        copy(userStore.invitationLink);
        showMassage(translate('finishRegister_its_copy'),'success');
    }

    render() {
        const toolbarStyle = {
            start22: {
                content: images.ic_back,
            },
            title: 'لینک من',

        };
        const open = Boolean(this.state.anchorEl);
        const PopperId = open ? 'simple-popper' : undefined;
        const {children}=this.props;
        return (
            <PanelLayout title={`Panel`} showMenu={this.state.showMenu}
                              onRef={(initDrawer)=>this.initDrawer=initDrawer}
                              onCloseMenu={()=>this.setState({showMenu:false})}
                              style={{margin:0}}
                              header={
                                  <Toolbar
                                   customStyle={toolbarStyle}
                                   isExpand={this.state.showAccountSelect }
                                  />
                              }
                              footer={
                                  <View style={{paddingHorizontal:20}}>
                                      <NavBar navButtons={[
                                          {
                                              label: translate('پروفایل'),
                                              path: "/profile",
                                              icon: <FontAwesomeIcon icon={faUser} />
                                          },
                                          {
                                              label: translate('شبکه من'),
                                              path: "/myNetwork",
                                              icon: <FontAwesomeIcon icon={faCogs} />
                                          },
                                          {
                                              label: translate('لینک دعوت'),
                                              path: "/myLink",
                                              icon: <FontAwesomeIcon icon={faCompass} />
                                          },
                                      ]}/>
                                  </View>
                              }>
                <View style={{padding:24,marginTop:0}}>
                    <Text
                        style={{
                            marginTop:10,
                            fontSize:16,
                            fontWeight:800,
                            fontFamily: 'IRANYekanFaNum-Bold',
                            color:grL5,
                        }}>
                        {translate('finishRegister_your_invitation_link')}
                    </Text>
                    <View style={{
                        flexDirection:'row',
                        marginTop:10,
                        borderWidth:1,
                        borderRadius:8,
                        borderColor:gr8,
                        alignItems:'center',
                    }} >
                        <TouchableOpacity
                            style={{
                                borderWidth:1,
                                borderRadius:0,
                                borderColor:grL5,
                                alignItems:'center',
                                justifyContent:'center',
                                color:gr10,
                                width:80,
                                height:60,
                                fontSize:16,
                                marginHorizontal:0,
                                backgroundColor:gr3,
                            }}
                            onPress={this.copyLink}>
                            <Text style={{padding:5,}}>{translate('finishRegister_copy')}</Text>
                        </TouchableOpacity>
                        <TextInput
                            style={{
                                fontSize:14,
                                fontFamily: 'IRANYekanRegular',
                                color:grL5,
                                //maxWidth:global.width-50,
                                textAlign:'left',
                                paddingHorizontal:5,
                                width:'100%',
                                height:60,
                            }}
                            readonly
                            numberOfLines={5}
                        value={ userStore.invitationLink}
                        >

                        </TextInput>
                    </View>

                </View>
                <Text style={{ textAlign:'justify',paddingHorizontal:30,fontSize:14,color:itemListText}}>{translate('با کپی کردن لینک اختصاصی خودت و ارسال آن برای دوستان و آشنایان یا اشتراک گذاری آن در شبکه های اجتماعی، خیلی سریع شبکه خودتو بزرگ کن.')}</Text>
                <Text style={{ textAlign:'justify',paddingHorizontal:30,fontSize:14,color:itemListText}}>{translate('کافیه لینک رو برای چند نفر بفرستی تا شبکه ات خودبخود شروع به رشد کنه و هر روز بتونی رشد درخت شبکه ات رو ببینی.')}</Text>
                <Text style={{ textAlign:'justify',paddingHorizontal:30,fontSize:14,color:itemListText}}>{translate('اگر در خارج از کشور آشنایی داری، یا در شبکه های اجتماعی بین المللی  مثل فیسبوک عضوی لینکتو برای خارجی ها به اشتراک بذار، تا شبکه ات در سطح بین الملل هم رشد کنه .')}</Text>
                <Text style={{ textAlign:'justify',paddingHorizontal:30,fontSize:14,color:itemListText}}>{translate('برای معرفی بهتر می تونی لینک خودت رو به همراه یه پیام برای دوستات ارسال کنی تا تاثیر بهتری داشته باشه.')}</Text>
                <Text style={{ textAlign:'justify',paddingHorizontal:30,fontSize:14,color:itemListText}}>{translate('شبکه خودتو توسعه بده و منتظر  اپلیکیشن ترینتگرام باش. این اپلیکیشن با امکاناتی که داره، بصورت اتوماتیک به تو قدرت تبلیغاتی، رسانه ای و ثروت آفرینی میده. پس از همین الان شروع کن و شبکه خودتو سریعتر از دیگران توسعه بده.')}</Text>

            </PanelLayout>
            //</PanelLayout>

        )
    }

}



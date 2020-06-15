import React, {Component} from 'react';
import {userStore,persistStore } from "../src/stores";
import {permissionId} from '../src/constants/values';
import Router from "next/router";
import ResponsiveLayout from "../src/components/layouts/ResponsiveLayout";
import {DropDownList,Toolbar,CardUnitInfo,PopupBase,ImageSelector} from "../src/components";

import accountsStore from "../src/stores/Accounts";
import {deviceWide, doDelay, logger} from "../src/utils";
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
    grL5, gr8, gr10, gr3
} from "../src/constants/colors";
import accounting from "accounting";
import NavFooterButtons from "../src/components/layouts/footerButtons";
import NavBar from "../src/components/layouts/NavBar";
import {View ,TouchableOpacity,Text,} from "../src/react-native";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCogs, faCompass, faMapMarkerAlt, faUser} from "@fortawesome/free-solid-svg-icons";
import translate from "../src/language/translate";


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
            <ResponsiveLayout title={`Panel`} showMenu={this.state.showMenu}
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
                <View style={{padding:16}}>
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
                                width:60,
                                height:60,
                                fontSize:16,
                                marginHorizontal:0,
                                backgroundColor:gr3,
                            }}
                            onPress={this.copyLink}>
                            <Text style={{padding:5,}}>{translate('finishRegister_copy')}</Text>
                        </TouchableOpacity>
                        <Text
                            style={{
                                fontSize:14,
                                fontFamily: 'IRANYekanRegular',
                                color:grL5,
                                //maxWidth:global.width-50,
                                textAlign:'left',
                                paddingHorizontal:5,
                            }}>
                            {`https://Treenetgram.com/?invitationCode=${userStore.invitationCode}` }
                        </Text>
                    </View>

                </View>

            </ResponsiveLayout>
            //</PanelLayout>

        )
    }

}



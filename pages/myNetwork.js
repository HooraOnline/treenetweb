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
import {bgItemRed, bgScreen, bgWhite, textItemRed, borderSeparate, border,primary} from "../src/constants/colors";
import accounting from "accounting";
import NavFooterButtons from "../src/components/layouts/footerButtons";
import NavBar from "../src/components/layouts/NavBar";
import {View ,TouchableOpacity,Text,} from "../src/react-native";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCogs, faCompass, faMapMarkerAlt, faUser} from "@fortawesome/free-solid-svg-icons";
import translate from "../src/language/translate";


const HOME_TYPE = 1
export default class MyNetwork extends Component {
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
            title: 'شبکه من',

        };
        const open = Boolean(this.state.anchorEl);
        const PopperId = open ? 'simple-popper' : undefined;
        const {children}=this.props;
        return (
            //<PanelLayout title={`صفحه اصلی`} onRoleSelected={onRoleSelected}>
            <ResponsiveLayout title={`صفحه اصلی`} showMenu={this.state.showMenu}
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


            </ResponsiveLayout>
            //</PanelLayout>

        )
    }

}



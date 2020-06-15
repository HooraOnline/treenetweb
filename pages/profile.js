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
export default class Profile extends Component {
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


    hasChangedPassword(accounts) {
        accounts.forEach((account) => {
            if (account.hasChangedPassword) {
                return true;
            }
        });
        return false;
    }

    hidePasswordChangePopUp() {
        this.setState({
            showPasswordChangePopUp: false,
        }, () => {
            if (accountsStore.accounts.length && persistStore.selected === 0) {
                this.selecetRole(true);
            }
        });
    }

    selecetRole(status) {
        this.setState({showAccountSelect: status}, () => {
            if (status) {
                this.getBalance();
            }
        });

    }

    async getBalance() {
        this.setState({loadingBalance: true});
        getUserBalance()
            .then(result => {
                logger('********* getUserBalance success result:', result);
                this.updateBalance(result);
            })
            .catch(e => {
                logger('********* getUserBalance catch e:', e);
                this.setState({loadingBalance: false});
                // Toast.show(e.errMessage, Toast.LONG);
            });
    }

    updateBalance(newBalance) {
        accountsStore.accounts = accountsStore.accounts.map(function (item) {
            if (item.UnitID) {
                const target = newBalance.find(obj => obj.UnitID === item.UnitID);
                item.UnitBalance = target.UnitBalance;
                return item;
            } else {
                return item;
            }
        });
        this.setState({loadingBalance: false});
    }

    onRoleSelected(item) {

        persistStore.selected = item.ID;
        userStore.setUser(item);
        userStore.setUnitBalance(item.UnitBalance);
        this.costPermission = userStore.findPermission(permissionId.costCalculation);
        this.payAnnouncePermissioin = userStore.findPermission(userStore.RoleID === 1 ? permissionId.manualPay : permissionId.pay);
        console.info('%%%%%%%%%%% onRoleSelected item selected: ', item);
        this.setState({showAccountSelect:false});
        this.initDrawer && this.initDrawer();
        this.loadForms()
    }

    async getAllNotifications() {
        // this.showLoading();
        globalState.showBgLoading();
        getAllNotification()
            .then(result => this.setState({notifications: result}))
            .catch(e => globalState.showToastCard())
            .finally(() => globalState.hideBgLoading());
    }

    onPressMenu() {
        //this.props.navigation.openDrawer();
        if(this.state.isWide){
            persistStore.showMenu=!persistStore.showMenu;
            this.setState({showMenu:persistStore.showMenu});
        }else{
            this.setState({showMenu:!this.state.showMenu});
        }
    }

    async onPressAccount() {
        this.selecetRole(!this.state.showAccountSelect);
        // this.setState({showAccountSelect: true});
        this.setState({showMenu:false});
    }

    componentDidMount() {
       // this.checkUserNotRefreshPage();
       // setTimeout(() => this.setState({roleId: userStore.RoleID}), 100);
       // this.manageMenuVisible();
       // this.initPanel();
    }

    initPanel(){
        doDelay(20)
            .then(()=>{

            })
    }
    render() {

        const toolbarStyle = {
            start22: {
                content: images.ic_back,
            },
            title: 'پروفایل',

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
                <View style={{padding:16}}>
                    <ImageSelector
                        style={{ }}
                        canUpload={true}
                        autoUpload={true}
                        imageStyle={{height:150,width:150,borderRadius:75}}
                        image={userStore.profileImage}
                        noImage={images.default_ProPic}
                        hideDeleteBtn={true}
                        //onrender={(imageSelector)=>imageSelector.setState({image:this.state.userImage})}
                        onUplodedFile={(fileName)=>{
                            this.setState({image: fileName});
                            this.setProfileImage(fileName);
                        }}
                        onRemoveImage={(fileName)=>{
                            this.setState({image: null});
                        }}

                    />
                    <Text>{userStore.firstName}</Text>
                </View>
            </ResponsiveLayout>
        )
    }

}



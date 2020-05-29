import React, {Component} from 'react';
import MainContent from "./home/MainContent";
import {userStore,persistStore } from "../src/stores";
import {permissionId} from '../src/constants/values';
import Router from "next/router";
import MobileLayout from "../src/components/layouts/MobileLayout";
import {DropDownList,Toolbar,CardUnitInfo,PopupBase,ImageSelector} from "../src/components";

import accountsStore from "../src/stores/Accounts";
import {deviceWide, logger} from "../src/utils";
import images from "../public/static/assets/images";
import PopupState, {bindTrigger, bindPopover} from 'material-ui-popup-state';
import {getUserBalance} from "../src/network/Queries";
import {bgItemRed, bgScreen, bgWhite, textItemRed, borderSeparate, border,primary} from "../src/constants/colors";
import accounting from "accounting";
import NavFooterButtons from "../src/components/layouts/footerButtons";
import NavBar from "../src/components/layouts/NavBar";
import {View ,TouchableOpacity,Text,} from "../src/react-native";


const HOME_TYPE = 1
export default class Main_ extends Component {
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
        this.initDrawer && this.initDrawer()
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

        this.checkUserNotRefreshPage();
        setTimeout(() => this.setState({roleId: userStore.RoleID}), 100);
        this.manageMenuVisible();


    }

    render() {
        //const { height, width } = useWindowDimensions();
        const toolbarStyle = {
            start: {
                onPress: () => this.onPressMenu(),
                content: this.state.showMenu?images.ic_close :images.ic_menu,
            },
            main: {
                onPress:
                    accountsStore.accounts.length > 1
                        ? this.onPressAccount.bind(this)
                        : null,
                title: userStore.RoleName,
                subTitle: userStore.BuildingName + userStore.UnitNumber,
            },
        };
        const open = Boolean(this.state.anchorEl);
        const PopperId = open ? 'simple-popper' : undefined;
        const {children}=this.props;
        return (
            //<PanelLayout title={`صفحه اصلی`} onRoleSelected={onRoleSelected}>
            <MobileLayout title={`صفحه اصلی`} showMenu={this.state.showMenu} onRef={(initDrawer)=>this.initDrawer=initDrawer} onCloseMenu={()=>this.setState({showMenu:false})} style={{margin:0}}>
                <Toolbar
                    customStyle={toolbarStyle}
                    isExpand={this.state.showAccountSelect }
                />
                {/*<ImageSelector
                    style={{height:global.height/4,margin:5 }}
                    canUpload={true}
                    autoUpload={true}
                    imageStyle={{borderRadius:this.bRedius}}
                    image={'1587814870896.jpg'}//{this.state.image}
                    noImage={images.bg_addphoto}
                    hideDeleteBtn={false}
                    onUplodedFile={(fileName)=>{
                        this.setState({image: fileName});
                    }}
                    onRemoveImage={(fileName)=>{
                        this.setState({image: null});
                    }}
                    renderContent={(image, progress) => {
                        return (
                            <TouchableOpacity
                                style={{
                                    flex: 2,
                                    shadowColor: '#000',
                                    shadowOffset: {width: 0, height: 1},
                                    shadowOpacity: 0.5,
                                    // marginBottom: 4,
                                }}
                                activeOpacity={0.4}
                                onPress={()=>alert(11)}
                            >
                                <View
                                    style={{
                                        width: global.width / 2,
                                        flex: 1,
                                        justifyContent: 'flex-end',

                                    }}

                                >
                                    <Text style={{
                                        color: '#000',
                                        fontSize: 18,
                                        marginStart: 24,
                                        marginBottom: 34,

                                    }}>  </Text>

                                </View>
                            </TouchableOpacity>
                        )
                    }}
                >
                </ImageSelector>*/}
                <PopupBase
                    opener={this.item}
                    top={0}
                    visible={this.state.showAccountSelect}
                    onClose={()=>this.setState({showAccountSelect:false})}
                    style={{marginTop:64,height:'93%',backgroundColor:bgScreen,opacity:1}}
                    contentStyle={{opacity:1, width:global.width,backgroundColor:bgWhite,paddingBottom:2, borderBottomRightRadius: 30,borderBottomLeftRadius:30,borderColor:bgScreen}}>
                        {accountsStore.accounts.map((item,index) => {
                                return (
                                    <div onClick={() => this.onRoleSelected(item)} style={{cursor: "pointer", paddingRight:5,paddingLeft:5,justifyContent:'center' }} >
                                        <div id={'seperator'} style={{
                                            height: index?1:0,
                                            backgroundColor: borderSeparate,
                                            marginHorizontal: 0,
                                            width:'100%',
                                            marginTop:-10,
                                        }}/>
                                        <CardUnitInfo
                                            isMain
                                            unitNumber={item.UnitNumber}
                                            floorNumber={item.FloorNumber}
                                            area={item.Area}
                                            >
                                            <div style={{
                                                display: 'flex',
                                                flex: 1,
                                                paddingBottom: 0,
                                                margin:3,
                                                //backgroundColor: '#fff',
                                            }}>
                                                <div style={{
                                                    display: 'flex',
                                                    flex: 1,
                                                    flexDirection: 'column',
                                                    alignItems: 'flex-start',
                                                    margin: 10
                                                }}>
                                                    <span style={{fontSize: 16}} >{item.RoleName}</span>
                                                    <span style={{
                                                        color: '#8a7e7e',
                                                        fontSize: 12,
                                                        textAlign: 'left',
                                                        flex: 1,
                                                    }}

                                                    >{item.BuildingName}</span>
                                                </div>
                                                {this.state.loadingBalance && (
                                                    <span style={{
                                                        color: '#8a7e7e',
                                                        fontSize: 10,
                                                        textAlign: 'left',
                                                        flex: 1,
                                                    }}>بارگذاری ...</span>
                                                )}
                                                {item.UnitBalance && item.UnitBalance != 0 && (
                                                    <div
                                                        style={{
                                                            flexDirection: 'row',
                                                            backgroundColor: bgItemRed,
                                                            padding: 8,
                                                            borderRadius: 5,
                                                            height: 35,
                                                        }}>
                                                                    <span
                                                                        style={{
                                                                            color: item.UnitBalance < 0 ? textItemRed : 'black',
                                                                            fontSize: 12,
                                                                            writingDirection: 'ltr',
                                                                        }}>
                                                                        {accounting.formatMoney(item.UnitBalance.replace('-', ''), '', 0, ',')}
                                                                    </span>
                                                        <span
                                                            style={{
                                                                color:
                                                                    item.UnitBalance < 0 ? textItemRed : 'black',
                                                                fontSize: 12,
                                                            }}>
                                                                        {' '}
                                                            {item.CurrencyID}{' '}
                                                                     </span>
                                                    </div>

                                                )}
                                            </div>

                                        </CardUnitInfo>
                                    </div>

                                )
                            }
                        )}
                </PopupBase>

               <MainContent isAdmin={userStore.RoleID == 1}/>
                <NavBar navButtons={NavFooterButtons}/>
            </MobileLayout>
            //</PanelLayout>

        )
    }

}



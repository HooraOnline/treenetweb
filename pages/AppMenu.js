import React, { Component } from 'react';
import PanelLayout from "../src/components/layouts/PanelLayout";
import { Toolbar,Line } from "../src/components";
import { navigation, showMassage } from "../src/utils";
import images from "../public/static/assets/images";
import { bgScreen, bgWhite, itemListText, primaryDark, subTextItem, textItem } from "../src/constants/colors";
import { IconApp, Image, Text, TouchableOpacity, View, } from "../src/react-native";
import { logoutApi } from '../dataService/apiService';



export default class AppMenu extends Component {
    constructor() {
        super();
        //globalState.changeStatusBarColor(primaryDark);
        //StatusBar.setTranslucent(false);

        this.state = {
            showAccountSelect: false,
            loadingBalance: false,
            showPasswordChangePopUp: false,
            anchorEl: null,
            showMenu: false,
            isWide: false,
            forms: []
        };
    }


    async componentDidMount() {

    }


    render() {
        const toolbarStyle = {
            start: {
                content: images.ic_close,
                //onPress: () => this.props.onClose(),
                onPress: () => navigation.goBack(),
            },
            title: 'منو',
        };

        return (
            // <div style={{ zIndex: 10000, position: 'absolute', top: 0, bottom: 0, 
            //   display: this.props.visible ? '' : 'none'
            //  }}>
                <PanelLayout title={`Panel`} loading={this.state.loading} loadingMessage={this.state.loadingMessage}
                    onRef={(initDrawer) => this.initDrawer = initDrawer}
                    style={{ margin: 0, }}
                    header={
                        <Toolbar
                            customStyle={toolbarStyle}
                            isExpand={this.state.showAccountSelect}
                        />
                    }>
                    <View style={{ padding: 24,marginTop:0 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('edit_profile')} style={{  flexDirection: 'row', alignItems: 'center' }}>
                            <IconApp 
                             class={'apic_Information'}
                                style={{
                                    width: 24,
                                    height: 24,
                                    tintColor: textItem,
                                    
                                }}
                            />
                            <Text style={{ fontSize: 12, paddingHorizontal: 5, color: textItem }}>ویرایش پروفایل</Text>
                        </TouchableOpacity>
                        <Line style={{marginTop:16,marginBottom:16}}/>
                       <TouchableOpacity onPress={() => navigation.navigate('change_password')} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <IconApp 
                             class={'apic_password'}
                                style={{
                                    width: 24,
                                    height: 24,
                                    tintColor: textItem
                                }}
                            />
                            <Text style={{ fontSize: 12, paddingHorizontal: 5, color: textItem }}>تغییر رمز عبور</Text>
                        </TouchableOpacity>
                        <Line style={{marginTop:16,marginBottom:16}}/>
                        <TouchableOpacity onPress={() => navigation.navigate('change_userkey')} style={{  flexDirection: 'row', alignItems: 'center' }}>
                            <IconApp 
                             class={'apic_edit'}
                                style={{
                                    width: 24,
                                    height: 24,
                                    tintColor: textItem
                                }}
                            />
                            <Text style={{ fontSize: 12, paddingHorizontal: 5, color: textItem }}>تغییر نام کاربری</Text>
                        </TouchableOpacity>
                        <Line style={{marginTop:16,marginBottom:16}}/>
                        <TouchableOpacity onPress={() => logoutApi()} style={{  flexDirection: 'row', alignItems: 'center' }}>
                            <IconApp 
                             class={'apic_period_notadded'}
                                style={{
                                    width: 24,
                                    height: 24,
                                    tintColor: textItem
                                }}
                            />
                            <Text style={{ fontSize: 12, paddingHorizontal: 5, color: textItem }}>خروج</Text>
                        </TouchableOpacity>
                        <Line style={{marginTop:16,marginBottom:16}}/>
                    </View>
                </PanelLayout>
            // </div>



        )
    }

}





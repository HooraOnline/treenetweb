import React, {Component} from 'react';
import PanelLayout from "../src/components/layouts/PanelLayout";
import {Toolbar} from "../src/components";
import {navigation, showMassage} from "../src/utils";
import images from "../public/static/assets/images";
import {bgWhite, itemListText, primaryDark} from "../src/constants/colors";
import NavBar from "../src/components/layouts/NavBar";
import {Image, Text, TouchableOpacity, View,} from "../src/react-native";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCogs, faCompass, faUser} from "@fortawesome/free-solid-svg-icons";
import translate from "../src/language/translate";
import copy from "copy-to-clipboard";
import {persistStore,} from "../src/stores";
import ShareLink from "./sections/ShareLink";


export default class followboard extends Component {
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


    async componentDidMount  () {

    }


    render() {
        const toolbarStyle = {
            start: {
                content: images.ic_back,
                onPress: ()=>navigation.goBack(),
            },
            title: 'فالوبورد',
        };

        return (
            <PanelLayout title={`Panel`}  loading={this.state.loading} loadingMessage={this.state.loadingMessage} showMenu={this.state.showMenu}
                         onRef={(initDrawer) => this.initDrawer = initDrawer}
                         onCloseMenu={() => this.setState({showMenu: false})}
                         style={{margin: 0}}
                         header={
                             <Toolbar
                                 customStyle={toolbarStyle}
                                 isExpand={this.state.showAccountSelect}
                             />
                         }
                         footer={
                             <View style={{paddingHorizontal: 20}}>
                                 <NavBar navButtons={[
                                     {
                                         label: translate('پستها'),
                                         path: "/mypage",
                                         icon: <FontAwesomeIcon icon={faUser}/>
                                     },
                                     {
                                         label: translate('شبکه من'),
                                         path: "/myNetwork",
                                         icon: <FontAwesomeIcon icon={faCogs}/>
                                     },
                                     {
                                         label: translate('فالوبورد'),
                                        path: "/followboard",
                                         icon: <FontAwesomeIcon icon={faCompass}/>
                                     },
                                 ]}/>
                             </View>
                         }>
                <View style={{flex:1,paddingBottom:40}}>
                    <View style={{padding: 24, marginTop: 10,alignItems:'center'}}>
                        <Text
                            style={{
                                marginTop: 0,
                                maxWidth:400,
                                fontSize: 14,
                                fontFamily: 'IRANYekanFaNum',
                                textAlign:'justify'
                            }}>
                            {translate(' پستها')}
                        </Text>


                    </View>
                </View>
            </PanelLayout>


        )
    }

}





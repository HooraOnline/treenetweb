import React, {Component, PureComponent} from 'react';
import {globalState, persistStore, pStore,} from "../src/stores";
import PanelLayout from "../src/components/layouts/PanelLayout";
import {Toolbar,} from "../src/components";
import {navigation, showMassage} from "../src/utils";
import images from "../public/static/assets/images";
import {
    bgItemRed,
     orange1,

} from "../src/constants/colors";
import NavBar from "../src/components/layouts/NavBar";
import {Text,View,} from "../src/react-native";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCogs, faCompass, faUser,faUsers,faBell} from "@fortawesome/free-solid-svg-icons";
import translate from "../src/language/translate";


import {observer} from "mobx-react";



@observer
export default class MyServices extends Component {
    constructor() {
        super();
        this.state={

        }
    }

   async componentDidMount  () {


    }

    
    render() {
        const toolbarStyle = {
            start: {
                content: images.ic_back,
                onPress: ()=>navigation.goBack(),
            },
            title: 'سرویسهای من',

        };

        return (
              <PanelLayout title={`Treenetgram`}  loading={this.state.loading} loadingMessage={this.state.loadingMessage} showMenu={this.state.showMenu}
                              onRef={(initDrawer)=>this.initDrawer=initDrawer}
                              onCloseMenu={()=>this.setState({showMenu:false})}
                              style={{paddingBottom:10}}
                              //notif={persistStore.notChangePassword?"رمز موقت را تغییر دهید.":""}
                              header={
                                  <View>
                                      <Toolbar
                                          customStyle={toolbarStyle}
                                          isExpand={this.state.showAccountSelect }
                                      />
                                     
                                  </View>
                              }
                            footer={
                                <NavBar navButtons={[
                                    {
                                        label: translate('پستها'),
                                        path: "/"+pStore.cUser.userKey,
                                        icon: <FontAwesomeIcon icon={faUser}/>
                                    },
                                    {
                                        label: translate('شبکه من'),
                                        path: "/myNetwork",
                                        icon: <FontAwesomeIcon icon={faUsers}/>
                                    },
                                    {
                                        label: translate('سرویسها'),
                                        path: "myServices",
                                        icon: <FontAwesomeIcon icon={faCogs}/>
                                    },
                                    {
                                        label: translate('اعلانات'),
                                        notif: pStore.newewAnnounceCount,
                                        path: "/activity",
                                        icon: <FontAwesomeIcon icon={faBell}/>
                                    },
                                    {
                                        label: translate('فالوبورد'),
                                        path:  "/followboard",
                                        icon: <FontAwesomeIcon icon={faCompass}/>
                                    },
                                ]}/>
                            }

                              >
                <View style={{marginHorizontal: '10%',marginTop: 40,paddingBottom:60}}>
                    <View style={{width:'100%',
                        flexDirection:'row',
                        justifyContent:'space-between',
                        alignItems:'space-between',
                        padding:20,
                        paddingHorizontal:16,
                        borderWidth:1,
                        borderRadius:12,
                        borderColor:orange1,
                        backgroundColor:bgItemRed
                    }} >
                        <Text style={{fontSize:12}}>به زودی سرویس کاربردی و درآمد زایی اضافه خواهد شد که با فعال کردن آنها در شبکه خود می توانید درآمد اتوماتیک داشته باشید. شبکه بزرگتر یعنی درآمد بیشتر.</Text>
                       
                       
                    </View>
                    
                    
                </View>
            </PanelLayout>

        )
    }

}



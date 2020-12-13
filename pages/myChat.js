import React, {Component, useEffect, useState} from 'react';
import PanelLayout from "../src/components/layouts/PanelLayout";
import {ImageSelector, Toolbar} from "../src/components";
import {doDelay, navigation, showMassage} from "../src/utils";
import images from "../public/static/assets/images";
import {
    bgEmpty,
    bgScreen,
    bgWhite,
    borderLight,
    itemListText,
    primaryDark,
    textGray,
    textItem, yellowmin
} from "../src/constants/colors";
import NavBar from "../src/components/layouts/NavBar";
import {FlatList, Image, Text, TouchableOpacity, View,} from "../src/react-native";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCogs, faCompass, faUser,faUsers,faBell} from "@fortawesome/free-solid-svg-icons";
import translate from "../src/language/translate";

import {observer} from "mobx-react";
import {getFileUri, postQuery} from "../dataService/apiService";
import pStore from "../src/stores/PublicStore";
import Api from "../dataService/apiCaller";


@observer
export default class myChat extends Component {
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
            forms: [],
            userKey:'',
            followers:[]
        };
        this.userKey='';
    }


    async componentDidMount  () {
        this.getMessages();
    }

    getMessages =(memberId)=> {
        this.setState({loading:true})
        Api.post('actions/getMessages',{memberId:memberId})
                  .then(followers=>{
                     
                     this.setState({followers:followers})
                  }).catch((error)=>{
                     showMassage('خطا در بارگذاری دنبال کنندگان')
                  })
                  .finally(()=>{
                    this.setState({loading:false})
                  });
  };

    render() {
        const toolbarStyle = {
            start: {
                content: images.ic_back,
                onPress: ()=>navigation.goBack(),
            },
            title: this.userKey+'('+this.state.followers.length+')',
        };

        return (
            <PanelLayout title={`فالورها`}  loading={this.state.loading} loadingMessage={this.state.loadingMessage}
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
                                         path: "/myServices",
                                         icon: <FontAwesomeIcon icon={faCogs}/>
                                     },
                                     {
                                        label: translate('اعلانات'),
                                        path: "/activity",
                                        icon: <FontAwesomeIcon icon={faBell}/>
                                    },
                                     {
                                         label: translate('فالوبورد'),
                                        path: "/followboard",
                                         icon: <FontAwesomeIcon icon={faCompass}/>
                                     },
                                 ]}/>
                             </View>
                         }>
                <View style={{flex:1,paddingBottom:40,paddingTop:16}}>
                    <View style={{padding: 0, marginTop: 0,}}>
                        <FollowerList followers={this.state.followers}/>
                    </View>
                </View>
            </PanelLayout>


        )
    }

}

export const FollowerList = observer(props => {
    const [loading, setloading] = useState(false);
  
    useEffect(() => {
      
    },[]);

    return (
            <FlatList
                loading={loading}
                style={{justifyContent:'center'}}
                keyExtractor={(item, index) => index.toString()}
                data={props.followers}
                ListEmptyComponent={
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: props.followers.length > 0 ? bgScreen : bgEmpty
                        }}>
                    </View>
                }
                renderItem={({item, index}) =>{
                    if(!item.follower)
                        return  null;
                    let {profileImage,userKey,avatar}=item.follower;
                    return (
                        <View style={{flex:1}}>
                            <TouchableOpacity
                             onPress={()=> location.pathname=item.member.userKey}
                             style={{flexDirection:'row',justifyContent:'center',paddingHorizontal:10,margin:16}}>
                                <Image
                                    source={getFileUri('member',profileImage)}
                                    style={{
                                        width:60,
                                        height:60,
                                        borderRadius:30,
                                    }}
                                />
                                <View style={{padding:5,flex:1,justifyContent:'center'}}>
                                    <Text style={{ fontSize:12,fontWeight:800, }}>{userKey}</Text>
                                    <Text style={{ fontSize:10,color:textItem}}>{avatar}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )
                } }
            />


    )
});





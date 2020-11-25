import React, {Component, useEffect, useState} from 'react';
import PanelLayout from "../src/components/layouts/PanelLayout";
import {ImageSelector, Toolbar} from "../src/components";
import {navigation, showMassage} from "../src/utils";
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
import {faCogs, faCompass, faUser} from "@fortawesome/free-solid-svg-icons";
import translate from "../src/language/translate";
import copy from "copy-to-clipboard";
import {persistStore,} from "../src/stores";
import ShareLink from "./sections/ShareLink";
import {observer} from "mobx-react";
import {getFileUri, postQuery} from "../dataService/apiService";
import pStore from "../src/stores/PublicStore";
import Api from "../dataService/apiCaller";

import { IoMdHeartEmpty ,IoMdShare} from "react-icons/io";
import { FaRegCommentDots } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
@observer
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
                                         label: translate('سروسها'),
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
                <View style={{flex:1,paddingBottom:40,paddingTop:16}}>
                    <View style={{padding: 0, marginTop: 0,alignItems:'center'}}>
                        <PostList/>
                    </View>
                </View>
            </PanelLayout>


        )
    }

}

export const PostList = observer(props => {
    const [loading, setloading] = useState(false);
    const [itemWidth, setItemWidth] = useState(100);
    const [posts, setPosts] = useState([{image:images.ic_Social_Telegram}]);
    const [postList, setPostList] = useState([]);
    useEffect(() => {

        getUserPost();
    },  [posts]);

    const addPost=()=> {

    }
    const uploadPostImage = (fileName) => {
        const data = {profileImage: fileName};
        postQuery('Members/me/setProfileImage', data)
            .then(res => {
                pStore.cUser.profileImage = res.profileImage;
            })
            .catch(err => {

            })
    };

    const getUserPost =(fields, include)=> {
        return  Api.post('posts/me/getPosts')
            .then(posts=>{
                pStore.userPosts=posts;
            }).catch((error)=>{
                setloading(false)
            });
    };

    return (
            <FlatList
                loading={loading}
                style={{justifyContent:'center'}}
                keyExtractor={(item, index) => index.toString()}
                data={pStore.userPosts}
                ListEmptyComponent={
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: posts.length > 0 ? bgScreen : bgEmpty
                        }}>


                    </View>
                }
                renderItem={({item, index}) =>{
                    if(!item.member)
                        return  null;
                    let {profileImage,username,avatar}=item.member;
                    return (
                        <View style={{flex:1}}>
                            <View style={{flexDirection:'row',justifyContent:'center',paddingHorizontal:10}}>
                                <Image
                                    source={getFileUri('member',profileImage)}
                                    style={{
                                        width:60,
                                        height:60,
                                        borderRadius:30,
                                    }}
                                />
                                <View style={{padding:5,flex:1,justifyContent:'center'}}>
                                    <Text style={{ fontSize:14,fontWeight:800, }}>{username}</Text>
                                    <Text style={{ fontSize:10,color:textItem}}>{avatar}</Text>
                                </View>
                            </View>
                            <View
                                style={{
                                    alignItems:'center',
                                    justifyContent:'center',
                                    width:'100%',
                                    maxWidth:global.width,
                                    height:global.width/2,
                                    maxHeight:global.width/2,
                                    borderRadius:0,
                                    borderWidth:0.4,
                                    borderColor:borderLight,
                                    margin:1,
                                    position:'relative',
                                }}>
                                {item.isSpecial &&(
                                    <FaStar
                                        size={30}
                                        color={yellowmin}
                                        style={{
                                            position:'absolute',
                                            top:5,
                                            left:5
                                        }}
                                    />
                                )}
                                <Image
                                    source={getFileUri('post',item.file)}
                                    style={{
                                        width:global.width-10,
                                        height:'100%',

                                    }}
                                />

                            </View>
                            <View style={{flex:1,padding:10,paddingBottom:30}}>
                                <Text style={{ fontSize:12,}}>{item.text}</Text>
                                <View style={{flex:1,flexDirection:'row'}}>
                                    <IoMdHeartEmpty size={25} style={{margin:10}}/>
                                    <IoMdShare size={25} style={{margin:10}}/>
                                    <FaRegCommentDots size={25} style={{margin:10}}/>

                                </View>
                            </View>
                        </View>
                    )
                } }
            />


    )
});





import React, {Component, useEffect, useState} from 'react';
import {globalState, persistStore} from "../src/stores";
import PanelLayout from "../src/components/layouts/PanelLayout";
import {ImageSelector, Toolbar} from "../src/components";

import accountsStore from "../src/stores/Accounts";
import {navigation, setScreenSize, waitForData} from "../src/utils";
import images from "../public/static/assets/images";
import {
    bg8,
    bgEmpty,
    bgScreen,
    bgSuccess,
    bgWhite, border, borderLight,
    orange1, primary, primaryDark,
    success,
    textGray,
    textItem, yellowmin
} from "../src/constants/colors";
import NavBar from "../src/components/layouts/NavBar";
import {FlatList, Text, TouchableOpacity, View,} from "../src/react-native";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCogs, faCompass, faUser} from "@fortawesome/free-solid-svg-icons";
import translate from "../src/language/translate";
import {getFileUri, logoutApi, postQuery} from "../dataService/apiService";
import {observer} from "mobx-react";
import Image from "../src/react-native/Image";
import pStore from "../src/stores/PublicStore";
import { IoIosLink } from "react-icons/io";
import {set} from "mobx";
import Api from "../dataService/apiCaller";
import { FaStar,FaWindowClose } from "react-icons/fa";
import { IoMdHeartEmpty ,IoMdShare,} from "react-icons/io";
import { FaRegCommentDots } from "react-icons/fa";

@observer
export default class mypage extends Component {
    constructor() {
        super();
        this.state = {};
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

    async componentDidMount() {


    }


    render() {

        const toolbarStyle = {
            start22: {
                content: images.ic_back,
            },
            title: pStore.cUser.username,
            end: {
                onPress: () => logoutApi(),
                icon: images.ic_Period,
            },
        };




        return (
            //<PanelLayout title={`Treenetgram`} onRoleSelected={onRoleSelected}>
            <PanelLayout title={`Treenetgram`} loading={this.state.loading} loadingMessage={this.state.loadingMessage}
                         showMenu={this.state.showMenu}
                         onRef={(initDrawer) => this.initDrawer = initDrawer}
                         onCloseMenu={() => this.setState({showMenu: false})}
                         style={{alignItems: 'center'}}
                         header={
                             <View>
                                 <Toolbar
                                     customStyle={toolbarStyle}
                                     isExpand={this.state.showAccountSelect}
                                 />
                                 {persistStore.notChangePassword && (
                                     <div style={{width: globalState.width, zIndex: 4}}>
                                         <TouchableOpacity
                                             onPress={() => {
                                                 navigation.navigate('change_username_password')
                                             }}
                                             style={{
                                                 flex: 1,
                                                 paddingBottom: 40,
                                                 flexDirection: 'row',
                                                 justifyContent: 'space-between',
                                                 padding: 10,
                                                 backgroundColor: '#F1C40F'
                                             }}>
                                             <Text style={{
                                                 fontSize: 14,
                                                 color: textItem,
                                                 padding: 5
                                             }}>{'رمز موقت را تغییر دهید.'} </Text>
                                             <View style={{
                                                 flexDirection: 'row',
                                                 height: 40,
                                                 backgroundColor: '#27AE60',
                                                 borderRadius: 8,
                                                 alignItems: 'cener',
                                                 justifyContent: 'center',
                                                 padding: 5,
                                                 paddingHorizontal: 15
                                             }}>
                                                 <Image source={images.ic_edit} style={{
                                                     width: 24,
                                                     height: 24,
                                                     paddingHorizontal: 5,
                                                     tintColor: bgWhite
                                                 }}/>
                                                 <Text style={{
                                                     color: bgWhite,
                                                     fontSize: 14,
                                                     paddingHorizontal: 5
                                                 }}>تغییر</Text>
                                             </View>
                                         </TouchableOpacity>
                                     </div>
                                 )

                                 }
                             </View>
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
                <View style={{flex:1, marginTop: persistStore.notChangePassword ? 30 : 0, alignItems: 'center'}}>
                    <UserCard style={{maxWidth: 500,paddingTop: 25,paddingHorizontal:16}}/>
                    <View style={{flex:1,width:'100%',backgroundColor:bgWhite,minHeight:600}}>
                        <MyPosts/>
                    </View>
                </View>
            </PanelLayout>
        )
    }

}

export const UserCard = observer(props => {
    let leavesCount = 0;
    let {story} = pStore.cUser;
    const setProfileImage = (fileName) => {
        const data = {profileImage: fileName};
        postQuery('Members/me/setProfileImage', data)
            .then(res => {
                pStore.cUser.profileImage = res.profileImage;
            })
            .catch(err => {

            })
    };

    return (
        <View style={props.style}>
            <View style={{
                width: '100%',
                flexDirection: 'row',
                //backgroundColor: bgWhite,
                borderRadius: 10,
                alignItems: 'center',
            }}>

                    <ImageSelector
                        style={{
                            borderColor: bg8,
                            height: 90,
                            width: 90,
                            borderRadius: 45,
                            alignSelf: 'center'
                        }}
                        folderName={'member'}
                        onUplodedFile={(fileName) => {
                            setProfileImage(fileName);
                        }}
                        canUpload={true}
                        autoUpload={true}
                        imageStyle={{height: 100, width: 100, borderRadius: 50}}
                        image={pStore.cUser.profileImage}
                        noImage={images.default_ProPic}
                        hideDeleteBtn={true}
                    />

                <View style={{width: 20}}/>
                <View style={{alignItems: 'center'}}>
                    <View style={{flexDirection: 'row', height: 30, maxWidth: 500, justifyContent: 'space-around'}}>
                        <View style={{alignItems: 'center', paddingHorizontal: 15}}>
                            <Text style={{fontSize: 12}}>شاخه</Text>
                            <Text style={{fontSize: 12}}>{pStore.branchesCount}</Text>
                        </View>
                        <View style={{alignItems: 'center', paddingHorizontal: 15}}>
                            <Text style={{fontSize: 12}}>برگ</Text>
                            <Text style={{fontSize: 12}}>{pStore.leavesCount}</Text>
                        </View>
                        <View style={{alignItems: 'center', paddingHorizontal: 15}}>
                            <Text style={{fontSize: 12}}>عضو</Text>
                            <Text style={{fontSize: 12}}>{pStore.branchesCount + pStore.leavesCount + 1}</Text>
                        </View>
                    </View>
                    <Text
                        style={{
                            alignItems: 'center',
                            marginTop: 25,
                            fontSize: 12,
                            fontWeight: 800,
                            fontFamily: 'IRANYekanRegular',


                        }}>
                        {pStore.cUser.avatar || 'عضو فعال  تری نتگرام'}
                    </Text>
                </View>
            </View>
            <View style={{
                width: '100%',
                flexDirection: 'row',
                marginVertical: 4,
                marginTop: 5,
                justifyContent: 'space-between'
            }}>
                <Text style={{fontSize: 12, textAlign: 'justify',color:textItem}}>{story}</Text>
            </View>
            <View style={{flexDirection:'row'}}>
                <TouchableOpacity
                    onPress={()=>{navigation.navigate('edit_profile')}}
                    style={{
                        flex:1,
                        margin:10,
                        width:'100%',
                        maxWidth:300,
                        borderRadius:8,
                        flexDirection:'row',
                        justifyContent:'center',
                        padding:10,
                        backgroundColor: orange1
                    }}>
                    <Image source={images.ic_edit} style={{
                        width: 24,
                        height: 24,
                        tintColor:bgWhite
                    }}/>
                    <Text style={{fontSize:12,color:bgWhite,paddingHorizontal:5}}>ویرایش پروفایل</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={()=>{navigation.navigate('myLink')}}
                    style={{
                        flex:1,
                        margin:10,
                        width:'100%',
                        maxWidth:300,
                        borderRadius:8,
                        flexDirection:'row',
                        justifyContent:'center',
                        padding:10,
                        backgroundColor: bgSuccess
                    }}>
                    <IoIosLink
                        color={bgWhite}
                        style={{
                            width: 24,
                            height: 24,
                            tintColor:bgWhite
                        }}
                    />

                    <Text style={{fontSize:12,color:bgWhite,paddingHorizontal:5}}>شبکه سازی</Text>
                </TouchableOpacity>
            </View>
        </View>

    )
});

export const MyPosts = observer(props => {
    const [loading, setLoading] = useState(false);
    const [itemWidth, setItemWidth] = useState(100);
    const [posts, setPosts] = useState([{image:images.ic_Social_Telegram}]);
    const [postList, setPostList] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    useEffect(() => {

        onResizeScreen();
        getUserPost();
    },  [postList]);
    const onResizeScreen=()=> {
        setItemWidth(global.width/3-4)
        document.body.onresize = () => {
            setItemWidth(global.width/3-4)
        };
    }



    const getUserPost =(fields, include)=> {
        return  Api.post('posts/me/getPosts')
            .then(posts=>{
                let userPosts=[{file:images.ic_add}].concat(posts);
                waitForData(()=>setPostList(userPosts));
                pStore.userPosts=userPosts;
            }).catch((error)=>{
                setloading(false)
            });
    };

    return (
        <View style={{flex:1,marginTop:2}}>
            <FlatList
                loading={loading}
                style={{justifyContent:'center'}}
                keyExtractor={(item, index) => index.toString()}
                data={postList}
                flexWrap
                ListEmptyComponent={null}

                renderItem={({item, index}) =>{
                    if(index==0)
                        return(
                            <ImageSelector
                                style={{
                                    alignItems:'center',
                                    justifyContent:'center',
                                    width:itemWidth,
                                    height:itemWidth,
                                    borderRadius:4,
                                    margin:2,
                                    backgroundColor:textGray
                                }}
                                folderName={'post'}
                                onUplodedFile={(fileName) => {
                                    pStore.param1=fileName;
                                    navigation.navigate('addpost');

                                }}
                                onSelectFile={(files,formData,file0,filebase64)=>{
                                    pStore.param1=files;
                                    pStore.param2=filebase64;
                                    //navigation.navigate('addpost')
                                }}

                                canUpload={true}
                                autoUpload={true}
                                imageStyle={{height: 100, width: 100, borderRadius: 50}}
                                image={item.file}
                                noImage={images.default_ProPic}
                                hideDeleteBtn={true}
                            >
                                <View style={{flex:1,width:'100%', height:'100%',justifyContent:'center',alignItems:'center'}}>
                                    <Text style={{fontWeight:800,fontSize:14,}} >New Post</Text>
                                </View>
                            </ImageSelector>
                        )

                    return (
                        <TouchableOpacity
                            onPress={()=>{
                                item.member={
                                    profileImage:pStore.cUser.profileImage,
                                    username:pStore.cUser.username,
                                    avatar:pStore.cUser.avatar,
                                };
                                navigation.navigate('edit_post',{post:item});
                            }}
                            style={{
                                alignItems:'center',
                                justifyContent:'center',
                                width:itemWidth,
                                height:itemWidth,
                                borderRadius:4,
                                borderWidth:0.4,
                                borderColor:borderLight,
                                margin:1,
                                position:'relative'
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
                                    width:'100%',
                                    height:'100%',

                                }}
                            />
                        </TouchableOpacity>

                    )
                } }
            />
        </View>

    )
});



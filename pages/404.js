import React, {Component, useEffect, useState} from 'react';
import {globalState, persistStore} from "../src/stores";
import PanelLayout from "../src/components/layouts/PanelLayout";
import {ImageSelector, Toolbar} from "../src/components";

import accountsStore from "../src/stores/Accounts";
import {doDelay, navigation, setScreenSize, waitForData} from "../src/utils";
import images from "../public/static/assets/images";
import {
    bg8,
    bgEmpty,
    bgScreen,
    bgSuccess,
    bgWhite, border, borderLight,
    fab,
    orange1, primary, primaryDark,
    success,
    textGray,
    textItem, yellowmin
} from "../src/constants/colors";
import NavBar from "../src/components/layouts/NavBar";
import {BgImageChacheProgress, FlatList, Text, TouchableOpacity, View,} from "../src/react-native";

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
export default class userpage extends Component {
    constructor() {
        super();
        this.state = {};
    }



    componentDidMount() {
        this.setState({loading:true})
        doDelay(200)
        .then(()=>{
            //this.userName=navigation.getParam('userName');
            const pathname = window.location.pathname;
            this.userName=pathname.split('/').join('');
            Api.post('posts/getUserPosts',{userName: this.userName})
                .then(users=>{
                  
                    if(users && users[0]){
                        let user =users[0];
                        this.user=user;
                        this.userPosts=user.posts;
                        pStore.userPosts=user.posts;
                    }

                    this.setState({loading:false});
                }).catch((error)=>{
                    this.setState({loading:true});
                });
        })
    }

   

    render() {
        let title=this.user?this.user.displayName || this.user.fullName:''
        let ss=this.user
        
        const toolbarStyle = {
            start: {
                content: images.ic_back,
                onPress: ()=>navigation.goBack(),
            },
            title:title,

        };

       

        return (
            <PanelLayout title={`user posts`} loading={this.state.loading} loadingMessage={this.state.loadingMessage}
                         showMenu={this.state.showMenu}
                         onRef={(initDrawer) => this.initDrawer = initDrawer}
                         onCloseMenu={() => this.setState({showMenu: false})}
                         style={{alignItems: 'center'}}
                         header={
                             <Toolbar
                                 customStyle={toolbarStyle}
                                 isExpand={this.state.showAccountSelect }
                             />
                         }
                         >
                             {this.user?(
                                <View style={{flex:1, marginTop: 0, alignItems: 'center'}}>
                                    <UserCard style={{maxWidth: 500,paddingTop: 25,paddingHorizontal:16}} user={this.user}/>
                                    <View style={{flex:1,width:'100%',backgroundColor:bgWhite,minHeight:600}}>
                                    {this.userPosts &&(
                                        <UserPosts postList={this.userPosts}/>
                                    )
                                    }
                                    </View>
                                </View>
                             ):(
                             <View>
                                  {this.state.loading?(
                                      <Text
                                            style={{
                                                
                                                marginTop: 20,
                                                alignSelf:'center',
                                                marginBottom: 10,
                                                fontSize: 14,
                                                fontWeight: 800,
                                                fontFamily: 'IRANYekanFaNum-Bold',
                                                color: orange1
                                            }}>
                                        ......
                                    </Text> 
                                 )
                                    
                                 :(
                                     
                                    <View style={{flex: 1,  alignItems: 'center', padding: 10, paddingTop: '5%',}}>
                                        <Image
                                            source={images.tree}
                                            style={{maxWidth: '40%', maxHeight: '40%',}}
                                        />
                                        <Text
                                            style={{
                                                marginTop: 20,
                                                alignSelf:'center',
                                                marginBottom: 10,
                                                fontSize: 14,
                                                fontWeight: 800,
                                                fontFamily: 'IRANYekanFaNum-Bold',
                                                color: orange1
                                            }}>
                                            Treenetgram
                                        </Text>
                                        <Text
                                            style={{
                                                marginTop: 5,
                                                marginBottom: 10,
                                                fontSize: 25,
                                                fontWeight: 499,
                                                fontFamily: 'IRANYekanFaNum-Bold',
                    
                                            }}>
                                            صفحه ای با این آدرس پیدا نشد.
                                        </Text>
                                     </View>
                                 )}
                             </View>
                             )
                            }
                             
                                
                
            </PanelLayout>
        )
    }

}

export const UserCard = observer(props => {
    let leavesCount = 0;
    let {user} = props;
    if(!user) return null;

    return (
        <View style={props.style}>
            <View style={{
                width: '100%',
                flexDirection: 'row',
                //backgroundColor: bgWhite,
                borderRadius: 10,
                alignItems: 'center',
            }}>
                      <BgImageChacheProgress
                                    style={[{width:100,height:100, borderRadius: 50,}]}
                                    //resizeMode="cover"
                                    source={user.profileImage?getFileUri('member',user.profileImage):"noImage"}
                                    indicator={() => <Progress.Circle
                                        progress={this.state.imageProgress}
                                        indeterminate={this.state.imageIndeterminate}
                                    />}
                                    indicatorProps={{
                                        borderWidth: 3,
                                        color: fab,
                                        // unfilledColor: primaryDark,
                                    }}

                                    onError={e=>{
                                        this.setState({imageIndeterminate: true});
                                        this.props.onErrorImage && this.props.onErrorImage();
                                    }}
                                    onLoadStart={() => console.warn('!!!!!!!!!!!!!!!!!! onLoadStart Image ')}
                                    onProgress={e => {
                                        console.warn('%%%%%%%%%%% onProgress loaded:', e.nativeEvent.loaded);
                                        console.warn('%%%%%%%%%%% onProgress total:', e.nativeEvent.total);
                                        const progress = e.nativeEvent.loaded / e.nativeEvent.total;
                                        this.setState({imageProgress: progress});
                                        console.warn('!!!!!!!!!!!!!!!!!!!! onProgress p:', progress);
                                    }}
                                    onLoad={e => console.warn('!!!!!!!!!!!!!!!!!!!! onLoad Success', e.nativeEvent.width, e.nativeEvent.height)}
                                    onLoadEnd={() => {
                                        this.setState({loadImageCompelete: true})
                                    }}
                                ></BgImageChacheProgress>

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
                        {user.avatar || 'عضو فعال  تری نتگرام'}
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
                <Text style={{fontSize: 12, textAlign: 'justify',color:textItem}}>{user.story}</Text>
            </View>
            <View style={{flexDirection:'row'}}>
                <TouchableOpacity
                    onPress={()=>{navigation.navigate('edit_profile')}}
                    disabled={true}
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
                    <Text style={{fontSize:12,color:bgWhite,paddingHorizontal:5}}>تماس</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={()=>{navigation.navigate('myLink')}}
                    disabled={true}
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

                    <Text style={{fontSize:12,color:bgWhite,paddingHorizontal:5}}>شبکه</Text>
                </TouchableOpacity>
            </View>
        </View>

    )
});

export const UserPosts = observer(props => {
    const [loading, setLoading] = useState(false);
    const [itemWidth, setItemWidth] = useState(100);
    const [posts, setPosts] = useState([{image:images.ic_Social_Telegram}]);
   
    const [selectedItem, setSelectedItem] = useState(null);
    useEffect(() => {
        onResizeScreen();
       
    },[]);

    const onResizeScreen=()=> {
        setItemWidth(global.width/3-4)
        document.body.onresize = () => {
            setItemWidth(global.width/3-4)
        };
    }

   
   

    return (
        <View style={{flex:1,marginTop:2}}>
            <FlatList
                loading={loading}
                style={{justifyContent:'center'}}
                keyExtractor={(item, index) => index.toString()}
                data={ pStore.userPosts}
                flexWrap
                ListEmptyComponent={null}

                renderItem={({item, index}) =>{
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



import React, {Component, useEffect, useState} from 'react';
import {globalState, persistStore, userStore} from "../src/stores";
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
import {BgImageChacheProgress, FlatList, IconApp, Text, TouchableOpacity, View,} from "../src/react-native";

import {getFileUri, getUserSubsetApi, logoutApi, postQuery} from "../dataService/apiService";
import {observer} from "mobx-react";
import Image from "../src/react-native/Image";
import pStore from "../src/stores/PublicStore";
import { IoIosLink } from "react-icons/io";
import {set} from "mobx";
import Api from "../dataService/apiCaller";
import { FaStar,FaWindowClose } from "react-icons/fa";
import { IoMdHeartEmpty ,IoMdShare,} from "react-icons/io";
import { FaRegCommentDots } from "react-icons/fa";
import translate from '../src/language/translate';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCogs, faCompass, faUser} from "@fortawesome/free-solid-svg-icons";
let leavesCount=0


@observer
export default class userpage extends Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        this.getPageInfo();
    }
    
    calculateCount=(user)=>{
        leavesCount=leavesCount+user.subsets.length;
        for(let i=0;i<user.subsets.length;++i){
            this.calculateCount(user.subsets[i]);
        }
    }

    calculateTotalSubsetsCount=(subsets)=>{
        for(let p=0;p<subsets.length;++p){
            this.calculateCount(subsets[p]);
        }
    }

    getPageInfo=()=> {
        this.setState({loading:true})
            const pathname = window.location.pathname;
            this.userKey=pathname.split('/').join('');
           
            Api.post('members/getUserPage',{userKey: this.userKey})
                .then(users=>{
                  
                    if(users && users[0]){
                        let user =users[0];
                        this.user=user;
                        this.cUserId=users.cUserId;
                        this.userPosts=user.posts;
                        this.userFollowed=user.followeds;
                        this.userFollowers=user.followers;
                        this.isFollowing=this.user.followers.find(item=>item.followerId==this.cUserId);
                        this.isPageAdmin=pStore.cUser.userKey===user.userKey;
                        pStore.userPosts=user.posts;
                       
                        this.setState({loading:false});
                        getUserSubsetApi(user.id)
                        .then(subsetList=>{
                            
                            leavesCount=0;
                            pStore.subsetList=subsetList;
                            this.calculateTotalSubsetsCount(subsetList);
                            pStore.branchesCount=subsetList.length;
                            pStore.leavesCount=leavesCount;
                            this.isPageAdmin=pStore.cUser.userKey===user.userKey;
                           
                            this.setState({loading:false});
        
                        })
                        .catch(err=>{
                           
                            this.isPageAdmin=pStore.cUser.userKey===user.userKey;
                            this.setState({loading:false});
                        });
                    }else{
                        this.setState({loading:false});
                    }
                   
                }).catch((error)=>{
                    this.setState({loading:false});
                });
        
    }

    followUser=(followedId)=>{
        this.setState({loading:true});
        Api.post('Followers/followUser',{followedId: followedId})
        .then(users=>{
            this.getPageInfo();
            this.setState({loading:false,});
        }).catch((error)=>{
            this.setState({loading:false});
        });

    }


    render() {
        
       
        let title=this.user?this.user.displayName || this.user.fullName:''
        
        const toolbarAdminStyle = {
          
            title:  this.user?this.user.fullName+' ('+this.userKey+'@)':'صفحه من',
            end: {
                onPress: () => logoutApi(),
                icon: images.ic_Period,
            },
        };
        
        const toolbarStyle={
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
                                 customStyle={this.isPageAdmin?toolbarAdminStyle:toolbarStyle}
                                 isExpand={this.state.showAccountSelect }
                             />
                         }

                         footer={
                            <View style={{paddingHorizontal: 20}}>
                                {this.isPageAdmin &&(
                                    <NavBar navButtons={[
                                    {
                                        label: translate('پستها'),
                                        path: "/"+pStore.cUser.userKey,
                                        icon: <FontAwesomeIcon icon={faUser}/>
                                    },
                                    {
                                        label: translate('سرویسها'),
                                        path: "/myServices",
                                        icon: <FontAwesomeIcon icon={faCogs}/>
                                    },
                                    {
                                        label: translate('فالوبورد'),
                                       path: "/followboard",
                                        icon: <FontAwesomeIcon icon={faCompass}/>
                                    },
                                ]}/>
                                )}
                                
                            </View>
                        }>
                         
                             {this.user?(
                                <View style={{flex:1, marginTop: 0, alignItems: 'center'}}>
                                    <UserCard
                                        style={{maxWidth: 500,paddingTop: 25,paddingHorizontal:16}} 
                                        user={this.user}
                                        isFollowing={this.isFollowing}
                                        onPressFollowBotton={(followedId)=>this.followUser(followedId)}
                                        isPageAdmin={this.isPageAdmin}
                                     />
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
                                                fontSize:12,
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
                                                fontSize:12,
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
                      {/* <BgImageChacheProgress
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
                                ></BgImageChacheProgress> */}
                                <View style={{alignItems:'center'}}>
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
                                    canUpload={props.isPageAdmin}
                                    autoUpload={true}
                                    imageStyle={{height: 100, width: 100, borderRadius: 50}}
                                    image={user.profileImage}
                                    noImage={images.default_ProPic}
                                    hideDeleteBtn={true}
                                />
                                <Text style={{marginTop:5,fontWeight:800}}>{props.user.userKey}</Text>
                                </View>
                                 


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
                        {/* <View style={{alignItems: 'center', paddingHorizontal: 15}}>
                            <Text style={{fontSize: 12}}>عضو</Text>
                            <Text style={{fontSize: 12}}>{pStore.branchesCount + pStore.leavesCount +user.followers.length+ 1}</Text>
                        </View> */}
                         <TouchableOpacity 
                            style={{alignItems: 'center', paddingHorizontal: 15}}
                            onPress={()=>{
                                if(user.followers.length>0){
                                    navigation.navigate('userfollowers',{uidc:user.id,userKey:user.userKey});
                                }
                            }}
                         >
                            <Text style={{fontSize: 12}}>فالور</Text>
                            <Text style={{fontSize: 12}}>{user.followers.length}</Text>
                        </TouchableOpacity>
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
            {props.isPageAdmin?(
                <View style={{flexDirection:'row'}}>
                <TouchableOpacity
                    onPress={()=>{navigation.navigate('edit_profile')}}
                    style={{
                        flex:1,
                        margin:10,
                        width:'100%',
                        width:140,
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
                    onPress={()=>{navigation.navigate('myNetwork')}}
                    style={{
                        flex:1,
                        margin:10,
                        width:'100%',
                        maxWidth:300,
                        width:140,
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

                    <Text style={{fontSize:12,color:bgWhite,paddingHorizontal:5}}>شبکه من</Text>
                </TouchableOpacity>
            </View>
            ):(
                <View style={{flexDirection:'row'}}>
                <TouchableOpacity
                    onPress={()=>{props.onPressFollowBotton(user.id)}}
                    style={{
                        flex:1,
                        margin:10,
                        width:'100%',
                        maxWidth:300,
                        borderRadius:8,
                        flexDirection:'row',
                        justifyContent:'center',
                        padding:10,
                        backgroundColor: props.isFollowing?bgSuccess:orange1
                    }}>
                    <Image source={images.ic_Information} style={{
                        width: 24,
                        height: 24,
                        tintColor:bgWhite
                    }}/>
                    <Text style={{fontSize:12,color:bgWhite,paddingHorizontal:5}}>{props.isFollowing?'رها کردن':'دنبال کردن'}</Text>
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
            )

            }
            
        </View>

    )
});

export const UserPosts = observer(props => {
    const [loading, setLoading] = useState(false);
    const [itemWidth, setItemWidth] = useState(100);
    //const [posts, setPosts] = useState([{image:images.ic_Social_Telegram}]);
   
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

    const pathname = window.location.pathname;
    const userKey=pathname.split('/').join('');
    const isPageAdmin=pStore.cUser.userKey===userKey;
    let posts=[];
    
    if(isPageAdmin){
        posts=[{file:images.ic_add}].concat(pStore.userPosts);
    }else{
        posts=pStore.userPosts;
    }
    
    return (
        <View style={{flex:1,marginTop:2}}>
            <FlatList
                loading={loading}
                style={{justifyContent:'center'}}
                keyExtractor={(item, index) => index.toString()}
                data={posts}
                listFormat='wrap'
                ListEmptyComponent={null}
                renderItem={({item, index}) =>{
                    if(index==0 && isPageAdmin)
                        return(
                            <ImageSelector
                                style={{
                                    alignItems:'center',
                                    justifyContent:'center',
                                    width:itemWidth,
                                    height:itemWidth,
                                    borderRadius:4,
                                    margin:2,
                                    backgroundColor:textGray,
                                    borderColor:borderLight,
                                    borderWidth:0.4,
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
                                <View style={{flex:1,width:'100%', height:'100%',justifyContent:'center',alignItems:'center',backgroundColor:'gray'}}>
                                    <IconApp
                                        class={'apic_addcircle'}
                                        style={{
                                            tintColor:bgWhite,
                                            width:50,
                                            height:50,

                                        }}
                                    />
                                        <Text style={{fontSize:11,color:bgWhite}} >پست جدید</Text>
                                    </View>
                            </ImageSelector>
                        )
                    
                    return (
                        <TouchableOpacity
                            onPress={()=>{
                                navigation.navigateTo('view_post',{postId:item.id});
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



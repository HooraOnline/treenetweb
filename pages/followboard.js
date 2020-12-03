import React, { Component, useEffect, useState } from 'react';
import PanelLayout from "../src/components/layouts/PanelLayout";
import { ImageSelector, Toolbar } from "../src/components";
import { navigation, showMassage } from "../src/utils";
import images from "../public/static/assets/images";
import {
    bgEmpty,
    bgScreen,
    bgWhite,
    borderLight,
    itemListText,
    primaryDark,
    subTextItem,
    textGray,
    textItem, yellowmin
} from "../src/constants/colors";
import NavBar from "../src/components/layouts/NavBar";
import { FlatList, Image, Text, TouchableOpacity, View, } from "../src/react-native";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCogs, faCompass, faUser } from "@fortawesome/free-solid-svg-icons";
import translate from "../src/language/translate";
import copy from "copy-to-clipboard";
import { persistStore, } from "../src/stores";
import ShareLink from "./sections/ShareLink";
import { observer } from "mobx-react";
import { getFileUri, postQuery } from "../dataService/apiService";
import pStore from "../src/stores/PublicStore";
import Api from "../dataService/apiCaller";

import { IoMdHeart, IoMdHeartEmpty, IoMdShare } from "react-icons/io";
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


    async componentDidMount() {

    }

    render() {
        const toolbarStyle = {
            start: {
                content: images.ic_back,
                onPress: () => navigation.goBack(),
            },
            title: 'فالوبورد',
        };

        return (
            <PanelLayout title={`Panel`} loading={this.state.loading} loadingMessage={this.state.loadingMessage} showMenu={this.state.showMenu}
                onRef={(initDrawer) => this.initDrawer = initDrawer}
                onCloseMenu={() => this.setState({ showMenu: false })}
                style={{ margin: 0 }}
                header={
                    <Toolbar
                        customStyle={toolbarStyle}
                        isExpand={this.state.showAccountSelect}
                    />
                }
                footer={
                    <View style={{ paddingHorizontal: 20 }}>
                        <NavBar navButtons={[
                            {
                                label: translate('پستها'),
                                path: "/" + pStore.cUser.userKey,
                                icon: <FontAwesomeIcon icon={faUser} />
                            },
                            {
                                label: translate('سرویسها'),
                                path: "/myServices",
                                icon: <FontAwesomeIcon icon={faCogs} />
                            },
                            {
                                label: translate('فالوبورد'),
                                path: "/followboard",
                                icon: <FontAwesomeIcon icon={faCompass} />
                            }
                        ]} />
                    </View>
                }>
                <View style={{ flex: 1, paddingBottom: 40, paddingTop: 16 }}>
                    <View style={{ padding: 0, marginTop: 0, alignItems: 'center' }}>
                        <PostList />
                    </View>
                </View>
            </PanelLayout>


        )
    }

}

export const PostCard = observer(props => {
    const item = props.item;
    const member = item.member;
    let { profileImage, userKey, avatar } = member;
    const [loading, setLoading] = useState(100);
    const [useLike, setUserLike] = useState(item.myLike.length);

    const [likesCount, setLikesCount] = useState(item.likes.length);
    const [mySeen, setMySeen] = useState(item.mySeen.length);
    const [commentsCount, setCommentsCount] = useState(item.comments.length);
     const [seenCount, setSeenCount] = useState( item.seens.length);
    
   
  
    useEffect(() => {
      
    }, []);
    const addSeen = (postId) => {
        if (mySeen) {
            return;
        }
        Api.post('seens/seenPost', { postId: postId })
            .then(seen => {
                setMySeen(true);
                setSeenCount(seenCount+1);
            }).catch((error) => {
                console.log(error);
            })
    }

   


    const like = (postId) => {
        setLoading(true);
        Api.post('likes/likePost', { postId: postId })
            .then(like => {
                setUserLike(true);
                setLikesCount(likesCount + 1);
            }).catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const unlike = (postId) => {
        setLoading(true);
        Api.post('likes/unlikePost', { postId: postId })
            .then(like => {
                setUserLike(false);
                setLikesCount(likesCount - 1);
            }).catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }



    return (
     
            <TouchableOpacity style={{ flex: 1 }} onTouchStart={()=>addSeen(item.id)} onMouseOver={()=>addSeen(item.id)}>
                <TouchableOpacity
                    onPress={() => location.pathname = item.member.userKey}
                    style={{ flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 10 }}>
                    <Image
                        source={getFileUri('member', profileImage)}
                        style={{
                            width: 60,
                            height: 60,
                            borderRadius: 30,
                        }}
                    />
                    <View style={{ padding: 5, flex: 1, justifyContent: 'center' }}>
                        <Text style={{ fontSize: 12, fontWeight: 800, }}>{userKey}</Text>
                        <Text style={{ fontSize: 10, color: textItem }}>{avatar}</Text>
                    </View>
                </TouchableOpacity>
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        maxWidth: global.width,
                        height: global.width / 2,
                        maxHeight: global.width / 2,
                        borderRadius: 0,
                        borderWidth: 0.4,
                        borderColor: borderLight,
                        margin: 1,
                        position: 'relative',
                    }}>
                    {item.isSpecial && (
                        <FaStar
                            size={30}
                            color={yellowmin}
                            style={{
                                position: 'absolute',
                                top: 5,
                                left: 5
                            }}
                        />
                    )}
                    <Image
                        source={getFileUri('post', item.file)}
                        style={{
                            width: global.width - 10,
                            height: '100%',

                        }}
                    />
                </View>
                <View style={{ flex: 1, padding: 10, paddingBottom: 30 }}>


                    <View style={{ flex: 1, flexDirection: 'row', marginTop: 5 }}>
                        {useLike ?
                            (<IoMdHeart size={25} color={'red'} style={{ marginRight: 10, marginLeft: 10 }} onClick={() => { unlike(item.id) }} />)
                            :
                            (<IoMdHeartEmpty size={25} style={{ marginRight: 10, marginLeft: 10 }} onClick={() => { like(item.id) }} />)
                        }
                        <IoMdShare size={25} style={{ marginRight: 10, marginLeft: 10 }} />
                        <FaRegCommentDots size={25} style={{ marginRight: 10, marginLeft: 10 }} onClick={() => {

                            navigation.navigate('comments', { postId: item.id });

                        }} />
                    </View>

                    {item.text ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                            <Text dir='ltr' style={{ fontSize: 12, fontWeight: 800, marginEnd: 4 }}>@{item.member.userKey}</Text>
                            <Text style={{ fontSize: 12, }}>{item.text}</Text>
                        </View>
                    ) : null}

                    <View style={{ marginHorizontal: 16, }}>
                        <View style={{ flexDirection: 'row' }}>
                            {likesCount ? (
                                <Text dir='ltr' style={{ fontSize: 11, color: subTextItem, marginTop: -5, }}>{likesCount} like</Text>
                            ) :  <Text dir='ltr' style={{ fontSize: 10, color: subTextItem, marginTop: -5, }}> لینک پنج لایک کننده اول در اینجا نمایش داده می شود اولین لایک کننده این پست باشید.</Text>}
                            {seenCount ? (
                                <Text dir='ltr' style={{ fontSize: 11, color: subTextItem, marginTop: -5, marginHorizontal: 20 }}> {seenCount} seen</Text>
                            ) : null}
                        </View>

                        {item.firstComment.length ? (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text dir='ltr' style={{ fontSize: 12, fontWeight: 800, marginEnd: 10 }}>@{item.firstComment[0].member.userKey}</Text>
                                <Text style={{ fontSize: 12, }}> {item.firstComment[0].text}</Text>
                            </View>

                        ) : (
                            <TouchableOpacity onPress={() => {
                                navigation.navigate('comments', { postId: item.id });
                            }} >
                                <Text style={{ fontSize: 10, color: subTextItem }}> اولین کامنت همیشه در اینجا نمایش داده می شود. اولین کامنت دهنده این پست باشید.</Text>
                            </TouchableOpacity>
                        )}


                        {commentsCount > 2 ? (
                            <TouchableOpacity onPress={() => {
                                navigation.navigate('comments', { postId: item.id });
                            }} >
                                <Text style={{ fontSize: 10, color: subTextItem }}> مشاهده {commentsCount - 1} کامنت دیگر</Text>
                            </TouchableOpacity>

                        ) :null}
                    </View>

                </View>
            </TouchableOpacity>
      

    )
});

export const PostList = observer(props => {
    const [loading, setloading] = useState(false);
    const [itemWidth, setItemWidth] = useState(100);
    const [posts, setPosts] = useState([{ image: images.ic_Social_Telegram }]);
    const [postList, setPostList] = useState([]);
    useEffect(() => {

        getFollowboardPosts();
    }, []);



    const getFollowboardPosts = (fields, include) => {
        setloading(true)
        Api.post('posts/getFollowboardPosts', { regentId: pStore.cUser.regentId })
            .then(posts => {
                debugger
                pStore.userPosts = posts;
                setPosts(posts)
            }).catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setloading(false);
            });
    };


    return (
        <FlatList
            loading={loading}
            style={{ justifyContent: 'center' }}
            keyExtractor={(item, index) => index.toString()}
            data={posts}
            ListEmptyComponent={
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: posts.length > 0 ? bgScreen : bgEmpty
                    }}>
                </View>
            }
            renderItem={({ item, index }) => {
                if (!item.member)
                    return null;

                return (
                    <PostCard item={item} />
                )
            }}
        />
    )
});





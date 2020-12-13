import React, { Component, useEffect, useState } from 'react';
import PanelLayout from "../src/components/layouts/PanelLayout";
import { ImageSelector, Toolbar } from "../src/components";
import { doDelay, navigation, showMassage } from "../src/utils";
import images from "../public/static/assets/images";
import {
    bgDarkBrown,
    bgEmpty,
    bgHeader,
    bgItemRed,
    bgOrang,
    bgScreen,
    bgSuccess,
    bgToolbarInfo,
    bgWhite,
    borderLight,
    gray,
    itemListText,
    orange1,
    primaryDark,
    subTextItem,
    textGray,
    textItem, yellowmin
} from "../src/constants/colors";
import NavBar from "../src/components/layouts/NavBar";
import { DateTime, FlatList, Image, Text, TouchableOpacity, View, } from "../src/react-native";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCogs, faCompass, faUser, faUsers, faBell } from "@fortawesome/free-solid-svg-icons";
import translate from "../src/language/translate";

import { observer } from "mobx-react";
import { getFileUri, getUserProfileApi, postQuery } from "../dataService/apiService";
import pStore from "../src/stores/PublicStore";
import Api from "../dataService/apiCaller";
import { IoMdHeart, IoMdHeartEmpty, IoMdShare } from "react-icons/io";
import { userStore } from '../src/stores';

@observer
export default class activity extends Component {
    constructor() {
        super();
        //globalState.changeStatusBarColor(primaryDark);
        //StatusBar.setTranslucent(false);

        this.state = {
            announceList: []
        };

    }


    async componentDidMount() {
        this.getUserAnnounce();
    }

    getUserAnnounce = () => {
        this.setState({ loading: true });

        Api.post('activities/getUserAnnounce', {})
            .then(announceList => {

                this.setState({ announceList: announceList })
            }).catch((error) => {
                showMassage('خطا در بارگذاری اعلانها')
            })
            .finally(() => {
                this.setState({ loading: false })
            });
    };

    render() {
        const toolbarStyle = {
            start: {
                content: images.ic_back,
                onPress: () => navigation.goBack(),
            },
            title: 'اعلانات',
        };

        return (
            <PanelLayout title={`اعلانات`} loading={this.state.loading} loadingMessage={this.state.loadingMessage}
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
                                icon: <FontAwesomeIcon icon={faCogs} />
                            },
                            {
                                label: translate('اعلانات'),
                                path: "/activity",
                                icon: <FontAwesomeIcon icon={faBell} />
                            },
                            {
                                label: translate('فالوبورد'),
                                path: "/followboard",
                                icon: <FontAwesomeIcon icon={faCompass} />
                            },
                        ]} />
                    </View>
                }>
                <View style={{ flex: 1, paddingBottom: 40, paddingTop: 16 }}>
                    <View style={{ padding: 0, marginTop: 0, }}>
                        <AnnounceList announceList={this.state.announceList} />
                    </View>
                </View>
            </PanelLayout>


        )
    }

}

const ShareItem = observer((props) => {

    const { profileImage, userKey, postId, file, text } = props.item;


    return (
        <View style={{ marginHorizontal: 30, marginTop: 7 }}>
            <View
                style={{
                    flexDirection: 'row',
                    width: '100%',
                    maxWidth: global.width,
                    //height: global.width / 2,
                    maxHeight: global.width / 2,
                    borderRadius: 0,
                    borderWidth: 0.4,
                    borderColor: borderLight,
                    margin: 1,
                    position: 'relative',
                }}>

                <View style={{ paddingHorizontal: 10, margin: 5, alignItems: 'center' }}>

                    <TouchableOpacity
                        onPress={() => location.pathname = userKey}
                        style={{ alignItems: 'center' }}>
                        <Image
                            source={getFileUri('member', profileImage)}
                            style={{
                                width: 60,
                                height: 60,
                                borderRadius: 30,
                            }}
                        />
                        <Text dir='ltr' style={{ fontSize: 12, fontWeight: 800, }}>{userKey}</Text>

                    </TouchableOpacity>

                    <IoMdShare size={25} style={{ marginTop: 16 }}
                        onClick={() => {
                            navigation.navigateTo('sharePost', { postId: postId });
                        }}
                    />


                </View>

                <View style={{ marginTop: 10 }}>
                    <Image
                        source={getFileUri('post', file)}
                        style={{
                            //width: global.width - 70,
                            height: global.width / 2.3,


                        }}
                    />
                    <Text style={{ fontSize: 12, margin: 10, }}>{userKey}@ {text}</Text>
                </View>
            </View>
        </View>
    )
})



export const AnnounceList = observer(props => {
    const [loading, setLoading] = useState(false);


    useEffect(() => {

    }, []);

    const followUser = async (followedId) => {
        setLoading(true);
        Api.post('Follows/followUser', { followedId: followedId })
            .then(users => {

                getUserProfileApi()
                    .then(users => {

                        pStore.cUser = users;
                        setLoading(false);
                    })
                    .catch(err => {
                        setLoading(false);
                    });

            }).catch((error) => {
                setLoading(false);
            });
    }

    return (
        <FlatList
            loading={loading}
            style={{ justifyContent: 'center' }}
            keyExtractor={(item, index) => index.toString()}
            data={props.announceList}
            ListEmptyComponent={
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        // backgroundColor: props.announceList.length > 0 ? bgScreen : bgEmpty
                    }}>
                    <Text style={{ marginTop: 24 }}>فعلا اعلانی وجود ندارد.</Text>
                </View>
            }
            renderItem={({ item, index }) => {
                let profileImage;
                let userKey;
                let file;
                let text;
                let memberId;
                let memberProfileImage;
                let memberDisplayName;
                let memberUserKey
                let postId;

                let activity = item[item.action];
                let post = activity.post;
                let isFollowing;

                let commentText;

                if (post) {
                    profileImage = post.member.profileImage;
                    userKey = post.member.userKey;
                    file = post.file;
                    text = post.text;
                    memberProfileImage = activity.member.profileImage;
                    memberUserKey = activity.member.userKey;
                    memberDisplayName = activity.member.displayName;
                    memberId = activity.member.id;
                    postId = activity.post.id;
                }

                let actionMessage = '';
                if (item.type == 'join_to_network') {
                    actionMessage = 'دعوت کننده شما بوده و پستهای ویژه او در فالوبرد شما نمایش داده می شود.';
                    memberId = activity.id;
                    memberProfileImage = activity.profileImage;
                    memberUserKey = activity.userKey;
                    memberDisplayName = activity.displayName;
                } if (item.type == 'join_to_your_braches') {
                    actionMessage = 'به شبکه شما پیوست(شاخه) .';
                    memberId = activity.id;
                    memberProfileImage = activity.profileImage;
                    memberUserKey = activity.userKey;
                    memberDisplayName = activity.displayName;
                } else if (item.type == 'join_to_your_leaves') {
                    actionMessage = 'به شبکه شما پیوست(زیرشاخه).';
                    memberId = activity.id;
                    memberProfileImage = activity.profileImage;
                    memberUserKey = activity.userKey;
                    memberDisplayName = activity.displayName;
                } else if (item.type == 'like_post') {
                    actionMessage = 'پست شما را لایک کرد.';
                } else if (item.type == 'share_post') {
                    actionMessage = 'این پست را با شما به اشتراک گذاشت.';
                } else if (item.type == 'share_your_post') {
                    actionMessage = 'پست شما را به اشتراک گذاشت.';

                } else if (item.type == 'replay_comment') {
                    actionMessage = 'به کامنت شما پاسخ داد.';
                    commentText = activity.text;
                } else if (item.type == 'follow_you') {
                    actionMessage = 'شما را دنبال کرد.';
                    memberId = activity.follower.id;
                    memberProfileImage = activity.follower.profileImage;
                    memberUserKey = activity.follower.userKey;
                    memberDisplayName = activity.follower.displayName;
                    isFollowing = pStore.cUser.followeds.find(item => item.followedId == memberId);
                } else if (item.type == 'unfollow_you') {
                    actionMessage = 'شما را آنفالو کرد.';
                    memberId = activity.follower.id;
                    memberProfileImage = activity.follower.profileImage;
                    memberUserKey = activity.follower.userKey;
                    memberDisplayName = activity.follower.displayName;
                    isFollowing = pStore.cUser.followers.find(item => item.followerId == memberId);
                }

                return (
                    <View style={{ flex: 1, marginTop: 16 }}>
                        <View style={{ flex: 1, marginHorizontal: 10, }}>
                            <TouchableOpacity
                                onPress={() => location.pathname = memberUserKey}
                                style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 5, }}>
                                <Image
                                    source={getFileUri('member', memberProfileImage)}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 30,
                                    }}
                                />
                                <View style={{ padding: 5, flex: 1, justifyContent: 'center' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 11, fontWeight: 100 }}>{memberDisplayName + ' ' + actionMessage} </Text>
                                        {/* <Text dir='ltr' style={{ fontSize: 10, color: subTextItem }}>{'@' +memberUserKey} </Text> */}
                                        {/* <Text style={{ fontSize: 10, color: itemListText ,paddingHorizontal:4}}> { actionMessage}  </Text> */}
                                    </View>
                                    <Text style={{ color: textItem, fontSize: 12 }}>{commentText}</Text>

                                    {/* <DateTime format='jYYYY/jM/jD HH:mm' style={{ color: subTextItem, fontSize: 10 }} >
                                        {item.cdate.timeToNow()}
                                    </DateTime> */}
                                   
                                </View>

                            </TouchableOpacity>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'space-between', alignItems: 'center',paddingHorizontal:10 }}>
                                <Text style={{ color: subTextItem, fontSize: 10,paddingStart:40 }}>{item.cdate.timeToNow()}</Text>
                                {file && (
                                    <TouchableOpacity
                                       
                                        onPress={() => {
                                            navigation.navigateTo('view_post', { postId: postId });
                                        }}
                                    >
                                        <Image
                                            source={getFileUri('post', file)}
                                            style={{
                                                width: 100,
                                                height: 100,
                                                borderRadius: 8,

                                            }}
                                        />
                                    </TouchableOpacity>
                                )}

                                {item.type === 'follow_you' && (
                                    <TouchableOpacity
                                        onPress={() => { followUser(memberId) }}
                                        style={{

                                            borderRadius: 4,
                                            width: 55,
                                            height: 30,
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            padding: 2,
                                            backgroundColor: isFollowing ? bgSuccess : orange1
                                        }}>
                                        <Image source={loading ? images.ic_more : images.ic_Information} style={{
                                            width: 20,
                                            height: 20,
                                            tintColor: bgWhite
                                        }} />
                                        <Text style={{ fontSize: 10, color: bgWhite, paddingHorizontal: 5 }}>{isFollowing ? 'رها کردن' : 'دنبال کردن'}</Text>
                                    </TouchableOpacity>
                                )}

                                {item.action === 'join' && (
                                    <TouchableOpacity
                                        onPress={() => location.pathname = memberUserKey}
                                        style={{
                                            borderRadius: 4,
                                            width: 45,
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            padding: 2,
                                            backgroundColor: bgSuccess
                                        }}>
                                        <Text style={{ fontSize: 10, color: bgWhite, paddingHorizontal: 5 }}>مشاهده </Text>
                                    </TouchableOpacity>
                                )}
                            </View>


                        </View>
                        {/* {item.type=='share_post' &&(
                             <ShareItem item={{profileImage,userKey,postId,file,text}} />
                        )} */}

                    </View>
                )
            }}
        />


    )
});







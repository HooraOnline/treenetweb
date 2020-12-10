import React, { Component, useEffect, useState } from 'react';
import PanelLayout from "../src/components/layouts/PanelLayout";
import { ImageSelector, Toolbar } from "../src/components";
import { doDelay, navigation, showMassage } from "../src/utils";
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
import { DateTime, FlatList, Image, Text, TouchableOpacity, View, } from "../src/react-native";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCogs, faCompass, faUser, faComments, faBell } from "@fortawesome/free-solid-svg-icons";
import translate from "../src/language/translate";

import { observer } from "mobx-react";
import { getFileUri, postQuery } from "../dataService/apiService";
import pStore from "../src/stores/PublicStore";
import Api from "../dataService/apiCaller";
import { IoMdHeart, IoMdHeartEmpty, IoMdShare } from "react-icons/io";

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
        debugger
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
                                label: translate('من'),
                                path: "/" + pStore.cUser.userKey,
                                icon: <FontAwesomeIcon icon={faUser} />
                            },
                            //  {
                            //     label: translate('گفتگو'),
                            //     path: "/myChat",
                            //     icon: <FontAwesomeIcon icon={faComments}/>
                            // },
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

export const AnnounceList = observer(props => {
    const [loading, setloading] = useState(false);

    useEffect(() => {

    }, []);

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
                let { profileImage, userKey, avatar } = item.share.post.member;
                let { file, isSpecial, text, } = item.share.post;

                const senderProfileImage = item.share.sender.profileImage;
                const senderUserKey = item.share.sender.userKey;
                const postId =item.share.post.id;


                return (
                    <View style={{ flex: 1,marginTop:16 }}>

                        <TouchableOpacity
                            onPress={() => location.pathname = senderUserKey}
                            style={{ flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 10, marginTop: 16, marginHorizontal: 16 }}>
                            <Image
                                source={getFileUri('member', senderProfileImage)}
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 30,
                                }}
                            />
                            <View style={{ padding: 5, flex: 1, justifyContent: 'center' }}>
                                <Text dir='ltr' style={{ fontSize: 12, }}>پست زیر را با شما به اشتراک گذاشت @{senderUserKey} </Text>
                                <DateTime format='jYYYY/jM/jD HH:mm' style={{ color: subTextItem, fontSize: 10 }} >
                                    {item.cdate}
                                </DateTime>
                            </View>
                        </TouchableOpacity>



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
                                        style={{  alignItems: 'center' }}>
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
                                    <IoMdShare size={25} style={{marginTop:16}}
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
                    </View>
                )
            }}
        />


    )
});





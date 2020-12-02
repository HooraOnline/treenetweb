import React, { Component, useEffect, useState } from 'react';
import PanelLayout from "../src/components/layouts/PanelLayout";
import { FloatingLabelTextInput, ImageSelector, Toolbar } from "../src/components";
import { doDelay, navigation, showMassage } from "../src/utils";
import images from "../public/static/assets/images";
import {
    bgEmpty,
    bgScreen,
    bgWhite,
    border,
    borderLight,
    gray,
    itemListText,
    primaryDark,
    subTextItem,
    textGray,
    textItem, textItemBlack, yellowmin
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

import { IoMdHeartEmpty, IoMdShare } from "react-icons/io";
import { FaRegCommentDots } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
@observer
export default class comments extends Component {
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
            userKey: '',
            comments: []
        };
        this.userKey = '';
    }


    async componentDidMount() {
        doDelay(150)
            .then(() => {
                this.postId = navigation.getParam('postId');

                if (this.postId) {
                    this.getComments();
                }
            })
    }

    getComments = () => {
        this.setState({ loading: true })

        Api.post('posts/geComments', { postId: this.postId })
            .then(post => {

                if (post[0]) {
                    this.setState({ post: post[0] })
                }
            }).catch((error) => {
                showMassage('خطا در بارگذاری کامنتها');
            })
            .finally(() => {
                this.setState({ loading: false });
            });
    };

    addComment = (commentId) => {
        this.setState({ loading: true })
        const comment = { postId: this.postId, text: this.state.text };
        if(commentId) comment.parentId=commentId;

        Api.post('Comments/addComment', comment)
            .then(comment => {
                this.setState({ text: '' })
                this.getComments({ comment: comment })
            }).catch((error) => {
                showMassage('خطایی رخ داد، دوباره تلاش کنید.');
            })
            .finally(() => {
                this.setState({ loading: false });
            });
    };
    keyPress = (e) => {
        if (e.keyCode === 13) {
            this.addComment();
        }
    }

    render() {
        const toolbarStyle = {
            start: {
                content: images.ic_back,
                onPress: () => navigation.goBack(),
            },
            title: 'کامنتها',
        };

        return (
            <PanelLayout title={`کامنتها`} loading={this.state.loading} loadingMessage={this.state.loadingMessage}
                onRef={(initDrawer) => this.initDrawer = initDrawer}
                onCloseMenu={() => this.setState({ showMenu: false })}
                style={{ margin: 0 }}
                header={
                    <View>
                        <Toolbar
                            customStyle={toolbarStyle}
                            isExpand={this.state.showAccountSelect}
                        />
                        <View style={{ flex: 1, backgroundColor: gray, padding: 5, justifyContent: 'center' }}>
                            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: bgWhite, borderRadius: 16, alignItems: 'center' }}>
                                <FloatingLabelTextInput
                                    //dir={'ltr'}
                                    //reverse={persistStore.isRtl}
                                    style={{ flex: 1, paddingHorizontal: 5, paddingVertical: 5, paddingTop: 7 }}
                                    placeholder={translate("متن کامنت")}
                                    value={this.state.text}
                                    onChangeText={text => {
                                        this.setState({ text })

                                    }}
                                    numberOfLines={1}
                                    isAccept={this.state.mobileValidation}
                                    textInputStyle={{
                                        fontFamily: 'IRANYekanFaNum-Bold',
                                        fontSize: 12,
                                        color: textItemBlack,
                                        paddingStart: 10,
                                        paddingTop: 0,
                                        paddingBottom: 0,
                                        //textAlign: 'left',
                                    }}
                                    underlineSize={0}
                                    multiline={true}
                                    maxLength={2000}
                                    autoFocus={true}
                                    onKeyDown={(e) => this.keyPress(e)}
                                    returnKeyType="done"

                                />
                                <TouchableOpacity
                                    style={{ width: 50, alignItems: 'center', justifyContent: 'center', padding: 7, margin: 0, borderRadius: 12 }}
                                    onPress={this.addComment}
                                >
                                    <Text style={{ color: bgWhite, fontSize: 12, color: primaryDark, fontWeight: 900 }}>ارسال</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>

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
                            },
                        ]} />
                    </View>
                }>
                <View style={{ flex: 1, paddingBottom: 16, paddingTop: 60 }}>
                    {this.state.post && (
                        <CommentList post={this.state.post} onReplay={this.addComment}/>
                    )}

                </View>
            </PanelLayout>


        )
    }

}

export const CommentList = observer(props => {

    const [loading, setloading] = useState(false);

    useEffect(() => {

    }, []);

    return (
        <FlatList
            loading={loading}
            style={{ justifyContent: 'center', }}
            keyExtractor={(item, index) => index.toString()}
            data={props.post.comments}
            ListEmptyComponent={
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: props.post.comments.length > 0 ? bgScreen : bgEmpty
                    }}>
                </View>
            }
            ListHeaderComponent={
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, marginTop: 15 }}>
                        <TouchableOpacity
                            onPress={() => location.pathname = props.post.member.userKey}
                            style={{}}>
                            <Image
                                source={getFileUri('member', props.post.member.profileImage)}
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 30,
                                }}
                            />
                        </TouchableOpacity>

                        <View style={{ flexDirection: 'row', padding: 5, flex: 1, alignItems: 'center' }}>
                            <TouchableOpacity
                                onPress={() => location.pathname = props.post.member.userKey}
                                style={{}}>
                                <Text style={{ fontSize: 12, fontWeight: 800, }}>{props.post.member.userKey}</Text>
                                {/* <Text style={{ fontSize: 9, color: textItem }}>{props.post.member.avatar}</Text>  */}
                            </TouchableOpacity>
                            <Text style={{ fontSize: 10, color: textItem, marginHorizontal: 5 }}>{props.post.text}</Text>
                        </View>
                    </View>
                    <View style={{ height: 1, width: '100%', backgroundColor: borderLight, marginVertical: 10, margin: 5, }}></View>
                </View>
            }
            renderItem={({ item, index }) => {
                if (!item.member)
                    return null;
                let { profileImage, userKey, avatar } = item.member;
                const profileImg = getFileUri('member', profileImage);

                return (
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, marginTop: 15 }}>
                            <TouchableOpacity
                                onPress={() => location.pathname = item.member.userKey}
                                style={{}}>
                                <Image
                                    source={profileImg}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 20,
                                    }}
                                />
                            </TouchableOpacity>

                            <View style={{ flexDirection: 'row', padding: 5, flex: 1, alignItems: 'center' }}>
                                <TouchableOpacity
                                    onPress={() => location.pathname = item.member.userKey}
                                    style={{}}>
                                    <Text style={{ fontSize: 12, fontWeight: 800, }}>{userKey}</Text>
                                    {/* <Text style={{ fontSize: 9, color: textItem }}>{avatar}</Text> */}
                                </TouchableOpacity>
                                <Text style={{ fontSize: 10, color: textItem, marginHorizontal: 5 }}>{item.text}</Text>
                            </View>

                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', margin: 24 }} >
                            <Text style={{ fontSize: 9, color: subTextItem, }}>{item.cdate.timeToNow()}</Text>
                            <TouchableOpacity style={{marginHorizontal:10}} 
                            onPress={()=>props.onReplay(item.id)}>
                                <Text style={{ fontSize: 9, color: subTextItem, }}>پاسخ</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }}
        />


    )
});





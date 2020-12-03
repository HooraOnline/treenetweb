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
    borderGray,
    borderLight,
    gray,
    itemListText,
    primaryDark,
    subTextItem,
    textDisabled,
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
        this.commentInput = React.createRef();
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

    addComment = () => {
        this.setState({ loading: true })
        const text = this.state.replayId ? ('@' + this.state.replayId + this.state.text) : this.state.text
        const comment = { postId: this.postId, text: text };
        if (this.state.replayId) {

            comment.commentId = this.state.replayId;
        }

        Api.post('Comments/addComment', comment)
            .then(comment => {
                this.setState({ text: '', replayId: null, replyTo: '' })
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

    onReplay = (item, fatherComment) => {

        this.setState({ replyTo: '@' + item.member.userKey + ' ', replayId: fatherComment.id });
        this.commentInput.current.textInput.current.childNodes[0].focus();
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
                                <Text dir='ltr' style={{ color: bgWhite, fontSize: 12, color: border, fontWeight: 900, marginHorizontal: 10 }}>{this.state.replyTo}</Text>
                                <FloatingLabelTextInput
                                    //dir={'ltr'}
                                    //reverse={persistStore.isRtl}
                                    ref={this.commentInput}
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
                                    disabled={!this.state.text}
                                    style={{ alignItems: 'center', justifyContent: 'center', padding: 7, margin: 0, borderRadius: 12 }}
                                    onPress={this.addComment}
                                >
                                    <Text style={{ color: this.state.text ? primaryDark : textDisabled, fontSize: 11, fontWeight: 900 }}>ارسال</Text>
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
                        <CommentList post={this.state.post} onReplay={this.onReplay} />
                    )}

                </View>
            </PanelLayout>


        )
    }

}
export const ReplyCard = observer(props => {
    debugger
    const [loading, setloading] = useState(false);
    const { profileImage, userKey, avatar } = props.reply.member;
    const {text,cdate}= props.reply;

    const profileUrl = getFileUri('member', profileImage);
  

    useEffect(() => {

    }, []);


    return (
        
         <View>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, marginTop: 10 }}>
                    <TouchableOpacity
                        onPress={() => location.pathname = userKey}
                        style={{}}>
                        <Image
                            source={profileUrl}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                            }}
                        />
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', padding: 5, flex: 1, alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => location.pathname = userKey}
                            style={{}}>
                            <Text style={{ fontSize: 12, fontWeight: 800, }}>{userKey}</Text>
                            {/* <Text style={{ fontSize: 9, color: textItem }}>{avatar}</Text> */}
                        </TouchableOpacity>
                        <Text style={{ fontSize: 10, color: textItem, marginHorizontal: 5 }}>{text}</Text>
                    </View>

                </View>
                <View style={{ flex: 1, flexDirection: 'row', marginHorizontal: 24,marginVertical:10 }} >
                    <Text style={{ fontSize: 10, color: subTextItem, }}>{cdate.timeToNow()}</Text>
                    <TouchableOpacity style={{ marginHorizontal: 10 }}
                        onPress={() => props.onReplay(reply, (props.mainComment || reply))}>
                        <Text style={{ fontSize: 10, color: subTextItem, fontWeight: 800 }}>پاسخ</Text>
                    </TouchableOpacity>
                </View>
            </View>

    )
});

export const CommentCard = observer(props => {
    debugger
    const [showReply, setShowReply] = useState(false);
    const comment = props.comment;
  
    useEffect(() => {

    }, []);


    return (
        
            <View style={{ flex: 1 }}>
                <ReplyCard reply={comment}/>
                
                {comment.comments.length && (
                    <View>
                        <TouchableOpacity onPress={() =>{
                                
                                setShowReply(!showReply);
                            }}>
                            <Text style={{ fontSize: 12, color: subTextItem, marginHorizontal: 24 }}>_______{showReply ? 'پنهان کردن پاسخ ها' : 'مشاهده پاسخ ها'}({comment.comments.length})_______</Text>
                        </TouchableOpacity>

                        {showReply && comment.comments.map(reply => (
                            <View style={{ flex: 1, marginRight: 24 }} >
                                <ReplyCard reply={reply} mainComment={comment}/>
                            </View>
                        ))}
                    </View>
                )}
            </View>

    )
});

export const CommentList = observer(props => {
    debugger
    const [loading, setloading] = useState(false);
    const [flag, setFlag] = useState();

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


                return (
                    <CommentCard comment={item}/>
                )
            }}
        />


    )
});





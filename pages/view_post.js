import React, { Component } from 'react';
import { Platform, Text, TouchableOpacity, View, StyleSheet, Image, IconApp } from "../src/react-native";

import PanelLayout from "../src/components/layouts/PanelLayout";
import { AlertMessage, OverlayModal, Toolbar, } from "../src/components";
import { doDelay, navigation, showMassage, waitForData } from "../src/utils";
import images from "../public/static/assets/images";
import {

    border,
    textItem, yellowmin, primary, borderLight, subTextItem
} from "../src/constants/colors";
import translate from "../src/language/translate";
import { getFileUri, postQuery } from "../dataService/apiService";


import { IoMdHeart, IoMdHeartEmpty, IoMdShare } from "react-icons/io";
import { FaRegCommentDots } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import Api from '../dataService/apiCaller';
import DialogPopUp from '../src/components/basic/DialogPopUp';
import { pStore } from '../src/stores';

export default class view_post extends Component {
    constructor() {
        super();

        this.state = {

        };
    }

    componentDidMount() {
        this.getPost();
       
    }

    getPost(){
        let postId = navigation.getUrlParams().postId;

        this.setState({ loading: true });
        Api.post('posts/getById', { postId: postId })
            .then(post => {
              
                this.setState({
                    post,
                    like: post.myLike.length,
                    commentsCount: post.comments.length,
                    likesCount: post.likes.length,
                    userKey:post.member.userKey
                });
               
             
            }).catch((error) => {
                console.log(error);
            })
            .finally(() => {
                doDelay(pStore.cUser.userKey?1000:0)
                    .then(()=>{
                        this.isPageAdmin = pStore.cUser.userKey === this.state.userKey;
                        this.setState({ loading: false });
                    })
                
            });
    }

    like = (postId) => {
        this.setState({ loading: true });
        Api.post('likes/likePost', { postId: postId })
            .then(like => {
                this.setState({ loading: false, like: true });
            }).catch((error) => {
                console.log(error);
            })
            .finally(() => {
                this.setState({ loading: false });
            });
    }

    unlike = (postId) => {
        this.setState({ loading: true });
        Api.post('likes/unlikePost', { postId: postId })
            .then(res => {
                this.setState({ loading: false, like: false });
            }).catch((error) => {
                console.log(error);
            })
            .finally(() => {
                this.setState({ loading: false });
            });
    }

    onConfirmDelete = (postId) => {
        this.setState({ loading: true });
        Api.post('posts/removePost', { postId: postId })
            .then(res => {
                this.setState({ loading: false, like: false });
                navigation.goBack();
            }).catch((error) => {
                console.log(error);
            })
            .finally(() => {
                this.setState({ loading: false });
            });
    }




    render() {
        const toolbarStyle = {
            start: {
                content: images.ic_back,
                onPress: () => navigation.goBack(),
            },
            title: 'مشاهده پست',

        };
        let { post } = this.state
        if (!post)
            return null;
        let { profileImage, userKey, avatar } = post.member;
        
        debugger
        return (
            <PanelLayout
                loading={this.state.loading}
                loadingMessage={this.state.loadingMessage}
                title={`مشاهده پست`}
                showMenu={this.state.showMenu}
                style={{ alignItems: 'center', }}
                header={
                    <Toolbar
                        customStyle={toolbarStyle}
                        isExpand={this.state.showAccountSelect}
                    />
                }>
                <View style={{ flex: 1, paddingTop: 16 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                        <TouchableOpacity
                            onPress={() => navigation.replaceTo(userKey)}
                            style={{}}>
                            <View style={{ maxWidth: 90, alignItems: 'center' }}>
                                <Image
                                    source={getFileUri('member', profileImage)}
                                    style={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 30,
                                    }}
                                />
                                <Text style={{ fontSize: 12, fontWeight: 800, }}>{userKey}</Text>
                            </View>
                            <Text style={{ fontSize: 10, color: textItem, marginHorizontal: 10 }}>{avatar}</Text>
                        </TouchableOpacity>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 5 }}>
                            {this.state.showActions && (
                                <View style={{ flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 5 }}>
                                    <TouchableOpacity onPress={() => this.setState({ showDeletePopUp: true })}>
                                        <IconApp
                                            class={'apic_delete'}
                                            style={{
                                                width: 24,
                                                height: 24,
                                                tintColor: 'red'
                                            }}
                                        />
                                    </TouchableOpacity>

                                </View>
                            )}
                            {this.isPageAdmin && (
                                <TouchableOpacity onPress={() => this.setState({ showActions: !this.state.showActions })}>
                                    <IconApp
                                        class={'apic_more'}
                                        style={{
                                            width: 24,
                                            height: 24,
                                            tintColor: border
                                        }}
                                    />
                                </TouchableOpacity>
                            )
                            }
                        </View>

                    </View>
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
                        {post.isSpecial && (
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
                            source={getFileUri('post', post.file)}
                            style={{
                                width: global.width - 10,
                                height: '100%',

                            }}
                        />

                    </View>
                    <View style={{ paddingHorizontal: 10, }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>

                            {this.state.like ?
                                (<IoMdHeart size={25} color={'red'} style={{ margin: 10 }} onClick={() => { this.unlike(post.id) }} />)
                                :
                                (<IoMdHeartEmpty size={25} style={{ margin: 10 }} onClick={() => { this.like(post.id) }} />)
                            }
                            <IoMdShare size={25} style={{ margin: 10 }} />
                            <FaRegCommentDots size={25} style={{ margin: 10 }} onClick={() => {

                                navigation.navigate('comments', { postId: post.id });

                            }} />

                        </View>
                    </View>
                    {post.text ? (
                        <View style={{ flexDirection: 'row', margin: 10 }}>
                            <Text dir='ltr' style={{ fontSize: 12, fontWeight: 800, marginEnd: 4 }}>@{post.member.userKey}</Text>
                            <Text style={{ fontSize: 12, }}>{post.text}</Text>
                        </View>
                    ) : null}

                    <View style={{ marginHorizontal: 16, }}>
                        <View style={{ flexDirection: 'row' }}>
                            {this.state.likesCount ? (
                                <Text dir='ltr' style={{ fontSize: 11, color: subTextItem, marginTop: -5, }}>{this.state.likesCount} like</Text>
                            ) : <Text dir='ltr' style={{ fontSize: 10, color: subTextItem, marginTop: -5, }}> لینک پنج لایک کننده اول در اینجا نمایش داده می شود اولین لایک کننده این پست باشید.</Text>}
                            {this.state.seenCount ? (
                                <Text dir='ltr' style={{ fontSize: 11, color: subTextItem, marginTop: -5, marginHorizontal: 20 }}> {this.state.seenCount} seen</Text>
                            ) : null}
                        </View>

                        {post.firstComment.length ? (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text dir='ltr' style={{ fontSize: 12, fontWeight: 800, marginEnd: 10 }}>@{post.firstComment[0].member.userKey}</Text>
                                <Text style={{ fontSize: 12, }}> {post.firstComment[0].text}</Text>
                            </View>

                        ) : (
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate('comments', { postId: post.id });
                                }} >
                                    <Text style={{ fontSize: 10, color: subTextItem }}> اولین کامنت همیشه در اینجا نمایش داده می شود. اولین کامنت دهنده این پست باشید.</Text>
                                </TouchableOpacity>
                            )}


                        {this.state.commentsCount > 2 ? (
                            <TouchableOpacity onPress={() => {
                                navigation.navigate('comments', { postId: post.id });
                            }} >
                                <Text style={{ fontSize: 10, color: subTextItem }}> مشاهده {this.state.commentsCount - 1} کامنت دیگر</Text>
                            </TouchableOpacity>

                        ) : null}
                    </View>
                </View>




                {this.state.showActions22 && (
                    <DialogPopUp
                        items={[
                            { name: 'حذف پست', callback: this.removePost.bind(this) },
                            { name: 'اشتراک گذاری', callback: this.removePost.bind(this) },
                        ]}
                        onClose={() => this.setState({ showActions: false })}
                    />)}

                <AlertMessage
                    visible={this.state.showDeletePopUp}
                    title="حذف پست"
                    message={
                        'آیا از حذف پست مطمئن هستید؟'
                    }
                    onConfirm={() => {
                        this.onConfirmDelete(post.id);
                    }}
                    onDismiss={() => this.setState({ showDeletePopUp: false })}
                    confirmTitle="بله"
                    dismissTitle="خیر"
                />

            </PanelLayout>

        )
    }

}




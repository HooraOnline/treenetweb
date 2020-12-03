import React, { Component } from 'react';
import { Platform, Text, TouchableOpacity, View, StyleSheet, Image, IconApp } from "../src/react-native";

import PanelLayout from "../src/components/layouts/PanelLayout";
import {  OverlayModal, Toolbar, } from "../src/components";
import {navigation, showMassage } from "../src/utils";
import images from "../public/static/assets/images";
import {
    
    border,
   textItem, yellowmin, primary, borderLight
} from "../src/constants/colors";
import translate from "../src/language/translate";
import { getFileUri, postQuery } from "../dataService/apiService";


import { IoMdHeart, IoMdHeartEmpty, IoMdShare } from "react-icons/io";
import { FaRegCommentDots } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import Api from '../dataService/apiCaller';
import DialogPopUp from '../src/components/basic/DialogPopUp';

export default class view_post extends Component {
    constructor() {
        super();

        this.state = {

        };
    }

    componentDidMount() {
        let post = navigation.getParam('post');
        if (!post) {
            return
        }

        this.setState({ post, like: post.myLike.length });
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
        debugger
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
    removePost = (postId) => {
        debugger
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
        let { profileImage, username, avatar } = post.member;
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
                    <View style={{ flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 10 }}>
                        <View style={{ flex: 1, alignItems: 'space-between', justifyContent: 'center' }}>
                            <Image
                                source={getFileUri('member', profileImage)}
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 30,
                                }}
                            />
                            <View style={{ padding: 5, flex: 1, justifyContent: 'center' }}>
                                <Text style={{ fontSize: 12, fontWeight: 800, }}>{username}</Text>
                                <Text style={{ fontSize: 10, color: textItem }}>{avatar}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => this.setState({ showActions: true })}>
                            <IconApp
                                class={'apic_more'}
                                style={{
                                    width: 24,
                                    height: 24,
                                    tintColor: border
                                }}
                            />
                        </TouchableOpacity>

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
                    <View style={{ flex: 1, padding: 10, paddingBottom: 30 }}>
                        <Text style={{ fontSize: 12, }}>{post.text}</Text>
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
                </View>
                {this.state.showActions && (
                        <DialogPopUp
                            items={[
                                { name: 'حذف پست', callback: this.removePost.bind(this) },
                                { name: 'اشتراک گذاری', callback: this.removePost.bind(this) },
                            ]}
                            onClose={() => this.setState({ showActions: false })}
                        />)}
               
            </PanelLayout>

        )
    }

}




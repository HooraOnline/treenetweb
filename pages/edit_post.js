import React, {Component} from 'react';
import {Platform, Text, TouchableOpacity, View, StyleSheet, Image} from "../src/react-native";
import {persistStore,pStore} from "../src/stores";
import PanelLayout from "../src/components/layouts/PanelLayout";
import {ImageSelector, SwitchTextMulti, Toolbar,} from "../src/components";
import {getTabWidth, mapNumbersToEnglish, navigation, showMassage} from "../src/utils";
import images from "../public/static/assets/images";
import {
    bgWhite,
    border,
    bgSuccess,
    lightRed,
    orange1,
    placeholderTextColor,
    primaryDark,
    textItemBlack, subTextItem, textItem, yellowmin, primary, borderLight
} from "../src/constants/colors";
import translate from "../src/language/translate";
import {getFileUri, postQuery} from "../dataService/apiService";
import FloatingLabelTextInput from "../src/components/FloatingLabelTextInput";
import TextInput from "../src/react-native/TextInput";

import { IoMdHeartEmpty ,IoMdShare} from "react-icons/io";
import { FaRegCommentDots } from "react-icons/fa";
import { FaStar } from "react-icons/fa";

export default class edit_post extends Component {
    constructor() {
        super();

        this.state = {

        };



    }

     componentDidMount() {
          debugger
         let post=navigation.getParam('post')
         this.setState({post})
    }



    render() {
        const toolbarStyle = {
            start: {
                content: images.ic_back,
                onPress: ()=>navigation.goBack(),
            },
            title: 'مشاهده پست',

        };
        let {post}=this.state
        if(!post)
            return null;
        let {profileImage,username,avatar}=post.member;
        return (
            <PanelLayout
                loading={this.state.loading}
                loadingMessage={this.state.loadingMessage}
                title={`مشاهده پست`}
                showMenu={this.state.showMenu}
                style={{alignItems:'center'}}
                header={
                    <Toolbar
                        customStyle={toolbarStyle}
                        isExpand={this.state.showAccountSelect }
                    />
                }>
                <View style={{flex:1}}>
                    <View style={{flexDirection:'row',justifyContent:'center',paddingHorizontal:10}}>
                        <Image
                            source={getFileUri('member',profileImage)}
                            style={{
                                width:60,
                                height:60,
                                borderRadius:30,
                            }}
                        />
                        <View style={{padding:5,flex:1,justifyContent:'center'}}>
                            <Text style={{ fontSize:14,fontWeight:800, }}>{username}</Text>
                            <Text style={{ fontSize:10,color:textItem}}>{avatar}</Text>
                        </View>
                    </View>
                    <View
                        style={{
                            alignItems:'center',
                            justifyContent:'center',
                            width:'100%',
                            maxWidth:global.width,
                            height:global.width/2,
                            maxHeight:global.width/2,
                            borderRadius:0,
                            borderWidth:0.4,
                            borderColor:borderLight,
                            margin:1,
                            position:'relative',
                        }}>
                        {post.isSpecial &&(
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
                            source={getFileUri('post',post.file)}
                            style={{
                                width:global.width-10,
                                height:'100%',

                            }}
                        />

                    </View>
                    <View style={{flex:1,padding:10,paddingBottom:30}}>
                        <Text style={{ fontSize:12,}}>{post.text}</Text>
                        <View style={{flex:1,flexDirection:'row'}}>
                            <IoMdHeartEmpty size={25} style={{margin:10}}/>
                            <IoMdShare size={25} style={{margin:10}}/>
                            <FaRegCommentDots size={25} style={{margin:10}}/>

                        </View>
                    </View>
                </View>
            </PanelLayout>

        )
    }

}




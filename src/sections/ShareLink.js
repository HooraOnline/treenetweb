import React, {Component, useEffect} from 'react';
import {showMassage} from "../../src/utils";

import {Image, Text, TextInput, TouchableOpacity, View,} from "../../src/react-native";
import translate from "../../src/language/translate";
import copy from "copy-to-clipboard";
import {userStore} from "../../src/stores";
import {getServerFilePath, getUserProfileApi, getUserSubsetApi, postQuery} from "../../dataService/apiService";
import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    PinterestIcon,
    PinterestShareButton,
    TelegramIcon,
    TelegramShareButton,
    TwitterIcon,
    TwitterShareButton,
    ViberIcon,
    ViberShareButton,
    WhatsappIcon,
    WhatsappShareButton
} from "react-share";
import {bg10, bgSuccess, bg8, bgWhite, grL5, orange1,} from "../constants/colors";
import images from "../../public/static/assets/images";
import {ImageSelector} from "../components";
import Link from "next/link";
import {observer} from "mobx-react";

export default class ShareLink extends Component {
    constructor() {
        super();
        //globalState.changeStatusBarColor(primaryDark);
        //StatusBar.setTranslucent(false);

        this.state = {};
    }


    async componentDidMount() {
        // this.getProfile();
    }

    getProfile() {
        this.setState({loading: true});
        getUserProfileApi()
            .then(user => {
                this.setState({loading: false});
            })
            .catch(err => {
                this.setState({loading: false});
            });
    }

    copyLink = () => {
        copy(userStore.invitationLink);
        showMassage(translate('finishRegister_its_copy'), 'success');
    };

    render() {
        return (
            <View style={[this.props.style,{}]}>
                <Text
                    style={{
                        marginTop: 0,
                        fontSize: 14,
                        fontWeight: 400,
                        fontFamily: 'IRANYekanFaNum-Bold',
                        color: bgSuccess,
                        marginHorizontal:10
                    }}>
                    {translate('لینک دعوت اختصاصی شما')}
                </Text>

                <View style={ { backgroundColor:'#979A9A',borderRadius:4,alignItems:'center',justifyContent:'center'}}>
                    <View style={{
                        flexDirection: 'row',
                        marginTop: 10,
                        borderWidth: 0,
                        borderRadius: 8,
                        borderColor: bg8,
                        alignItems: 'center',
                    }}>
                        <Text
                            style={{
                                verticalAlign: 'middle',
                                fontSize: 14,
                                backgroundColor:'#979A9A',
                                fontFamily: 'IRANYekanRegular',
                                color: bgWhite,
                                //maxWidth:global.width-50,
                                textAlign: 'center',
                                paddingHorizontal: 5,
                                width: '100%',
                                height: 50,
                                padding:5,
                                borderWidth:0,
                                borderRadius:1,
                                borderColor:orange1,
                                justifyContent:'center',
                            }}
                            readonly
                            numberOfLines={3}
                            //value= {userStore.invitationLink}
                        >
                            {userStore.invitationLink}
                        </Text>
                    </View>
                    <InvitCard/>

                    <View style={{flexDirection:'row',justifyContent:'center',marginTop:4}}>
                        {/*
                    LineShareButton,
                    LivejournalShareButton,
                    MailruShareButton,
                    OKShareButton,
                    PocketShareButton,
                    RedditShareButton,
                    TumblrShareButton,
                    ViberShareButton,
                    VKShareButton,
                    WorkplaceShareButton,
                    FacebookShareCount*/}
                        {/*
                    FacebookMessengerIcon,
                    LineIcon,
                    LivejournalIcon,
                    MailruIcon,
                    OKIcon,
                    PocketIcon,
                    RedditIcon,
                    TumblrIcon,
                    ViberIcon,
                    VKIcon,
                    WeiboIcon,
                    WorkplaceIcon,*/}
                        <TelegramShareButton style={{}}
                                             url={userStore.invitationLink}
                                             quote={"با ترینتگرام خیلی  راحت،  لینکتو به اشتراک بذار، شاخ و برگ بگیر و شبکه تبلیغاتی و پیامرسانی خودتو بساز. "}
                                             className="share"
                                             imageURL={'https://treenetgram.com/_next/static/images/tree-ca9fd9e975b7edbcc796a105125a15e7.png'}
                        >
                            <TelegramIcon size={40} round={false}/>
                        </TelegramShareButton>
                        <WhatsappShareButton style={{}}
                                             url={userStore.invitationLink}
                                             quote={"با ترینتگرام خیلی  راحت،  لینکتو به اشتراک بذار، شاخ و برگ بگیر و شبکه تبلیغاتی و پیامرسانی خودتو بساز. "}
                                             className="share"
                                             imageURL={'https://treenetgram.com/_next/static/images/tree-ca9fd9e975b7edbcc796a105125a15e7.png'}
                        >
                            <WhatsappIcon size={40} round={false}/>
                        </WhatsappShareButton>
                        <FacebookShareButton style={{}}
                                             url={userStore.invitationLink}
                                             quote={"تری نتگرام، موفقیت با سرعت نور"}
                                             className="share"
                                             imageURL={'https://treenetgram.com/_next/static/images/tree-ca9fd9e975b7edbcc796a105125a15e7.png'}

                        >
                            <FacebookIcon size={40} round={false}/>
                        </FacebookShareButton>
                        <TwitterShareButton style={{}}
                                            url={userStore.invitationLink}
                                            quote={"تری نتگرام، موفقیت با سرعت نور"}
                                            className="share"
                                            imageURL={'https://treenetgram.com/_next/static/images/tree-ca9fd9e975b7edbcc796a105125a15e7.png'}

                        >
                            <TwitterIcon size={40} round={false}/>
                        </TwitterShareButton>
                        <LinkedinShareButton style={{}}
                                             url={userStore.invitationLink}
                                             quote={"تری نتگرام، موفقیت با سرعت نور"}
                                             className="share"
                                             imageURL={'https://treenetgram.com/_next/static/images/tree-ca9fd9e975b7edbcc796a105125a15e7.png'}
                                             className="share">
                            <LinkedinIcon size={40} round={false}/>
                        </LinkedinShareButton>
                        <EmailShareButton style={{}}
                                          url={userStore.invitationLink}
                                          quote={"تری نتگرام، موفقیت با سرعت نور"}
                                          className="share"
                                          imageURL={'https://treenetgram.com/_next/static/images/tree-ca9fd9e975b7edbcc796a105125a15e7.png'}
                                          className="share">
                            <EmailIcon size={40} round={false}/>
                        </EmailShareButton>
                       {/* <PinterestShareButton style={{}}
                                          url={userStore.invitationLink}
                                          quote={"تری نتگرام، موفقیت با سرعت نور"}
                                          className="share"
                                          imageURL={'https://treenetgram.com/_next/static/images/tree-ca9fd9e975b7edbcc796a105125a15e7.png'}
                                        >
                             <PinterestIcon size={40} round={false}/>
                        </PinterestShareButton>*/}
                        <ViberShareButton style={{}}
                                          url={userStore.invitationLink}
                                          quote={"تری نتگرام، موفقیت با سرعت نور"}
                                          className="share"
                                          imageURL={'https://treenetgram.com/_next/static/images/tree-ca9fd9e975b7edbcc796a105125a15e7.png'}
                        >
                            <ViberIcon size={40} round={false}/>
                        </ViberShareButton>
                        <TouchableOpacity
                            style={{
                                borderWidth: 0,
                                borderRadius: 0,
                                borderColor: grL5,
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: bg10,
                                width: 40,
                                height: 40,
                                fontSize: 16,
                                marginHorizontal: 0,
                                backgroundColor: orange1,
                            }}
                            onPress={this.copyLink}>
                            <Text style={{padding: 5,}}>{translate('finishRegister_copy')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>

        )
    }

}

const InvitCard=observer(props=> {

    let leavesCount=0;
    const setProfileImage = (fileName) => {
        const data = {profileImage: fileName};
        postQuery('Members/me/setProfileImage', data)
            .then(res => {
                userStore.profileImage = res.profileImage;

            })
            .catch(err => {

            })
    };

   const getUserSubset=()=>{
        getUserSubsetApi()
            .then(subsetList=>{
                calculateTotalSubsetsCount(subsetList);
                userStore.branchesCount=subsetList.length;
                userStore.leavesCount=leavesCount

            })
            .catch(err=>{
                //this.setState({loading:false});
            });
    }
    setTimeout( getUserSubset,30);

    const calculateCount=(user)=>{
        leavesCount=leavesCount+user.subsets.length;
        for(let i=0;i<user.subsets.length;++i){
            calculateCount(user.subsets[i]);
        }
    }
    const calculateTotalSubsetsCount=(subsets)=>{
        for(let p=0;p<subsets.length;++p){
            calculateCount(subsets[p]);
        }
    }

    return (
        <View>
           {/* <Link style={{}}  href={'/profil'}>
                <Text style={{alignItems:'center', fontSize:11,color:bgWhite,marginHorizontal:0,marginBottom:0,backgroundColor:'#F1C40F',width:100,borderRadius:4}}>
                    ویرایش کارت
                </Text>
            </Link>*/}
            <View style={{
                flexDirection: 'row',
                alignItems:'center',
                backgroundColor: bgWhite,
                borderRadius: 10,
                padding:10,
                //maxWidth:300,
            }}>
                <View style={{}}>


                    <ImageSelector
                        style={{
                            borderWidth: 1,
                            borderColor: bg8,
                            height: 100,
                            width: 100,
                            borderRadius: 50,
                            alignSelf: 'center'
                        }}
                        onUplodedFile={(fileName) => {
                            setProfileImage(fileName);
                        }}
                        canUpload={true}
                        autoUpload={true}
                        imageStyle={{height: 100, width: 100, borderRadius: 50}}
                        image={userStore.profileImage}
                        noImage={images.default_ProPic}
                        hideDeleteBtn={true}
                    />

                </View>
                <View style={{alignItems:'center'}}>
                    <View style={{flexDirection: 'row', height:30,  maxWidth: 400,}}>
                        <View style={{alignItems: 'center', paddingHorizontal: 10}}>
                            <Text style={{fontSize: 12}}>شاخه</Text>
                            <Text style={{fontSize: 12}}>{userStore.branchesCount}</Text>
                        </View>
                        <View style={{alignItems: 'center', paddingHorizontal: 10}}>
                            <Text style={{fontSize: 12}}>برگ</Text>
                            <Text style={{fontSize: 12}}>{userStore.leavesCount}</Text>
                        </View>
                        <View style={{alignItems: 'center', paddingHorizontal: 10}}>
                            <Text style={{fontSize: 12}}>عضو</Text>
                            <Text style={{fontSize: 12}}>{userStore.branchesCount+userStore.leavesCount+1}</Text>
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
                        {userStore.avatar || 'عضو فعال  تری نتگرام'}
                    </Text>

                </View>


            </View>
        </View>

    )
});



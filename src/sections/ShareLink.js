import React, {Component} from 'react';
import {showMassage} from "../../src/utils";
import {bg10, bg3, bg8, bgWhite, grL5, primaryDark, textItem} from "../../src/constants/colors";
import {Text, TextInput, TouchableOpacity, View,} from "../../src/react-native";
import translate from "../../src/language/translate";
import copy from "copy-to-clipboard";
import {userStore} from "../../src/stores";
import {getUserProfileApi} from "../../dataService/apiService";
import {
    EmailShareButton,
    FacebookShareButton,
    InstapaperShareButton,
    LineShareButton,
    LinkedinShareButton,
    LivejournalShareButton,
    MailruShareButton,
    OKShareButton,
    PinterestShareButton,
    PocketShareButton,
    RedditShareButton,
    TelegramShareButton,
    TumblrShareButton,
    TwitterShareButton,
    ViberShareButton,
    VKShareButton,
    WhatsappShareButton,
    WorkplaceShareButton,
    FacebookShareCount
} from "react-share";

import {
    EmailIcon,
    FacebookIcon,
    FacebookMessengerIcon,
    InstapaperIcon,
    LineIcon,
    LinkedinIcon,
    LivejournalIcon,
    MailruIcon,
    OKIcon,
    PinterestIcon,
    PocketIcon,
    RedditIcon,
    TelegramIcon,
    TumblrIcon,
    TwitterIcon,
    ViberIcon,
    VKIcon,
    WeiboIcon,
    WhatsappIcon,
    WorkplaceIcon,

} from "react-share";
import {bg4, bg5, bg6, bg9} from "../constants/colors";
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
            <View style={{padding: 0, marginTop: 0,}}>
               {/* <Text
                    style={{
                        marginTop: 0,
                        fontSize: 16,
                        fontWeight: 800,
                        fontFamily: 'IRANYekanFaNum-Bold',
                        color: grL5,
                    }}>
                    {translate('finishRegister_your_invitation_link')}
                </Text>*/}
                <Text
                    style={{
                        marginTop: 0,
                        fontSize: 14,
                        fontWeight: 400,
                        fontFamily: 'IRANYekanFaNum-Bold',
                        color: bg3,
                    }}>
                    {translate('لینک دعوت اختصاصی خودتو تو شبکه های اجتماعی به اشتراک بزار و خیلی سریع رشد کن.')}
                </Text>

                <View style={{ backgroundColor:'#979A9A',borderRadius:4,}}>
                    <View style={{
                        flexDirection: 'row',
                        marginTop: 10,
                        borderWidth: 0,
                        borderRadius: 8,
                        borderColor: bg8,
                        alignItems: 'center',


                    }}>

                        <TextInput
                            style={{
                                verticalAlign: 'middle',
                                fontSize: 14,
                                backgroundColor:'#979A9A',
                                fontFamily: 'IRANYekanRegular',
                                color: bgWhite,
                                //maxWidth:global.width-50,
                                textAlign: 'left',
                                paddingHorizontal: 5,
                                width: '100%',
                                height: 50,
                                padding:5,
                                borderWidth:0,
                                borderRadius:1,
                                borderColor:bg4,
                                justifyContent:'center',
                            }}
                            readonly
                            numberOfLines={3}
                            value={userStore.invitationLink}
                        >
                        </TextInput>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'center'}}>
                        {/*
                   ,

                    LineShareButton,

                    LivejournalShareButton,
                    MailruShareButton,
                    OKShareButton,
                    ,
                    PocketShareButton,
                    RedditShareButton,
                    ,
                    TumblrShareButton,

                    ViberShareButton,
                    VKShareButton,

                    WorkplaceShareButton,
                    FacebookShareCount*/}

                        {/*
                    ,

                    FacebookMessengerIcon,
                    ,
                    LineIcon,
                    ,
                    LivejournalIcon,
                    MailruIcon,
                    OKIcon,
                    ,
                    PocketIcon,
                    RedditIcon,
                    ,
                    TumblrIcon,

                    ViberIcon,
                    VKIcon,
                    WeiboIcon,
                    ,
                    WorkplaceIcon,*/}
                        <TelegramShareButton style={{}}
                                             url={userStore.invitationLink}
                                             quote={"تری نتگرام، شبکه سازی  با سرعت نور"}
                                             className="share"
                                             imageURL={'https://treenetgram.com/_next/static/images/tree-ca9fd9e975b7edbcc796a105125a15e7.png'}
                        >
                            <TelegramIcon size={40} round={false}/>
                        </TelegramShareButton>

                        <FacebookShareButton style={{}}
                                             url={userStore.invitationLink}
                                             quote={"تری نتگرام، شبکه سازی با سرعت نور"}
                                             className="share"
                                             imageURL={'https://treenetgram.com/_next/static/images/tree-ca9fd9e975b7edbcc796a105125a15e7.png'}

                        >
                            <FacebookIcon size={40} round={false}/>
                        </FacebookShareButton>
                        <TwitterShareButton style={{}}
                                            url={userStore.invitationLink}
                                            quote={"تری نتگرام، شبکه سازی با سرعت نور"}
                                            className="share"
                                            imageURL={'https://treenetgram.com/_next/static/images/tree-ca9fd9e975b7edbcc796a105125a15e7.png'}

                        >
                            <TwitterIcon size={40} round={false}/>
                        </TwitterShareButton>
                        <LinkedinShareButton style={{}}
                                             url={userStore.invitationLink}
                                             quote={"تری نتگرام، شبکه سازی با سرعت نور"}
                                             className="share"
                                             imageURL={'https://treenetgram.com/_next/static/images/tree-ca9fd9e975b7edbcc796a105125a15e7.png'}
                                             className="share">
                            <LinkedinIcon size={40} round={false}/>
                        </LinkedinShareButton>
                        <EmailShareButton style={{}}
                                          url={userStore.invitationLink}
                                          quote={"تری نتگرام، شبکه سازی با سرعت نور"}
                                          className="share"
                                          imageURL={'https://treenetgram.com/_next/static/images/tree-ca9fd9e975b7edbcc796a105125a15e7.png'}
                                          className="share">
                            <EmailIcon size={40} round={false}/>
                        </EmailShareButton>
                        <PinterestShareButton style={{}}
                                          url={userStore.invitationLink}
                                          quote={"تری نتگرام، شبکه سازی با سرعت نور"}
                                          className="share"
                                          imageURL={'https://treenetgram.com/_next/static/images/tree-ca9fd9e975b7edbcc796a105125a15e7.png'}
                                        >
                        <PinterestIcon size={40} round={false}/>
                    </PinterestShareButton>
                        <ViberShareButton style={{}}
                                          url={userStore.invitationLink}
                                          quote={"تری نتگرام، شبکه سازی با سرعت نور"}
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
                                backgroundColor: bg4,
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



import React, {Component} from 'react';
import {showMassage} from "../../src//utils";

import {Text, TouchableOpacity, View,} from "../../src//react-native";
import translate from "../../src//language/translate";
import copy from "copy-to-clipboard";
import {pStore} from "../../src/stores";
import {postQuery} from "../../dataService/apiService";
import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    TelegramIcon,
    TelegramShareButton,
    TwitterIcon,
    TwitterShareButton,
    ViberIcon,
    ViberShareButton,
    WhatsappIcon,
    WhatsappShareButton
} from "react-share";
import {bg10, bg8, bgSuccess, bgWhite, grL5,} from "../../src/constants/colors";
import images from "../../public/static/assets/images";

import {observer} from "mobx-react";
import {ImageSelector} from "../../src/components";
import {orange1} from "../../src/constants/colors";

export default class ShareLink extends Component {
    constructor() {
        super();
        //globalState.changeStatusBarColor(primaryDark);
        //StatusBar.setTranslucent(false);

        this.state = {};
    }

    copyLink = () => {
        copy(pStore.cUser.invitationLink);
        showMassage(translate('finishRegister_its_copy'), 'success');
    };

    render() {
        return (
            <View style={[this.props.style, {}]}>
                <Text
                    style={{
                        marginTop: 0,
                        fontSize:12,
                        fontWeight: 400,
                        fontFamily: 'IRANYekanFaNum-Bold',
                        color: bgSuccess,
                        marginHorizontal: 10
                    }}>
                    {translate('لینک دعوت اختصاصی شما')}
                </Text>

                <View style={{
                    backgroundColor: '#979A9A',
                    borderRadius: 4,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
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
                                fontSize:12,
                                backgroundColor: '#979A9A',
                                fontFamily: 'IRANYekanRegular',
                                color: bgWhite,
                                //maxWidth:global.width-50,
                                textAlign: 'center',
                                paddingHorizontal: 5,
                                width: '100%',
                                height: 50,
                                padding: 5,
                                borderWidth: 0,
                                borderRadius: 1,
                                borderColor: orange1,
                                justifyContent: 'center',
                            }}
                            readonly
                            numberOfLines={3}
                            //value= {pStore.cUser.invitationLink}
                        >
                            {pStore.cUser.invitationLink}
                        </Text>
                    </View>
                    <InvitCard/>

                    <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 4}}>
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
                                             url={pStore.cUser.invitationLink}
                                             quote={"با ترینتگرام خیلی  راحت،  لینکتو به اشتراک بذار، شاخ و زیرشاخه بگیر و شبکه تبلیغاتی و پیامرسانی خودتو بساز. "}
                                             className="share"
                                             imageURL={'https://treenetgram.com/_next/static/images/tree-ca9fd9e975b7edbcc796a105125a15e7.png'}
                        >
                            <TelegramIcon size={40} round={false}/>
                        </TelegramShareButton>
                        <WhatsappShareButton style={{}}
                                             url={pStore.cUser.invitationLink}
                                             quote={"با ترینتگرام خیلی  راحت،  لینکتو به اشتراک بذار، شاخ و زیرشاخه بگیر و شبکه تبلیغاتی و پیامرسانی خودتو بساز. "}
                                             className="share"
                                             imageURL={'https://treenetgram.com/_next/static/images/tree-ca9fd9e975b7edbcc796a105125a15e7.png'}
                        >
                            <WhatsappIcon size={40} round={false}/>
                        </WhatsappShareButton>
                        <FacebookShareButton style={{}}
                                             url={pStore.cUser.invitationLink}
                                             quote={"تری نتگرام، موفقیت با سرعت نور"}
                                             className="share"
                                             imageURL={'https://treenetgram.com/_next/static/images/tree-ca9fd9e975b7edbcc796a105125a15e7.png'}

                        >
                            <FacebookIcon size={40} round={false}/>
                        </FacebookShareButton>
                        <TwitterShareButton style={{}}
                                            url={pStore.cUser.invitationLink}
                                            quote={"تری نتگرام، موفقیت با سرعت نور"}
                                            className="share"
                                            imageURL={'https://treenetgram.com/_next/static/images/tree-ca9fd9e975b7edbcc796a105125a15e7.png'}

                        >
                            <TwitterIcon size={40} round={false}/>
                        </TwitterShareButton>
                        <LinkedinShareButton style={{}}
                                             url={pStore.cUser.invitationLink}
                                             quote={"تری نتگرام، موفقیت با سرعت نور"}
                                             className="share"
                                             imageURL={'https://treenetgram.com/_next/static/images/tree-ca9fd9e975b7edbcc796a105125a15e7.png'}
                                             className="share">
                            <LinkedinIcon size={40} round={false}/>
                        </LinkedinShareButton>
                        <EmailShareButton style={{}}
                                          url={pStore.cUser.invitationLink}
                                          quote={"تری نتگرام، موفقیت با سرعت نور"}
                                          className="share"
                                          imageURL={'https://treenetgram.com/_next/static/images/tree-ca9fd9e975b7edbcc796a105125a15e7.png'}
                                          className="share">
                            <EmailIcon size={40} round={false}/>
                        </EmailShareButton>
                        {/* <PinterestShareButton style={{}}
                                          url={pStore.cUser.invitationLink}
                                          quote={"تری نتگرام، موفقیت با سرعت نور"}
                                          className="share"
                                          imageURL={'https://treenetgram.com/_next/static/images/tree-ca9fd9e975b7edbcc796a105125a15e7.png'}
                                        >
                             <PinterestIcon size={40} round={false}/>
                        </PinterestShareButton>*/}
                        <ViberShareButton style={{}}
                                          url={pStore.cUser.invitationLink}
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
                                fontSize:14,
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

export const InvitCard = observer(props => {
    let leavesCount = 0;
    const setProfileImage = (fileName) => {
        const data = {profileImage: fileName};
        postQuery('Members/me/setProfileImage', data)
            .then(res => {
                pStore.cUser.profileImage = res.profileImage;
            })
            .catch(err => {

            })
    };

    return (
        <View>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: bgWhite,
                borderRadius: 10,
                padding: 10,
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
                        folderName={'member'}
                        onUplodedFile={(fileName) => {
                            setProfileImage(fileName);
                        }}
                        canUpload={true}
                        autoUpload={true}
                        imageStyle={{height: 100, width: 100, borderRadius: 50}}
                        image={pStore.cUser.profileImage}
                        noImage={images.default_ProPic}
                        hideDeleteBtn={true}
                    />

                </View>
                <View style={{alignItems: 'center'}}>
                    <View style={{flexDirection: 'row', height: 30, maxWidth: 400,}}>
                        <View style={{alignItems: 'center', paddingHorizontal: 10}}>
                            <Text style={{fontSize: 12}}>شاخه</Text>
                            <Text style={{fontSize: 12}}>{pStore.branchesCount}</Text>
                        </View>
                        <View style={{alignItems: 'center', paddingHorizontal: 10}}>
                            <Text style={{fontSize: 12}}>زیرشاخه</Text>
                            <Text style={{fontSize: 12}}>{pStore.leavesCount}</Text>
                        </View>
                        <View style={{alignItems: 'center', paddingHorizontal: 10}}>
                            <Text style={{fontSize: 12}}>عضو</Text>
                            <Text style={{fontSize: 12}}>{pStore.branchesCount + pStore.leavesCount + 1}</Text>
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
                        {pStore.cUser.avatar || 'عضو فعال  تری نتگرام'}
                    </Text>

                </View>


            </View>
        </View>

    )
});



import React, { Component } from 'react';
import ResponsiveLayout from "../src/components/layouts/ResponsiveLayout";
import translate from "../src/language/translate";
import { LNGList } from "../src/language/aaLngUtil";
import { fetchStore, navigation, showMassage, } from "../src/utils";
import images from "../public/static/assets/images";
import {
    accentLight,
    bgSuccess,
    bgWhite,
    borderRed,
    borderSeparate,
    fab,
    orange1,
    primaryDark,
    subTextItem,
    textRed
} from "../src/constants/colors";
import { BgImageChacheProgress, Image, Text, TouchableOpacity, View, Progress } from "../src/react-native";
import { ListDialogPopUp } from "../src/components";
import { getFileUri, getUserSubsetApi, postQuery } from "../dataService/apiService";
import { persistStore, pStore, userStore } from "../src/stores";
import { observer } from "mobx-react";
let leavesCount = 0

@observer
export default class register extends Component {
    constructor() {
        super();
        this.state = {
            loading: false,
            followersNumber:0,
        };


    }

    async componentDidMount() {
        persistStore.apiToken = null;
        if (!persistStore.apiToken) {
            await fetchStore()
        }
        if (persistStore.apiToken) {
            navigation.replace(pStore.cUser.userKey);
        }/*if(!persistStore.userRegisterbefor){
            navigation.replace('/login');
            return;
        }*/
        else {

            this.regentCode = navigation.getParam('regentCode');
            postQuery('Members/getRegentInfo', { invitationCode: this.regentCode })
                .then((regent) => {
                  
                    leavesCount = 0;
                    pStore.subsetList = regent.subsets;
                    this.calculateTotalSubsetsCount(regent.subsets);
                    pStore.branchesCount =  regent.subsets.length;
                    pStore.leavesCount = leavesCount;
                    this.setState({ regent: regent,followersNumber:regent.followers.length });
                })
                .catch((e) => {
                    console.log(e);
                })
                .finally(() => {  this.setState({ loading: false });})

            this.getUserGeo();
        }
    }

    calculateCount = (user) => {
        leavesCount = leavesCount + user.subsets.length;
        for (let i = 0; i < user.subsets.length; ++i) {
            this.calculateCount(user.subsets[i]);
        }
    }

    calculateTotalSubsetsCount = (subsets) => {
        for (let p = 0; p < subsets.length; ++p) {
            this.calculateCount(subsets[p]);
        }
    }

    checkValidation() {
        if (!this.regentCode) {
            this.setState({ regentCodeCodeValidation: false });
            return translate('required_invitationLink');
        }
    }
    getUserGeo() {
        let self = this;

        this.setState({ loadingGeo: true })
        $.getJSON('https://api.ipdata.co/?api-key=92c9cd9137ca4bd296e2a749b8cd3a7908cb960766c10013cd108f26', function (data) {
            console.log(JSON.stringify(data, null, 2));
            self.geoInfo = JSON.stringify(data, null, 2);
        })
            .done(function (res) { console.log(res) })
            .fail(function (e) { showMassage('اگر فیلتر شکن شما روشن است، فیلتر شکن را خاموش کنید.') })
            .always(function () { self.setState({ loadingGeo: false }) });
    }
    async initUser() {

        const msg = this.checkValidation();
        if (msg) {
            showMassage(msg, 'info');
            return;
        }
        const user = { regentCode: this.regentCode };
        try {

            user.geoInfo = this.geoInfo ? JSON.parse(this.geoInfo) : {};
            user.geo = this.geo ? JSON.parse(this.geo) : {};
            user.countryCode = user.geoInfo.calling_code || "98";
        } catch (e) {
            console.log('error');
        }

        this.nextPage(user);

    }
    nextPage(user) {

        navigation.navigate('registered_mobile', { regentCode: this.regentCode, countryCode: user.countryCode });
    }

    async onSelectLanguege(lng) {
        persistStore.userLanguageKey = lng.key;
        persistStore.userLanguageId = lng.index;
        persistStore.isRtl = lng.rtl;
        persistStore.direction = lng.rtl ? 'rtl' : 'ltr';
        this.setState({ languageIndex: persistStore.userLanguageId });
    }

    render() {
        /*  if(!global.isCheckedToken){
              return  <View style={{flex:1,alignItems:'center',padding:20,fontSize:30,paddingTop:50,color:bg8}} >Welcom to Treenetgram</View>;
          }*/
        return (

            <ResponsiveLayout title={`Treenetgram`} loading={this.state.loading} loadingMessage={this.state.loadingMessage} style={{ margin: 0 }}>
                <View style={{ flex: 1, alignItems: 'center', padding: 10, paddingTop: '5%', }}>

                    <Image
                        source={images.tree}
                        style={{ maxWidth: '30%', maxHeight: '30%', }}
                    />
                    <Text
                        style={{
                            marginTop: 5,
                            marginBottom: 10,
                            fontSize: 18,
                            fontWeight: 800,
                            fontFamily: 'IRANYekanFaNum-Bold',
                            color: orange1
                        }}>
                        Treenetgram
                    </Text>

                    {this.state.regent && (
                        <View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text
                                    style={{
                                        alignItems: 'center',

                                        fontSize: 12,
                                        color: accentLight,
                                        fontWeight: 500,
                                        fontFamily: 'IRANYekanRegular',
                                        marginBottom: 5,
                                        paddingHorizontal: 5,
                                    }}>
                                    {this.state.regent.fullName}
                                </Text>
                                <Text
                                    style={{
                                        alignItems: 'center',

                                        fontSize: 12,
                                        fontWeight: 500,
                                        fontFamily: 'IRANYekanRegular',
                                        marginBottom: 5
                                    }}>
                                    {' شما را به پلتفرم شبکه سازی ترینتگرام دعوت کرد.'}
                                </Text>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: bgWhite,
                                borderRadius: 12,
                                padding: 10,
                            }}>
                                <View style={{ alignItems: 'center', color: subTextItem }}>
                                    <Image
                                        source={getFileUri('member', this.state.regent.profileImage)}
                                        style={{
                                            width: 100,
                                            height: 100,
                                            borderRadius: 50,
                                        }}
                                    />



                                    <Text
                                        style={{
                                            alignItems: 'center',
                                            marginTop: 0,
                                            fontSize: 10,
                                            fontWeight: 800,
                                            fontFamily: 'IRANYekanRegular',
                                            marginBottom: 0,
                                            paddingHorizontal: 5,
                                        }}>
                                        {this.state.regent.fullName}
                                    </Text>
                                </View>
                                <View style={{ alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'row', height: 30, maxWidth: 400, }}>
                                        <View style={{ alignItems: 'center', paddingHorizontal: 15 }}>
                                            <Text style={{ fontSize: 12 }}>شاخه</Text>
                                            <Text style={{ fontSize: 12 }}>{pStore.branchesCount}</Text>
                                        </View>
                                        <View style={{ alignItems: 'center', paddingHorizontal: 15 }}>
                                            <Text style={{ fontSize: 12 }}>برگ</Text>
                                            <Text style={{ fontSize: 12 }}>{pStore.leavesCount}</Text>
                                        </View>
                                        <View style={{ alignItems: 'center', paddingHorizontal: 15 }}>
                                        <Text style={{ fontSize: 12 }}>عضو</Text>
                                            <Text style={{ fontSize: 12 }}>{pStore.branchesCount+this.state.followersNumber+pStore.leavesCount}</Text>
                                        </View>
                                        {/* <View style={{alignItems: 'center', paddingHorizontal: 15}}>
                                            <Text style={{fontSize: 12}}>عضو</Text>
                                            <Text style={{fontSize: 12}}>{pStore.branchesCount + pStore.leavesCount +this.state.regent.followers.length+ 1}</Text>
                                        </View> */}
                                        
                                    </View>
                                    <Text
                                        style={{
                                            alignItems: 'center',
                                            marginTop: 25,
                                            fontSize: 11,
                                            fontWeight: 800,
                                            fontFamily: 'IRANYekanRegular',
                                            marginBottom: 0,

                                        }}>
                                        {this.state.regent.avatar}
                                    </Text>
                                </View>


                            </View>
                        </View>
                    )}



                    <View id='form' style={{
                        width: '100%',
                        paddingHorizontal: 5,
                        marginTop: 5,
                        paddingBottom: 20,
                        alignItems: 'center'
                    }}>
                        {/*<ListDialogPopUp
                            style={{
                                minWidth: 150
                            }}
                            selectedItemStyle={{
                                backgroundColor: orange1,
                            }}
                            title={translate('Select_Your_Language')}
                            snake
                            items={LNGList}
                            selectedItem={this.state.languageIndex}
                            height={global.height / 2}
                            validation={true}
                            searchField={"title"}
                            selectedItemCustom={
                                <View
                                    style={{
                                        color: bgWhite,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginHorizontal: 8,
                                        marginVertical: 8,
                                    }}>
                                    <Text
                                        style={{
                                            fontSize:12,
                                            fontFamily: 'IRANYekanFaNum-Bold',
                                            paddingTop: 2,
                                        }}>
                                        {this.state.languageIndex !== undefined
                                            ? LNGList[this.state.languageIndex].title
                                            : translate('Select_Your_Language')}
                                    </Text>
                                </View>
                            }
                            onValueChange={item => this.onSelectLanguege(item, item.index)}
                            itemComponent={(item, index) => {
                                return (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            paddingHorizontal: 8,
                                            alignItems: 'center',
                                            borderBottomWidth: 0.5,
                                            borderColor: borderSeparate,
                                        }}>

                                        <Text style={{paddingVertical: 16}}>
                                            {item.title}
                                        </Text>

                                    </View>
                                )
                            }}
                        />*/}


                        <TouchableOpacity
                            disabled={this.state.loadingGeo}
                            style={{
                                flex: 1,
                                marginTop: 10,
                                width: 200,
                                maxWidth: 300,
                                backgroundColor: bgSuccess,
                                padding: 0,
                                paddingTop: 0,
                                borderRadius: 12,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onPress={() => this.initUser()}
                        >
                            <Text style={{
                                fontSize: 12,
                                color: bgWhite,
                                fontWeight: 500,
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                            }}>
                                شروع شبکه سازی
                                </Text>
                        </TouchableOpacity>


                        <Text
                            style={{
                                alignItems: 'center',
                                marginTop: 25,
                                fontSize: 11,
                                fontWeight: 800,
                                fontFamily: 'IRANYekanRegular',
                                color: orange1,
                                marginBottom: 5,
                                textAlign: 'center',
                                maxWidth: 360,

                            }}>
                            {/*{translate("from_local_power_to_global_power")}*/}
                           با تری نت گرام لینک دعوت اختصاصی خودت را به اشتراک بزار، به صورت ویروسی رشد کن و شبکه عظیم تبلیغاتی و درآمدزایی خودت رو بساز.
                        </Text>



                        <View style={{ padding: '4%', marginTop: 0, }}>

                            <Text
                                style={{
                                    alignItems: 'center',
                                    fontSize: 13,
                                    fontFamily: 'IRANYekanRegular',

                                    textAlign: 'justify',
                                    marginBottom: 5
                                }}>
                                {/*{translate('treenetDes2')}*/}
                                  ترینتگرام برای کسانی ساخته شده است که می خواهند در زمانی کوتاه یک صفحه شخصی با قابلیت رشد سریع و ویروسی فالور داشته باشند. کافی است لینک دعوت اختصاصی خود را برای دیگران ارسال کنید تا آنها عضو صفحه شما شوند، نه تنها فرد دعوت شده عضو صفحه شما می شود بلکه هر فردی که توسط او دعوت شود نیز عضو صفحه شما خواهد شد و الی آخر.  بنابراین تعداد فالورهای شما به صورت ویروسی و در کمترین زمان رشد می کند. شما از طریق فروش صفحه خود نمایش تبلیغات درآن  می توانید برای خود درآمد ایجاد کنید .

                            </Text>

                            <Text
                                style={{
                                    alignItems: 'center',
                                    fontSize: 13,
                                    fontFamily: 'IRANYekanRegular',

                                    textAlign: 'justify',
                                    marginBottom: 5
                                }}>
                                {/*{translate('treenetDes2')}*/}
                                 ترینتگرام همچنین به بازاریابان، مغازه داران، شرکتها و تمام کسانی که نیاز به فالورهای زیاد برای تبلیغات محلی یا بین المللی دارند، کمک می کند تا به رایگان شبکه درختی خود را ایجاد کرده و به سرعت رشد دهند.

                            </Text>
                            <Text
                                style={{
                                    alignItems: 'center',
                                    fontSize: 13,
                                    fontFamily: 'IRANYekanRegular',

                                    textAlign: 'justify',
                                    marginBottom: 5
                                }}>
                                {/*{translate('treenetDes2')}*/}
                                 همچنین ترینتگرام مجهز به سرویسهای درآمدزایی از جمله تبلیغات اتوماتیک است که با فعال کردن آن در صفحه خود می توانید بدون هیچ زحمتی درآمد اتوماتیک کسب کنید.

                            </Text>


                        </View>
                    </View>

                </View>

            </ResponsiveLayout>
        )
    }

}



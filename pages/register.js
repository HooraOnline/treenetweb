import React, {Component} from 'react';
import ResponsiveLayout from "../src/components/layouts/ResponsiveLayout";
import translate from "../src/language/translate";
import {LNGList} from "../src/language/aaLngUtil";
import {fetchStore, navigation, showMassage,} from "../src/utils";
import images from "../public/static/assets/images";
import {
    accentLight,
    bgSuccess,
    bgWhite,
    borderRed,
    borderSeparate,
    orange1,
    primaryDark,
    textRed
} from "../src/constants/colors";
import {Image, Text, TouchableOpacity, View,} from "../src/react-native";
import {ListDialogPopUp} from "../src/components";
import {postQuery} from "../dataService/apiService";
import {persistStore, userStore} from "../src/stores";
import {observer} from "mobx-react";

@observer
export default class register extends Component {
     constructor() {
        super();
        this.state = {
            loading: false,
        };


    }

    async componentDidMount() {
        persistStore.apiToken=null;
        if (!persistStore.apiToken) {
            await fetchStore()
        }
        if (persistStore.apiToken) {
            navigation.replace('/mypage');
        }/*if(!persistStore.userRegisterbefor){
            navigation.replace('/login');
            return;
        }*/
        else {
            this.regentCode = navigation.getParam('regentCode');
            this.getUserGeo()
        }
    }

    checkValidation() {
        if (!this.regentCode) {
            this.setState({regentCodeCodeValidation: false});
            return translate('required_invitationLink');
        }
    }
    getUserGeo(){
        let self=this;
        $.getJSON('https://api.ipdata.co/?api-key=92c9cd9137ca4bd296e2a749b8cd3a7908cb960766c10013cd108f26', function(data) {
            console.log(JSON.stringify(data, null, 2));
            self.geoInfo=JSON.stringify(data, null, 2);
        });
    }
    async initUser () {
        const msg = this.checkValidation();
        if (msg) {
            showMassage(msg, 'info');
            return;
        }
        const user={regentCode:this.regentCode};
        try{
            user.geoInfo =JSON.parse( this.geoInfo);
            user.geo =JSON.parse( this.geo);
        }catch (e) {

        }

        this.nextPage(user);

    }
    nextPage(user){

        navigation.navigate('registered_mobile', {regentCode:this.regentCode,countryCode:user.geoInfo.calling_code});
    }

    async onSelectLanguege(lng) {
        persistStore.userLanguageKey= lng.key;
        persistStore.userLanguageId=lng.index;
        persistStore.isRtl = lng.rtl;
        persistStore.direction = lng.rtl?'rtl':'ltr';
        this.setState({languageIndex: persistStore.userLanguageId});
    }

    render() {
        /*  if(!global.isCheckedToken){
              return  <View style={{flex:1,alignItems:'center',padding:20,fontSize:30,paddingTop:50,color:bg8}} >Welcom to Treenetgram</View>;
          }*/
        return (

            <ResponsiveLayout title={`Treenetgram`} loading={this.state.loading} loadingMessage={this.state.loadingMessage} style={{margin: 0}}>
                <View style={{flex: 1,  alignItems: 'center', padding: 10, paddingTop: '5%',}}>

                    <Image
                        source={images.tree}
                        style={{maxWidth: '30%', maxHeight: '30%',}}
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

                    <View>
                        <View style={{flexDirection: 'row'}}>
                            <Text
                                style={{
                                    alignItems: 'center',

                                    fontSize: 14,
                                    color: accentLight,
                                    fontWeight: 500,
                                    fontFamily: 'IRANYekanRegular',
                                    marginBottom: 5,
                                    paddingHorizontal: 5,
                                }}>
                                علی موسوی
                            </Text>
                            <Text
                                style={{
                                    alignItems: 'center',

                                    fontSize: 12,
                                    fontWeight: 500,
                                    fontFamily: 'IRANYekanRegular',
                                    marginBottom: 5
                                }}>
                                {' شما را به شبکه بین المللی ترینتگرام دعوت کرد.'}
                            </Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            alignItems:'center',
                            backgroundColor: bgWhite,
                            borderRadius: 12,
                            padding:10,
                        }}>
                            <View style={{}}>
                                <Image
                                    source={'https://beard-style.com/image/1/51589-latest-awesome-beard-styles-for-men-in-india-cinthol-awesome-men.jpg'}
                                    style={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: 50,
                                    }}
                                />
                                {/* <Text
                        style={{
                            alignItems: 'center',
                            marginTop: 0,
                            fontSize: 12,
                            fontWeight: 800,
                            fontFamily: 'IRANYekanRegular',
                            marginBottom: 5,
                            paddingHorizontal: 5,
                        }}>
                        {name}
                    </Text>*/}
                            </View>
                            <View style={{alignItems:'center'}}>
                                <View style={{flexDirection: 'row', height:30,  maxWidth: 400,}}>
                                    <View style={{alignItems: 'center', paddingHorizontal: 10}}>
                                        <Text style={{fontSize: 12}}>شاخه</Text>
                                        <Text style={{fontSize: 12}}>443</Text>
                                    </View>
                                    <View style={{alignItems: 'center', paddingHorizontal: 10}}>
                                        <Text style={{fontSize: 12}}>برگ</Text>
                                        <Text style={{fontSize: 12}}>45k</Text>
                                    </View>
                                    <View style={{alignItems: 'center', paddingHorizontal: 10}}>
                                        <Text style={{fontSize: 12}}>فالور</Text>
                                        <Text style={{fontSize: 12}}>569k</Text>
                                    </View>
                                </View>
                                <Text
                                    style={{
                                        alignItems: 'center',
                                        marginTop: 25,
                                        fontSize: 12,
                                        fontWeight: 800,
                                        fontFamily: 'IRANYekanRegular',
                                        marginBottom: 5,

                                    }}>
                                    {'فروشنده لوازم ارایشی در ترینتگرام'}
                                </Text>
                            </View>


                        </View>
                    </View>

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
                                            fontSize: 14,
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
                                fontSize: 14,
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
                                color:orange1,
                                marginBottom: 5,
                                textAlign:'center',
                                maxWidth:360,

                            }}>
                            {/*{translate("from_local_power_to_global_power")}*/}
                           با تری نت گرام لینک دعوت اختصاصی خودت را به اشتراک بزار، به صورت ویروسی رشد کن و شبکه عظیم تبلیغاتی و درآمدزایی خودت رو بساز.
                        </Text>



                        <View style={{padding: '4%', marginTop: 0,}}>

                            <Text
                                style={{
                                    alignItems: 'center',
                                    fontSize: 13,
                                    fontFamily: 'IRANYekanRegular',

                                    textAlign: 'justify',
                                    marginBottom: 5
                                }}>
                                {/*{translate('treenetDes2')}*/}
                                 تری نتگرام برای کسانی ساخته شده است که می خواهند در زمانی کوتاه یک شبکه تبلیغاتی بزرگ با قابلیت رشد ویروسی داشته و از راه فروش شبکه خود و یا تبلیغات در آن برای خود درآمد و کسب و کار ایجاد کنند.

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
                                 ترینتگرام همچنین به بازاریابان، مغازه داران، شرکتها، صاحبان رسانه و تمام کسانی که نیاز به تبلیغات محلی یا بین المللی دارند، کمک می کند تا به رایگان شبکه درختی خود را ایجاد کرده و به سرعت رشد دهند.

                            </Text>


                        </View>
                    </View>

                </View>

            </ResponsiveLayout>
        )
    }

}



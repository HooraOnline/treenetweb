import React, {Component} from 'react';
import Router from "next/router";
import ResponsiveLayout from "../src/components/layouts/ResponsiveLayout";
import translate from "../src/language/translate";
import {LNGList} from "../src/language/aaLngUtil";
import {fetchStore, getUrlParameter, navigation, showMassage,} from "../src/utils";
import images from "../public/static/assets/images";
import {borderSeparate, bg10, bg2, bg3, bg4, bg5, bg9, primaryDark, bg8, bgWhite} from "../src/constants/colors";
import {Image, Text, TouchableOpacity, View,} from "../src/react-native";
import {ListDialogPopUp} from "../src/components";
import { postQuery} from "../dataService/apiService";
import {persistStore} from "../src/stores";
import {observer} from "mobx-react";

@observer
export default class index extends Component {
     constructor() {
        super();
        this.state = {
            loading: false,
        };


    }

    async componentDidMount() {
        await fetchStore()
        if ( persistStore.apiToken) {
            navigation.replace('/profile');
        }
        this.regentCode = navigation.getParam('regentCode');
        this.getUserGeo()
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

        $.getJSON('https://ipapi.co/json/', function(data) {
            self.geo=JSON.stringify(data, null, 2);
        });
        /*$.getJSON('https://geolocation-db.com/json/')
            .done (function(location) {
                this.usergeo_ipdata_co
                console.log(location)
            });

        $.getJSON('http://www.geoplugin.net/json.gp?jsoncallback=?', function(data) {
            console.log(JSON.stringify(data, null, 2));
        });
        $.getJSON('http://ip-api.com/json?callback=?', function(data) {
            console.log(JSON.stringify(data, null, 2));
        });*/
    }
    async registerUser () {
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

        this.setState({loading:true,loadingMessage:'در حال ساخت شبکه...'});
        postQuery('members/me/register',user)
            .then(res=>{
                this.nextPage(res);
                this.setState({loading:false});
            })
            .catch(err=>{
                this.setState({loading:false});
            })

    }
    nextPage(user){
        navigation.navigate('registered_new', {user});
    }

    loginPanel() {
        if ( persistStore.apiToken)
            navigation.navigate('/profile');
        else
            navigation.navigate('/login');
    }

    async onSelectLanguege(lng) {
        persistStore.userLanguageKey= lng.key;
        persistStore.userLanguageId=lng.index;
        persistStore.isRtl = lng.rtl;
        this.setState({languageIndex: persistStore.userLanguageId});
    }

    render() {
        /*  if(!global.isCheckedToken){
              return  <View style={{flex:1,alignItems:'center',padding:20,fontSize:30,paddingTop:50,color:bg8}} >Welcom to Treenetgram</View>;
          }*/
        return (

            <ResponsiveLayout title={`Treenet`} loading={this.state.loading} loadingMessage={this.state.loadingMessage} style={{margin: 0}}>
                <View style={{flex: 1,  alignItems: 'center', padding: 10, paddingTop: '5%',}}>

                    <Image
                        source={images.tree}
                        style={{maxWidth: '40%', maxHeight: '40%',}}
                    />
                    <Text
                        style={{
                            marginTop: 5,
                            marginBottom: 10,
                            fontSize: 25,
                            fontWeight: 800,
                            fontFamily: 'IRANYekanFaNum-Bold',
                            color: bg4
                        }}>
                        Treenetgram
                    </Text>

                    <View id='form' style={{
                        width: '100%',
                        paddingHorizontal: 5,
                        marginTop: 10,
                        paddingBottom: 20,
                        alignItems: 'center'
                    }}>
                        <ListDialogPopUp
                            style={{
                                minWidth: 150
                            }}
                            selectedItemStyle={{
                                backgroundColor: bg5,
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
                                        color: bg10,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginHorizontal: 8,
                                        marginVertical: 8,
                                    }}>
                                    <Text
                                        style={{
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
                        />
                        <Text
                            style={{
                                alignItems: 'center',
                                marginTop: 25,
                                fontSize: 15,
                                fontWeight: 500,
                                fontFamily: 'IRANYekanRegular',

                                marginBottom: 5
                            }}>
                            {translate("from_local_power_to_global_power")}
                        </Text>
                        <Text
                            style={{
                                alignItems: 'center',
                                marginTop: 2,
                                fontSize: 15
                                ,
                                fontWeight: 800,
                                fontFamily: 'IRANYekanFaNum-Bold',


                            }}>
                            {translate("make_your_global_network")}
                        </Text>
                        <View style={{
                            flex: 1,
                            //flexDirection:'row',
                            paddingHorizontal: 16,
                            alignItems: 'center',
                            paddingBottom: 10,

                        }}>
                           {!persistStore.userRegisterbefor22 && (
                                <TouchableOpacity
                                    style={{
                                        width: 200,
                                        maxWidth: 300,
                                        marginTop: 25,
                                        borderColor: primaryDark,
                                        borderWidth: 1,
                                        padding: 0,
                                        paddingTop: 0,
                                        borderRadius: 12,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginHorizontal: 10,

                                    }}
                                    onPress={() => this.registerUser()}
                                >
                                    <Text style={{
                                        fontSize: 16,
                                        color: primaryDark,
                                        fontWeight: 500,
                                        paddingVertical: 12,
                                        paddingHorizontal: 20,
                                    }}>{translate('create_network')}</Text>
                                </TouchableOpacity>
                            )}

                           <TouchableOpacity
                                style={{
                                    flex: 1,
                                    marginTop: 30,
                                    width: 200,
                                    maxWidth: 300,
                                    borderColor: '#FF8C00',
                                    backgroundColor:'#FF8C00',
                                    borderWidth: 1,
                                    padding: 0,
                                    paddingTop: 0,
                                    borderRadius: 12,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                onPress={() => this.loginPanel()}
                            >
                                <Text style={{
                                    fontSize: 16,
                                    color: bgWhite,
                                    fontWeight: 500,
                                    paddingVertical: 12,
                                    paddingHorizontal: 20,
                                }}>{translate('login_my_tree')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{padding: '4%', marginTop: 0,}}>
                            <Text
                                style={{
                                    alignItems: 'center',
                                    fontSize: 16,
                                    fontFamily: 'IRANYekanRegular',

                                    textAlign: 'justify',
                                    marginBottom: 5
                                }}>
                                {
                                    translate('treenetDesl')
                                }
                            </Text>
                            <Text
                                style={{
                                    alignItems: 'center',
                                    fontSize: 16,
                                    fontFamily: 'IRANYekanRegular',

                                    textAlign: 'justify',
                                    marginBottom: 5
                                }}>
                                {translate('treenetDes2')}

                            </Text>
                            <Text
                                style={{
                                    alignItems: 'center',
                                    fontSize: 16,
                                    fontFamily: 'IRANYekanRegular',

                                    textAlign: 'justify',
                                    marginBottom: 5
                                }}>
                                {translate('treenetDes3')}

                            </Text>
                            <Text
                                style={{
                                    alignItems: 'center',
                                    fontSize: 16,
                                    fontFamily: 'IRANYekanRegular',

                                    textAlign: 'justify',
                                    marginBottom: 5
                                }}>
                                {translate('treenetDes4')}
                            </Text>

                            <Text
                                style={{
                                    alignItems: 'center',
                                    fontSize: 16,
                                    fontFamily: 'IRANYekanRegular',

                                    textAlign: 'justify',

                                }}>
                                {translate('treenetDes5')}

                            </Text>

                            <Text
                                style={{
                                    alignItems: 'center',
                                    marginTop: 0,
                                    fontSize: 16,
                                    fontFamily: 'IRANYekanRegular',
                                    textAlign: 'justify',


                                }}>
                                {translate('treenetDes6')}
                            </Text>
                        </View>
                    </View>

                </View>
                <View style={{
                    flex: 1,
                    //flexDirection:'row',
                    paddingHorizontal: 16,
                    alignItems: 'center',
                    paddingBottom: 10,

                }}>
                    {!persistStore.userRegisterbefor22 && (
                        <TouchableOpacity
                            style={{
                                width: 200,
                                maxWidth: 300,
                                marginTop: 25,
                                borderColor: primaryDark,
                                borderWidth: 1,
                                padding: 0,
                                paddingTop: 0,
                                borderRadius: 12,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginHorizontal: 10,

                            }}
                            onPress={() => this.registerUser()}
                        >
                            <Text style={{
                                fontSize: 16,
                                color: primaryDark,
                                fontWeight: 500,
                                paddingVertical: 12,
                                paddingHorizontal: 20,
                            }}>{translate('create_network')}</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={{
                            flex: 1,
                            marginTop: 30,
                            width: 200,
                            maxWidth: 300,
                            borderColor: '#FF8C00',
                            backgroundColor:'#FF8C00',
                            borderWidth: 1,
                            padding: 0,
                            paddingTop: 0,
                            borderRadius: 12,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onPress={() => this.loginPanel()}
                    >
                        <Text style={{
                            fontSize: 16,
                            color: bgWhite,
                            fontWeight: 500,
                            paddingVertical: 12,
                            paddingHorizontal: 20,
                        }}>{translate('login_my_tree')}</Text>
                    </TouchableOpacity>
                </View>
            </ResponsiveLayout>
        )
    }

}



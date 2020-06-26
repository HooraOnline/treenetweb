import React, {Component} from 'react';
import ResponsiveLayout from "../src/components/layouts/ResponsiveLayout";
import translate from "../src/language/translate";
import {navigation, showMassage,} from "../src/utils";
import images from "../public/static/assets/images";
import {bgHeader, orange1} from "../src/constants/colors";
import {Image, Text, View,} from "../src/react-native";
import {postQuery} from "../dataService/apiService";
import {persistStore, userStore} from "../src/stores";
import {observer} from "mobx-react";
import Api from "../dataService/apiCaller";
import version from "../src/version";

@observer
export default class autoRegister extends Component {
    constructor() {
        super();
        this.state = {
            loading: false,
            buldingMsg: 'در حال ساخت تری نت شما...'
        };


    }

    async componentDidMount() {
        if (persistStore.apiToken) {
            navigation.replace('/profile');
        }
        this.regentCode = navigation.getParam('regentCode');
        if (!persistStore.userRegisterbefor || version.release == false) {
            this.getLocationAndRegisterUser();
        } else {
            navigation.navigate('404');
        }
    }

    checkValidation() {
        if (!this.regentCode) {
            this.setState({regentCodeCodeValidation: false});
            return translate('required_invitationLink');
        }
    }

    async getLocationAndRegisterUser() {
        let self = this;
        alert($.getJSON)
        await $.getJSON('https://api.ipdata.co/?api-key=92c9cd9137ca4bd296e2a749b8cd3a7908cb960766c10013cd108f26', function (data) {
            console.log(JSON.stringify(data, null, 2));
            self.geoInfo = JSON.stringify(data, null, 2);
            alert(self.geoInfo)
        });
        await $.getJSON('https://ipapi.co/json/', function (data) {
            self.geo = JSON.stringify(data, null, 2);

        });
        alert(3)
        this.registerUser();
    }

    getUserGeo() {

        let self = this;
        $.getJSON('https://api.ipdata.co/?api-key=92c9cd9137ca4bd296e2a749b8cd3a7908cb960766c10013cd108f26', function (data) {
            console.log(JSON.stringify(data, null, 2));
            self.geoInfo = JSON.stringify(data, null, 2);
            $.getJSON('https://ipapi.co/json/', function (data) {
                self.geo = JSON.stringify(data, null, 2);
                self.registerUser();
            });
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

    async registerUser() {

        const msg = this.checkValidation();
        if (msg) {
            showMassage(msg, 'info');
            return;
        }
        const user = {regentCode: this.regentCode};
        try {
            user.geoInfo = JSON.parse(this.geoInfo);
            user.geo = JSON.parse(this.geo);

        } catch (e) {

        }

        this.setState({loading: true, loadingMessage: 'در حال ساخت تری نت...'});
        //user.host = '1111111111111111111111111111111';
        postQuery('members/me/register', user)
            .then(member => {
                self.user = member;
                //this.nextPage(res);
                persistStore.apiToken = member.token;
                Api.setToken(member.token);
                userStore.setUser(member);
                persistStore.userRegisterbefor = true;
                this.setState({loading: false});
                debugger
                navigation.replace('newInvite', {user: member});
            })
            .catch(err => {
                this.setState({loading: false, buldingMsg: 'خطا در ساخت تری نت'});
            })

    }

    nextPage(user) {
        navigation.navigate('registered_new', {user});
    }

    render() {
        /*  if(!global.isCheckedToken){
              return  <View style={{flex:1,alignItems:'center',padding:20,fontSize:30,paddingTop:50,color:bg8}} >Welcom to Treenetgram</View>;
          }*/
        return (

            <ResponsiveLayout title={`Treenetgram`} loading={this.state.loading}
                              loadingMessage={this.state.loadingMessage} style={{margin: 0}}>
                <View dir='ltr'
                      style={{flexDirection: 'row', width: '100%', backgroundColor: bgHeader, alignContent: 'center'}}>
                    <Image
                        source={images.logoTop}
                        style={{padding: 5}}
                    />

                </View>
                <View style={{flex: 1, alignItems: 'center', padding: 10, paddingTop: '5%',}}>

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
                            color: orange1
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
                        <Text
                            style={{
                                marginTop: 5,
                                marginBottom: 10,
                                fontSize: 14,
                                fontWeight: 800,
                                fontFamily: 'IRANYekanFaNum-Bold',

                            }}>
                            {this.state.buldingMsg}
                        </Text>
                    </View>

                </View>

            </ResponsiveLayout>
        )
    }

}


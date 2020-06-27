import React, {Component} from 'react';
import ResponsiveLayout from "../src/components/layouts/ResponsiveLayout";
import translate from "../src/language/translate";
import {doDelay, navigation,} from "../src/utils";
import images from "../public/static/assets/images";
import {bg1, bgScreen, bgWhite, orange1, primaryDark} from "../src/constants/colors";
import {Image, Text, TouchableOpacity, View,} from "../src/react-native";
import {loginApi} from "../dataService/apiService";
import LoadingPopUp from "../src/components/LoadingPopUp";
import Router from "next/router";


export default class registered_new extends Component {
    constructor() {
        super();
        this.state = {


        };
    }

    componentDidMount() {
        doDelay(100)
            .then(() => {
                this.user = navigation.getParam('user');
                console.log('new user',this.user);
                if(this.user){
                    this.setState({username:this.user.username,password:this.user.tempPassword})
                }

            })

    }
    onSuccessLogin=(user)=>{
        global.width=null;
        Router.replace('/profile');
    }
    login() {
        this.setState({loading: true});
        this.setState({loading:true});
        loginApi(this.state.username,this.state.password)
            .then(res=>{
                console.log(res);
                this.onSuccessLogin(res);
                this.setState({loading:false});
            })
            .catch(err=>{
                this.setState({loading:false});
            })
    }

    nextPage() {
        navigation.navigate('registerUserProperty', {
            user: this.user,
        });
    }

    render() {
        //const { height, width } = useWindowDimensions();

        return (

            <ResponsiveLayout title={`Treenetgram`} loading={this.state.loading} loadingMessage={this.state.loadingMessage} style={{margin: 0}}>
                <View
                    style={{flex: 1, backgroundColor: bgScreen, alignItems: 'center', padding: 10, paddingTop: '5%',}}>
                    <Image
                        source={images.tree}
                        style={{maxWidth: '25%', maxHeight: '25%',}}
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

                    <View id='form'
                          style={{
                              width: '100%',
                              alignItems:'center',
                              maxWidth: 500,
                              marginTop: 3,
                              padding: 16,
                          }}>
                        {/* <Text style={{ textAlign:'center', marginTop:30,fontSize:14,color:bgWhite}}>{translate("for_start_enter_your_phone_number")}</Text>*/}
                        <Text
                            style={{
                                alignItems: 'center',
                                marginTop: 2,
                                fontSize: 14,
                                fontFamily: 'IRANYekanFaNum-Bold',
                                textAlign: 'justify',
                                color: bg1,

                            }}>
                            {translate(" شبکه درختی شما با نام کاربری و رمز عبور موقتی زیر ساخته شد. لطفا بعد از ورود نام کاربری و رمز عبور موقت خود را تغییر دهید.")}
                        </Text>
                    <View style={{
                        width: '100%',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: orange1,
                        borderRadius: 12,
                        marginTop: 30,
                        padding: 10,
                        borderStyle: 'dotted',
                        paddingVertical: 20,
                    }}>
                        <View
                            style={{
                                flexDirection: 'row',

                            }}
                        >
                            <Text
                                style={{
                                    alignItems: 'center',
                                    marginTop: 2,
                                    fontSize: 14,
                                    fontFamily: 'IRANYekanFaNum',
                                    textAlign: 'justify',
                                    color: bg1,

                                }}>
                                {translate("نام کاربری شما:")}
                            </Text>
                            <Text
                                style={{
                                    alignItems: 'center',
                                    marginTop: 2,
                                    fontSize: 16,
                                    fontWeight: 800,
                                    paddingHorizontal: 10,
                                    fontFamily: 'IRANYekanFaNum-Bold',
                                    color: primaryDark,

                                }}>
                                {this.state.username}
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: 10,

                            }}
                        >
                            <Text
                                style={{
                                    alignItems: 'center',
                                    fontSize: 14,
                                    fontFamily: 'IRANYekanFaNum',
                                    textAlign: 'justify',
                                    color: bg1,

                                }}>
                                {translate("رمز عبور شما:")}
                            </Text>
                            <Text
                                style={{
                                    alignItems: 'center',
                                    fontSize: 16,
                                    fontWeight: 800,
                                    paddingHorizontal: 10,
                                    fontFamily: 'IRANYekanFaNum-Bold',
                                    color: primaryDark,

                                }}>
                                {this.state.password}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={{
                                marginTop: 20,
                                borderColor: orange1,
                                backgroundColor: orange1,
                                borderWidth: 1,
                                width: 200,
                                paddingTop: 0,
                                borderRadius: 8,
                                maxWidth: 300,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onPress={() => this.login()}
                        >
                            <Text style={{
                                fontSize: 16,
                                color: bgWhite,
                                fontWeight: 500,
                                paddingVertical: 8
                            }}>{translate('ورود')}</Text>
                        </TouchableOpacity>
                    </View>

                </View>




                </View>

                <LoadingPopUp
                    visible={this.state.loading}
                    message={this.state.loadingMessage}
                />
            </ResponsiveLayout>
        )
    }


}



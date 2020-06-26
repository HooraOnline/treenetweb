import React, {Component} from 'react';
import ResponsiveLayout from "../src/components/layouts/ResponsiveLayout";
import {navigation,} from "../src/utils";
import images from "../public/static/assets/images";
import {bg5,} from "../src/constants/colors";
import {Image, Text, View,} from "../src/react-native";
import {Toolbar} from "../src/components";
import {observer} from "mobx-react";

@observer
export default class index extends Component {
    constructor() {
        super();
        this.state = {
            loading: false,
        };


    }


    render() {
        const toolbarStyle = {
            start: {
                content: images.ic_back,
                onPress: ()=>navigation.navigate('home'),
            },
            title: 'آدرس اشتباه',

        };
        return (

            <ResponsiveLayout title={`Treenetgram`} loading={this.state.loading}
                              loadingMessage={this.state.loadingMessage}
                              style={{margin: 0}}
                              header={
                                  <Toolbar
                                      customStyle={toolbarStyle}
                                      isExpand={this.state.showAccountSelect }
                                  />
                              }
            >
                <View style={{flex: 1,  alignItems: 'center', padding: 10, paddingTop: '5%',}}>

                    <Image
                        source={images.tree}
                        style={{maxWidth: '40%', maxHeight: '40%',}}
                    />
                    <Text
                        style={{
                            marginTop: 20,
                            alignSelf:'center',
                            marginBottom: 10,
                            fontSize: 14,
                            fontWeight: 800,
                            fontFamily: 'IRANYekanFaNum-Bold',
                            color: bg5
                        }}>
                        Treenetgram
                    </Text>
                    <Text
                        style={{
                            marginTop: 5,
                            marginBottom: 10,
                            fontSize: 25,
                            fontWeight: 499,
                            fontFamily: 'IRANYekanFaNum-Bold',

                        }}>
                        صفحه ای با این آدرس در سایت وجود ندارد.
                    </Text>

                </View>
            </ResponsiveLayout>
        )
    }

}



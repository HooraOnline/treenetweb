import React, {PureComponent} from 'react';
import {IconApp, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View} from '../react-native';

import {
    bgScreen,
    bgSuccess, bgWhite,
    lightRed,
    overlayColor,
    placeholderTextColor,
    primaryDark,
    subTextItem, textItemBlack,
    transparent,
} from '../constants/colors';
import {LineCustom, Overlay, ShowDateTime} from './index';

import images from "../../public/static/assets/images";
import accounting from 'accounting';
import {userStore} from '../stores';
import {inputNumberValidation} from '../utils';



export default class TransactionDialog extends PureComponent {
    constructor(props) {
        super(props);
        let validPrice = userStore.CurrencyID === 'تومان' ? Number(props.item.Mandeh) * 10 : Number(props.item.Mandeh);
        this.state = {
            currentPrice: validPrice,
            currentPriceValidation: false,
        };
    }

    render() {
        const {visible, item, onConfirm, onDismiss} = this.props;

        if (visible) {
            return (
                    <Overlay catchTouch={true} onPress={onDismiss} fill={null}>
                        <View
                            style={{
                                backgroundColor: 'white',
                                minHeight: 77,
                                minWidth:300,
                                maxWidth:500,
                                borderRadius: 20,
                                marginHorizontal: 24,
                                alignSelf:"center",
                            }}>
                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity
                                    style={{flex: 0.1, paddingStart: 16, paddingTop: 16}}
                                    onPress={onDismiss}>
                                    <IconApp
                                        class={'apic_close'}
                                        style={{tintColor: subTextItem, width: 24, height: 24}}
                                    />
                                </TouchableOpacity>

                                <View style={{flex: 1, marginTop: 16}}>
                                    <Text style={[styles.title]}>فاکتور پرداخت{/*{item.Title}*/}</Text>
                                </View>
                                <View style={{flex: 0.1}}/>
                            </View>

                            <Text style={[styles.subTitle]}>
                                لطفا پیش از پرداخت، جزئیات را بررسی کنید
                            </Text>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: bgWhite,
                                    // marginVertical: 8,
                                }}>
                                {/* <Image source={images.halfCircle} style={{height: 18, width: 10,tintColor:overlayColor}}/>*/}
                                <View style={{width:18,height:18,backgroundColor:'rgb(102, 97, 96)',borderRadius:9,marginStart:-9}}/>
                                <View style={{flex: 1, backgroundColor: 'white'}}>
                                    <View
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            marginHorizontal: 7,
                                        }}>
                                        <LineCustom color={subTextItem}/>
                                    </View>
                                </View>
                                <View style={{width:18,height:18,backgroundColor:'rgb(102, 97, 96)',borderRadius:9,marginEnd:-9}}/>

                                {/* <Image
                                                source={images.halfCircle}
                                                style={{transform: [{rotate: '180deg'}], height: 18, width: 10,tintColor:borderLight}}
                                            />*/}
                            </View>

                            <View
                                style={{
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    marginBottom: 24,
                                }}>
                                <Text style={[styles.costTitle]}>{item.Title}</Text>
                                <Text style={{fontSize: 10, color: subTextItem, marginTop: 8,flexDirection:'row'}}>
                                    مبلغ قابل پرداخت
                                    <Text
                                        style={{
                                            fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum' : 'IRANYekanRegular(FaNum)',
                                            color: primaryDark,
                                            fontSize: 10,
                                        }}>
                                        {' (ریال)'}
                                    </Text>
                                </Text>
                                <View style={{
                                    flexDirection: 'row',
                                    marginHorizontal: 24,
                                    marginTop:5,
                                    alignItems: 'center',
                                }}>
                                    <TextInput
                                        onChangeText={text => {                                   
                                            const textNumber = parseInt(accounting.unformat(inputNumberValidation(text, this.state.currentPrice)));
                                            this.setState({
                                                currentPrice: textNumber,
                                                currentPriceValidation: textNumber >= 10000,
                                            });
                                        }}
                                        numberOfLines={1}
                                        style={{
                                            borderWidth: 1,
                                            borderColor: this.state.currentPriceValidation ? placeholderTextColor : lightRed,
                                           
                                            fontWeight: 'normal',
                                            fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
                                            fontSize: 18,
                                            color: primaryDark,
                                            maxWidth:190,
                                            paddingStart: 4,
                                            paddingVertical: 10,
                                            paddingBottom: 10,
                                            textAlign: 'center',
                                            alignSelf:'center'
                                        }}
                                        multiline={false}
                                        maxLength={17}
                                        keyboardType="number-pad"
                                        returnKeyType="done"
                                        value={accounting.formatMoney(this.state.currentPrice, '', 0, ',')}
                                        underlineColorAndroid={transparent}
                                    />
                                </View>

                                <TouchableOpacity
                                    style={{
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        backgroundColor: this.state.currentPrice<1000?placeholderTextColor: bgSuccess  ,
                                        borderRadius: 10,
                                        marginTop: 8,
                                    }}
                                    disabled={this.state.currentPrice<1000}
                                    onPress={onConfirm.bind(this, this.state.currentPrice)}>
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontFamily:
                                                Platform.OS === 'ios'
                                                    ? 'IRANYekanFaNum-Bold'
                                                    : 'IRANYekanBold(FaNum)',
                                            paddingHorizontal: 16,
                                            padding:10,
                                        }}>
                                        تایید و پرداخت
                                    </Text>
                                    <IconApp
                                        class={'apic_left'}
                                        style={{
                                            tintColor: 'white',
                                            width: 24,
                                            height: 24,
                                            marginEnd: 8,
                                            marginVertical: 8,
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>
                            {item.LastPayDate && (
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        backgroundColor: bgScreen,
                                        // overflow: 'hidden',
                                        borderBottomStartRadius: 20,
                                        borderBottomEndRadius: 20,
                                        paddingHorizontal: 24,
                                    }}>
                                    <Text style={[styles.subTitle, {fontSize: 11, paddingVertical: 8}]}>
                                        مهلت پرداخت
                                    </Text>
                                    <View
                                        style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
                                        <ShowDateTime
                                            time={item.LastPayDate}
                                            fontFamily={
                                                Platform.OS === 'ios'
                                                    ? 'IRANYekanFaNum-Bold'
                                                    : 'IRANYekanBold(FaNum)'
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                        </View>

                    </Overlay>


            );
        } else {
            return <View/>;
        }
    }
}

const styles = StyleSheet.create({
    btn: {
        paddingVertical: 6,
        paddingHorizontal: 16,
    },
    title: {
        fontFamily:
            Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
        fontSize: 14,
        textAlign: 'center',
    },
    costTitle: {
        fontFamily:
            Platform.OS === 'ios' ? 'IRANYekan-ExtraBold' : 'IRANYekanExtraBold',
        fontSize: 14,
    },
    costPrice: {
        fontFamily:
            Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
        fontSize: 20,
        color: primaryDark,
        marginEnd: 4,
    },
    subTitle: {
        textAlign: 'center',
        fontSize: 11,
        color: subTextItem,
    },
});

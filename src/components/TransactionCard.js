import React,{PureComponent} from 'react';
import {IconApp, Image, Platform, StyleSheet, Text, TouchableOpacity, View} from '../react-native';

import {
    bgItem,
    bgSuccess,
    borderSeparate,
    fab,
    goldDark,
    primaryDark,
    subTextItem, success,
    textItem,
    textRedLight,
} from '../constants/colors';
import {ShowDateTime, ShowPrice} from './index';
import images from "public/static/assets/images";

export default function TransactionCard({item, onPress, isTransaction = false,style}) {
    if (item.hasOwnProperty('HasPaid')) {
        const status = parseInt(item.HasPaid);
        const isBed = status === 0; //item.Bed  & isBed ? item.Bed : item.Bes
        const date = status === 1 ? item.CreatedAtDatetime : item.LastPayDate;
        return (
            <TouchableOpacity
                onPress={onPress ? onPress.bind(this, item) : null}
                disabled={!onPress}
                style={[styles.container, {
                    elevation: isTransaction ? 0 : 3,
                    shadowOffset: {width: 0, height: isTransaction ? 0 : 1},
                    marginHorizontal: isTransaction ? 0 : 24,
                    borderWidth: (status !== 1 || isTransaction) ? 1 : 0,
                    borderColor: isTransaction ? borderSeparate : status === 2 ? fab : primaryDark,
                },style]}>
                <View style={{marginBottom:Platform.OS==='web'?15:10,marginTop:10, marginEnd: 8, alignItems: 'flex-start'}}>
                    <Text style={[styles.title]}>{item.Title}</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        {item.PeriodName && (
                            <Text style={{color: subTextItem, fontSize: 11,}}>{item.PeriodName} . </Text>
                        )}
                        <ShowDateTime color={subTextItem} time={date} style={{paddingVertical:3,fontSize:9}}/>
                    </View>
                    {item.Tasviye && (
                        <Text style={{paddingBottom:10,color: success, fontSize: 11}}>تسویه</Text>
                    )}
                </View>
                <View
                    style={{
                        alignItems: 'flex-end',
                        justifyContent: !isBed ? 'flex-start' : 'flex-start',
                        borderWidth:0,
                    }}>
                    {!isBed && (
                        <View style={{flexDirection: 'row'}}>
                            {status === 2 && (
                                <ShowPrice
                                    priceStyle={{textDecorationLine: 'line-through', textDecorationStyle: 'double'}}
                                    style={{
                                        marginEnd: 0,
                                        marginTop: 8
                                    }}
                                    color={textRedLight}
                                    colorCurrency={textRedLight}
                                    fontSize={12}
                                    price={item.Price}
                                />
                            )}
                            <View style={[styles.iconDode, {
                                backgroundColor: status === 1 ? bgSuccess : fab,
                                padding: status === 1 ? 0 : 6,
                            }]}>
                                <Image
                                    source={status === 1 ? images.ic_done : images.ic_error}
                                    style={{
                                        tintColor: status === 1 ? 'white' : goldDark,
                                        width: status === 1 ? 24 : 13, height: status === 1 ? 24 : 16,
                                    }}
                                />
                            </View>
                        </View>
                    )}
                    <View style={{flexDirection: 'row', marginTop: isBed ? 8 : 0, marginEnd: isBed ? 0 : 10}}>
                        <ShowPrice
                            color={isBed ? primaryDark : textItem}
                            colorCurrency={isBed ? primaryDark : textItem}
                            fontSize={16}
                            fontSizeCurrency={12}
                            price={status === 2 ? item.Mandeh : item.Price}
                        />

                        {isBed && (
                            <IconApp
                                class={'apic_left'}
                                style={{
                                    tintColor: subTextItem,
                                    width: 24,
                                    height: 24,
                                    marginEnd: 3,
                                }}
                            />
                        )}
                    </View>
                    {item.Tasviye && (
                        <View style={{marginEnd: 16}}>
                        <ShowPrice
                            color={success}
                            colorCurrency={success}
                            fontSize={14}
                            fontSizeCurrency={12}
                            price={item.Tasviye}
                        />
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    }


    return (
            <TouchableOpacity
                onPress={onPress.bind(this, item)}
                // disabled={true}
                style={ [{
                    marginHorizontal: 24,
                    marginTop: 12,
                    marginBottom: 4,
                    padding: 16,
                    backgroundColor: bgItem,
                    elevation: 3,
                    shadowColor: '#aaaaaa',
                    shadowOffset: {width: 0, height: 1},
                    shadowOpacity: 0.5,
                    borderRadius: 10,
                },style]}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <ShowDateTime
                        time={item.PaidDatetime}
                        fontSize={14}
                        showTime
                    />
                    <ShowPrice
                        fontSize={17}
                        price={item.TotalPrice}
                    />
                </View>
                <View style={{paddingTop: 4, borderTopWidth: 1, borderColor: borderSeparate, flexDirection: 'row', justifyContent: 'space-between',}}>
                    <Text style={{fontSize: 11}}>
                        {item.PaymentTypeName}
                    </Text>
                </View>
            </TouchableOpacity>
    );
    

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginTop: 12,
        marginBottom: 4,
        justifyContent: 'space-between',
        paddingStart: 16,
        backgroundColor: bgItem,
        shadowColor: '#000',
        shadowOpacity: 0.5,
        borderRadius: 10,
    },
    title: {
        color: textItem,
        fontSize: 12,

    },
    iconDode: {
        borderBottomStartRadius: 10,
        borderBottomEndRadius: 10,
        marginEnd: 16,
    },
});

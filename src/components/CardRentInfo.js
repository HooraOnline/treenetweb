import React from 'react';
import {Platform, StyleSheet, Text, View} from '../react-native';

import {border, borderLight, textDisabled} from '../constants/colors';

export default function CardRentInfo({
                                         isDisabled,
                                         number,
                                         area,
                                         children,
                                         isMain,
                                         openable,
                                         isOpen,
                                         bgColor = 'white',
                                         style,
                                     }) {
    return (
        <View
            style={[
                styles.container,
                {
                    borderBottomEndRadius: openable ? isOpen ? 10 : 0 : 10,
                    borderTopEndRadius: openable ? isOpen ? 10 : 0 : 10,
                    marginEnd: openable ? 0 : 16,
                    backgroundColor: isDisabled?textDisabled:bgColor,
                    elevation: isMain ? 0 : 2,
                    shadowColor: isMain ? '#fff' : '#000',
                    shadowOffset: {width: 0, height: .5},
                    shadowOpacity: isMain ? 0 : 0.2,

                },style
            ]}>

                <View style={[styles.startSide]}>
                    <View
                        style={[styles.unitNumber, {marginHorizontal: isMain ? 16 : 0}]}>
                        <Text style={[styles.textUnitNumber, styles.textUnit]}>
                            {number}
                        </Text>
                    </View>
                    <View
                        style={{flex: 1, flexDirection: 'row', marginTop: isMain ? 8 : 0}}>
                        <View
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderColor: borderLight,
                                borderEndWidth: 0.5,
                            }}>
                            <Text style={[styles.textUnit]}> {area} </Text>
                        </View>

                    </View>
                </View>

            <View style={[styles.endSide, {paddingEnd: isMain ? 0 : 16}]}>{children}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 5,
        flexDirection: 'row',
        borderBottomStartRadius: 10,
        borderTopStartRadius: 10,
        marginTop: 10,
        marginStart: 16,


    },
    startSide: {
        borderColor: border,
        borderEndWidth: 1,
        flex: 1,
        flexDirection: 'column',
    },
    endSide: {
        flex: 3,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    unitNumber: {
        flex: 1,
        borderColor: borderLight,
        borderBottomWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textUnitNumber: {
        fontFamily:
            Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
        fontSize: 14,
    },
    textUnit: {
        color: border,
        paddingVertical: 6,
    },
});

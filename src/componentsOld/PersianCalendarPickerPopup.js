import React, {PureComponent} from 'react';
import {Image, Modal, Platform, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from '../react-native';

import {lightRed, overlayColor, primary, primaryDark, subTextItem, textItem} from '../constants/colors';

import images from "public/static/assets/images";

var jMoment = require('moment-jalaali');
//const PersianCalendarPicker = require('react-native-persian-calendar-picker');

//import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker from 'react-modern-calendar-datepicker';
export default class PersianCalendarPickerPopup extends PureComponent {
    constructor() {
        super();
        this.state = {
            dialogVisible: false,
        };
    }

    componentDidMount() {

    }

    render() {
        const {
            validation = true,
            disabled,
            selectedDate = null,
            minWidth = 250,
            selectedItemCustom,
            defaultTitle = 'تاریخ',
            showToday = false,
            minDate,
            simple,
            iconColor = textItem,
            style,
        } = this.props;
        let width=global.width/1.2;
        let maxWith=500;

        return (
            <View style={{flex:1}}>
                <TouchableOpacity
                    style={[styles.button, {borderColor: validation ? subTextItem : lightRed},style]}
                    onPress={() => this.setState({dialogVisible: true})}
                    disabled={disabled}
                >
                    <View style={{}}>
                        {selectedItemCustom ? (
                            selectedItemCustom
                        ) : (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                }}>
                                {!selectedDate && !simple && (
                                    <Image
                                        source={images.ic_calendar}
                                        style={{
                                            //tintColor: iconColor,
                                            height: 24,
                                            width: 24,
                                        }}
                                    />
                                )}
                                <View style={{flex: 1}}>
                                    <Text
                                        dir={'ltr'}
                                        style={{
                                            fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
                                            alignSelf: simple ? 'center' : 'flex-start',
                                            paddingTop: 7,
                                            paddingBottom: 8,
                                            marginStart: simple ? 0 : 8,

                                        }}>
                                        {selectedDate ? jMoment.utc(selectedDate).format('jYYYY / jM / jD') : defaultTitle}
                                    </Text>
                                </View>

                                {!simple &&
                                <Image
                                    source={images.ic_expand}
                                    style={{
                                        //tintColor: textItem,
                                        height: 24,
                                        width: 24,
                                        margin: 8,
                                    }}
                                />
                                }

                            </View>
                        )}
                    </View>


                </TouchableOpacity>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.dialogVisible}
                    presentationStyle="overFullScreen"
                    onRequestClose={() => {
                        this.setState({dialogVisible: false});
                    }}
                >
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: overlayColor,

                    }}>

                        <View
                            style={{
                                backgroundColor: 'white',
                                elevation: 7,
                                minWidth: minWidth,
                                borderRadius: 10,
                                width:width,
                                //maxWith:maxWith,
                            }}
                        >
                            {
                                <Text style={{alignSelf:'center',marginVertical:16}} >{this.props.title ||'انتخاب روز'}</Text>
                            }

                            <DatePicker
                                weekdays={['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']}
                                previousTitle={'>'}
                                nextTitle={'<'}
                                onDateChange={date => this.onDateSelect(date)}
                                selectedStartDate={new Date(selectedDate)}
                                selectedDayColor={primary}
                                selectedDayTextColor={'white'}
                                initialDate={selectedDate ? new Date(selectedDate)  : jMoment.utc()}
                                minDate={minDate && jMoment.utc(minDate)}
                            />
                            {showToday && (
                                <TouchableOpacity
                                    style={{alignSelf: 'flex-end', paddingHorizontal: 13, paddingBottom: 13}}
                                    onPress={() => this.onDateSelect(jMoment.utc())}
                                >
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}>
                                        <Text style={{marginRight: 7, marginLeft: 7, color: primaryDark}}>امروز</Text>
                                        <Image
                                            source={images.goToTodayIcon}
                                            style={{
                                                //tintColor: primaryDark,
                                                height: 18, width: 18}}
                                        />
                                    </View>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </Modal>
            </View>

        );
    }

    onDateSelect(date) {
        this.props.onValueChange(date);
        this.setState({dialogVisible: false});
    }
}

const styles = StyleSheet.create({
    text: {
        // textAlign: 'right',
        fontSize:12,
        color: 'black',
        marginStart: 7,
        // marginEnd: 13
    },
    button: {
        // flex: 1,
        borderWidth: 1,
        backgroundColor: 'white',
        borderRadius: 10,
        justifyContent: 'center',
        paddingStart: 7,
    },
});


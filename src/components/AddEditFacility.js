import React, {PureComponent} from 'react';
import {
    Alert,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    BgImageChacheProgress,
} from '../react-native';

import Color, {placeholderTextColor, primaryDark, transparent} from '../constants/colors';

import {getFileDownloadURL, inputNumberValidation, mapNumbersToEnglish, uploadFile} from '../utils';
import {persistStore, userStore} from '../stores';
import images from "../../public/static/assets/images";
import {
    //DateTimePickerPopup,
    PersianCalendarPickerPopup,
    ListDialogPopUp,
    LoadingPopUp, OverlayModal} from './index';
import {cudBuildingFacilityQuery} from '../network/Queries';
//import Permissions from 'react-native-permissions';
//import * as Progress from 'react-native-progress';
import accounting from 'accounting';
import {GlobalState as globalState} from '../stores/GlobalState';
import FloatingLabelTextInput from './FloatingLabelTextInput';
const jMoment = require('moment-jalaali');

export default class AddEditFacility extends PureComponent {
    constructor(props) {
        super(props);
        const item = props.item;
        this.typeImageSlected = null;
        if (item) {
            let fromTime, toHour;
            if (item.FromTime) {
                let startDate = new Date();
                startDate.setHours(item.FromTime.split(':')[0]);
                startDate.setMinutes(item.FromTime.split(':')[1]);
                fromTime = startDate;
            }
            if (item.ToHour) {
                let endDate = new Date();
                endDate.setHours(item.ToHour.split(':')[0]);
                endDate.setMinutes(item.ToHour.split(':')[1]);
                toHour = endDate;
            }
            this.state = {
                showSelectPicker: false,

                id: item.ID,
                image: item.Image,
                startTime: fromTime,
                endTime: toHour,
                price: item.DefaultPrice,
                comradePrice: item.DefaultPrice,
                comradeCount: item.DefaultPrice,
                phoneNumber: item.Tel,
                description: item.Description,
                isScheduler: item.IsScheduled,
                facilitySelected: this.props.facilityTypes.find(o => o.ID == item.FacilityID), //==

            };
        } else {
            this.state = {
                showSelectPicker: false,

                id: null,
                image: 'defaultNewFacility.jpg',
                startTime: null,
                endTime: null,
                price: 0,
                comradePrice: 0,
                comradeCount: 0,
                phoneNumber: null,
                description: null,
                isScheduler: false,
                facilitySelected: null,


                facilitySelectedValidation: true,
            };
        }

    }

    checkPermissions = () => {
       /* Permissions.checkMultiple(['camera', 'photo']).then(response => {
            // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
            this.setState({
                cameraPermission: response.camera,
                photoPermission: response.photo,
            });
        });*/
    };

    async componentDidMount() {
        //this.checkPermissions();
    }


    render() {
        const {visible, onCancel, onFinish} = this.props;
        return (
            <OverlayModal
                visible={visible}
                onOutPress={onCancel}
                catchTouch
            >

                <ScrollView>
                    <KeyboardAvoidingView enabled={Platform.OS === 'ios'} behavior="padding">
                        <View>
                            <ListDialogPopUp
                                items={[
                                    {title: 'دوربین', icon: images.cameraIcon, isCamera: true},
                                    {title: 'گالری', icon: images.galleryIcon, isCamera: false},
                                ]}
                                selectedComponentCustom={
                                    <View style={{flex: 1}}>
                                        <BgImageChacheProgress
                                            style={{
                                                height: 160,
                                                // flex: 1
                                                // width: '100%',
                                                // overflow: `hidden`,
                                                resizeMode: 'contain',
                                            }}
                                            source={{
                                                uri: getFileDownloadURL(this.state.image),
                                                headers: {Authorization: 'Bearer ' + persistStore.token},
                                                priority: FastImage.priority.high,
                                            }}
                                            //indicator={Progress.Pie}
                                            indicatorProps={{
                                                borderWidth: 0,
                                                color: Color.primaryDark,
                                                unfilledColor: Color.primary,
                                            }}
                                        >
                                            <View
                                                style={{
                                                    backgroundColor: 'rgba(255,255,255,0.6)',
                                                    height: 33,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                                                    <Image
                                                        source={images.edit_icon}
                                                        style={{tintColor: primaryDark, height: 20, width: 20}}
                                                    />
                                                    <Text style={{marginRight: 7, marginLeft: 7, color: primaryDark}}>تغییر
                                                        تصویر</Text>
                                                </View>
                                            </View>
                                        </BgImageChacheProgress>

                                    </View>
                                }
                                onValueChange={item => {
                                    if (Platform.OS === 'android') {
                                        this.onImageSelector(item.isCamera);
                                    } else {
                                        this.typeImageSlected = item;
                                    }
                                }}
                                onFinish={() => this.onFinishImagePickerIos()}
                                itemComponent={item => (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            padding: 13,
                                            borderBottomWidth: 0.5,
                                        }}>
                                        <Text style={{
                                            flex: 1,
                                            color: 'black',
                                            alignSelf: 'flex-start',
                                        }}>{item.title}</Text>
                                        <Image
                                            source={item.icon}
                                            style={{tintColor: primaryDark, height: 24, width: 24, marginHorizontal: 7}}
                                        />
                                    </View>
                                )}
                            />
                        </View>

                        <View style={{padding: 16}}>
                            <ListDialogPopUp
                                defaultTitle='انتخاب نوع خدمات'
                                disabled={this.props.facilityTypes.length === 0 || this.props.item}
                                validation={this.state.facilitySelectedValidation}
                                items={this.props.facilityTypes}
                                fieldItem='PersianName'
                                selectedItem={this.state.facilitySelected}
                                onValueChange={item => this.setState({
                                    facilitySelected: item,
                                    facilitySelectedValidation: true,
                                })}
                            />
                            <View
                                style={{
                                    marginVertical: 23,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <PersianCalendarPickerPopup
                                    selectedDate={this.state.startTime}
                                    onValueChange={date => this.setState({startTime: date})}
                                    defaultTitle={'از ساعت'}
                                    isTime
                                />

                                <PersianCalendarPickerPopup
                                    selectedDate={this.state.endTime}
                                    onValueChange={date => this.setState({endTime: date})}
                                    defaultTitle={'تا ساعت'}
                                    isTime
                                />
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <FloatingLabelTextInput
                                    ref="textInput"
                                    editable={true}
                                    multiline={false}
                                    maxLength={15}
                                    keyboardType='number-pad'
                                    numberOfLines={1}
                                    returnKeyType="done"
                                    // onSubmitEditing={() => this.processCalc()}
                                    floatingLabelEnable={true}
                                    underlineColor={placeholderTextColor}
                                    textInputStyle={{
                                        fontSize: 13,
                                        color: 'black',
                                        textAlign: 'center',
                                    }}
                                    underlineSize={1}
                                    placeholder='قیمت پیش‌فرض خصوصی'
                                    style={{flex: 1}}
                                    onChangeText={text => {
                                        if (text === '') {
                                            text = '0';
                                        }
                                        text = mapNumbersToEnglish(text);
                                        this.setState({
                                            price: parseInt(accounting.unformat(text), 10),
                                            priceValidation: true,
                                        });
                                    }}
                                    highlightColor={primaryDark}
                                    value={this.state.price > 0 ? accounting.formatMoney(this.state.price, '', 0, ',') : ''}
                                />
                                <Text style={{marginHorizontal: 7}}>{userStore.CurrencyID}</Text>
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: 17,
                                }}>
                                <FloatingLabelTextInput
                                    ref="textInput"
                                    editable={true}
                                    multiline={false}
                                    maxLength={15}
                                    keyboardType='number-pad'
                                    numberOfLines={1}
                                    returnKeyType="done"
                                    // onSubmitEditing={() => this.processCalc()}
                                    floatingLabelEnable={true}
                                    underlineColor={placeholderTextColor}
                                    textInputStyle={{
                                        fontSize: 13,
                                        color: 'black',
                                        textAlign: 'center',
                                    }}
                                    underlineSize={1}
                                    placeholder='قیمت همراه'
                                    style={{flex: 1}}
                                    onChangeText={text => {
                                        if (text === '') {
                                            text = '0';
                                        }
                                        text = mapNumbersToEnglish(text);
                                        this.setState({
                                            comradePrice: parseInt(accounting.unformat(text), 10),
                                            priceValidation: true,
                                        });
                                    }}
                                    highlightColor={primaryDark}
                                    value={this.state.comradePrice > 0 ? accounting.formatMoney(this.state.comradePrice, '', 0, ',') : ''}
                                />
                                <Text style={{marginHorizontal: 7}}>{userStore.CurrencyID}</Text>
                            </View>

                            <View style={{marginVertical: 13}}>
                                <FloatingLabelTextInput
                                    ref="textInput"
                                    editable={true}
                                    multiline={false}
                                    maxLength={14}
                                    keyboardType='number-pad'
                                    numberOfLines={1}
                                    returnKeyType="done"
                                    floatingLabelEnable={true}
                                    underlineColor={placeholderTextColor}
                                    textInputStyle={{
                                        fontSize: 13,
                                        color: 'black',
                                        textAlign: 'center',
                                    }}
                                    underlineSize={1}
                                    placeholder='تعداد همراه'
                                    style={{flex: 1}}
                                    onChangeText={text => this.setState({comradeCount: inputNumberValidation(text, this.state.comradeCount, /[\d]+$/)})}
                                    highlightColor={primaryDark}
                                    value={this.state.comradeCount}
                                />
                            </View>


                            <View style={{marginVertical: 13}}>
                                <FloatingLabelTextInput
                                    ref="textInput"
                                    editable={true}
                                    multiline={false}
                                    maxLength={14}
                                    keyboardType='number-pad'
                                    numberOfLines={1}
                                    returnKeyType="done"
                                    floatingLabelEnable={true}
                                    underlineColor={placeholderTextColor}
                                    textInputStyle={{
                                        fontSize: 13,
                                        color: 'black',
                                        textAlign: 'center',
                                    }}
                                    underlineSize={1}
                                    placeholder='تلفن هماهنگی'
                                    style={{flex: 1}}
                                    onChangeText={text => this.setState({phoneNumber: inputNumberValidation(text, this.state.phoneNumber)})}
                                    highlightColor={primaryDark}
                                    value={this.state.phoneNumber}
                                />
                            </View>
                            <TextInput
                                placeholder="توضیحات..."
                                placeholderTextColor={placeholderTextColor}
                                style={[styles.textInput, {
                                    borderColor: primaryDark,
                                    textAlign: 'right',
                                    marginTop: 13,
                                    minHeight: 63,
                                }]}
                                numberOfLines={3}
                                multiline={true}
                                underlineColorAndroid={transparent}
                                onChangeText={text => this.setState({description: text})}
                                returnKeyType="done"
                                value={this.state.description}
                            />

                            <TouchableOpacity
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginVertical: 7,
                                    padding: 7,
                                    alignSelf: 'flex-start',
                                }}
                                onPress={() => this.setState({isScheduler: !this.state.isScheduler})}>
                                <Image
                                    source={
                                        this.state.isScheduler
                                            ? images.checked_icon
                                            : images.unchecked_icon
                                    }
                                    style={{tintColor: primaryDark, height: 20, width: 20, marginHorizontal: 7}}
                                />
                                <Text>دارای زمان بندی</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
                <TouchableOpacity
                    onPress={() => this.checkValidation()}
                >
                    <View style={{flexDirection: 'row'}}>
                        <View
                            style={{
                                flex: 1,
                                height: 48,
                                backgroundColor: primaryDark,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderBottomLeftRadius: 4,
                                borderBottomRightRadius: 4,
                            }}
                        >
                            <Text style={{fontSize: 16, color: 'white'}}>ذخیره</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                <LoadingPopUp visible={this.state.loading} message={this.state.loadingMessage} onFinish={onFinish}/>
            </OverlayModal>
        );
    }

    onFinishImagePickerIos() {
        if (this.typeImageSlected) {
            this.onImageSelector(this.typeImageSlected.isCamera);
        }
        this.typeImageSlected = null;
    }

    onImageSelector(isCamera) {
        // this.hideSelectPicker();
        if (isCamera) {
            if (this.state.cameraPermission === 'authorized') {
                ImagePicker.openCamera({
                    // width: 800,
                    // height: 600,
                    cropping: true,
                }).then(async image => {
                    const {mime, path} = image;
                    const res = await uploadFile(path);
                    const fileName = res.fileName;

                    this.setState({
                        image: fileName,
                    });
                });
            } else if (this.state.cameraPermission !== 'restricted') {
                if (Platform.OS === 'ios' && this.state.cameraPermission === 'denied') {
                    this.alertForIosPermission('دوربین');
                } else {
                    this._requestPermission('camera');
                }
            }
        } else {
            if (this.state.photoPermission === 'authorized') {
                ImagePicker.openPicker({
                    // width: 800,
                    // height: 600,
                    cropping: true,
                }).then(async image => {
                    const {mime, path} = image;
                    const res = await uploadFile(path);
                    const fileName = res.fileName;

                    this.setState({
                        image: fileName,
                    });
                });
            } else if (this.state.photoPermission !== 'restricted') {
                if (Platform.OS === 'ios' && this.state.photoPermission === 'denied') {
                    this.alertForIosPermission('گالری تصاویر');
                } else {
                    this._requestPermission('photo');
                }
            }
        }
    }

    _requestPermission(type) {
        Permissions.request(type).then(response => {
            if (type === 'camera') {
                this.setState({cameraPermission: response});
            } else {
                this.setState({photoPermission: response});
            }
            if (response === 'authorized') {
                this.onImageSelector(type === 'camera');
            }
        });
    }

    alertForIosPermission(title) {
        Alert.alert(
            'اجازه دسترسی به ' + title,
            'شما مجوز لازم را صادر نکرده اید از طریق تنظیمات اقدام نمایید!',
            [
                {
                    text: 'لغو',
                    onPress: () => console.log('Permission denied'),
                    style: 'cancel',
                },
                {text: 'باز کردن تنظیمات', onPress: Permissions.openSettings},
            ],
        );
    }


    checkValidation() {
        Keyboard.dismiss();
        if (!this.state.facilitySelected) {
            this.setState({facilitySelectedValidation: false});
            return;
        }

        this.onConfirmFacility();
    }

    async onConfirmFacility() {
        Keyboard.dismiss();
        this.setState({loading: true, loadingMessage: 'در حال ذخیره ...'});

        let facility = {
            FacilityID: this.state.facilitySelected.ID,
            Image: this.state.image,
            IsScheduled: this.state.isScheduler,
            Tel: this.state.phoneNumber,
            FromTime: this.state.startTime ? jMoment(this.state.startTime).format('HH:mm') : null,
            ToHour: this.state.endTime ? jMoment(this.state.endTime).format('HH:mm') : null,
            DefaultPrice: this.state.price > 0 ? this.state.price : null,
            DefaultPriceForAdditionalPerson: this.state.comradePrice,
            MaxAditionalPerson: this.state.comradeCount,
            Description: this.state.description,
            BuildingID: userStore.BuildingID,
            UnitID: userStore.UnitID,
            RoleID: userStore.RoleID,
        };

        //         @DefaultPriceForAdditionalPerson	BIGINT					=	NULL	,
        //         @					BIGINT					=	NULL	,

        if (this.state.id) {
            facility = Object.assign(facility, {ID: this.state.id});
        }

        await cudBuildingFacilityQuery(facility)
            .then(() => {
                this.props.onSave(true);
            })
            .catch(e => globalState.showToastCard())
            .finally(() => this.setState({loading: false}));
    }
}

const styles = StyleSheet.create({
    textInput: {
        paddingHorizontal: 4,
        borderWidth: .5,
        borderRadius: 2,
        fontSize: 12,
        textAlignVertical: 'top',
        marginTop: 32,
    },
});

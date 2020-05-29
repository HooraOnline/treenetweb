import React, {Component} from 'react';
import {
    Keyboard,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    View,
    KeyboardAvoidingView,
    KeyboardAwareScrollView
} from '../src/react-native';
import images from "../public/static/assets/images";

import {placeholderTextColor, primaryDark, transparent} from '../src/constants/colors';

import {isValidate} from '../src/utils';
import {persistStore, userStore} from '../src/stores';
import {AlertMessage, AndroidBackButton, Toolbar} from '../src/components';
import ListMultiSelect from "../src/components/ListMultiSelect";
import FloatingLabelTextInput from '../src/components/FloatingLabelTextInput';
import MobileLayout from "../src/components/layouts/MobileLayout";
import Router from "next/router";
export default class AddMessage extends Component {
    constructor(props) {
        super(props);
        this.personCount = persistStore.roles.length;
        let state = {
            title: '',
            message: '',
            id: '',
            pristine: true,
            keyboardHeight:0,
            DestinationBuildingID: [],
            DestinationRoleID: [],
            validationTitle: true,
            validationMessage: true,
            validationBuilding: true,
            validationPerson: true,
        };
       let item =Router.query.item;
      /*  let item = props.navigation.getParam('item', null);
        this.onSave = props.navigation.getParam('onSave');*/
        if (item) {
            const perBuilding = [];
            const perPerson = [];
            JSON.parse(item.BuildingNoticeBoardBuilding).map(obj => {
                perBuilding.push(obj.id);
            });
            JSON.parse(item.BuildingNoticeBoardDestinationRole).map(obj => {
                perPerson.push(obj.id);
            });
            state.title = item.Title;
            state.message = item.Description;
            state.id = item.ID;
            state.DestinationBuildingID = perBuilding;
            state.DestinationRoleID = perPerson;
            let roles = persistStore.roles;
            state.DestinationRoleTitle = perPerson.length == this.personCount ? 'ارسال برای همه' : perPerson.length > 1 ? roles[perPerson[0]].persianName + ' و ' + (perPerson.length - 1).toString() + ' مورد دیگر' : perPerson.length > 0 ? roles[perPerson[0]].persianName : 'هیچ موردی انتخاب نشده است.';
        }
        this.state = state;
    }
    render() {

        const toolbarStyle = {
            start: {
                onPress: this.state.pristine ? () => this.onBackPress() : () => {
                    Keyboard.dismiss();
                    this.setState({showClosePopup: true});
                },
                content: images.ic_close,
            },
            title: 'ساخت اعلان جدید',
        };
        return (
            <MobileLayout title={"اضافه کردن اعلان "}>
                <View style={{flex: 1, backgroundColor: '#F5F1F1'}}>
                <Toolbar customStyle={toolbarStyle}/>
                <AndroidBackButton
                    onPress={() => {
                        this.onBackPress();
                        return true;
                    }}
                />
                    <KeyboardAwareScrollView>
                    <View
                        style={{
                            backgroundColor: '#F5F1F1',
                            flex: 1,
                            padding: 24,
                        }}
                    >
                    <FloatingLabelTextInput
                        multiline={false}
                        keyboardType="default"
                        returnKeyType="done"
                        floatingLabelEnable={false}
                        tintColor={'#BFACAC'}
                        textInputStyle={{
                            fontSize: 16,
                            color: '#5D4A4A',
                            textAlign: 'right',
                            fontFamily:
                                Platform.OS === 'ios'
                                    ? 'IRANYekan-ExtraBold'
                                    : 'IRANYekanExtraBold',

                        }}
                        underlineSize={1}
                        placeholder="عنوان اعلان"
                        onChangeText={text => this.setState({
                            title: text,
                            validationTitle: true,
                            pristine: false,
                        })}
                        highlightColor={primaryDark}
                        value={this.state.title}
                    />

                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            bottom: this.state.keyboardHeight,
                            left: 0,
                            right: 0,
                        }}
                        onPress={() => this.checkValidation()}
                        disabled={!(this.state.title && this.state.title != '' &&
                            this.state.message && this.state.message != '' &&
                            this.state.DestinationRoleID && this.state.DestinationRoleID.length > 0)}
                        disa
                    >
                        <View style={{flexDirection: 'row'}}>
                            <View
                                style={{
                                    flex: 1,
                                    height: 48,
                                    backgroundColor: (this.state.title && this.state.title != '' &&
                                        this.state.message && this.state.message != '' &&
                                        this.state.DestinationRoleID && this.state.DestinationRoleID.length > 0)
                                        ? primaryDark : '#D5CBCB',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderBottomLeftRadius: 4,
                                    borderBottomRightRadius: 4,
                                }}
                            >
                                <Text style={{
                                    fontSize: 16, color: 'white', fontFamily:
                                        Platform.OS === 'ios'
                                            ? 'IRANYekanFaNum-Bold'
                                            : 'IRANYekanBold(FaNum)',
                                }}>ساخت اعلان</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <AlertMessage
                        visible={this.state.showClosePopup}
                        title='خروج؟'
                        message='در صورت خروج از صفحه، تغییرات ذخیره نخواهد شد.'
                        onConfirm={() => {
                            this.setState({showClosePopup: false}, () => this.onBackPress());
                        }}
                        onDismiss={() => this.setState({showClosePopup: false})}
                        confirmTitle='خروج'
                        dismissTitle='ادامه ویرایش'
                    />
                </View>
                        </KeyboardAwareScrollView>
                </View>

         {/*   <View style={{flex: 1, backgroundColor: '#F5F1F1'}}>
                <Toolbar customStyle={toolbarStyle}/>
                <AndroidBackButton
                    onPress={() => {
                        this.onBackPress();
                        return true;
                    }}
                />
               <KeyboardAwareScrollView >
                    <View
                        style={{
                            backgroundColor: '#F5F1F1',
                            flex: 1,
                            padding: 24,
                        }}
                    >

                        <FloatingLabelTextInput
                            multiline={false}
                            keyboardType="default"
                            returnKeyType="done"
                            floatingLabelEnable={false}
                            tintColor={'#BFACAC'}
                            textInputStyle={{
                                fontSize: 16,
                                color: '#5D4A4A',
                                textAlign: 'right',
                                fontFamily:
                                    Platform.OS === 'ios'
                                        ? 'IRANYekan-ExtraBold'
                                        : 'IRANYekanExtraBold',

                            }}
                            underlineSize={1}
                            placeholder="عنوان اعلان"
                            onChangeText={text => this.setState({
                                title: text,
                                validationTitle: true,
                                pristine: false,
                            })}
                            highlightColor={primaryDark}
                            value={this.state.title}
                        />

                        ????????????????<TextInput
                            placeholder="پیام خود را وارد کنید"
                            placeholderTextColor={placeholderTextColor}
                            blurOnSubmit={false}
                            autoCorrect={false}

                            style={[styles.textInput, {
                                borderColor: '#E5DEDE',
                                backgroundColor: 'white',
                                textAlign: 'right',
                                color: '#262020',
                                placeholderTextColor: '#8A7E7E',
                                borderRadius: 10,
                                fontSize: 12,
                                fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum' : 'IRANYekanRegular(FaNum)',
                            }]}
                            multiline={true}
                            underlineColorAndroid={transparent}
                            onChangeText={text => this.setState({
                                message: text,
                                validationMessage: true,
                                pristine: false,
                            })}
                            returnKeyType="done"
                            value={this.state.message}
                        />

                        <Text style={{
                            fontSize: 18,
                            color: 'black',
                            textAlign: 'right',
                            fontFamily:
                                Platform.OS === 'ios'
                                    ? 'IRANYekan-ExtraBold'
                                    : 'IRANYekanExtraBold',
                            alignSelf: 'flex-start',
                            marginTop: 30,
                            marginBottom: 20,
                        }}>ارسال برای</Text>

                        { userStore.BuildingIds.length > 1 &&
                        <View
                            style={{marginBottom: 25}}
                        >
                            <ListMultiSelect
                                title='ارسال اعلان برای:'
                                selectedIcon={images.ic_send}
                                validation={this.state.validationPerson}
                                items={userStore.BuildingIds}
                                selectedTitle={this.state.DestinationBuildingTitle ? this.state.DestinationBuildingTitle : 'ساختمان را انتخاب کنید'}
                                selectedItems={this.state.DestinationBuildingID}
                                onAccept={selectedItems => this.onBuildingSelect(selectedItems)}
                            />
                        </View>
                        }

                        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 16}}>
                            <ListMultiSelect
                                title='ارسال اعلان برای:'
                                validation={this.state.validationPerson}
                                items={persistStore.roles}
                                selectedIcon={images.ic_send}
                                selectedTitle={this.state.DestinationRoleTitle ? this.state.DestinationRoleTitle : 'نقش را انتخاب کنید'}
                                selectedItems={this.state.DestinationRoleID}
                                onAccept={selectedItems => this.onRoleSelect(selectedItems)}
                            />
                        </View>


                    </View>?????????
                </KeyboardAwareScrollView>
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        bottom: this.state.keyboardHeight,
                        left: 0,
                        right: 0,
                    }}
                    onPress={() => this.checkValidation()}
                    disabled={!(this.state.title && this.state.title != '' &&
                        this.state.message && this.state.message != '' &&
                        this.state.DestinationRoleID && this.state.DestinationRoleID.length > 0)}

                >
                    <View style={{flexDirection: 'row'}}>
                        <View
                            style={{
                                flex: 1,
                                height: 48,
                                backgroundColor: (this.state.title && this.state.title != '' &&
                                    this.state.message && this.state.message != '' &&
                                    this.state.DestinationRoleID && this.state.DestinationRoleID.length > 0)
                                    ? primaryDark : '#D5CBCB',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderBottomLeftRadius: 4,
                                borderBottomRightRadius: 4,
                            }}
                        >
                            <Text style={{
                                fontSize: 16, color: 'white', fontFamily:
                                    Platform.OS === 'ios'
                                        ? 'IRANYekanFaNum-Bold'
                                        : 'IRANYekanBold(FaNum)',
                            }}>ساخت اعلان</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <AlertMessage
                    visible={this.state.showClosePopup}
                    title='خروج؟'
                    message='در صورت خروج از صفحه، تغییرات ذخیره نخواهد شد.'
                    onConfirm={() => {
                        this.setState({showClosePopup: false}, () => this.onBackPress());
                    }}
                    onDismiss={() => this.setState({showClosePopup: false})}
                    confirmTitle='خروج'
                    dismissTitle='ادامه ویرایش'
                />

            </View>*/}
            </MobileLayout>
        );
    }
   /* componentDidMount(): void {
        if(Platform.OS === 'ios'){
            Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
            Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
        }
    }*/
    _keyboardDidShow=(e)=> {
        this.setState({  keyboardHeight: e.endCoordinates.height-33, });
    }
    _keyboardDidHide=(e)=> {
        this.setState({  keyboardHeight: 0, });
    }
   /* componentWillUnmount(): void {
        if(Platform.OS === 'ios'){
            Keyboard.removeListener('keyboardDidShow');
            Keyboard.removeListener('keyboardDidHide');
        }
    }*/
    onBackPress() {
        this.props.navigation.goBack();
    }
    onRoleSelect(selectedItems) {
        let roles = persistStore.roles;
        this.setState({
            DestinationRoleID: selectedItems,
            DestinationRoleTitle: selectedItems.length == this.personCount ? 'ارسال برای همه' : selectedItems.length > 1 ?
                roles[selectedItems[0]].persianName + ' و ' + (selectedItems.length - 1).toString()
                + ' مورد دیگر' : selectedItems.length > 0 ? roles[selectedItems[0]].persianName : 'هیچ نقشی انتخاب نشده است.',
            pristine: false,
        });
    }
    onBuildingSelect(selectedItems) {
        this.setState({
            DestinationBuildingID: selectedItems,
            DestinationBuildingTitle: selectedItems.length == userStore.BuildingIds.length ? 'ارسال برای همه' :
                selectedItems.length > 0 ? selectedItems.length + " ساختمان" : 'هیچ ساختمانی انتخاب نشده است.',
            pristine: false,
        });
    }
    checkValidation() {

        Keyboard.dismiss();
        if (!isValidate(this.state.title)) {
            this.setState({validationTitle: false});
            return;
        }

        if (!isValidate(this.state.message)) {
            this.setState({validationMessage: false});
            return;
        }

        if (userStore.BuildingIds.length > 1 && !isValidate(this.state.DestinationBuildingID)) {
            this.setState({validationBuilding: false});
            return;
        }

        if (!isValidate(this.state.DestinationRoleID)) {
            this.setState({validationPerson: false});
            return;
        }

        let item = {
            title: this.state.title,
            description: this.state.message,
        };
        item = Object.assign(item, {
            DestinationBuildingID: userStore.BuildingIds.length > 1 ? this.state.DestinationBuildingID : [userStore.BuildingIds[0].id],
            DestinationRoleID: this.personCount === this.state.DestinationRoleID.length ? null : this.state.DestinationRoleID,
        });
        if (this.state.id) {
            item = Object.assign(item, {ID: this.state.id});
        }

        item = Object.assign(item, {BuildingID: userStore.BuildingID, UnitID: userStore.UnitID});

        this.onBackPress();

        this.onSave(item);
    }


}

const styles = StyleSheet.create({
    textInput: {
        paddingHorizontal: 4,
        borderWidth: 0.5,
        height: 120,
        textAlignVertical: 'top',
        marginTop: 24,
    },
    buttonIn: {
        flex: 1,
        borderWidth: 0.5,
        alignItems: 'center',
        borderRadius: 4,
        height: 33,
        justifyContent: 'center',
        marginLeft: 7,
        marginRight: 7,
    },
});

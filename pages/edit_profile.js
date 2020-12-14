import React, { Component } from 'react';
import { Platform, Text, TouchableOpacity, View, StyleSheet, Image } from "../src/react-native";
import { persistStore, pStore, userStore } from "../src/stores";
import PanelLayout from "../src/components/layouts/PanelLayout";
import { ImageSelector, SwitchTextMulti, Toolbar, } from "../src/components";
import { getTabWidth, mapNumbersToEnglish, navigation, showMassage } from "../src/utils";
import images from "../public/static/assets/images";
import {
    bgWhite,
    border,
    bgSuccess,
    lightRed,
    orange1,
    placeholderTextColor,
    primaryDark,
    textItemBlack, subTextItem, textItem, bg1
} from "../src/constants/colors";
import translate from "../src/language/translate";
import { postQuery } from "../dataService/apiService";
import FloatingLabelTextInput from "../src/components/FloatingLabelTextInput";
import TextInput from "../src/react-native/TextInput";


export default class edit_profile extends Component {
    constructor() {
        super();

        this.state = {
            image: pStore.cUser.profileImage,
            password: '',
            showPassword: false,
            mobileValidation: pStore.cUser.mobile ? true : false,
            userKeyValidation: pStore.cUser.userKey ? true : false,
            emailValidation: pStore.cUser.email ? true : false,
            usernameValidation: pStore.cUser.username ? true : false,
            avatarValidation: pStore.cUser.avatar ? true : false,
            storyValidation: pStore.cUser.story ? true : false,
            firstNameValidation: pStore.cUser.firstName ? true : false,
            lastNameValidation: pStore.cUser.lastName ? true : false,
            displayNameValidation: pStore.cUser.displayName ? true : false,
            
            ageValidation: pStore.cUser.age ? true : false,
            countryCode: pStore.cUser.countryCode,
            username: pStore.cUser.username,
            userKey: pStore.cUser.userKey,
            shortMobile: pStore.cUser.mobile,
            email: pStore.cUser.email,
            firstName: pStore.cUser.firstName,
            lastName: pStore.cUser.lastName,
            displayName: pStore.cUser.displayName,
            avatar: pStore.cUser.avatar,
            story: pStore.cUser.story,
            gender: Number(pStore.cUser.gender || 0),
            profileImageValidation: pStore.cUser.profileImage !== 'defaultProfileImage.png',
        };

        this.state.age = pStore.cUser.age;
        this.state.gender = Number(pStore.cUser.gender || 0)

    }

    async componentDidMount() {

    }

    checkValidation() {

        const emailReg = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/
        if (this.state.email && !emailReg.test(this.state.email)) {
            //this.setState({emailReg: false});
            return translate('fastRegister_invalid_email_format');
        }
        if (!this.state.firstName) {

            return translate('نام خود را وارد کنید.');
        }
        if (!this.state.lastName) {

            return translate('نام خانوادگی خود را وارد کنید.');
        }
        if (!this.state.age) {
            return translate('سن را وارد کنید');
        }

        if (!this.state.profileImageValidation) {
            return translate(' تصویر  پروفایل خود را انتخاب کنید.');
        }
        // if (!this.state.userKeyValidation) {
        //     return translate(' نام کاربری وارد نشده.');
        // }
    }
    updateProfile = () => {
        const msg = this.checkValidation();
        if (msg) {
            showMassage(msg, 'warning')
            return;
        }

        const data = {

        };

        if (this.state.email) {
            data.email = this.state.email;
        }
        if (this.state.firstName) {
            data.firstName = this.state.firstName;
        }
        if (this.state.lastName) {
            data.lastName = this.state.lastName;
        }
        // if (this.state.userKey) {
        //     data.userKey = this.state.userKey;
        // }
        if (this.state.displayName) {
            data.displayName = this.state.displayName;
        }
        if (this.state.avatar) {
            data.avatar = this.state.avatar;
        }
        if (this.state.story) {
            data.story = this.state.story;
        }
        if (this.state.age) {
            data.age = this.state.age;
        }
        if (this.state.gender !== undefined) {
            data.gender = Number(this.state.gender);
        }

        this.setState({ loading: true, loadingMessage: 'در حال اجرا' });
        postQuery('Members/me/editProfile', data, 'cUser')
            .then(res => {
                console.log(res);
                //pStore.cUser=res;
                navigation.replace(pStore.cUser.userKey);
                this.setState({ loading: false });
                //showMassage('پروفایل با موفقیت ویرایش شد.','success')
            })
            .catch(err => {
                this.setState({ loading: false });
            })

    }
    setProfileImage = (fileName) => {
        const data = { profileImage: fileName }
        postQuery('Members/me/setProfileImage', data)
            .then(res => {
                profileImage: res.profileImage;
                this.setState({ loading: false });
            })
            .catch(err => {
                this.setState({ loading: false });
            })
    }

    render() {
        const toolbarStyle = {
            start: {
                content: images.ic_back,
                onPress: () => navigation.goBack(),
            },
            title: 'ویرایش پروفایل',

        };
        return (
            <PanelLayout
                loading={this.state.loading}
                loadingMessage={this.state.loadingMessage}
                title={`Treenetgram`}
                showMenu={this.state.showMenu}
                onRef={(initDrawer) => this.initDrawer = initDrawer}
                onCloseMenu={() => this.setState({ showMenu: false })}
                style={{ alignItems: 'center' }}
                header={
                    <Toolbar
                        customStyle={toolbarStyle}
                        isExpand={this.state.showAccountSelect}
                    />
                }
                footer={
                    <TouchableOpacity
                        onPress={this.updateProfile}
                        style={{ alignItems: 'center', justifyContent: 'center', padding: 10, backgroundColor: primaryDark }}>
                        <Text style={{ color: bgWhite }} >ذخیره</Text>
                    </TouchableOpacity>
                }>
                <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 10,paddingVertical:24 }} >
                    <View id='form' style={{ width: '100%', maxWidth: 500, marginTop: 3, paddingHorizontal: 16, }}   >
                        <ImageSelector
                            style={{
                                borderWidth: 1,
                                borderColor: orange1,
                                height: 100,
                                width: 100,
                                borderRadius: 50,
                                alignSelf: 'center'
                            }}
                            folderName={'member'}
                            canUpload={true}
                            autoUpload={true}
                            imageStyle={{ height: 100, width: 100, borderRadius: 50 }}
                            image={pStore.cUser.profileImage}
                            noImage={images.default_ProPic}
                            hideDeleteBtn={true}
                            //onrender={(imageSelector)=>imageSelector.setState({image:this.state.userImage})}
                            onUplodedFile={(fileName) => {

                                this.setState({ image: fileName });
                                this.setProfileImage(fileName);
                            }}
                            onRemoveImage={(fileName) => {
                                this.setState({ image: null });
                            }}
                            onSelectFile={() => {
                                this.setState({ profileImageValidation: true })
                            }}
                        />
                         <Text style={{
                            fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum' : 'IRANYekanRegular(FaNum)',
                            fontSize: 13,
                            color: textItem,
                            alignSelf: 'center',
                            fontWeight:800,
                         }}>{pStore.cUser.userKey}</Text>
                          <Text dir='ltr' style={{
                                    fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum' : 'IRANYekanRegular(FaNum)',
                                    fontSize: 12,
                                    color: border,
                                    alignSelf: 'center',
                                }}>+{this.state.username}</Text>

                        <View id='userProperty' >
                            
                            <View style={{ marginTop: 0, padding: 10 }}  >
                                <FloatingLabelTextInput
                                    ref={input => {
                                        this.labelInput = input;
                                    }}
                                    //labelAlign={'left'}
                                    placeholder={translate('نام')}
                                    style={{ flex: 1, marginTop: 10 }}
                                    labelStyle={{ color: border,fontSize:10,fontSize:10  }}
                                    editable={true}
                                    multiline={false}
                                    maxLength={70}
                                    floatingLabelEnable={true}
                                    keyboardType="default"
                                    returnKeyType="done"
                                    numberOfLines={1}
                                    underlineColor={
                                        this.state.firstNameValidation ? bgSuccess : lightRed
                                    }
                                    isAccept={this.state.firstNameValidation}
                                    textInputStyle={{

                                        fontFamily:
                                            Platform.OS === 'ios'
                                                ? 'IRANYekan-ExtraBold'
                                                : 'IRANYekanExtraBold',

                                        fontSize: 12,
                                        paddingStart: 4,
                                        paddingTop: 1,
                                        paddingBottom: 3,
                                        //textAlign: 'right',
                                    }}
                                    underlineSize={1}

                                    onChangeText={text =>
                                        this.setState({
                                            firstName: text,
                                            firstNameValidation: true,
                                        })
                                    }
                                    highlightColor={primaryDark}
                                    value={this.state.firstName}
                                />

                                <FloatingLabelTextInput
                                    ref={input => {
                                        this.labelInput = input;
                                    }}
                                    //labelAlign={'left'}
                                    placeholder={translate('نام خانوادگی')}
                                    style={{ flex: 1, marginTop: 30 }}
                                    labelStyle={{ color: border ,fontSize:10}}
                                    editable={true}
                                    multiline={false}
                                    maxLength={70}
                                    floatingLabelEnable={true}
                                    keyboardType="default"
                                    returnKeyType="done"
                                    numberOfLines={1}
                                    underlineColor={
                                        this.state.firstNameValidation ? bgSuccess : lightRed
                                    }
                                    isAccept={this.state.lastNameValidation}
                                    textInputStyle={{

                                        fontFamily:
                                            Platform.OS === 'ios'
                                                ? 'IRANYekan-ExtraBold'
                                                : 'IRANYekanExtraBold',

                                        fontSize: 12,
                                        paddingStart: 4,
                                        paddingTop: 1,
                                        paddingBottom: 3,
                                        //textAlign: 'right',
                                    }}
                                    underlineSize={1}

                                    onChangeText={text =>
                                        this.setState({
                                            lastName: text,
                                            lastNameValidation: true,
                                        })
                                    }
                                    highlightColor={primaryDark}
                                    value={this.state.lastName}
                                />

                                <FloatingLabelTextInput
                                    ref={input => {
                                        this.labelInput = input;
                                    }}
                                    //labelAlign={'left'}
                                    placeholder={translate('نام مستعار')}
                                    style={{ flex: 1, marginTop: 30 }}
                                    labelStyle={{ color: border,fontSize:10  }}
                                    editable={true}
                                    multiline={false}
                                    maxLength={70}
                                    floatingLabelEnable={true}
                                    keyboardType="default"
                                    returnKeyType="done"
                                    numberOfLines={1}
                                    underlineColor={
                                        this.state.displayNameValidation ? bgSuccess : lightRed
                                    }
                                    
                                    isAccept={this.state.displayNameValidation}
                                    textInputStyle={{

                                        fontFamily:
                                            Platform.OS === 'ios'
                                                ? 'IRANYekan-ExtraBold'
                                                : 'IRANYekanExtraBold',

                                        fontSize: 12,
                                        paddingStart: 4,
                                        paddingTop: 1,
                                        paddingBottom: 3,
                                        //textAlign: 'right',
                                    }}
                                    underlineSize={1}

                                    onChangeText={text =>
                                        this.setState({
                                            displayName: text,
                                            displayNameValidation: true,
                                        })
                                    }
                                    highlightColor={primaryDark}
                                    value={this.state.displayName}
                                />

                                <FloatingLabelTextInput
                                    //labelAlign={'left'}
                                    //reverse={persistStore.isRtl}
                                    placeholder={translate('age')}
                                    style={{ flex: 1, marginTop: 30 }}
                                    labelStyle={{ color: border,fontSize:10  }}
                                    editable={true}
                                    multiline={false}
                                    maxLength={2}
                                    floatingLabelEnable={true}
                                    keyboardType="number-pad"
                                    returnKeyType="done"
                                    numberOfLines={1}
                                    textInputStyle={{
                                        fontFamily: 'IRANYekanExtraBold',

                                        fontSize: 12,
                                        paddingRight: 10,
                                        paddingTop: 1,
                                        paddingBottom: 3,
                                        //textAlign: 'right',
                                    }}
                                    underlineSize={1}
                                    value={this.state.age}
                                    onChangeText={text => {
                                        const acceptReg = /^\d+$/;;
                                        const ageReg = /^\d+$/;
                                        text = mapNumbersToEnglish(text);
                                        if (acceptReg.test(text)) {
                                            this.setState({ age: text, ageValidation: ageReg.test(text) });
                                        } else {
                                            //showMassage(translate('فقط اعداد انگلیسی'),'warning');
                                        }
                                        if (!text) {
                                            this.setState({ age: '', ageValidation: false });
                                        }

                                    }

                                    }
                                    underlineColor={
                                        this.state.ageValidation ? bgSuccess : lightRed
                                    }
                                    isAccept={this.state.ageValidation}
                                    highlightColor={primaryDark}
                                    unit={translate('year')}
                                    unitStyle={{ color: orange1 }}
                                    keyboardType="number-pad"
                                />
                                <View style={{ flex: 1, alignItems: 'center', marginTop: 30 }}>
                                    <SwitchTextMulti
                                        style={{ width: 300 }}
                                        selectedIndex={this.state.gender}
                                        onSelect={index => {
                                            this.setState({ gender: index });
                                            //this.checkValidation();
                                        }}
                                        data={[
                                            translate('woman'),
                                            translate('man'),
                                        ]}
                                        backgroundActive={primaryDark}
                                        backgroundInactive={'#fff'}
                                        itemWidth={getTabWidth(300, 2, 1)}
                                        activeTextStyle={{
                                            paddingVertical: 6,
                                        }}
                                        inactiveTextStyle={{
                                            paddingVertical: 6,
                                        }}
                                    />
                            </View>
                           
                            <FloatingLabelTextInput
                                    labelAlign={'left'}
                                    dir={'ltr'}
                                    floatingLabelEnable={true}
                                    reverse={persistStore.isRtl}
                                    style={{ flex: 1, marginTop:30 }}
                                    placeholder={translate("fastRegister_email_address")}
                                    value={this.state.email}
                                    onChangeText={text => {
                                        const acceptReg = /^[a-zA-Z0-9~@.]+$/;
                                        const emailReg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                        if (acceptReg.test(text)) {
                                            this.setState({ email: text, emailValidation: emailReg.test(text) });
                                        } else {
                                            //showMassage(translate('fastRegister_only_english_number_special_charachter'),'warning');
                                        }
                                        if (!text) {
                                            this.setState({ email: '', emailValidation: false });
                                        }
                                    }}
                                    underlineColor={
                                        this.state.emailValidation ? bgSuccess : lightRed
                                    }
                                    numberOfLines={1}
                                    isAccept={this.state.emailValidation}
                                    textInputStyle={{
                                        fontSize: 12,
                                        color: textItemBlack,
                                        paddingStart: 4,
                                        paddingTop: 1,
                                        paddingBottom: 10,
                                        //textAlign: 'left',
                                    }}
                                    underlineSize={1}
                                    multiline={false}
                                    maxLength={100}
                                    //autoFocus={true}
                                    returnKeyType="done"
                                />
                                <FloatingLabelTextInput
                                    labelAlign={'left'}
                                    placeholder={translate('آواتار')}
                                    style={{ flex: 1, marginTop: 30 }}
                                    labelStyle={{ color: border,fontSize:10  }}
                                    editable={true}
                                    multiline={false}
                                    maxLength={50}
                                    floatingLabelEnable={true}
                                    keyboardType="default"
                                    returnKeyType="done"
                                    numberOfLines={1}
                                    underlineColor={
                                        this.state.firstNameValidation ? bgSuccess : lightRed
                                    }
                                    textInputStyle={{

                                        fontFamily: 'IRANYekanExtraBold',

                                        fontSize: 12,
                                        paddingStart: 4,
                                        paddingTop: 1,
                                        paddingBottom: 3,
                                        //textAlign: 'right',
                                    }}
                                    underlineSize={1}

                                    onChangeText={text =>
                                        this.setState({
                                            avatar: text,
                                            avatarValidation: true,
                                        })
                                    }
                                    highlightColor={primaryDark}
                                    value={this.state.avatar}
                                />
                                <Text style={{ marginTop: 10, fontSize: 11, color: textItemBlack, textAlign: 'justify',  }} > در بخش آواتار می توانید یک جمله کوتاه در مورد تخصص، کسب و کار یا هدفتان در ترینتگرام برای دیگران بنویسید</Text>
                                <Text style={{ fontSize: 11 }} >چند مثال </Text>
                                <Text style={{ fontSize: 11 }} >بازاریاب کالای شما در سراسر ایران</Text>
                                <Text style={{ fontSize: 11 }} >مربی موفقیت مالی</Text>
                                <Text style={{ fontSize: 11 }} >فروشگاه اینترنتی کارنیکا</Text>
                                <Text style={{ fontSize: 11 }} >متخصص تعمیرات لوازم برقی</Text>
                                <Text style={{ fontSize: 11 }} >تبلیغ بین المللی یورونت</Text>
                                <Text style={{ fontSize: 11 }} > فروش بیمه عمر با شرایط ویژه </Text>
                                <Text style={{ fontSize: 11 }} >رستوران لوکس نارنجستان</Text>
                                <Text style={{ fontSize: 11 }} >هتل پنج ستاره حاتم</Text>
                               

                                <TextInput
                                    placeholder="داستان کوتاه شما یا داستان تخصص یا کسب و کار(اختیاری)"
                                    bgSuccess={subTextItem}
                                    style={{
                                        flex: 1,
                                        marginTop: 20,
                                        paddingHorizontal: 4,
                                        borderColor: this.state.storyValidation ? bgSuccess : lightRed,
                                        borderWidth: 1,
                                        borderRadius: 10,
                                        fontSize: 12,
                                        textAlignVertical: 'top',
                                        textAlign: 'right',
                                        padding: 8,
                                        height: 110,
                                    }}
                                    multiline={true}
                                    onChangeText={text => { this.setState({ story: text, storyValidation: text ? true : false }) }}
                                    returnKeyType="done"
                                    value={this.state.story}
                                    numberOfLines={4}
                                    maxLength={300}
                                />

                            </View>


                        </View>
                    </View>
                </View>
            </PanelLayout>


        )
    }

}

const styles = StyleSheet.create({
    textInput: {
        flex: 1,
        paddingHorizontal: 4,
        borderColor: subTextItem,
        borderWidth: 1,
        borderRadius: 10,
        fontSize: 12,
        textAlignVertical: 'top',
        textAlign: 'right',
        padding: 8,
        height: 110,
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

    multiSwitchItem: {
        flex: 1,
        fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum' : 'IRANYekanRegular(FaNum)',
        fontSize: 12,
        paddingHorizontal: 7,
        paddingVertical: 2,
    },
    multiSwitchItemActive: {
        fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum-Bold' : 'IRANYekanBold(FaNum)',
        fontSize: 14,
    },

});



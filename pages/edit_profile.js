import React, {Component} from 'react';
import {persistStore, userStore} from "../src/stores";
import PanelLayout from "../src/components/layouts/PanelLayout";
import {ImageSelector, SwitchTextMulti, Toolbar} from "../src/components";
import {getTabWidth, mapNumbersToEnglish, navigation, showMassage} from "../src/utils";
import images from "../public/static/assets/images";
import {
    bgWhite,
    border,
    bgSuccess,
    lightRed,
    orange1,
    placeholderTextColor,
    primaryDark,
    textItemBlack
} from "../src/constants/colors";
import {Platform, Text, TouchableOpacity, View,} from "../src/react-native";
import translate from "../src/language/translate";
import {postQuery} from "../dataService/apiService";
import FloatingLabelTextInput from "../src/components/FloatingLabelTextInput";

const HOME_TYPE = 1;
export default class edit_profile extends Component {
    constructor() {
        super();

        this.state = {
            image:userStore.profileImage,
            password:'',
            showPassword:false,
            passwordValidation:false,
            passwor2dValidation:false,
            usernameValidation:false,
            avatarValidation:false,
            countryCode:userStore.countryCode,
            username:userStore.username,
            shortMobile:userStore.shortMobile,
            email:userStore.email ||'',
            firstName:userStore.firstName ||'',
            lastName:userStore.lastName ||'',
            avatar:userStore.avatar ||'',
            gender:Number(userStore.gender ||0),
            profileImageValidation:userStore.profileImage!=='defaultProfileImage.png',
        };

        this.state.age=userStore.age;
        this.state.gender=Number(userStore.gender ||0)

    }

    async componentDidMount() {

    }

    checkValidation() {
        if(!this.state.shortMobile){
            this.setState({mobileValidation: false});
            return translate('موبایل خود را وارد کنید.')
        }
        if (this.state.shortMobile && this.state.shortMobile.length < 10) {
            this.setState({mobileValidation: false});
            return translate('the_number_of_mobile_is_not_valid');
        }

        const mobileReg = /^9[0-9]{9}$/i;
        if (this.state.shortMobile && !mobileReg.test(this.state.shortMobile)){
            //this.setState({mobileValidation: false});
            return translate('invalid_mobile_number'); ;
        }

        const emailReg = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/
        if (this.state.email && !emailReg.test(this.state.email)){
            //this.setState({emailReg: false});
            return translate('fastRegister_invalid_email_format');
        }
        if (!this.state.firstName){

            return translate('نام خود را وارد کنید.');
        }
        if (!this.state.lastName){
            //this.setState({emailReg: false});
            return translate('نام خانوادگی خود را وارد کنید.');
        }
        if (!this.state.age){
            return translate('سن را وارد کنید');
        }

        if(!this.state.profileImageValidation){
            return translate(' تصویر  پروفایل خود را انتخاب کنید.');
        }

    }
    updateUsernameAndPassword=()=>{

        const msg=this.checkValidation();
        if(msg){
            showMassage(msg,'warning')
            return;
        }

        const data={

        };
        if(this.state.shortMobile){
            data.mobile=this.state.countryCode+'-'+this.state.shortMobile;
        }
        if(this.state.email){
            data.email=this.state.email;
        }
        if(this.state.firstName){
            data.firstName=this.state.firstName;
        }
        if(this.state.lastName){
            data.lastName=this.state.lastName;
        }
        if(this.state.avatar){
            data.avatar=this.state.avatar;
        }
        if(this.state.age){
            data.age=this.state.age;
        }
        if(this.state.gender!==undefined){
            data.gender=Number(this.state.gender);
        }


        this.setState({loading:true,loadingMessage:'در حال اجرا'});
        postQuery('Members/me/editProfile',data)
            .then(res=>{
                console.log(res);
                navigation.replace('profile');
                this.setState({loading:false});
                //showMassage('پروفایل با موفقیت ویرایش شد.','success')
            })
            .catch(err=>{
                this.setState({loading:false});
            })

    }
    setProfileImage=(fileName)=>{
        const data={profileImage:fileName}
        postQuery('Members/me/setProfileImage',data)
            .then(res=>{
                profileImage:res.profileImage;
                this.setState({loading:false});
            })
            .catch(err=>{
                this.setState({loading:false});
            })
    }

    render() {
        const toolbarStyle = {
            start: {
                content: images.ic_back,
                onPress: ()=>navigation.goBack(),
            },
            title: 'ویرایش پروفایل',

        };
        return (
            <PanelLayout
                loading={this.state.loading}
                loadingMessage={this.state.loadingMessage}
                title={`Treenetgram`}
                showMenu={this.state.showMenu}
                         onRef={(initDrawer)=>this.initDrawer=initDrawer}
                         onCloseMenu={()=>this.setState({showMenu:false})}
                         style={{alignItems:'center'}}
                         header={
                             <Toolbar
                                 customStyle={toolbarStyle}
                                 isExpand={this.state.showAccountSelect }
                             />
                         }
                         footer={
                             <TouchableOpacity
                                 onPress={this.updateUsernameAndPassword}
                                 style={{alignItems:'center',justifyContent:'center',padding:10, backgroundColor:primaryDark}}>
                                 <Text style={{color:bgWhite}} >ذخیره</Text>
                             </TouchableOpacity>
                         }>
                <View style={{flex:1,alignItems:'center',paddingHorizontal:10,}} >
                    <View id='form' style={{width:'100%',maxWidth:500,marginTop:3,paddingHorizontal:16,}}   >
                        <ImageSelector
                            style={{
                                borderWidth: 2,
                                borderColor: orange1,
                                height: 100,
                                width: 100,
                                borderRadius: 50,
                                alignSelf: 'center'
                            }}
                            canUpload={true}
                            autoUpload={true}
                            imageStyle={{height:100,width:100,borderRadius:50}}
                            image={userStore.profileImage}
                            noImage={images.default_ProPic}
                            hideDeleteBtn={true}
                            //onrender={(imageSelector)=>imageSelector.setState({image:this.state.userImage})}
                            onUplodedFile={(fileName)=>{

                                this.setState({image: fileName});
                                this.setProfileImage(fileName);
                            }}
                            onRemoveImage={(fileName)=>{
                                this.setState({image: null});
                            }}
                            onSelectFile={()=>{
                                this.setState({profileImageValidation:true})
                            }}
                        />

                        <View id='form' style={{width:'100%',maxWidth:500,marginTop:10}}   >
                            <View dir={"ltr"} style={{
                                flexDirection: 'row',
                                marginTop: 0,
                                borderColor: orange1,
                                borderWidth: 2,
                                borderRadius: 8,
                                backgroundColor: bgWhite,
                            }}>
                                <Text style={{
                                    fontFamily: Platform.OS === 'ios' ? 'IRANYekanFaNum' : 'IRANYekanRegular(FaNum)',
                                    fontSize: 14,
                                    color: border,

                                    padding: 5,
                                    alignSelf: 'center',
                                }}>{this.state.countryCode}</Text>
                                <FloatingLabelTextInput
                                    dir={'ltr'}
                                    labelAlign={'left'}
                                    reverse={persistStore.isRtl}
                                    style={{flex:1,paddingHorizontal:5,paddingVertical:5,paddingTop:7}}
                                    placeholder={translate("fastRegister_mobile_number")}
                                    value={this.state.shortMobile}
                                    onChangeText={text => {
                                        text = mapNumbersToEnglish(text);
                                        if(text.length>1 && text.indexOf(0)==0){
                                            text=text.substring(1);
                                        }

                                        const acceptReg =/^[0-9~.]+$/;
                                        const mobileReg = /^9[0-9]{9}$/i;
                                        if(acceptReg.test(text)){
                                            text = mapNumbersToEnglish(text);
                                            this.setState({ shortMobile:text, mobileValidation:mobileReg.test(text)});
                                        }else{
                                            //showMassage(translate('fastRegister_onlyEnglish_number'),'warning');
                                        }
                                        if(!text){
                                            this.setState({ shortMobile:'', mobileValidation:false});
                                        }

                                    }}
                                    numberOfLines={1}
                                    isAccept={this.state.mobileValidation}
                                    textInputStyle={{
                                        fontFamily: 'IRANYekanFaNum-Bold',
                                        fontSize: 14,
                                        fontWeight:800,
                                        color: textItemBlack,
                                        paddingStart: 4,
                                        paddingTop: 1,
                                        paddingBottom: 10,
                                        //textAlign: 'left',
                                    }}
                                    underlineSize={0}

                                    multiline={false}
                                    maxLength={10}
                                    //autoFocus={true}
                                    keyboardType="number-pad"
                                    returnKeyType="done"

                                />

                            </View>
                            <View dir={"ltr"} style={{
                                flexDirection: 'row',
                                marginTop: 10,
                                borderColor: orange1,
                                borderWidth: 2,
                                borderRadius: 8,
                                backgroundColor: bgWhite,
                            }}>
                                <FloatingLabelTextInput
                                    labelAlign={'left'}
                                    dir={'ltr'}
                                    reverse={persistStore.isRtl}
                                    style={{flex: 1, paddingHorizontal: 5, paddingVertical: 5, paddingTop: 7}}
                                    placeholder={translate("fastRegister_email_address")}
                                    value={this.state.email}
                                    onChangeText={text => {
                                        const acceptReg = /^[a-zA-Z0-9~@.]+$/;
                                        const emailReg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                        if(acceptReg.test(text)){
                                            this.setState({ email:text, emailValidation:emailReg.test(text)});
                                        }else{
                                            //showMassage(translate('fastRegister_only_english_number_special_charachter'),'warning');
                                        }
                                        if(!text){
                                            this.setState({ email:'', emailValidation:false});
                                        }
                                    }}
                                    numberOfLines={1}
                                    isAccept={this.state.emailValidation}
                                    textInputStyle={{
                                        fontFamily: 'IRANYekanFaNum-Bold',
                                        fontSize: 14,
                                        fontWeight:800,
                                        color: textItemBlack,
                                        paddingStart: 4,
                                        paddingTop: 1,
                                        paddingBottom: 10,
                                        //textAlign: 'left',
                                    }}
                                    underlineSize={0}
                                    multiline={false}
                                    maxLength={100}
                                    //autoFocus={true}
                                    returnKeyType="done"
                                />
                            </View>
                        </View>
                        <View id='userProperty' >
                            <View style={{flex:1,alignItems:'center',marginTop:30}}>
                                <SwitchTextMulti
                                    style={{width:300}}
                                    selectedIndex={this.state.gender}
                                    onSelect={index => {
                                        this.setState({gender: index});
                                        //this.checkValidation();
                                    }}
                                    data={[
                                        translate('woman'),
                                        translate('man'),
                                    ]}
                                    backgroundActive={primaryDark}
                                    backgroundInactive={'#fff'}
                                    itemWidth={getTabWidth(300, 2,1)}
                                    activeTextStyle={{
                                        paddingVertical: 6,
                                    }}
                                    inactiveTextStyle={{
                                        paddingVertical: 6,
                                    }}
                                />
                            </View>
                            <View  style={{marginTop:0,  padding:10}}  >
                                <FloatingLabelTextInput
                                    ref={input => {
                                        this.labelInput = input;
                                    }}
                                    labelAlign={'left'}
                                    placeholder={translate('firstName')}
                                    style={{flex: 1, marginTop: 20}}
                                    labelStyle={{color: bgSuccess}}
                                    editable={true}
                                    multiline={false}
                                    maxLength={70}
                                    floatingLabelEnable={true}
                                    keyboardType="default"
                                    returnKeyType="done"
                                    numberOfLines={1}
                                    tintColor={
                                        this.state.firstNameValidation ? placeholderTextColor : lightRed
                                    }
                                    textInputStyle={{

                                        fontFamily:
                                            Platform.OS === 'ios'
                                                ? 'IRANYekan-ExtraBold'
                                                : 'IRANYekanExtraBold',

                                        fontSize: 14,
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
                                    labelAlign={'left'}
                                    placeholder={translate('lastName')}
                                    style={{flex: 1, marginTop: 20}}
                                    labelStyle={{color: bgSuccess}}
                                    editable={true}
                                    multiline={false}
                                    maxLength={70}
                                    floatingLabelEnable={true}
                                    keyboardType="default"
                                    returnKeyType="done"
                                    numberOfLines={1}
                                    tintColor={
                                        this.state.lastNameValidation ? placeholderTextColor : lightRed
                                    }
                                    textInputStyle={{

                                        fontFamily:
                                            Platform.OS === 'ios'
                                                ? 'IRANYekan-ExtraBold'
                                                : 'IRANYekanExtraBold',

                                        fontSize: 14,
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
                                    labelAlign={'left'}
                                    reverse={persistStore.isRtl}
                                    placeholder={translate('age')}
                                    style={{flex: 1, marginTop: 20}}
                                    labelStyle={{color: bgSuccess}}
                                    editable={true}
                                    multiline={false}
                                    maxLength={2}
                                    floatingLabelEnable={true}
                                    keyboardType="number-pad"
                                    returnKeyType="done"
                                    numberOfLines={1}
                                    textInputStyle={{
                                        fontFamily:'IRANYekanExtraBold',

                                        fontSize: 14,
                                        paddingRight: 10,
                                        paddingTop: 1,
                                        paddingBottom: 3,
                                        //textAlign: 'right',
                                    }}
                                    underlineSize={1}
                                    value={this.state.age}
                                    onChangeText={text =>{
                                        const acceptReg =/^\d+$/;;
                                        const ageReg=/^\d+$/;
                                        text = mapNumbersToEnglish(text);
                                        if(acceptReg.test(text)){
                                            this.setState({ age:text, ageValidation:ageReg.test(text)});
                                        }else{
                                            //showMassage(translate('فقط اعداد انگلیسی'),'warning');
                                        }
                                        if(!text){
                                            this.setState({ age:'', ageValidation:false});
                                        }

                                    }

                                    }
                                    tintColor={
                                        this.state.ageValidation ? placeholderTextColor : lightRed
                                    }
                                    highlightColor={primaryDark}
                                    unit={translate('year')}
                                    unitStyle={{color: orange1}}
                                    keyboardType="number-pad"
                                />
                                <FloatingLabelTextInput

                                    labelAlign={'left'}
                                    placeholder={translate('آواتار')}
                                    style={{flex: 1, marginTop: 20}}
                                    labelStyle={{color: bgSuccess}}
                                    editable={true}
                                    multiline={false}
                                    maxLength={50}
                                    floatingLabelEnable={true}
                                    keyboardType="default"
                                    returnKeyType="done"
                                    numberOfLines={1}
                                    tintColor={
                                        this.state.firstNameValidation ? placeholderTextColor : lightRed
                                    }
                                    textInputStyle={{

                                        fontFamily:'IRANYekanExtraBold',

                                        fontSize: 14,
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
                                <Text style={{fontSize:12,color:primaryDark,textAlign:'justify'}} > در بخش آواتار می توانید یک جمله کوتاه در مورد تخصص، کسب و کار یا هدفتان برای دیگران بنویسید</Text>
                                <Text style={{fontSize:12}} >چند مثال </Text>
                                <Text style={{fontSize:12}} >تبلیغ کالای شما در شبکه ۱۰۰ هزار نفری من </Text>
                                <Text style={{fontSize:12}} >متخصص تعمیرات لوازم برقی</Text>
                                <Text style={{fontSize:12}} >تبلیغ بین المللی در کشورهای اروپایی در یورونت</Text>
                                <Text style={{fontSize:12}} > فروش بیمه عمر با شرایط خاص </Text>
                                <Text style={{fontSize:12}} >بوتیک فرهاد، عرضه برترین پوشاک مردانه</Text>
                                <Text style={{fontSize:12}} >هتل پنج ستاره حاتم</Text>
                                <Text style={{fontSize:12}} >مشاوره روانشناس خانواده</Text>
                                <Text style={{fontSize:12}} >فروشگاه اینترنتی کارنیکا</Text>

                            </View>

                        </View>
                    </View>
                </View>
            </PanelLayout>
        )
    }

}



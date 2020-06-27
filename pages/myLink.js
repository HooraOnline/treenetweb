import React, {Component} from 'react';
import PanelLayout from "../src/components/layouts/PanelLayout";
import {Toolbar} from "../src/components";
import {navigation, showMassage} from "../src/utils";
import images from "../public/static/assets/images";
import {bgWhite, itemListText, primaryDark} from "../src/constants/colors";
import NavBar from "../src/components/layouts/NavBar";
import {Image, Text, TouchableOpacity, View,} from "../src/react-native";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCogs, faCompass, faUser} from "@fortawesome/free-solid-svg-icons";
import translate from "../src/language/translate";
import copy from "copy-to-clipboard";
import {persistStore, userStore} from "../src/stores";
import {getServerFilePath, getUserProfileApi, postQuery} from "../dataService/apiService";
import ShareLink from "../src/sections/ShareLink";

const HOME_TYPE = 1;
export default class MyLink extends Component {
    constructor() {
        super();
        //globalState.changeStatusBarColor(primaryDark);
        //StatusBar.setTranslucent(false);

        this.state = {
            selected: HOME_TYPE,
            showAccountSelect: false,
            loadingBalance: false,
            showPasswordChangePopUp: false,
            anchorEl: null,
            showMenu: false,
            isWide: false,
            forms: []
        };
    }


    async componentDidMount  () {

        this.getProfile();


    }
    getProfile(){
        this.setState({loading:true});
        getUserProfileApi()
            .then(user=>{
                this.setState({loading:false});
            })
            .catch(err => {
                this.setState({loading: false});
            });
    }

    copyLink = () => {
        copy(userStore.invitationLink);
        showMassage(translate('finishRegister_its_copy'), 'success');
    };


    render() {
        const toolbarStyle = {
            start22: {
                content: images.ic_back,
            },
            title: 'لینک من',

        };

        return (
            <PanelLayout title={`Panel`}  loading={this.state.loading} loadingMessage={this.state.loadingMessage} showMenu={this.state.showMenu}
                         onRef={(initDrawer) => this.initDrawer = initDrawer}
                         onCloseMenu={() => this.setState({showMenu: false})}
                         style={{margin: 0}}
                         header={
                             <Toolbar
                                 customStyle={toolbarStyle}
                                 isExpand={this.state.showAccountSelect}
                             />
                         }
                         footer={
                             <View style={{paddingHorizontal: 20}}>
                                 <NavBar navButtons={[
                                     {
                                         label: translate('پروفایل'),
                                         path: "/profile",
                                         icon: <FontAwesomeIcon icon={faUser}/>
                                     },
                                     {
                                         label: translate('شبکه من'),
                                         path: "/myNetwork",
                                         icon: <FontAwesomeIcon icon={faCogs}/>
                                     },
                                     {
                                         label: translate('لینک دعوت'),
                                         path: "/myLink",
                                         icon: <FontAwesomeIcon icon={faCompass}/>
                                     },
                                 ]}/>
                             </View>
                         }>
                <View style={{flex:1,paddingBottom:40}}>
                    {persistStore.notChangePassword?(
                        <View style={{padding: 24, marginTop: 10,alignItems:'center'}}>
                            <Text
                                style={{
                                    marginTop: 0,
                                    maxWidth:400,
                                    fontSize: 14,
                                    fontFamily: 'IRANYekanFaNum',
                                    textAlign:'justify'
                                }}>
                                {translate(' برای دریافت لینک اختصاصی خود و شروع شبکه سازی، ابتدا نام کاربری و رمز عبور موقت خود را تغییر دهید.')}
                            </Text>
                            <TouchableOpacity
                            onPress={()=>{
                                navigation.navigate('change_username_password')
                            }}
                            >
                                <View style={{
                                    flexDirection:'row',height:40,marginTop:30,maxWidth:300,
                                    alignSelf:'center',
                                    backgroundColor:'#27AE60',borderRadius:8,alignItems:'cener',
                                    justifyContent:'center', padding:5,paddingHorizontal:15}}>
                                    <Image source={images.ic_edit} style={{
                                        width: 24,
                                        height: 24,
                                        paddingHorizontal:5,
                                        tintColor:bgWhite
                                    }}/>
                                    <Text style={{color:bgWhite, fontSize:14,paddingHorizontal:5,padding:5}} >تغییر رمز موقت</Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                    ):(
                        <View style={{padding: 16,}}>

                            <Text
                                style={{
                                    marginTop: 0,
                                    fontSize: 14,
                                    fontWeight: 400,
                                    fontFamily: 'IRANYekanFaNum-Bold',
                                    marginHorizontal:10
                                }}>
                                {translate(' خیلی راحت از همینجا لینکتو به اشتراک بذار، شاخ و برگ بگیر و شبکه عظیم خودتو بساز')}
                            </Text>
                            <ShareLink style={{marginVertical:20}}/>
                            <Text style={{
                                textAlign: 'justify',
                                paddingHorizontal: 30,
                                fontSize: 14,
                                color: itemListText
                            }}>{translate('با اشتراک گذاری لینک خودت در شبکه های اجتماعی یا کپی و ارسال اون برای دوستان و آشنایان، می تونی خیلی سریع شبکه خودتو رشد بدی. فقط کافیه مخاطب، روی لینک ارسالی شما بزنه و وارد سایت تری نتگرام بشه. به محض ورود، بصورت اتوماتیک ثبت نام و جز شبکه شما میشه. و تابلو اعلانات شما رو خواهد دید.')}</Text>
                            <Text style={{
                                textAlign: 'justify',
                                paddingHorizontal: 30,
                                fontSize: 14,
                                color: itemListText
                            }}>{translate('هر فردی هم که دوست شما لینک خودشو براش بفرسته، اون فرد هم جز شبکه شما میشه و الی آخر، و به همین علت اعضای صفحه شما به سرعت رشد می کنه.')}</Text>
                            <Text style={{
                                textAlign: 'justify',
                                paddingHorizontal: 30,
                                fontSize: 14,
                                color: itemListText
                            }}>{translate('حتی می تونی لینک خودتو به دوستان و آشنایان خارجی خودت بفرستی یا در شبکه های اجتماعی و فرومهایی که افراد خارجی هستند ارسال کنی. به همین سادگی شاخه های بین المللی شبکه خودتو کم کم ایجاد می کنی. و حتما میدونی که شبکه بین المللی یعنی درآمد بین المللی. مثلا درآمد از سرویس تبلیغات اتوماتیک تری نتگرام')}</Text>
                            <Text style={{
                                textAlign: 'justify',
                                paddingHorizontal: 30,
                                fontSize: 14,
                                color: itemListText
                            }}>{translate('برای معرفی بهتر می تونی لینک خودت رو به همراه یه پیام برای دوستات ارسال کنی تا تاثیر بهتری داشته باشه.')}</Text>
                            <Text style={{
                                textAlign: 'justify',
                                paddingHorizontal: 30,
                                fontSize: 14,
                                color: itemListText
                            }}>{translate('شبکه خودتو توسعه بده و منتظر  اپلیکیشن ترینتگرام باش. این اپلیکیشن با امکاناتی که داره، بصورت اتوماتیک به تو قدرت تبلیغاتی، رسانه ای و ثروت آفرینی میده. پس از همین الان شروع کن و شبکه خودتو سریعتر از دیگران توسعه بده.')}</Text>

                        </View>
                    )}
                </View>
            </PanelLayout>
            //</PanelLayout>

        )
    }

}





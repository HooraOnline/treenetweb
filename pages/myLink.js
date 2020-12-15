import React, {Component} from 'react';
import PanelLayout from "../src/components/layouts/PanelLayout";
import {Toolbar} from "../src/components";
import {navigation, showMassage} from "../src/utils";
import images from "../public/static/assets/images";
import {bgWhite, itemListText, primaryDark, textItemBlack} from "../src/constants/colors";
import NavBar from "../src/components/layouts/NavBar";
import {Image, Text, TouchableOpacity, View,} from "../src/react-native";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCogs, faCompass, faUser} from "@fortawesome/free-solid-svg-icons";
import translate from "../src/language/translate";
import copy from "copy-to-clipboard";
import {persistStore,} from "../src/stores";
import ShareLink from "./sections/ShareLink";


export default class MyLink extends Component {
    constructor() {
        super();
        //globalState.changeStatusBarColor(primaryDark);
        //StatusBar.setTranslucent(false);

        this.state = {
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

    }


    render() {
        const toolbarStyle = {
            start: {
                content: images.ic_back,
                onPress: ()=>navigation.goBack(),
            },
            title: 'لینک شبکه سازی',
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
                         }>
                <View style={{flex:1,paddingBottom:40}}>
                {!persistStore.changedDefaultUserKey &&(
                            <div  style={{width:global.width,zIndex:40,marginBottom:16}}>
                                <TouchableOpacity
                                    onPress={()=>{navigation.navigate('change_userkey')}}
                                    style={{flex:1,paddingBottom:20, flexDirection:'row',justifyContent:'space-between', padding:6,paddingHorizontal:24, backgroundColor:'#F1C40F'}}>
                                    <Text style={{fontSize:12,color:textItemBlack,padding:5}}>{'قبل از ارسال لینک دعوت، نام کاربری موقت را تغییر دهید.'} </Text>
                                    <View style={{flexDirection:'row', backgroundColor:'#27AE60',borderRadius:8,alignItems:'cener',justifyContent:'center', padding:5,paddingHorizontal:16}}>
                                        <Image source={images.ic_edit} style={{
                                            width: 22,
                                            height: 22,
                                            paddingHorizontal:3,
                                            tintColor:bgWhite
                                        }}/>
                                        <Text style={{color:bgWhite,fontSize:12,paddingHorizontal:5}} >تغییر</Text>
                                    </View>
                                </TouchableOpacity>
                            </div>
                        )
                    } 
                        <View style={{padding: 16,}}>
                            <Text
                                style={{
                                    marginTop: 10,
                                    fontSize:12,
                                    fontWeight: 400,
                                    fontFamily: 'IRANYekanFaNum-Bold',
                                    marginHorizontal:10
                                }}>
                                {translate(' خیلی راحت از همینجا لینکتو به اشتراک بذار، شاخه و زیرشاخ و برگ بگیر و شبکه عظیم تبلیغاتی و بیزینسی خودتو بساز.')}
                            </Text>
                            <ShareLink style={{marginVertical:20}}/>
                            <Text style={{
                                textAlign: 'justify',
                                paddingHorizontal: 30,
                                fontSize:12,
                                color: itemListText
                            }}>{translate('با اشتراک گذاری لینک خودت در شبکه های اجتماعی یا کپی و ارسال اون برای دوستان و آشنایان، می تونی خیلی سریع شبکه خودتو رشد بدی. فقط کافیه مخاطب، روی لینک ارسالی شما بزنه و وارد سایت تری نتگرام بشه. به محض ورود شماره موبایل، جز شاخه های شبکه شما میشه. و تمام پستهای ویژه شما رو در فالوبورد خودش خواهد دید.')}</Text>
                            <Text style={{
                                textAlign: 'justify',
                                paddingHorizontal: 30,
                                fontSize:12,
                                color: itemListText
                            }}>{translate('هر فردی هم که دوست شما لینک خودشو براش بفرسته، اون فرد هم جز شبکه شما میشه و الی آخر، و به همین علت اعضای صفحه شما به سرعت و بصورت هرمی رشد می کنه.')}</Text>
                            <Text style={{
                                textAlign: 'justify',
                                paddingHorizontal: 30,
                                fontSize:12,
                                color: itemListText
                            }}>{translate('حتی می تونی لینک خودتو به دوستان و آشنایان خارجی خودت بفرستی یا در شبکه های اجتماعی و فرومهایی که افراد خارجی هستند ارسال کنی. به همین سادگی شاخه های بین المللی شبکه خودتو کم کم ایجاد می کنی. و حتما میدونی که شبکه بین المللی یعنی درآمد بین المللی در آینده نزدیک. مثلا درآمد از سرویس تبلیغات تری نتگرام و سایر سرویسهای درآمدزایی که به تدریج به ترینتگرام اضابه خواهند شد.')}</Text>
                                                      
                        </View>
                    {/* )} */}
                </View>
            </PanelLayout>
            //</PanelLayout>

        )
    }

}





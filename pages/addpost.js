import React, {Component} from 'react';
import PanelLayout from "../src/components/layouts/PanelLayout";
import {AlertMessage, Toolbar} from "../src/components";
import {navigation, showMassage} from "../src/utils";
import images from "../public/static/assets/images";
import {
    bg10,
    bg8,
    bgSuccess,
    bgWhite,
    border,
    gray,
    greenDark,
    itemListText,
    lightRed,
    niceBlue,
    primaryDark,
    subTextItem,
    success,
    textDisabled,
    textItem
} from "../src/constants/colors";
import {IconApp, Image, Text, TouchableOpacity, View,} from "../src/react-native";

import {globalState, persistStore,} from "../src/stores";

import TextInput from "../src/react-native/TextInput";
import {postQuery} from "../dataService/apiService";

import pStore from "../src/stores/PublicStore";
import { observer } from 'mobx-react';
import { IoIosRadioButtonOff, IoIosRadioButtonOn } from "react-icons/io";

@observer
export default class addpost extends Component {
    constructor() {
        super();
        //globalState.changeStatusBarColor(primaryDark);
        //StatusBar.setTranslucent(false);

        this.state = {
            isSpecial:false,
            showAccountSelect: false,
            loadingBalance: false,
            showPasswordChangePopUp: false,
            anchorEl: null,
            showMenu: false,
            isWide: false,
            forms: [],
            postType:'normal'
        };
    }


    componentDidMount  () {
       // const base64=navigation.getParam('filebase64');
        this.setState({base64:pStore.param2})


    }
    uploadFile(){
        if(!pStore.param1){
            showMassage('تصویر موجود نیست!','warning');
            return
        }

        this.addPost(pStore.param1);
    }

    addPost(fileName){
        let post={
            file:fileName,
            text:this.state.text,
            isSpecial:this.state.isSpecial
        }
        this.setState({loading:true});
        postQuery('posts/me/addPost',post)
            .then(res=>{
                navigation.replace(pStore.cUser.userKey)
                this.setState({loading:false});
            })
            .catch(err=>{
                this.setState({loading:false});
            })

    }

    getTimeMessage(secend){
        let min=secend/60;
        if(min<1)
            return `شما ${Math.floor(secend)} ثانیه پیش یک پست ویژه منتشر کردید. هر 6 ساعت فقط یک پست ویژه قابل انتشار است.` ;
       let h=min/60;
       if(h<1)
          return `شما ${Math.floor(min)} دقیقه پیش یک پست ویژه منتشر کردید. هر 6 ساعت فقط یک پست ویژه قابل انتشار است.` ;
        let dayhlf=h/6;
        if(dayhlf<1)
            return `شما ${Math.floor(h)} ساعت پیش یک پست ویژه منتشر کردید. هر 6 ساعت فقط یک پست ویژه قابل انتشار است.` ;
        return null;
    }

    checkSpecial(isSpecial,type){
        if(isSpecial){
            this.setState({isSpecial:true,postType:type});
            postQuery('posts/me/getLastSpecialedPost',{},)
                .then(post=>{
                    if(!post){
 
                        return;
                    }
                    let msg=this.getTimeMessage(post.time);
                    if(msg){
                        this.setState({isSpecial:false,postType:'normal'});
                        showMassage(msg,'error');
                        return;
                    }
                 
                })
                .catch(err=>{
                   
                })
        }else{
            this.setState({isSpecial:false,postType:'normal'});
        }

    }
    render() {
        const toolbarStyle = {
            start: {
                content: images.ic_back,
                onPress: ()=>navigation.goBack(),
            },
            title: 'پست جدید',
        };

        return (
            <PanelLayout title={`Panel`}  loading={this.state.loading} loadingMessage={this.state.loadingMessage} showMenu={this.state.showMenu}
                         onRef={(initDrawer) => this.initDrawer = initDrawer}
                         onCloseMenu={() => this.setState({showMenu: false})}
                         style={{margin: 0}}
                         header={
                             <View>
                                <Toolbar
                                 customStyle={toolbarStyle}
                                 isExpand={this.state.showAccountSelect}
                               />
                               
                               </View>
                         }
                         footer={
                             <View>
                                 {!persistStore.postHelp && (
                                     <div style={{width: globalState.width, zIndex: 4}}>
                                         <TouchableOpacity
                                             onPress={() => {
                                                persistStore.postHelp=true;
                                             }}
                                             style={{
                                                 flex: 1,
                                                 paddingBottom: 10,
                                                 justifyContent: 'space-between',
                                                 padding: 10,
                                                 backgroundColor: '#F1C40F'
                                             }}>
                                             <Text style={{
                                                 fontSize: 11,
                                                 color: textItem,
                                                 padding: 5
                                             }}>پستهای ویژه برای همه اعضای شبکه (شاخ و زیرشاخه ها و فالورها)و پستهای عادی فقط برای فالورها نمایش داده می شود </Text>
                                             <View style={{
                                                 flexDirection: 'row',
                                                 height: 35,
                                                 backgroundColor:primaryDark,
                                                 borderRadius: 8,
                                                 alignItems: 'cener',
                                                 justifyContent: 'center',
                                                 padding: 5,
                                                 alignSelf:'center',
                                                 width:100,
                                             }}>
                                                 <Image source={images.ic_AllPaid} style={{
                                                     width: 24,
                                                     height: 24,
                                                     paddingHorizontal: 5,
                                                     tintColor: bgWhite
                                                 }}/>
                                                 <Text style={{
                                                     color: bgWhite,
                                                     fontSize: 11,
                                                     paddingHorizontal: 5
                                                 }}>متوجه شدم</Text>
                                             </View>
                                         </TouchableOpacity>
                                     </div>
                                 )
                                 }
                             </View>
                         }
                         
                         >
                <View style={{flex:1,paddingBottom:40}}>
                    <img
                        src={this.state.base64}
                        style={{
                        width: '100%',
                        maxHeight:global.width/2 ,
                    }}/>

                    <View style={{width:'100%', marginTop: 10,paddingHorizontal:24,}}>
                        <TextInput
                            placeholder="متن پست(اختیاری)"
                            bgSuccess={subTextItem}
                            style={{
                                flex: 1,
                                width:'100%',
                                marginTop:20,
                                padding: 10,
                                borderColor:this.state.storyValidation?bgSuccess: lightRed,
                                borderWidth: 0,
                                borderRadius: 10,
                                fontSize: 12,
                                textAlignVertical: 'top',
                                textAlign: 'right',
                                height: 110,
                            }}
                            multiline={true}
                            onChangeText={text => {this.setState({text: text})}}
                            returnKeyType="done"
                            value={this.state.text}
                            numberOfLines={4}
                            maxLength={300}
                        />

                        <View style={{flex:1,alignItems:'flex-start'}}>
                            <TouchableOpacity
                                onPress={()=>this.checkSpecial(this.state.isSpecial,'normal')}
                                style={{padding:6,borderRadius:8,borderWidth:1, borderColor:this.state.postType=='normal'?primaryDark:bgWhite, alignSelf:'right', marginTop:20, flexDirection:'row',justifyContent:'center'}}>
                                <img
                                    src={this.state.postType=='normal'?images.checked_icon:images.unchecked_icon}
                                    style={{height:24,width:24,}}
                                />
                                <Text style={{fontSize:12, paddingStart:5}}>پست عادی</Text>
                                <Text style={{fontSize:10, paddingHorizontal:2,color:border}}> (نمایش فقط برای فالورها)</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={()=>this.checkSpecial(!this.state.isSpecial,'special')}
                                style={{padding:6,borderRadius:8,borderWidth:1, borderColor:this.state.postType=='special'?primaryDark:bgWhite, alignSelf:'right', marginTop:20, flexDirection:'row',justifyContent:'center'}}>
                                <img
                                    src={this.state.postType=='special'?images.checked_icon:images.unchecked_icon}
                                    style={{height:24,width:24,}}
                                />
                                <Text style={{fontSize:12, paddingStart:5}}>پست ویژه</Text>
                                <Text style={{fontSize:10, paddingHorizontal:2,color:border}}> (نمایش برای تمام شاخه ها،زیرشاخه ها و فالورها )</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={()=>this.checkSpecial(!this.state.isSpecial,'adv')}
                                style={{padding:6,borderRadius:8,borderWidth:1, borderColor:this.state.postType=='adv'?primaryDark:bgWhite, alignSelf:'right', marginTop:20, flexDirection:'row',justifyContent:'center'}}>
                                <img
                                    src={this.state.postType=='adv'?images.checked_icon:images.unchecked_icon}
                                    style={{height:24,width:24,}}
                                />
                                <Text style={{fontSize:12, paddingStart:5}}>پست ویژه تبلیغی</Text>
                                <Text style={{fontSize:10, paddingHorizontal:2,color:border}}> (کسب درآمد از ظرفیت پست ویژه)</Text>
                                <TouchableOpacity stopPropagation={true}  onPress={()=>this.setState({showHelp:true})} style={{paddingHorizontal:5}}>
                                        <Text  style={{fontSize:11,color:border,marginStart:1,color:niceBlue}}>راهنما</Text>
                                </TouchableOpacity>
                            </TouchableOpacity>
                            
                            
                         
                             

                            <AlertMessage
                                    visible={this.state.showHelp || this.state.makeMony}
                                    title=""
                                    //message={}
                                     
                                    
                                    onConfirm={() => {
                                       navigation.navigate('myLink')
                                    }}
                                    onDismiss={() => this.setState({ showHelp: false,makeMony:false })}
                                    confirmTitle="افزایش شاخه ها"
                                    dismissTitle="بستن"
                                >
                                    <View style={{margin:16,marginTop:5}}>
                                    <Text style={{fontSize:10,fontWeight:800}}>برای ارسال پست ویژه تبلیغی ابتدا باید تعداد افراد شبکه خود را به بیش از هزار نفر برسانید.(مجموع شاخه، زیرشاخه و فالور)، سپس می توانید از شبکه خود درآمد کسب کنید، کافی است تبلیغات  برندها و کسب و کارها را در بعنوان پست ویژه ارسال کنید. تبلیغات آماده است و شما فقط تبلیغ دلخواه را انتخاب می کنید.</Text>
                                   
                                    <Text style={{fontSize:11,color:primaryDark,marginTop:10}}>* شبکه هزار نفری هر پست ویژه 10 هزار تومان درآمد.</Text>
                                    <Text style={{fontSize:11,color:primaryDark}}>* شبکه ده هزار نفری هر پست ویژه 100 هزار تومان درآمد.</Text>
                                    <Text style={{fontSize:11,color:primaryDark}}>* شبکه صد هزار نفری هر پست ویژه 1 میلیون تومان درآمد.</Text>
                                    <Text style={{fontSize:11,color:primaryDark}}>* شبکه یک میلیون نفری هر پست ویژه 10 میلیون تومان درآمد.</Text>
                                </View>
                                </AlertMessage>
                           
                        </View>
                         <TouchableOpacity
                            onPress={()=>{
                               this.uploadFile();
                            }}
                            style={{}}
                            >
                                <View style={{
                                    marginTop:30,
                                    flexDirection:'row',maxWidth:300,
                                    alignSelf:'center',
                                    backgroundColor:primaryDark,
                                    borderRadius:8,
                                    alignItems:'cener',
                                    justifyContent:'center',
                                    padding:2,paddingHorizontal:15}}>
                                    <Image source={images.ic_add} style={{
                                        width: 24,
                                        height: 24,
                                        paddingHorizontal:5,
                                        paddingTop:7,
                                        tintColor:bgWhite
                                    }}/>
                                    <Text style={{color:bgWhite, fontSize:12,paddingHorizontal:5,padding:5}} >اشتراک گذاری</Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                </View>
            </PanelLayout>
            //</PanelLayout>

        )
    }

}





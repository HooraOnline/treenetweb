import React, {Component} from 'react';
import PanelLayout from "../src/components/layouts/PanelLayout";
import {Toolbar} from "../src/components";
import {navigation, showMassage} from "../src/utils";
import images from "../public/static/assets/images";
import {
    bg10,
    bg8,
    bgSuccess,
    bgWhite,
    gray,
    greenDark,
    itemListText,
    lightRed,
    primaryDark,
    subTextItem,
    textItem
} from "../src/constants/colors";
import {Image, Text, TouchableOpacity, View,} from "../src/react-native";

import {globalState, persistStore,} from "../src/stores";

import TextInput from "../src/react-native/TextInput";
import {postQuery} from "../dataService/apiService";

import pStore from "../src/stores/PublicStore";
import { observer } from 'mobx-react';

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
            forms: []
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
            return `شما ${Math.floor(secend)} ثانیه پیش یک پست ویژه منتشر کردید. هر 6 ساعت فقط یک پست ویژه قابل انتشار در شبکه است.` ;
       let h=min/60;
       if(h<1)
          return `شما ${Math.floor(min)} دقیقه پیش یک پست ویژه منتشر کردید. هر 6 ساعت فقط یک پست ویژه قابل انتشار در شبکه است.` ;
        let dayhlf=h/6;
        if(dayhlf<1)
            return `شما ${Math.floor(h)} ساعت پیش یک پست ویژه منتشر کردید. هر 6 ساعت فقط یک پست ویژه قابل انتشار در شبکه است.` ;
        return null;
    }




    checkSpecial(isSpecial){
        if(isSpecial){
            postQuery('posts/me/getLastSpecialedPost',{},)
                .then(post=>{
                    if(!post){
                        this.setState({isSpecial:true});
                        return;
                    }
                    let msg=this.getTimeMessage(post.time);
                    if(msg){
                        showMassage(msg);
                        return;
                    }
                    this.setState({isSpecial:true});
                })
                .catch(err=>{
                    this.setState({isSpecial:true});
                })
        }else{
            this.setState({isSpecial:false});
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
                                             }}>پستهای ویژه برای همه اعضای شبکه (شاخ و برگها و فالورها)و پستهای عادی فقط برای فالورها نمایش داده می شود </Text>
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
                                fontSize: 13,
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
                                onPress={()=>this.checkSpecial(!this.state.isSpecial)}
                                style={{padding:6,borderRadius:8,borderWidth:1, borderColor:this.state.isSpecial?primaryDark:bgWhite, alignSelf:'right', marginVertical:20, flexDirection:'row',justifyContent:'center'}}>
                                <img
                                    src={ this.state.isSpecial?images.checked_icon:images.unchecked_icon}
                                    style={{height:24,width:24,}}
                                />
                                <Text style={{fontSize:12, paddingHorizontal:5}}>پست ویژه(نمایش در فالوبرد تمام اعضای شبکه من)</Text>
                            </TouchableOpacity>
                        </View>
                         <TouchableOpacity
                            onPress={()=>{
                               this.uploadFile();
                            }}
                            style={{}}
                            >
                                <View style={{
                                    flexDirection:'row',maxWidth:300,
                                    alignSelf:'center',
                                    backgroundColor:greenDark,
                                    borderRadius:8,
                                    alignItems:'cener',
                                    justifyContent:'center',
                                    padding:5,paddingHorizontal:15}}>
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





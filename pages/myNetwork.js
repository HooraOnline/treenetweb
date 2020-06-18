import React, {Component, PureComponent} from 'react';
import {userStore,persistStore } from "../src/stores";
import {permissionId} from '../src/constants/values';
import Router from "next/router";
import PanelLayout from "../src/components/layouts/PanelLayout";
import {DropDownList,Toolbar,CardUnitInfo,PopupBase,ImageSelector} from "../src/components";

import accountsStore from "../src/stores/Accounts";
import {deviceWide, doDelay, logger, showMassage} from "../src/utils";
import images from "../public/static/assets/images";
import PopupState, {bindTrigger, bindPopover} from 'material-ui-popup-state';
import {getUserBalance} from "../src/network/Queries";
import {
    bgItemRed,
    bgScreen,
    bgWhite,
    textItemRed,
    borderSeparate,
    border,
    primary,
    fab,
    gr2, textItem, gr9, gr10, primaryDark, gr3, primaryDarkOld, grL5, gr8, itemListText
} from "../src/constants/colors";
import accounting from "accounting";
import NavFooterButtons from "../src/components/layouts/footerButtons";
import NavBar from "../src/components/layouts/NavBar";
import {View, TouchableOpacity, Text, FlatList, Progress, BgImageChacheProgress, TextInput,} from "../src/react-native";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCogs, faCompass, faMapMarkerAlt, faUser} from "@fortawesome/free-solid-svg-icons";
import translate from "../src/language/translate";
import {getFileUri, getUserProfileApi, getUserSubsetApi} from "../dataService/apiService";
import Image from "../src/react-native/Image";
import DateTime from "../src/react-native/DateTime";
import { IoMdEyeOff,IoMdEye,IoIosBulb } from "react-icons/io";
import copy from "copy-to-clipboard";


 class TreeView extends PureComponent {
     constructor(props) {
         super(props);
         this.state = {
             open:false,
         };
     }
     open(item){
         debugger
         if(item.subsets.length>0)
           this.setState({open:!this.state.open})
         else{
             let name=item.username;
             let message=name+' فعلا زیر مجموعه ای ندارد.';
             showMassage(message,'warning');
         }

     }
     render() {
         let {level}=this.props;
         let  itemColor;
         switch(level) {
             case 1:
                 itemColor='#FBFCFC'
                 break;
             case 2:
                 itemColor='#D7BDE2 '
                 break;
             case 3:
                 itemColor='#D4E6F1'
                 break;
             case 4:
                 itemColor='#D1F2EB '
                 break;
             case 5:
                 itemColor='#FCF3CF'
                 break;
             case 6:
                 itemColor='#F2D7D5'
                 break;
             case 7:
                 itemColor='#FBEEE6'
                 break;
             case 8:
                 itemColor='#D6DBDF'
                 break;
             case 9:
                 itemColor='#D7BDE2'
                 break;
             case 10:
                 itemColor='#D0ECE7'
                 break;

             default:
                 itemColor='#D5DBDB'
         }
        return (
            <FlatList
                style={this.props.style}
                keyExtractor={(item, index) => index.toString()}
                data={this.props.subsetList}
                ListEmptyComponent22={
                    <View style={{ padding:10}}>
                        <Text style={{fontSize:12}}>بدون شاخه.</Text>

                    </View>
                }
                renderItem={({item}) =>{

                    let {subsets,cdate,firstName='',lastName='',biarthDate='',profileImage='',gender=0,username=''}=item;
                    return(
                        <View style={{
                            borderBottomWidth: 1,
                            borderColor: borderSeparate,
                            borderRadius:10,
                            borderWidth:1,
                            backgroundColor:itemColor,
                            marginTop:10,
                        }}>
                            <View
                                //onPress={this.showUser}
                                style={{
                                    borderBottomWidth: 0.5,
                                    borderColor: borderSeparate,
                                    margin:5,
                                    borderRadius:10,
                                    borderWidth:1,
                                    padding:3,
                                }}>
                                <TouchableOpacity
                                    onPress={()=>this.open(item)}
                                    style={{flexDirection:'row',alignItems:'center'}} >
                                    <Image
                                        style={{width:60,height:60,borderRadius:30,}}
                                        resizeMode="cover"
                                        source={getFileUri('member',profileImage)}
                                    />
                                    <View style={{ padding:5,margin:5,}}>
                                        <Text style={{}}>{firstName+' '+lastName}</Text>
                                        <Text style={{fontSize:12}}>{username}</Text>
                                        <View style={{flexDirection:'row',fontSize:12}}>
                                            <Text style={{}}>{'عضویت' }</Text>
                                            <DateTime>{cdate}</DateTime>
                                        </View>
                                    </View>
                                </TouchableOpacity>

                            </View>
                            <View
                                style={{flexDirection:'row', justifyContent:'space-between', padding:10,fontSize:12,color:textItem,}}>
                                <TouchableOpacity style={{flexDirection:'row',}}
                                                  onPress={()=>this.open(item)} >

                                    <Text style={{paddingHorizontal:5,}}>{'زیر شاخه' } {subsets.length} نفر </Text>
                                    {subsets.length ?(
                                        this.state.open?
                                            <IoMdEye color={primaryDark}  size={30} />
                                            :<IoMdEyeOff color={primaryDarkOld}  size={30}/>
                                    ):null
                                    }
                                </TouchableOpacity>



                                <Text style={{}}>{'سطح: '+ level }</Text>

                            </View>
                            {this.state.open &&(
                                <TreeView
                                    style={{marginRight:5,}}
                                    regent={item}
                                    level={level+1}
                                    subsetList={item.subsets}/>
                            )
                            }

                        </View>
                    )
                } }
            />
        );
    }
}
const HOME_TYPE = 1
export default class MyNetwork extends Component {
    constructor() {
        super();
        //globalState.changeStatusBarColor(primaryDark);
        //StatusBar.setTranslucent(false);

        this.state = {
            subsetList:[]
        };
        this.totalSebsetsCount=0;
    }

    componentDidMount  () {
        this.getUserSubset();
    }
    static async getInitialProps (context) {
        console.log('context========',context);
        const { pathname } = context

        return { pathname }
    }
    getUserSubset(){
        this.setState({loading:true});
        getUserSubsetApi()
            .then(subsetList=>{
                console.log(subsetList);
                this.calculateTotalSubsetsCount(subsetList)
                this.setState({subsetList,totalSubsetsCount:this.totalSebsetsCount, loading:false})
            })
            .catch(err=>{
                console.log(err);
                this.setState({loading:false});
            });
    }


    calculateCount=(user)=>{
        this.totalSebsetsCount=this.totalSebsetsCount+user.subsets.length;
        for(let i=0;i<user.subsets.length;++i){
            this.calculateCount(user.subsets[i]);
        }
    }
    calculateTotalSubsetsCount=(subsets)=>{
        for(let p=0;p<subsets.length;++p){
            this.calculateCount(subsets[p]);
        }
    }
    copyLink=()=> {
        copy(userStore.invitationLink);
        showMassage(translate('finishRegister_its_copy'),'success');
    }
    render() {
        const toolbarStyle = {
            start22: {
                content: images.ic_back,
            },
            title: 'شبکه من',

        };
        const open = Boolean(this.state.anchorEl);
        const PopperId = open ? 'simple-popper' : undefined;
        const {children}=this.props;
        return (
            //<PanelLayout title={`Treenetgram`} onRoleSelected={onRoleSelected}>
            <PanelLayout title={`Treenetgram`} showMenu={this.state.showMenu}
                              onRef={(initDrawer)=>this.initDrawer=initDrawer}
                              onCloseMenu={()=>this.setState({showMenu:false})}
                              style={{paddingBottom:10}}
                              header={
                                  <Toolbar
                                      customStyle={toolbarStyle}
                                      isExpand={this.state.showAccountSelect }
                                  />
                              }
                              footer={
                                  <View style={{paddingHorizontal:10}}>
                                      <NavBar navButtons={[
                                          {
                                              label: translate('پروفایل'),
                                              path: "/profile",
                                              icon: <FontAwesomeIcon icon={faUser} />
                                          },
                                          {
                                              label: translate('شبکه من'),
                                              path: "/myNetwork",
                                              icon: <FontAwesomeIcon icon={faCogs} />
                                          },
                                          {
                                              label: translate('لینک دعوت'),
                                              path: "/myLink",
                                              icon: <FontAwesomeIcon icon={faCompass} />
                                          },
                                      ]}/>
                                  </View>
                              }>
                <View style={{marginHorizontal: 10,marginTop:24,paddingBottom:60}}>
                    <View style={{width:'100%',
                        flexDirection:'row',
                        justifyContent:'space-between',
                        alignItems:'space-between',
                        padding:5,
                        paddingHorizontal:16,
                        borderWidth:1,
                        borderRadius:12,
                        backgroundColor:bgItemRed
                    }} >
                        <Text style={{fontSize:12}}> {this.state.subsetList.length } شاخه </Text>
                        <Text  style={{fontSize:12}}> {this.state.totalSubsetsCount } برگ </Text>
                        <Text  style={{fontSize:12}}>{this.state.totalSubsetsCount+this.state.subsetList.length+1 } عضو </Text>
                    </View>
                    <TreeView
                        style={{paddingBottom:60}}
                        subsetList={this.state.subsetList}
                        level={1}
                    />
                    {this.state.subsetList.length==0 &&(
                        <View style={{marginTop:20}}>
                            <Text
                                style={{textAlign:'justify',paddingHorizontal:30,fontSize:14,color:itemListText}}
                            > برای ایجاد شاخه های درخت خود، کافی است لینک اختصاصی خود را برای چند نفر ارسال کنید یا آنرا در شبکه های اجتماعی مانند فیسبوک یا تلگرام به اشتراک بگذارید. </Text>
                            <View style={{padding:24,marginTop:0}}>
                                <Text
                                    style={{
                                        marginTop:10,
                                        fontSize:16,
                                        fontWeight:800,
                                        fontFamily: 'IRANYekanFaNum-Bold',
                                        color:grL5,
                                    }}>
                                    {translate('finishRegister_your_invitation_link')}
                                </Text>
                                <View style={{
                                    flexDirection:'row',
                                    marginTop:10,
                                    borderWidth:1,
                                    borderRadius:8,
                                    borderColor:gr8,
                                    alignItems:'center',
                                }} >
                                    <TouchableOpacity
                                        style={{
                                            borderWidth:1,
                                            borderRadius:0,
                                            borderColor:grL5,
                                            alignItems:'center',
                                            justifyContent:'center',
                                            color:gr10,
                                            width:80,
                                            height:60,
                                            fontSize:16,
                                            marginHorizontal:0,
                                            backgroundColor:gr3,
                                        }}
                                        onPress={this.copyLink}>
                                        <Text style={{padding:5,}}>{translate('finishRegister_copy')}</Text>
                                    </TouchableOpacity>
                                    <TextInput
                                        style={{
                                            fontSize:14,
                                            fontFamily: 'IRANYekanRegular',
                                            color:grL5,
                                            //maxWidth:global.width-50,
                                            textAlign:'left',
                                            paddingHorizontal:5,
                                            width:'100%',
                                            height:60,
                                        }}
                                        readonly
                                        numberOfLines={5}
                                        value={ userStore.invitationLink}
                                    >

                                    </TextInput>
                                </View>

                            </View>
                        </View>
                    )}
                </View>


            </PanelLayout>
            //</PanelLayout>

        )
    }

}



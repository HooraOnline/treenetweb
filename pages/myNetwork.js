import React, {Component, PureComponent} from 'react';
import {globalState, persistStore, pStore,} from "../src/stores";
import PanelLayout from "../src/components/layouts/PanelLayout";
import {Toolbar,} from "../src/components";
import {navigation, showMassage} from "../src/utils";
import images from "../public/static/assets/images";
import {
    bgItemRed,
    bgSuccess,
    bgWhite,
    borderSeparate,
    itemListText, orange1,
    primaryDark,
    primaryDarkOld,
    subTextItem,
    success,
    successLight,
    textItem,
} from "../src/constants/colors";

import NavBar from "../src/components/layouts/NavBar";
import {DateTime,Image,FlatList, Text, TouchableOpacity, View,} from "../src/react-native";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCogs, faCompass, faUser,faUsers,faBell} from "@fortawesome/free-solid-svg-icons";
import translate from "../src/language/translate";
import {getFileUri, getUserSubsetApi} from "../dataService/apiService";

import {IoIosLink, IoMdEye, IoMdEyeOff} from "react-icons/io";
import copy from "copy-to-clipboard";
import {observer} from "mobx-react";
import { RiProfileLine } from "react-icons/ri";
class TreeView extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
    }

    open(item) {
        if (item.subsets.length > 0)
            this.setState({open: !this.state.open});
        else {
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

                    let {subsets,cdate,displayName='',birthDate='',profileImage='',gender=0,userKey='',avatar}=item;
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
                                    onPress={() => location.pathname = item.userKey}
                                    style={{flexDirection:'row',alignItems:'center'}} >
                                    <Image
                                        style={{width:60,height:60,borderRadius:30,}}
                                        resizeMode="cover"
                                        source={getFileUri('member',profileImage)}
                                    />


                                    <View style={{ padding:5,margin:5,}}>
                                        <Text style={{fontSize:12,fontWeight:800}}>{displayName}({userKey}@)</Text>
                                        <Text style={{fontSize:11,color:itemListText}}>{avatar}</Text>
                                       
                                    </View>
                                </TouchableOpacity>
                                <View style={{flexDirection:'row',fontSize:12}}>
                                            <Text style={{color:textItem,fontSize:10}}>{'عضویت' }</Text>
                                            {/* <Text>{cdate.timeToNow()}</Text> */}
                                            <DateTime style={{color:textItem,fontSize:10}}>{cdate}</DateTime>
                                 </View>

{/*                                
                                <TouchableOpacity
                                    onPress={()=>location.pathname=item.userKey }
                                    style={{alignItems:'center',padding:5}} >
                                    <RiProfileLine size={24} style={{}}/>
                                    <Text style={{fontSize:11}}>{'پستها' }</Text>
                                </TouchableOpacity> */}
                            </View>
                            <View
                                style={{flexDirection:'row', justifyContent:'space-between', padding:10,fontSize:12,color:textItem,}}>
                                <TouchableOpacity style={{flexDirection:'row',}}
                                                  onPress={()=>this.open(item)} >

                                    <Text style={{paddingHorizontal:5,}}>{'زیر شاخه' } {subsets.length} نفر </Text>
                                    {subsets.length ?(
                                        this.state.open?
                                            <IoMdEye color={primaryDark}  size={30} />
                                            :<IoMdEyeOff color={primaryDarkOld}  size={30} onPress={()=>this.open(item)}/>
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

@observer
export default class MyNetwork extends Component {
    constructor() {
        super();
        this.state={

        }
    }

   async componentDidMount  () {


    }

    getUserSubset(){
        this.setState({loading:true});
        getUserSubsetApi()
            .then(subsetList=>{
                this.calculateTotalSubsetsCount(subsetList)
                this.setState({subsetList,leavesCount:this.totalSebsetsCount, loading:false})
            })
            .catch(err=>{
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
        copy(pStore.cUser.invitationLink);
        showMassage(translate('finishRegister_its_copy'),'success');
    }
    render() {
        const toolbarStyle = {
            start: {
                content: images.ic_back,
                onPress: ()=>navigation.goBack(),
            },
            title: 'شبکه من',

        };

        return (
              <PanelLayout title={`Treenetgram`}  loading={this.state.loading} loadingMessage={this.state.loadingMessage} showMenu={this.state.showMenu}
                              onRef={(initDrawer)=>this.initDrawer=initDrawer}
                              onCloseMenu={()=>this.setState({showMenu:false})}
                              style={{paddingBottom:10}}
                              //notif={persistStore.notChangePassword?"رمز موقت را تغییر دهید.":""}
                              header={
                                  <View>
                                      <Toolbar
                                          customStyle={toolbarStyle}
                                          isExpand={this.state.showAccountSelect }
                                      />
                                      {/* {persistStore.notChangePassword &&(
                                          <div  style={{position:'fixed',top:50,width:globalState.width,zIndex:40}}>
                                              <TouchableOpacity
                                                  onPress={()=>{navigation.navigate('change_username_password')}}
                                                  style={{flex:1,paddingBottom:40, flexDirection:'row',justifyContent:'space-between', padding:10,backgroundColor:'#F1C40F'}}>
                                                  <Text style={{fontSize:12,color:textItem,padding:5}}>{'رمز موقت را تغییر دهید.'} </Text>
                                                  <View style={{flexDirection:'row',height:40, backgroundColor:'#27AE60',borderRadius:8,alignItems:'cener',justifyContent:'center', padding:5,paddingHorizontal:15}}>
                                                      <Image source={images.ic_edit} style={{
                                                          width: 24,
                                                          height: 24,
                                                          paddingHorizontal:5,
                                                          tintColor:bgWhite
                                                      }}/>
                                                      <Text style={{color:bgWhite,fontSize:12,paddingHorizontal:5}} >تغییر</Text>
                                                  </View>
                                              </TouchableOpacity>
                                          </div>
                                      )
                                      } */}
                                  </View>
                              }
                            footer={
                                <NavBar navButtons={[
                                    {
                                        label: translate('پستها'),
                                        path: "/"+pStore.cUser.userKey,
                                        icon: <FontAwesomeIcon icon={faUser}/>
                                    },
                                    {
                                        label: translate('شبکه من'),
                                        path: "/myNetwork",
                                        icon: <FontAwesomeIcon icon={faUsers}/>
                                    },
                                    {
                                        label: translate('سرویسها'),
                                        path: "/myServices",
                                        icon: <FontAwesomeIcon icon={faCogs}/>
                                    },
                                    {
                                        label: translate('اعلانات'),
                                        path: "/activity",
                                        notif: pStore.newewAnnounceCount,
                                        icon: <FontAwesomeIcon icon={faBell}/>
                                    },
                                    {
                                        label: translate('فالوبورد'),
                                        path:  "/followboard",
                                        icon: <FontAwesomeIcon icon={faCompass}/>
                                    },
                                ]}/>
                            }

                              >
                <View style={{marginHorizontal: 10,marginTop: 10,paddingBottom:60}}>
                    <View style={{width:'100%',
                        flexDirection:'row',
                        justifyContent:'space-between',
                        alignItems:'space-between',
                        padding:5,
                        paddingHorizontal:16,
                        borderWidth:1,
                        borderRadius:12,
                        borderColor:orange1,
                        backgroundColor:bgItemRed
                    }} >
                        <Text style={{fontSize:12}}> {pStore.subsetList.length } شاخه </Text>
                        <Text  style={{fontSize:12}}> {pStore.leavesCount } زیرشاخه </Text>
                        <Text  style={{fontSize:12}}>{pStore.leavesCount+pStore.subsetList.length+1 } عضو </Text>
                    </View>
                    <View style={{marginTop:10,alignItems:'center'}}>
                           {pStore.subsetList.length==0?(
                                <Text
                                    style={{textAlign:'justify',paddingHorizontal:30,fontSize:11,color:itemListText}}
                                > شما هنوز هیچ فردی را به تری نتگرام دعوت نکرده و شاخه ای نساخته اید. برای ایجاد شاخه های درخت خود، کافی است لینک اختصاصی خود را برای چند نفر ارسال کنید یا آنرا در شبکه های اجتماعی مانند فیسبوک یا تلگرام به اشتراک بگذارید. ساختن یک شبکه بزرگ خیلی ساده است . همین الان شروع کنید.. </Text>
                            ):
                                <Text style={{textAlign:'justify',paddingHorizontal:30,fontSize:11,color:itemListText}} > تمام شاخه ها و زیرشاخه های شما پستهای ویژه شما را خواهند دید. </Text>
                            }
                            <TouchableOpacity
                                onPress={()=>{navigation.navigate('myLink')}}
                                style={{
                                    margin:5,
                                    borderRadius:8,
                                    flexDirection:'row',
                                    justifyContent:'center',
                                    padding:5,
                                    paddingHorizontal:10,
                                    backgroundColor: primaryDark,
                                    
                                }}>
                               <Image
                                    style={{width:24,height:24,
                                        tintColor:successLight
                                    }}
                                    source={images.ic_addCircle}
                                />
                                <Text style={{fontSize:12,color:bgWhite,paddingHorizontal:3}}>ایجاد شاخه جدید</Text>
                            </TouchableOpacity>
                        
                        </View>
                    <TreeView
                        style={{paddingBottom:60}}
                        subsetList={pStore.subsetList}
                        level={1}
                    />
                    
                        
                   
                </View>
            </PanelLayout>

        )
    }

}



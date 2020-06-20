import React, {Component} from 'react';
import {userStore,persistStore } from "../src/stores";
import {permissionId} from '../src/constants/values';
import Router from "next/router";
import PanelLayout from "../src/components/layouts/PanelLayout";
import {Toolbar,ImageSelector} from "../src/components";

import accountsStore from "../src/stores/Accounts";
import { navigation} from "../src/utils";
import images from "../public/static/assets/images";
import {
    bgWhite,
    bg5
} from "../src/constants/colors";
import accounting from "accounting";
import NavFooterButtons from "../src/components/layouts/footerButtons";
import NavBar from "../src/components/layouts/NavBar";
import {View ,TouchableOpacity,Text,} from "../src/react-native";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCogs, faCompass, faMapMarkerAlt, faUser} from "@fortawesome/free-solid-svg-icons";
import translate from "../src/language/translate";
import {getUserProfileApi, logoutApi, postQuery} from "../dataService/apiService";
import Api from "../dataService/apiCaller";
import ResponsiveLayout from "../src/components/layouts/ResponsiveLayout";
import {observer} from "mobx-react";
import Image from "../src/react-native/Image";


const HOME_TYPE = 1;
@observer
export default class Profile extends Component {
    constructor() {
        super();
        this.state = {

        };
    }

    hasChangedPassword(accounts) {
        accounts.forEach((account) => {
            if (account.hasChangedPassword) {
                return true;
            }
        });
        return false;
    }

    hidePasswordChangePopUp() {
        this.setState({
            showPasswordChangePopUp: false,
        }, () => {
            if (accountsStore.accounts.length && persistStore.selected === 0) {
                this.selecetRole(true);
            }
        });
    }

   async componentDidMount  () {

        this.getProfile();


    }
     getProfile(){

        getUserProfileApi()
            .then(user=>{
                this.setState({
                    userId:user.id,
                    username:user.username,
                    firstName:user.firstName,
                    lastName:user.lastName,
                    biarthDate:user.biarthDate,
                    profileImage:user.profileImage,
                    gender:user.gender,

                });
            })
            .catch(err=>{
                this.setState({loading:false});
            });
    }

    setProfileImage=(fileName)=>{
        const data={id:this.state.userId,profileImage:fileName}
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
            start22: {
                content: images.ic_back,
            },
            title: 'پروفایل',
            end: {
                onPress: ()=>logoutApi(),
                icon: images.ic_Period,
            },
        };


        let {age='.........',firstName='.........',lastName='.........',biarthDate='.........',profileImage='.........',gender=0,username='.........'}=this.state;
         const dateYear=new Date(biarthDate).getFullYear();
        const genderText=(gender==0)?'.........':(gender==1)?'مرد':'زن';
        return (
            //<PanelLayout title={`Treenetgram`} onRoleSelected={onRoleSelected}>
            <PanelLayout title={`Treenetgram`}  loading={this.state.loading} loadingMessage={this.state.loadingMessage} showMenu={this.state.showMenu}
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
                                  <View style={{paddingHorizontal:20}}>
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
                <View style={{  padding:0,marginTop:userStore.isVerify?0: 50,alignItems:'center'}}>
                        <View style={{width:'100%',  padding:24,marginTop:0,alignItems:'center',maxWidth:300}}>
                            <ImageSelector
                                style={{borderWidth:2,borderColor:bg5,height:100,width:100,borderRadius:50 }}
                                canUpload={true}
                                autoUpload={true}
                                imageStyle={{height:100,width:100,borderRadius:50}}
                                image={profileImage}
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

                            />
                            <TouchableOpacity
                                onPress={()=>{navigation.navigate('edit_profile')}}
                                style={{
                                    flex:1,
                                    marginTop:10,
                                    width:'100%',
                                    maxWidth:300,
                                    borderRadius:8,
                                    flexDirection:'row',
                                    justifyContent:'center',
                                    padding:10,
                                    backgroundColor:bg5
                                }}>
                                <Image source={images.ic_edit} style={{
                                    width: 24,
                                    height: 24,
                                    tintColor:bgWhite
                                }}/>
                                <Text style={{fontSize:14,color:bgWhite,paddingHorizontal:5}}>ویرایش پروفایل</Text>
                            </TouchableOpacity>
                            <View style={{width:'100%',  flexDirection:'row',marginVertical:4,marginTop:16,justifyContent:'space-between'}}>
                                <Text style={{fontWeight:400}} > نام کاربری:</Text>
                                <Text>{this.state.username}</Text>
                            </View>
                            <View style={{width:'100%',  flexDirection:'row',marginVertical:4,justifyContent:'space-between'}}>
                                <Text style={{fontWeight:400}} > نام:</Text>
                                <Text>{firstName}</Text>
                            </View>
                            <View style={{width:'100%',  flexDirection:'row',marginVertical:4,justifyContent:'space-between'}}>
                                <Text style={{fontWeight:400,width:100}} > نام خانوادگی:</Text>
                                <Text>{lastName}</Text>
                            </View>
                            <View style={{width:'100%',  flexDirection:'row',marginVertical:4,justifyContent:'space-between'}}>
                                <Text style={{fontWeight:400,width:100}} > سال تولد:</Text>
                                <Text>{dateYear.length>3?dateYear+' میلادی ':'.........'}  </Text>
                            </View>
                            <View style={{width:'100%',  flexDirection:'row',marginVertical:4,justifyContent:'space-between'}}>
                                <Text style={{fontWeight:400,width:100}} > جنسیت:</Text>
                                <Text>{genderText}  </Text>
                            </View>

                        </View>

                    </View>
            </PanelLayout>
        )
    }

}



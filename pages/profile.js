import React, {Component} from 'react';
import {userStore, persistStore, globalState} from "../src/stores";
import {permissionId} from '../src/constants/values';
import Router from "next/router";
import PanelLayout from "../src/components/layouts/PanelLayout";
import {Toolbar,ImageSelector} from "../src/components";

import accountsStore from "../src/stores/Accounts";
import { navigation} from "../src/utils";
import images from "../public/static/assets/images";
import {
    bgWhite,
    bg5, fab, textItem
} from "../src/constants/colors";
import accounting from "accounting";
import NavFooterButtons from "../src/components/layouts/footerButtons";
import NavBar from "../src/components/layouts/NavBar";
import {View, TouchableOpacity, Text, Progress, BgImageChacheProgress,} from "../src/react-native";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCogs, faCompass, faMapMarkerAlt, faUser} from "@fortawesome/free-solid-svg-icons";
import translate from "../src/language/translate";
import {getFileUri, getUserProfileApi, logoutApi, postQuery} from "../dataService/apiService";
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

       try{
           this.getProfile();
       }catch (e) {

       }



    }
     getProfile(){

        getUserProfileApi()
            .then(user=>{
                /*this.setState({
                    userId:user.id,
                    username:user.username,
                    firstName:user.firstName,
                    lastName:user.lastName,
                    birthDate:user.birthDate,
                    profileImage:user.profileImage,
                    gender:user.gender,

                });*/
            })
            .catch(err=>{
                this.setState({loading:false});
            });
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


        let {age='.........',fullName='.........',birthDate='.........',profileImage='.........',gender=0,username='.........'}=userStore;
        const birthYear=(userStore.birthYear && userStore.birthYear.length>3)?userStore.birthYear+' میلادی ':'.........'
        const genderText=(!userStore.gender)?'.........':(userStore.gender==1)?'مرد':'زن';
        let shortMobile=userStore.shortMobile?'0'+userStore.shortMobile:'.........';
        return (
            //<PanelLayout title={`Treenetgram`} onRoleSelected={onRoleSelected}>
            <PanelLayout  title={`Treenetgram`}  loading={this.state.loading} loadingMessage={this.state.loadingMessage} showMenu={this.state.showMenu}

                              style={{alignItems:'center'}}
                              header={
                                  <View>
                                      <Toolbar
                                          customStyle={toolbarStyle}
                                          isExpand={this.state.showAccountSelect }
                                      />
                                      {persistStore.notChangePassword &&(
                                          <div  style={{width:globalState.width,zIndex:4}}>
                                              <TouchableOpacity
                                                  onPress={()=>{navigation.navigate('change_username_password')}}
                                                  style={{flex:1,paddingBottom:40, flexDirection:'row',justifyContent:'space-between', padding:10,backgroundColor:'#F1C40F'}}>
                                                  <Text style={{fontSize:14,color:textItem,padding:5}}>{'رمز موقت را تغییر دهید.'} </Text>
                                                  <View style={{flexDirection:'row',height:40, backgroundColor:'#27AE60',borderRadius:8,alignItems:'cener',justifyContent:'center', padding:5,paddingHorizontal:15}}>
                                                      <Image source={images.ic_edit} style={{
                                                          width: 24,
                                                          height: 24,
                                                          paddingHorizontal:5,
                                                          tintColor:bgWhite
                                                      }}/>
                                                      <Text style={{color:bgWhite,fontSize:14,paddingHorizontal:5}} >تغییر</Text>
                                                  </View>
                                              </TouchableOpacity>
                                          </div>
                                      )

                                      }
                                  </View>

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
                <View style={{  padding:0,marginTop:persistStore.notChangePassword?30: 0,alignItems:'center'}}>
                        <View style={{width:'100%',  padding:24,marginTop:0,alignItems:'center',maxWidth:300}}>

                            <Image
                                style={{height:100,width:100,borderRadius:50}}
                                resizeMode="cover"
                                source={getFileUri('member',userStore.profileImage)}
                            />

                            <View style={{width:'100%',  flexDirection:'row',marginVertical:4,marginTop:16,justifyContent:'space-between'}}>
                                <Text style={{fontWeight:400}} > نام کاربری:</Text>
                                <Text>{username}</Text>
                            </View>
                            <View style={{width:'100%',  flexDirection:'row',marginVertical:4,justifyContent:'space-between'}}>
                                <Text style={{fontWeight:400}} > نام:</Text>
                                <Text>{fullName || '.........'}</Text>
                            </View>
                            <View style={{width:'100%',  flexDirection:'row',marginVertical:4,justifyContent:'space-between'}}>
                                <Text style={{fontWeight:400}} > موبایل:</Text>
                                <Text>{shortMobile || '.........'}</Text>
                            </View>


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

                        </View>

                    </View>
            </PanelLayout>
        )
    }

}



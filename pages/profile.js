import React, {Component} from 'react';
import {globalState, persistStore, pStore, userStore} from "../src/stores";
import PanelLayout from "../src/components/layouts/PanelLayout";
import {ImageSelector, Toolbar} from "../src/components";

import accountsStore from "../src/stores/Accounts";
import {navigation} from "../src/utils";
import images from "../public/static/assets/images";
import {bgWhite, orange1, textItem} from "../src/constants/colors";
import NavBar from "../src/components/layouts/NavBar";
import {Text, TouchableOpacity, View,} from "../src/react-native";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCogs, faCompass, faUser,faComments,faBell} from "@fortawesome/free-solid-svg-icons";
import translate from "../src/language/translate";
import { logoutApi, postQuery} from "../dataService/apiService";
import {observer} from "mobx-react";
import Image from "../src/react-native/Image";



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


    }


    setProfileImage = (fileName) => {
        const data = {profileImage: fileName};
        postQuery('Members/me/setProfileImage', data)
            .then(res => {
                userStore.profileImage = res.profileImage;
                this.setState({loading: false});
            })
            .catch(err => {
                this.setState({loading: false});
            })
    };

    render() {

        const toolbarStyle = {
            start22: {
                content: images.ic_back,
            },
            title: 'پروفایل',
            end: {
                onPress: () => logoutApi(),
                icon: images.ic_Period,
            },
        };


        let {avatar='عضو فعال تری نتگرام',age='.........',fullName='.........',birthDate='.........',profileImage='.........',gender=0,username='.........'}=userStore;
        const birthYear=(userStore.birthYear && userStore.birthYear.length>3)?userStore.birthYear+' میلادی ':'.........'
        const genderText=(!userStore.gender)?'.........':(userStore.gender==1)?'مرد':'زن';
        let shortMobile=userStore.shortMobile?'0'+userStore.shortMobile:'.........';
        return (
            //<PanelLayout title={`Treenetgram`} onRoleSelected={onRoleSelected}>
            <PanelLayout  title={`Treenetgram`}  loading={this.state.loading} loadingMessage={this.state.loadingMessage} showMenu={this.state.showMenu}
                              onRef={(initDrawer)=>this.initDrawer=initDrawer}
                              onCloseMenu={()=>this.setState({showMenu:false})}
                              style={{alignItems:'center'}}
                              header={
                                  <View>
                                      <Toolbar
                                          customStyle={toolbarStyle}
                                          isExpand={this.state.showAccountSelect }
                                      />
                                      {/* {persistStore.notChangePassword &&(
                                          <div  style={{width:globalState.width,zIndex:4}}>
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
                                  <View style={{paddingHorizontal:20}}>
                                      <NavBar navButtons={[
                                          {
                                              label: translate('من'),
                                              path: "/"+pStore.cUser.userKey,
                                              icon: <FontAwesomeIcon icon={faUser}/>
                                          },
                                        //   {
                                        //     label: translate('گفتگو'),
                                        //     path: "/myChat",
                                        //     icon: <FontAwesomeIcon icon={faComments}/>
                                        //   },
                                          {
                                              label: translate('سرویسها'),
                                              path: "/myServices",
                                              icon: <FontAwesomeIcon icon={faCogs} />
                                          },
                                          {
                                            label: translate('اعلانات'),
                                            path: "/activity",
                                            icon: <FontAwesomeIcon icon={faBell}/>
                                          },
                                          {
                                              label: translate('فالوبورد'),
                                               path: "/followboard",
                                              icon: <FontAwesomeIcon icon={faCompass} />
                                          },
                                      ]}/>
                                  </View>
                              }>
                <View style={{  padding:0,marginTop:0,alignItems:'center'}}>
                    <View style={{width: '100%', padding: 24, marginTop: 0, alignItems: 'center', maxWidth: 300}}>

                        {/* <Image
                                style={{height:100,width:100,borderRadius:50}}
                                resizeMode="cover"
                                source={getFileUri('member',userStore.profileImage)}
                            />*/}
                        <ImageSelector
                            style={{
                                borderWidth: 2,
                                borderColor: orange1,
                                height: 100,
                                width: 100,
                                borderRadius: 50,
                                alignSelf: 'center'
                            }}
                            folderName={'member'}
                            canUpload={true}
                            autoUpload={true}
                            imageStyle={{height: 100, width: 100, borderRadius: 50}}
                            image={userStore.profileImage}
                            noImage={images.default_ProPic}
                            hideDeleteBtn={true}
                            //onrender={(imageSelector)=>imageSelector.setState({image:this.state.userImage})}
                            onUplodedFile={(fileName) => {

                                this.setState({image: fileName});
                                this.setProfileImage(fileName);
                            }}
                            onRemoveImage={(fileName) => {
                                this.setState({image: null});
                            }}
                            onSelectFile={() => {
                                this.setState({profileImageValidation: true})
                            }}
                        />

                        <View style={{
                            width: '100%',
                            flexDirection: 'row',
                            marginVertical: 4,
                            marginTop: 16,
                            justifyContent: 'space-between'
                        }}>
                            <Text style={{fontWeight: 400}}> نام کاربری:</Text>
                            <Text style={{fontSize:12}}>{username}</Text>
                        </View>

                        <View style={{
                            width: '100%',
                            flexDirection: 'row',
                            marginVertical: 4,
                            justifyContent: 'space-between'
                        }}>
                            <Text style={{fontWeight: 400}}> نام:</Text>
                            <Text style={{fontSize:12}}>{fullName || '.........'}</Text>
                        </View>
                            <View style={{width:'100%',  flexDirection:'row',marginVertical:4,justifyContent:'space-between'}}>
                                <Text style={{fontWeight:400}} > موبایل:</Text>
                                <Text style={{fontSize:12}}>{shortMobile || '.........'}</Text>
                            </View>

                        <View style={{
                            width: '100%',
                            flexDirection: 'row',
                            marginVertical: 4,
                            marginTop: 16,
                            justifyContent: 'space-between'
                        }}>
                            <Text style={{fontWeight: 400}}> آواتار:</Text>
                            <Text style={{fontSize:12}} >{avatar}</Text>
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
                                    backgroundColor: orange1
                                }}>
                                <Image source={images.ic_edit} style={{
                                    width: 24,
                                    height: 24,
                                    tintColor:bgWhite
                                }}/>
                                <Text style={{fontSize:12,color:bgWhite,paddingHorizontal:5}}>ویرایش پروفایل</Text>
                            </TouchableOpacity>

                        </View>

                    </View>
            </PanelLayout>
        )
    }

}



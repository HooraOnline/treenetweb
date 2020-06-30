import React, {Component} from 'react';
import {globalState, persistStore} from "../src/stores";
import PanelLayout from "../src/components/layouts/PanelLayout";
import {ImageSelector, Toolbar} from "../src/components";

import accountsStore from "../src/stores/Accounts";
import {navigation} from "../src/utils";
import images from "../public/static/assets/images";
import {bg8, bgSuccess, bgWhite, orange1, success, textItem} from "../src/constants/colors";
import NavBar from "../src/components/layouts/NavBar";
import {Text, TouchableOpacity, View,} from "../src/react-native";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCogs, faCompass, faUser} from "@fortawesome/free-solid-svg-icons";
import translate from "../src/language/translate";
import {logoutApi, postQuery} from "../dataService/apiService";
import {observer} from "mobx-react";
import Image from "../src/react-native/Image";
import pStore from "../src/stores/PublicStore";
import { IoIosLink } from "react-icons/io";


@observer
export default class mypage extends Component {
    constructor() {
        super();
        this.state = {};
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

    async componentDidMount() {


    }


    setProfileImage = (fileName) => {
        const data = {profileImage: fileName};
        postQuery('Members/me/setProfileImage', data)
            .then(res => {
                pStore.cUser.profileImage = res.profileImage;
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
            title: pStore.cUser.username,
            end: {
                onPress: () => logoutApi(),
                icon: images.ic_Period,
            },
        };


        let {story} = pStore.cUser;

        return (
            //<PanelLayout title={`Treenetgram`} onRoleSelected={onRoleSelected}>
            <PanelLayout title={`Treenetgram`} loading={this.state.loading} loadingMessage={this.state.loadingMessage}
                         showMenu={this.state.showMenu}
                         onRef={(initDrawer) => this.initDrawer = initDrawer}
                         onCloseMenu={() => this.setState({showMenu: false})}
                         style={{alignItems: 'center'}}
                         header={
                             <View>
                                 <Toolbar
                                     customStyle={toolbarStyle}
                                     isExpand={this.state.showAccountSelect}
                                 />
                                 {persistStore.notChangePassword && (
                                     <div style={{width: globalState.width, zIndex: 4}}>
                                         <TouchableOpacity
                                             onPress={() => {
                                                 navigation.navigate('change_username_password')
                                             }}
                                             style={{
                                                 flex: 1,
                                                 paddingBottom: 40,
                                                 flexDirection: 'row',
                                                 justifyContent: 'space-between',
                                                 padding: 10,
                                                 backgroundColor: '#F1C40F'
                                             }}>
                                             <Text style={{
                                                 fontSize: 14,
                                                 color: textItem,
                                                 padding: 5
                                             }}>{'رمز موقت را تغییر دهید.'} </Text>
                                             <View style={{
                                                 flexDirection: 'row',
                                                 height: 40,
                                                 backgroundColor: '#27AE60',
                                                 borderRadius: 8,
                                                 alignItems: 'cener',
                                                 justifyContent: 'center',
                                                 padding: 5,
                                                 paddingHorizontal: 15
                                             }}>
                                                 <Image source={images.ic_edit} style={{
                                                     width: 24,
                                                     height: 24,
                                                     paddingHorizontal: 5,
                                                     tintColor: bgWhite
                                                 }}/>
                                                 <Text style={{
                                                     color: bgWhite,
                                                     fontSize: 14,
                                                     paddingHorizontal: 5
                                                 }}>تغییر</Text>
                                             </View>
                                         </TouchableOpacity>
                                     </div>
                                 )

                                 }
                             </View>
                         }
                         footer={
                             <View style={{paddingHorizontal: 20}}>
                                 <NavBar navButtons={[
                                     {
                                         label: translate('پستها'),
                                         path: "/mypage",
                                         icon: <FontAwesomeIcon icon={faUser}/>
                                     },
                                     {
                                         label: translate('شبکه من'),
                                         path: "/myNetwork",
                                         icon: <FontAwesomeIcon icon={faCogs}/>
                                     },
                                     {
                                         label: translate('فالوبورد'),
                                        path: "/followboard",
                                         icon: <FontAwesomeIcon icon={faCompass}/>
                                     },
                                 ]}/>
                             </View>
                         }>
                <View style={{padding: 0, marginTop: persistStore.notChangePassword ? 30 : 0, alignItems: 'center'}}>
                    <View style={{width: '100%', padding: 24, marginTop: 0, maxWidth: 500}}>
                        <UserCard/>
                        <View style={{
                            width: '100%',
                            flexDirection: 'row',
                            marginVertical: 4,
                            marginTop: 8,
                            justifyContent: 'space-between'
                        }}>
                            <Text style={{fontSize: 12, textAlign: 'justify',color:textItem}}>{story}</Text>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <TouchableOpacity
                                onPress={()=>{navigation.navigate('edit_profile')}}
                                style={{
                                    flex:1,
                                    marginTop:10,
                                    margin:10,
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
                            <TouchableOpacity
                                onPress={()=>{navigation.navigate('myLink')}}
                                style={{
                                    flex:1,
                                    marginTop:10,
                                    margin:10,
                                    width:'100%',
                                    maxWidth:300,
                                    borderRadius:8,
                                    flexDirection:'row',
                                    justifyContent:'center',
                                    padding:10,
                                    backgroundColor: bgSuccess
                                }}>
                                <IoIosLink
                                    color={bgWhite}
                                    style={{
                                        width: 24,
                                        height: 24,
                                        tintColor:bgWhite
                                    }}
                                />

                                <Text style={{fontSize:12,color:bgWhite,paddingHorizontal:5}}>شبکه سازی</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                </View>
            </PanelLayout>
        )
    }

}

export const UserCard = observer(props => {
    let leavesCount = 0;
    const setProfileImage = (fileName) => {
        const data = {profileImage: fileName};
        postQuery('Members/me/setProfileImage', data)
            .then(res => {
                pStore.cUser.profileImage = res.profileImage;
            })
            .catch(err => {

            })
    };

    return (
        <View>
            <View style={{
                width: '100%',
                flexDirection: 'row',
                //backgroundColor: bgWhite,
                borderRadius: 10,
            }}>
                <View style={{alignItems: 'center'}}>
                    <ImageSelector
                        style={{
                            borderWidth: 1,
                            borderColor: bg8,
                            height: 100,
                            width: 100,
                            borderRadius: 50,
                            alignSelf: 'center'
                        }}
                        onUplodedFile={(fileName) => {
                            setProfileImage(fileName);
                        }}
                        canUpload={true}
                        autoUpload={true}
                        imageStyle={{height: 100, width: 100, borderRadius: 50}}
                        image={pStore.cUser.profileImage}
                        noImage={images.default_ProPic}
                        hideDeleteBtn={true}
                    />
                </View>
                <View style={{width: 30}}/>
                <View style={{alignItems: 'center'}}>
                    <View style={{flexDirection: 'row', height: 30, maxWidth: 500, justifyContent: 'space-around'}}>
                        <View style={{alignItems: 'center', paddingHorizontal: 15}}>
                            <Text style={{fontSize: 12}}>شاخه</Text>
                            <Text style={{fontSize: 12}}>{pStore.branchesCount}</Text>
                        </View>
                        <View style={{alignItems: 'center', paddingHorizontal: 15}}>
                            <Text style={{fontSize: 12}}>برگ</Text>
                            <Text style={{fontSize: 12}}>{pStore.leavesCount}</Text>
                        </View>
                        <View style={{alignItems: 'center', paddingHorizontal: 15}}>
                            <Text style={{fontSize: 12}}>عضو</Text>
                            <Text style={{fontSize: 12}}>{pStore.branchesCount + pStore.leavesCount + 1}</Text>
                        </View>
                    </View>
                    <Text
                        style={{
                            alignItems: 'center',
                            marginTop: 25,
                            fontSize: 12,
                            fontWeight: 800,
                            fontFamily: 'IRANYekanRegular',


                        }}>
                        {pStore.cUser.avatar || 'عضو فعال  تری نتگرام'}
                    </Text>
                </View>
            </View>
        </View>

    )
});



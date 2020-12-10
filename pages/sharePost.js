import React, { Component, useEffect, useState } from 'react';
import PanelLayout from "../src/components/layouts/PanelLayout";
import { FloatingLabelTextInput, ImageSelector, Toolbar } from "../src/components";
import { doDelay, navigation, showMassage } from "../src/utils";
import images from "../public/static/assets/images";
import {
    bgDarkBrown,
    bgEmpty,
    bgItemRed,
    bgScreen,
    bgWhite,
    border,
    borderGray,
    borderLight,
    gray,
    itemListText,
    primaryDark,
    subTextItem,
    success,
    successLight,
    textDisabled,
    textGray,
    textItem, textItemBlack, yellowmin
} from "../src/constants/colors";
import NavBar from "../src/components/layouts/NavBar";
import { FlatList, IconApp, Image, ScrollView, Text, TouchableOpacity, View, } from "../src/react-native";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCogs, faCompass, faUser } from "@fortawesome/free-solid-svg-icons";
import translate from "../src/language/translate";
import { observer } from "mobx-react";
import { getFileUri, postQuery } from "../dataService/apiService";
import pStore from "../src/stores/PublicStore";
import Api from "../dataService/apiCaller";
import { ListItemText } from '@material-ui/core';


@observer
export default class sharePost extends Component {
    constructor() {
        super();
        //globalState.changeStatusBarColor(primaryDark);
        //StatusBar.setTranslucent(false);
        this.commentInput = React.createRef();
        this.state = {
            showAccountSelect: false,
            loadingBalance: false,
            showPasswordChangePopUp: false,
            anchorEl: null,
            showMenu: false,
            isWide: false,
            members: [],
            recivers:[]
        };
        this.userKey = '';
    }


    async componentDidMount() {
        
        this.postId = navigation.getUrlParams('postId');
            if (this.postId) {
               // this.getTopFollowing();
            }
    }
    addToRecivers=(member)=>{
       const list=this.state.recivers.filter(item=>item.userKey!==member.userKey);
       list.push(member);
       this.setState({recivers:list})
    }
     removeFromRecivers=(member)=>{
       this.setState({recivers:this.state.recivers.filter(item=>item.userKey!==member.userKey)});
     }

    searchMembers(keyWord){
        if(keyWord.length<3){
            return;
        }
        Api.post('members/searchByKeyword', {keyword:keyWord})
            .then(members => {
                this.setState({members:members })
            }).catch((error) => {
                showMassage('خطایی رخ داد، دوباره تلاش کنید.');
            })
            .finally(() => {
                
            });
    }

    sharePost = () => {
        this.setState({ loading: true })
        const share = { postId: this.postId, reciverList: this.state.recivers.map(r=>r.id) };
        Api.post('shares/sharePost', share)
            .then(share => {
                this.setState({ keyword: '', reciverList:[]});
                navigation.goBack();
            }).catch((error) => {
                showMassage('خطایی رخ داد، دوباره تلاش کنید.','error');
            })
            .finally(() => {
                this.setState({ loading: false });
            });
    };

    render() {
        const toolbarStyle = {
            start: {
                content: images.ic_back,
                onPress: () => navigation.goBack(),
            },
            title: 'اشتراک گذاری پست',
        };

        return (
            <PanelLayout title={`ارسال`} loading={this.state.loading} loadingMessage={this.state.loadingMessage}
                onRef={(initDrawer) => this.initDrawer = initDrawer}
                onCloseMenu={() => this.setState({ showMenu: false })}
                style={{ margin: 0 }}
                header={
                    <View>
                        <Toolbar
                            customStyle={toolbarStyle}
                            isExpand={this.state.showAccountSelect}
                        />
                        <View style={{ flex: 1, backgroundColor: gray, padding: 5,paddingVertical:10, justifyContent: 'center' }}>
                          
                            <View style={{ flex: 1, flexDirection: 'row',  borderRadius: 16, alignItems: 'center' }}>
                               
                                <Text style={{width:70, color:bgWhite, fontWeight: 900 }}>ارسال به</Text>
                                <View dir='ltr' horizontal={true} style={{
                                            flexDirection:'row', 
                                            marginTop:5,
                                            overflowX:'auto',
                                            alignItems:'center',
                                        }}>
                                    {
                                        this.state.recivers.map(member=>{
                                            return(
                                                <View dir='ltr'
                                                    style={{
                                                        flexDirection:'row',
                                                        marginHorizontal:5,
                                                        borderRadius:12,
                                                        borderColor:primaryDark,
                                                        borderWidth:1,
                                                        alignItems:'center',
                                                        backgroundColor:bgItemRed
                                                    }}>
                                                    <TouchableOpacity style={{padding:3,}} onPress={()=>this.removeFromRecivers(member)}>
                                                        <IconApp
                                                            class={'apic_close'}
                                                            style={{width:16,height:16,tintColor:primaryDark}}
                                                        />   
                                                    </TouchableOpacity>
                                                    <Text  style={{fontSize:11, color:textItem,padding:3,textAlign:'left',paddingStart:5}}>@{member.userKey}</Text>
                                                    </View>
                                            )
                                        })
                                    }
                                </View>
                                <View style={{flex:1,flexDirection:'row',backgroundColor: bgWhite,borderRadius:8 }}>
                                    <FloatingLabelTextInput
                                        //dir={'ltr'}
                                        //reverse={persistStore.isRtl}
                                        ref={this.commentInput}
                                        style={{ flex: 1,minWidth:100, paddingHorizontal: 5, paddingVertical: 5, paddingTop: 7,}}
                                        placeholder={translate("جستجوی کاربر (نام یا نام کاربری را وارد کنید)")}
                                        value={this.state.keyword}
                                        onChangeText={text => {
                                            this.setState({ keyword:text });
                                            this.searchMembers(text)
                                        }}
                                        numberOfLines={1}
                                        isAccept={this.state.mobileValidation}
                                        textInputStyle={{
                                            fontFamily: 'IRANYekanFaNum-Bold',
                                            fontSize: 12,
                                            color: textItemBlack,
                                            paddingStart: 10,
                                            paddingTop: 0,
                                            paddingBottom: 0,
                                            //textAlign: 'left',
                                        }}
                                        underlineSize={0}
                                        multiline={false}
                                        maxLength={2000}
                                        autoFocus={true}
                                        //onKeyDown={(e) => this.keyPress(e)}
                                        returnKeyType="done"

                                    />
                                    
                                    <TouchableOpacity
                                        disabled={this.state.recivers.length==0}
                                        style={{ alignItems: 'center', justifyContent: 'center', padding: 3, margin: 0, borderRadius: 2 }}
                                        onPress={this.sharePost}
                                    >
                                        <Text style={{width:40, color: this.state.recivers.length ? primaryDark : textDisabled, fontWeight: 900 }}>ارسال</Text>
                                    </TouchableOpacity>
                                </View>
                              
                            </View>
                            
                        </View>
                    </View>

                }
               >
                <View style={{ flex: 1, paddingBottom: 16, paddingTop:60 }}>
                      <MemberList  members={this.state.members} addToRecivers={this.addToRecivers} recivers={this.state.recivers}/>
                </View>
            </PanelLayout>


        )
    }

}

export const MemberList = observer(props => {
    const [loading, setloading] = useState(false);
    const [flag, setFlag] = useState();
    useEffect(() => {

    }, []);
    return (
        <FlatList
            loading={loading}
            style={{justifyContent: 'center', }}
            keyExtractor={(item, index) => index.toString()}
            data={props.members}
            ListEmptyComponent={
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor:  bgEmpty
                    }}>
                </View>
            }
            ListHeaderComponent={
                <View style={{ flex: 1 }}>
                   
                </View>
            }
            renderItem={({ item, index }) => {
                return (
                    <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:16,marginTop:16}}>
                         
                        <TouchableOpacity
                            onPress={() => {
                                props.addToRecivers(item);
                               
                            }}
                            style={{}}>
                            <View style={{ flex:1,flexDirection:'row', justifyContent: 'center', }}>
                                <Image
                                    source={getFileUri('member', item.profileImage)}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 25,
                                    }}
                                />
                                <View>
                                  <Text style={{marginHorizontal:5, fontSize: 13, fontWeight: 800,color:textItem }}>{item.userKey}@</Text>
                                  <Text style={{marginHorizontal:5, fontSize: 11, color:subTextItem }}>{item.displayName || item.fullName}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => props.addToRecivers(item)}
                                style={{ 
                                    width:30,
                                    justifyContent:'center',
                                    paddingTop:5,
                                }}>
                               <IconApp
                                    class={props.recivers.find(r=>r.id==item.id)?'apic_done_circle':'apic_addcircle'}
                                    style={{
                                        width: 24,
                                        height: 24,
                                        tintColor:success,
                                    }}
                                />
                        </TouchableOpacity>
                    </View>
                )
            }}
        />
    )
});





import React, {Component} from 'react';
import ResponsiveLayout from "../src/components/layouts/ResponsiveLayout";
import translate from "../src/language/translate";
import {LNGList} from "../src/language/aaLngUtil";
import {fetchStore, navigation,} from "../src/utils";
import images from "../public/static/assets/images";
import {bg10, bgHeader, bgWhite, borderSeparate, bgSuccess, orange1, primaryDark} from "../src/constants/colors";
import {Image, Text, TouchableOpacity, View,} from "../src/react-native";
import {ListDialogPopUp} from "../src/components";
import {getServerFilePath, getUserSubsetApi} from "../dataService/apiService";
import {persistStore, userStore} from "../src/stores";
import {observer} from "mobx-react";

@observer
export default class newInvite extends Component {
    constructor() {
        super();
        this.state = {
            loading: false,
        };


    }

    async componentDidMount() {
        if (!persistStore.apiToken) {
            await fetchStore();
        }
        this.user = navigation.getParam('user');
        if (this.user) {
            this.setState({user: this.user, regent: this.user.regent});
        } else {
            navigation.replace('home');
        }
    }

    goToPanel() {
        navigation.navigate('registered_new', {user: this.user});
    }

    loginPanel() {
        if (persistStore.apiToken)
            navigation.navigate('/mypage');
        else
            navigation.navigate('/login');
    }

    async onSelectLanguege(lng) {
        persistStore.userLanguageKey = lng.key;
        persistStore.userLanguageId = lng.index;
        persistStore.isRtl = lng.rtl;
        this.setState({languageIndex: persistStore.userLanguageId});
    }

    render() {
        /*  if(!global.isCheckedToken){
              return  <View style={{flex:1,alignItems:'center',padding:20,fontSize:30,paddingTop:50,color:bg8}} >Welcom to Treenetgram</View>;
          }*/
        return (
            <ResponsiveLayout title={`Treenetgram`} loading={this.state.loading}
                              loadingMessage={this.state.loadingMessage} style={{margin: 0}}>
                <View dir='ltr'
                      style={{flexDirection: 'row', width: '100%', backgroundColor: bgHeader, alignContent: 'center'}}>
                    <Image
                        source={images.logoTop}
                        style={{padding: 5}}
                    />

                </View>
                <View style={{flex: 1, alignItems: 'center', padding: 10, paddingTop: '5%',}}>

                    <Image
                        source={images.tree}
                        style={{maxWidth: '40%', maxHeight: '40%',}}
                    />
                    <Text
                        style={{
                            marginTop: 5,
                            marginBottom: 10,
                            fontSize: 25,
                            fontWeight: 800,
                            fontFamily: 'IRANYekanFaNum-Bold',
                            color: orange1
                        }}>
                        Treenetgram
                    </Text>

                    <View id='form' style={{
                        width: '100%',
                        paddingHorizontal: 5,
                        marginTop: 10,
                        paddingBottom: 20,
                        alignItems: 'center'
                    }}>
                        <ListDialogPopUp
                            style={{
                                minWidth: 150
                            }}
                            selectedItemStyle={{
                                backgroundColor: orange1,
                            }}
                            title={translate('Select_Your_Language')}
                            snake
                            items={LNGList}
                            selectedItem={this.state.languageIndex}
                            height={global.height / 2}
                            validation={true}
                            searchField={"title"}
                            selectedItemCustom={
                                <View
                                    style={{
                                        color: bg10,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginHorizontal: 8,
                                        marginVertical: 8,
                                    }}>
                                    <Text
                                        style={{
                                            fontFamily: 'IRANYekanFaNum-Bold',
                                            fontSize: 14,
                                            paddingTop: 2,
                                        }}>
                                        {this.state.languageIndex !== undefined
                                            ? LNGList[this.state.languageIndex].title
                                            : translate('Select_Your_Language')}
                                    </Text>
                                </View>
                            }
                            onValueChange={item => this.onSelectLanguege(item, item.index)}
                            itemComponent={(item, index) => {
                                return (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            paddingHorizontal: 8,
                                            alignItems: 'center',
                                            borderBottomWidth: 0.5,
                                            borderColor: borderSeparate,
                                        }}>

                                        <Text style={{paddingVertical: 16}}>
                                            {item.title}
                                        </Text>

                                    </View>
                                )
                            }}
                        />


                        <RegentCard regent={this.state.regent}/>


                        <Text
                            style={{
                                alignItems: 'center',
                                marginTop: 25,
                                fontSize: 15,
                                fontWeight: 500,
                                fontFamily: 'IRANYekanRegular',

                                marginBottom: 5
                            }}>
                            {translate("from_local_power_to_global_power")}
                        </Text>
                        <Text
                            style={{
                                alignItems: 'center',
                                marginTop: 2,
                                fontSize: 15
                                ,
                                fontWeight: 800,
                                fontFamily: 'IRANYekanFaNum-Bold',


                            }}>
                            {translate("make_your_global_network")}
                        </Text>
                        <View style={{
                            flex: 1,
                            //flexDirection:'row',
                            paddingHorizontal: 16,
                            alignItems: 'center',
                            paddingBottom: 10,

                        }}>

                            <TouchableOpacity
                                style={{
                                    width: 200,
                                    maxWidth: 300,
                                    marginTop: 25,
                                    borderColor: bgSuccess,
                                    backgroundColor: bgSuccess,
                                    borderWidth: 1,
                                    padding: 0,
                                    paddingTop: 0,
                                    borderRadius: 12,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginHorizontal: 10,

                                }}
                                onPress={() => this.goToPanel()}
                            >
                                <Text style={{
                                    fontSize: 16,
                                    color: bgWhite,
                                    fontWeight: 500,
                                    paddingVertical: 12,
                                    paddingHorizontal: 20,
                                }}>{translate('login_my_tree')}</Text>
                            </TouchableOpacity>


                        </View>
                        <View style={{padding: '4%', marginTop: 0,}}>
                            <Text
                                style={{
                                    alignItems: 'center',
                                    fontSize: 14,
                                    fontFamily: 'IRANYekanRegular',
                                    textAlign: 'justify',
                                    marginBottom: 5
                                }}>
                                {
                                    translate('treenetDesl')
                                }
                            </Text>
                            <Text
                                style={{
                                    alignItems: 'center',
                                    fontSize: 14,
                                    fontFamily: 'IRANYekanRegular',
                                    textAlign: 'justify',
                                    marginBottom: 5
                                }}>
                                {translate('treenetDes2')}

                            </Text>
                            <Text
                                style={{
                                    alignItems: 'center',
                                    fontSize: 14,
                                    fontFamily: 'IRANYekanRegular',
                                    textAlign: 'justify',
                                    marginBottom: 5
                                }}>
                                {translate('treenetDes3')}

                            </Text>
                            <Text
                                style={{
                                    alignItems: 'center',
                                    fontSize: 14,
                                    fontFamily: 'IRANYekanRegular',
                                    textAlign: 'justify',
                                    marginBottom: 5
                                }}>
                                {translate('treenetDes4')}
                            </Text>

                            <Text
                                style={{
                                    alignItems: 'center',
                                    fontSize: 14,
                                    fontFamily: 'IRANYekanRegular',

                                    textAlign: 'justify',

                                }}>
                                {translate('treenetDes5')}

                            </Text>

                            <Text
                                style={{
                                    alignItems: 'center',
                                    marginTop: 0,
                                    fontSize: 14,
                                    fontFamily: 'IRANYekanRegular',
                                    textAlign: 'justify',


                                }}>
                                {translate('treenetDes6')}
                            </Text>
                        </View>
                    </View>

                </View>

            </ResponsiveLayout>
        )
    }

}


const RegentCard=observer(
    (props)=> {
        let {regent} = props;
        if (!regent)
            return null;


        const getUserSubset=()=>{
            getUserSubsetApi(regent.id)
                .then(subsetList=>{
                    calculateTotalSubsetsCount(subsetList);
                    userStore.branchesCount=subsetList.length;
                    userStore.leavesCount=leavesCount
                })
                .catch(err=>{
                    //this.setState({loading:false});
                });
        }
        setTimeout( getUserSubset,30);

        let leavesCount=0;
        const calculateCount=(user)=>{
            leavesCount=leavesCount+user.subsets.length;
            for(let i=0;i<user.subsets.length;++i){
                calculateCount(user.subsets[i]);
            }
        }
        const calculateTotalSubsetsCount=(subsets)=>{
            for(let p=0;p<subsets.length;++p){
                calculateCount(subsets[p]);
            }
        }
        const name = regent.name.trim() || regent.username;
        const inviteProfileImage = getServerFilePath('member') + regent.inviteProfileImage;
        return (
            <View>
                <View style={{flexDirection: 'row'}}>
                    <Text
                        style={{
                            alignItems: 'center',
                            marginTop: 25,
                            fontSize: 14,
                            color: primaryDark,
                            fontWeight: 500,
                            fontFamily: 'IRANYekanRegular',
                            marginBottom: 5,
                            paddingHorizontal: 5,
                        }}>
                        {name}
                    </Text>
                    <Text
                        style={{
                            alignItems: 'center',
                            marginTop: 25,
                            fontSize: 12,
                            fontWeight: 500,
                            fontFamily: 'IRANYekanRegular',
                            marginBottom: 5
                        }}>
                        {' شما را به شبکه بین المللی ترینتگرام دعوت کرد.'}
                    </Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    alignItems:'center',
                    backgroundColor: bgWhite,
                    borderRadius: 12,
                    padding:10,
                }}>
                    <View style={{}}>
                        <Image
                            source={inviteProfileImage}
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: 50,
                            }}
                        />
                        {/* <Text
                        style={{
                            alignItems: 'center',
                            marginTop: 0,
                            fontSize: 12,
                            fontWeight: 800,
                            fontFamily: 'IRANYekanRegular',
                            marginBottom: 5,
                            paddingHorizontal: 5,
                        }}>
                        {name}
                    </Text>*/}
                    </View>
                    <View style={{alignItems:'center'}}>
                        <View style={{flexDirection: 'row', height:30,  maxWidth: 400,}}>
                            <View style={{alignItems: 'center', paddingHorizontal: 10}}>
                                <Text style={{fontSize: 12}}>شاخه</Text>
                                <Text style={{fontSize: 12}}>{userStore.branchesCount}</Text>
                            </View>
                            <View style={{alignItems: 'center', paddingHorizontal: 10}}>
                                <Text style={{fontSize: 12}}>برگ</Text>
                                <Text style={{fontSize: 12}}>{userStore.leavesCount}</Text>
                            </View>
                            <View style={{alignItems: 'center', paddingHorizontal: 10}}>
                                <Text style={{fontSize: 12}}>عضو</Text>
                                <Text style={{fontSize: 12}}>{userStore.branchesCount+userStore.leavesCount+1}</Text>
                            </View>
                        </View>
                        <Text
                            style={{
                                alignItems: 'center',
                                marginTop: 25,
                                fontSize: 12,
                                fontWeight: 800,
                                fontFamily: 'IRANYekanRegular',
                                marginBottom: 5,

                            }}>
                            {regent.avatar ||'فعال در شبکه اجتماعی تری نتگرام'}
                        </Text>
                    </View>


                </View>
            </View>
        )
    }
)



import React, {Component} from 'react';
import ResponsiveLayout from "../src/components/layouts/ResponsiveLayout";

import {doDelay, navigation, showMassage} from "../src/utils";
import images from "../public/static/assets/images";
import {bg10, bg8, bgScreen, bgSuccess, grL5, primary, primaryDark} from "../src/constants/colors";
import {Text, TouchableOpacity, View,} from "../src/react-native";
import {postQuery} from "../dataService/apiService";
import translate from "../src/language/translate";
import copy from "copy-to-clipboard";
import ImageSelector from "../src/components/ImageSelector";

export default class FinishRegister extends Component {
    constructor() {
        super();
        this.state = {
            focus:1,
            invitationLink:'',
            userImage:''
        };
    }
    componentDidMount() {

        doDelay(20)
            .then(()=>{
                this.user= navigation.getParam('user');
                if(this.user){
                    this.setState({userImage:this.user.profileImage, invitationLink:`https://Treenetgram.com/?invitationCode=${this.user.invitationCode}`})
                }
            });
    }
    checkValidation() {
        if(!this.state.fullName ){
            this.setState({firsNameValidation: false});
            return translate('enter_your_fullName');
        }
    }
    copyLink=()=> {
        copy(this.state.invitationLink);
        showMassage(translate('finishRegister_its_copy'),'success');
    }
    setProfileImage=(fileName)=>{
        const data={id:this.user.id,profileImage:fileName}
        postQuery('Members/me/setProfileImage',data)
            .then(res=>{
                this.nextPage(res);
                this.setState({loading:false});
            })
            .catch(err=>{
                this.setState({loading:false});
            })
    }
    render() {
        return (
            <ResponsiveLayout title={`Enter Confirm code`}  style={{margin:0}}>
                <View
                    style={{flex: 1, backgroundColor: bgScreen, alignItems: 'center', padding: 16, paddingTop: '5%',}}>


                    <ImageSelector
                        style={{}}
                        folderName={'member'}
                        canUpload={true}
                        autoUpload={true}
                        imageStyle={{height: 150, width: 150, borderRadius: 75}}
                        image={this.state.userImage}
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

                    <View id='form' >
                        <Text
                            style={{
                                marginTop:20,
                                fontSize:14,
                                fontWeight:800,
                                fontFamily: 'IRANYekanFaNum-Bold',
                                color:primaryDark,
                                alignSelf:'center',
                                padding:5,
                            }}>
                           { translate('finishRegister_welcom_to_treenet')}
                        </Text>
                        <TouchableOpacity
                            onPress={()=>navigation.navigate('login')}
                            style={{
                                alignItems:'center',
                                justifyContent:'center',
                                color:bg10,
                                backgroundColor:primaryDark,
                                padding:8,
                                borderWidth:1,
                                borderRadius:8,
                                borderColor:primary,
                                width:150,
                                alignSelf:'center'

                            }} >
                            <Text>{translate('ورود به پنل')}</Text>
                        </TouchableOpacity>

                        <View  style={{marginTop:5, }}  >

                            <View style={{}} >
                                <Text
                                    style={{
                                        marginTop:10,
                                        fontSize:14,
                                        fontWeight:800,
                                        fontFamily: 'IRANYekanFaNum-Bold',
                                        color:grL5,
                                    }}>
                                    {translate('finishRegister_your_invitation_link')}
                                </Text>
                                <View style={{
                                    flexDirection:'row',
                                    borderWidth:1,
                                    borderRadius:8,
                                    borderColor:bg8,
                                    alignItems:'center',
                                }} >
                                    <TouchableOpacity
                                        style={{
                                            borderWidth: 1,
                                            borderRadius: 0,
                                            borderColor: grL5,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: bg10,
                                            width: 60,
                                            height: 60,
                                            fontSize:14,
                                            marginHorizontal: 0,
                                            backgroundColor: bgSuccess,
                                        }}
                                        onPress={this.copyLink}>
                                        <Text style={{padding:5,}}>{translate('finishRegister_copy')}</Text>
                                    </TouchableOpacity>
                                    <Text
                                        style={{
                                            fontSize:12,
                                            fontFamily: 'IRANYekanRegular',
                                            color:grL5,
                                            //maxWidth:global.width-50,
                                            textAlign:'left',
                                            paddingHorizontal:5,
                                        }}>
                                        {this.state.invitationLink}
                                    </Text>
                                </View>
                                <Text
                                    style={{
                                        marginTop: 20,
                                        fontSize:14,
                                        paddingHorizontal: 5,
                                        fontFamily: 'IRANYekanRegular',
                                        color: bgSuccess,
                                        textAlign: 'justify',
                                    }}>
                                    { translate('finishRegister_decription1')}
                                </Text>
                                <Text
                                    style={{
                                        marginTop: 10,
                                        fontSize:14,
                                        fontWeight: 800,
                                        paddingHorizontal: 5,
                                        fontFamily: 'IRANYekanRegular',
                                        color: bgSuccess,
                                        textAlign: 'justify',
                                    }}>
                                    { translate('finishRegister__decription2')}
                                </Text>
                                <ul
                                    style={{
                                        margin: 5,
                                        fontSize:14,
                                        fontFamily: 'IRANYekanRegular',
                                        color: bgSuccess,
                                        alignSelf: 'center',
                                        textAlign: 'justify',
                                    }}

                                >
                                    <li>{ translate('finishRegister__li1')}</li>
                                    <li>{ translate('finishRegister__li2')}</li>
                                    <li>{ translate('finishRegister__li3')}</li>
                                    <li>{ translate('finishRegister__li4')}</li>
                                    <li>{ translate('finishRegister__li5')}</li>
                                    <li>{ translate('finishRegister__li6')}</li>
                                    <li>{ translate('finishRegister__li7')}</li>
                                    <li>{ translate('....')}</li>
                                    <li>{ translate('....')}</li>
                                </ul>
                                <Text
                                    style={{
                                        marginTop: 10,
                                        fontSize:14,
                                        fontFamily: 'IRANYekanFaNum',
                                        color: bgSuccess,
                                        paddingHorizontal: 5,
                                        textAlign: 'justify',
                                    }}>
                                    { translate('finishRegister__decription3')}
                                </Text>
                                <Text
                                    style={{
                                        marginTop: 0,
                                        fontSize:14,
                                        fontWeight: 400,
                                        fontFamily: 'IRANYekanFaNum',
                                        color: bgSuccess,
                                        paddingHorizontal: 5,
                                        alignSelf: 'center'
                                    }}>
                                    { translate('finishRegister__decription4')}
                                </Text>

                            </View>

                        </View>
                        <Text
                            style={{
                                marginTop:10,
                                fontSize:14,
                                fontWeight:800,
                                fontFamily: 'IRANYekanFaNum-Bold',
                                color:grL5,
                            }}>
                            {translate('finishRegister__your_envation_ink2')}
                        </Text>
                        <View style={{
                            flexDirection:'row',
                            borderWidth:1,
                            borderRadius:8,
                            borderColor:bg8,
                            alignItems:'center',
                        }} >
                            <TouchableOpacity
                                style={{
                                    borderWidth: 1,
                                    borderRadius: 0,
                                    borderColor: grL5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: bg10,
                                    width: 60,
                                    height: 60,
                                    fontSize:14,
                                    marginHorizontal: 0,
                                    backgroundColor: bgSuccess,
                                }}
                                onPress={this.copyLink}>
                                <Text style={{padding:5,}}>{translate('finishRegister_copy')}</Text>
                            </TouchableOpacity>
                            <Text
                                style={{
                                    fontSize:12,
                                    fontFamily: 'IRANYekanRegular',
                                    color:grL5,
                                    //maxWidth:global.width-50,
                                    textAlign:'left',
                                    paddingHorizontal:5,
                                }}>
                                {this.state.invitationLink}
                            </Text>
                        </View>


                       {/* <TouchableOpacity
                            style={{
                                marginTop:30,
                                borderColor: orange1,
                                borderWidth:1,
                                padding:10,
                                paddingTop:10,
                                paddingHorizontal:30,
                                borderRadius:12,
                                alignItems:'center',
                                justifyContent:'center',

                            }}
                            onPress={() =>this.registerUserProps()}
                        >
                            <Text style={{fontSize:20,color:bg1,fontWeight:500}}>{ translate('finishRegister__login_to_panel')}</Text>
                        </TouchableOpacity>*/}
                    </View>




                </View>

            </ResponsiveLayout>


        )
    }

}



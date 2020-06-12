import React, {Component} from 'react';
import ResponsiveLayout from "../src/components/layouts/ResponsiveLayout";

import {
    doDelay,
    navigation,
    showMassage,
    getTabWidth, mapNumbersToEnglish
} from "../src/utils";
import images from "../public/static/assets/images";
import {
    placeholderTextColor,
    lightRed,
    gr10,
    gr3,
    gr8,
    gr9,
    gr5,
    gr1, gr2,
    primaryDark, gr4, grL5, grayVD7
} from "../src/constants/colors";
import {View, TouchableOpacity, Text, Image, Platform,} from "../src/react-native";
import {FloatingLabelTextInput,SwitchTextMulti} from "../src/components";
import {postQuery, saveEntity} from "../dataService/dataService";
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
                console.log('finishRedister_this.user===========',this.user);
                if(this.user){
                    this.setState({userImage:this.user.profileImage, invitationLink:`https://Treenetgram.com/?invitationCode=${this.user.invitationCode}`})
                }
            });
    }
    checkValidation() {
        if(!this.state.firstName ){
            this.setState({firsNameValidation: false});
            return translate('enter_your_firstName');
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
                console.log(err);
                this.setState({loading:false});
            })
    }
    render() {
        return (
            <ResponsiveLayout title={`Enter Confirm code`}  style={{margin:0}}>
                <View style={{flex:1,backgroundColor:gr9,alignItems:'center',padding:16,paddingTop:'5%',}} >


                    <ImageSelector
                        style={{ }}
                        canUpload={true}
                        autoUpload={true}
                        imageStyle={{height:150,width:150,borderRadius:75}}
                        image={this.state.userImage}
                        noImage={images.default_ProPic}
                        hideDeleteBtn={true}
                        onrender={(imageSelector)=>imageSelector.setState({image:this.state.userImage})}
                        onUplodedFile={(fileName)=>{
                            this.setState({image: fileName});
                            this.setProfileImage(fileName);
                        }}
                        onRemoveImage={(fileName)=>{
                            this.setState({image: null});
                        }}

                    >
                    </ImageSelector>
                    <View id='form' >
                        <Text
                            style={{
                                marginTop:20,
                                fontSize:16,
                                fontWeight:800,
                                fontFamily: 'IRANYekanFaNum-Bold',
                                color:gr3,
                                alignSelf:'center',
                                padding:5,
                            }}>
                           { translate('finishRegister_welcom_to_treenet')}
                        </Text>

                        <View  style={{marginTop:5, }}  >

                            <View style={{}} >
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
                                            width:60,
                                            height:60,
                                            fontSize:16,
                                            marginHorizontal:0,
                                            backgroundColor:gr3,
                                        }}
                                        onPress={this.copyLink}>
                                        <Text style={{padding:5,}}>{translate('finishRegister_copy')}</Text>
                                    </TouchableOpacity>
                                    <Text
                                        style={{
                                            fontSize:14,
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
                                        marginTop:20,
                                        fontSize:16,
                                        paddingHorizontal:5,
                                        fontFamily: 'IRANYekanRegular',
                                        color:gr3,
                                        textAlign:'justify',
                                    }}>
                                    { translate('finishRegister_decription1')}
                                </Text>
                                <Text
                                    style={{
                                        marginTop:10,
                                        fontSize:16,
                                        fontWeight:800,
                                        paddingHorizontal:5,
                                        fontFamily: 'IRANYekanRegular',
                                        color:gr3,
                                        textAlign:'justify',
                                    }}>
                                    { translate('finishRegister__decription2')}
                                </Text>
                                <ul
                                    style={{
                                        margin:5,
                                        fontSize:16,
                                        fontFamily: 'IRANYekanRegular',
                                        color:gr3,
                                        alignSelf:'center',
                                        textAlign:'justify',
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
                                        marginTop:10,
                                        fontSize:16,
                                        fontFamily: 'IRANYekanFaNum',
                                        color:gr3,
                                        paddingHorizontal:5,
                                        textAlign:'justify',
                                    }}>
                                    { translate('finishRegister__decription3')}
                                </Text>
                                <Text
                                    style={{
                                        marginTop:0,
                                        fontSize:16,
                                        fontWeight:400,
                                        fontFamily: 'IRANYekanFaNum',
                                        color:gr3,
                                        paddingHorizontal:5,
                                        alignSelf:'center'
                                    }}>
                                    { translate('finishRegister__decription4')}
                                </Text>

                            </View>

                        </View>
                        <Text
                            style={{
                                marginTop:10,
                                fontSize:16,
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
                                    width:60,
                                    height:60,
                                    fontSize:16,
                                    marginHorizontal:0,
                                    backgroundColor:gr3,
                                }}
                                onPress={this.copyLink}>
                                <Text style={{padding:5,}}>{translate('finishRegister_copy')}</Text>
                            </TouchableOpacity>
                            <Text
                                style={{
                                    fontSize:14,
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
                                borderColor: gr5,
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
                            <Text style={{fontSize:20,color:gr1,fontWeight:500}}>{ translate('finishRegister__login_to_panel')}</Text>
                        </TouchableOpacity>*/}
                    </View>




                </View>

            </ResponsiveLayout>


        )
    }

}



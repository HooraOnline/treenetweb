
import {bg4, bg6, bgScreen, bgWhite, primaryDark, textItem} from "../../constants/colors";
import {observer} from 'mobx-react';
import React, {useEffect, useState,useRef} from "react";
import {
    getCookie,
    setDemansion,
    navigation,
    fetchStore, setScreenSize
} from "../../utils";
import "./index.scss";
import ToastCard from "../ToastCard";
import {globalState, userStore} from "../../stores";
import {Image, Text, View} from "../../react-native";
import images from "../../../public/static/assets/images";
import persistStore from "../../stores/PersistStore";
import Router from "next/router";
import {getUserProfileApi} from "../../../dataService/apiService";
import LoadingPopUp from "../LoadingPopUp";
import TouchableOpacity from "../../react-native/TouchableOpacity";
import translate from "../../language/translate";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCogs, faCompass, faUser} from "@fortawesome/free-solid-svg-icons";
import NavBar from "./NavBar";

const  screenMaxWidth=700;
const PanelLayout = observer( props => {
    const [showToast, setShowToast] = useState();
    const [isRtl, setIsRtl] = useState(true);
    const [loading, setLoading] = useState(false);
    const [screenwidth, setScreenwidth] = useState(900);
    const [isWide, setIsWide] = useState(false);
    const ref = useRef(null);

    const init=async()=> {
        if(!userStore.username) {
            await fetchStore();
        }
        checkToken();
        setIsRtl(persistStore.isRtl);

    }

    const checkToken=()=> {
        if(!persistStore.apiToken ) {
            navigation.replace('/home')
        }else{
            persistStore.userRegisterbefor=true;
            getProfile();
        }
    }
    const getProfile=()=>{
        setLoading(true);
        getUserProfileApi()
            .then(res=>{
                console.log(res);
                setLoading(false);
            })
            .catch(err=>{
                setLoading(false);
            });
    }
    const onResizeScreen=()=> {
        setScreenSize();
        document.body.onresize = () => {
            setScreenSize();
            //props.onResizeScreen && props.onResizeScreen(globalState.width,global.height);
        };
    }
    useEffect(() => {
        onResizeScreen();
        init();
        document.title = props.title;


    },  [ref.current]);

    return (
        <div   dir={isRtl || persistStore.isRtl?'rtl':'ltr'}  style={{
            textAlign:persistStore.isRtl?"right":"left",
            display: 'flex',flex:1,
            justifyContent:'center',
            minHeight: '100%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '125% auto',
            backgroundPosition: 'center top',
            backgroundAttachment: 'fixed',
            backgroundImage: `url(${images.publicPg})`}}
        >
            <div  ref={ref}   style={{
                display:'flex',
                flex:1,
                maxWidth:screenMaxWidth,
                backgroundColor:bgScreen,
                flexDirection:'column',
                position:'relative'
            }}>
                <View style={[props.style,{width:'100%',}]}>
                    <div id={"header"} style={{position:'fixed',top:0,width:globalState.width,zIndex:4,marginBottom:50}}>
                        {props.header}
                    </div>
                    {props.notif &&(
                        <div  style={{position:'fixed',top:50,width:globalState.width,zIndex:40}}>
                             <TouchableOpacity
                                 onPress={()=>{navigation.navigate('change_username_password')}}
                                 style={{flex:1,paddingBottom:40, flexDirection:'row',justifyContent:'space-between', padding:10,backgroundColor:'#F1C40F'}}>
                                 <Text style={{fontSize:14,color:textItem,padding:5}}>{props.notif} </Text>
                                 {props.showNotifAction!==false &&(
                                     <View style={{flexDirection:'row',height:40, backgroundColor:'#27AE60',borderRadius:8,alignItems:'cener',justifyContent:'center', padding:5,paddingHorizontal:15}}>
                                         <Image source={images.ic_edit} style={{
                                             width: 24,
                                             height: 24,
                                             paddingHorizontal:5,
                                             tintColor:bgWhite
                                         }}/>
                                         <Text style={{color:bgWhite,fontSize:14,paddingHorizontal:5}} >تغییر</Text>
                                     </View>
                                 )}
                             </TouchableOpacity>
                        </div>
                    )

                    }
                    <View id={'body'} style={{flex:1,width:globalState.width,marginTop:props.header?60:0,marginBottom:props.footer?60:0}}>
                        {props.children}
                    </View>
                    <div style={{position:'fixed',bottom:0,width:globalState.width,zIndex:10,backgroundColor:bgScreen,paddingTop:10, }}>
                        {props.footer}
                    </div>
                    <div >{
                        loading?'loading':''
                    }</div>
                    <ToastCard
                        visible={globalState.toastCard}
                        type={globalState.toastType}
                        title={globalState.toastTitle}
                        message={globalState.responseMessage}
                        onClose={() => globalState.hideToastCard()}
                    />
                    <LoadingPopUp
                        visible={props.loading}
                        message={props.loadingMessage || ''}
                    />
                </View>
            </div>
        </div>
    );
});

export default PanelLayout;

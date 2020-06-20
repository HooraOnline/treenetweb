
import {bgScreen, textItem} from "../../constants/colors";
import {observer} from 'mobx-react';
import React, {useEffect, useState,useRef} from "react";
import {
    getCookie,
    setDemansion,
    navigation,
    fetchStore
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
        manageScreenSize();
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
    const manageScreenSize=()=> {
        setDemansion(screenMaxWidth);
        setScreenwidth(global.width);
        document.body.onresize = () => {
            setDemansion(screenMaxWidth);
            setScreenwidth(global.width);
            props.onResizeScreen && props.onResizeScreen(global.width,global.height);
        };
    }
    useEffect(() => {
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
                    <div id={"header"} style={{position:'fixed',top:0,width:global.width,zIndex:4,marginBottom:50}}>
                        {props.header}
                    </div>
                    {!userStore.isVerify && props.showVerifiyMassege!==false &&(
                        <div  style={{position:'fixed',top:50,width:global.width,zIndex:4,marginBottom:50}}>
                             <TouchableOpacity
                                 onPress={()=>{navigation.navigate('change_username_password')}}
                                 style={{flex:1,paddingBottom:40, flexDirection:'row',justifyContent:'space-between', padding:10,backgroundColor:'yellow'}}>
                                 <Text style={{fontSize:14,color:textItem}}>توجه:جهت امنیت و حفظ مالکیت کامل شبکه خود،  ایکون مداد را لمس کرده و نام کاربری و رمز عبور خود را تغییر دهید. </Text>
                                 <Image source={images.ic_edit} style={{
                                     width: 30,
                                     height: 30,
                                 }}/>
                             </TouchableOpacity>
                        </div>
                    )

                    }
                    <View id={'body'} style={{flex:1,width:global.width,marginTop:props.header?60:0,marginBottom:props.footer?60:0}}>
                        {props.children}
                    </View>
                    <div style={{position:'fixed',bottom:0,width:global.width,zIndex:4,backgroundColor:bgScreen,paddingTop:10 }}>
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

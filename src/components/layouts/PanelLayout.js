
import {bgScreen} from "../../constants/colors";
import {observer} from 'mobx-react';
import React, {useEffect, useState,useRef} from "react";
import { deviceWide, height, showMassage, getCookie, saveCookie} from "../../utils";
import "./index.scss";
import ToastCard from "../ToastCard";
import {globalState, userStore} from "../../stores";
import {View} from "../../react-native";
import images from "../../../public/static/assets/images";
import persistStore from "../../stores/PersistStore";
import Router from "next/router";

const  maxWidth=700;
const PanelLayout = observer( props => {
    const [showToast, setShowToast] = useState();
    const [loadingBalance, setLoadingBalance] = useState(false);
    const [accountSelectorVisible, setAccountSelectorVisible] = useState(false);
    const [screenwidth, setScreenwidth] = useState(900);
    const [isWide, setIsWide] = useState(false);
    let costPermission=null;
    let payAnnouncePermissioin=null;
    const ref = useRef(null);
    const selecetRole=(status)=> {
        setAccountSelectorVisible(status);
        getBalance();
    }
    const init=async()=> {

    }
    const manageResizeScreen=()=> {
        setIsWide(deviceWide());
        setScreenwidth(width);
        const width = ref.current ? ref.current.offsetWidth : maxWidth;
        const height = ref.current ? ref.current.offsetHeight : 800;
        global.width=width;
        global.height=height;
        document.body.onresize = () => {
            if(ref.current){
                setScreenwidth(ref.current.offsetWidth);
                global.width=ref.current.offsetWidth;
                global.height=ref.current.offsetHeight;
                window.ss=ref.current
                props.onResizeScreen && props.onResizeScreen(ref.current.offsetWidth,ref.current.offsetHeight);
            }
        };
    }

    const checkToken=async()=> {
        //await fetchStore();
        persistStore.token=await getCookie('token');
        if(!persistStore.token ){
            Router.push('/index');
        }
    }
    checkToken();
    useEffect(() => {
        init();
        document.title = props.title;
        manageResizeScreen();

    },  [ref.current]);

    return (
        <div  dir={global.isRtl?'rtl':'ltr'}  style={{
            textAlign:global.isRtl?"right":"left",
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
                maxWidth:maxWidth,
                backgroundColor:screenwidth<maxWidth?bgScreen:bgScreen,
                flexDirection:'column',
                margin:isWide?3:0,paddingTop:props.header?63:0,

                position:'relative'
            }}>
                <View style={[props.style,{width:'100%',}]}>
                    <div id={"header"} style={{position:'fixed',top:0,width:global.width,zIndex:4,}}>
                        {props.header}
                    </div>
                    <View id={'body'} style={{flex:1,width:global.width}}>
                        {props.children}
                    </View>
                    <div style={{position:'fixed',bottom:0,width:global.width,zIndex:4,backgroundColor:bgScreen,paddingTop:10 }}>
                        {props.footer}
                    </div>
                    <ToastCard
                        visible={globalState.toastCard}
                        type={globalState.toastType}
                        title={globalState.toastTitle}
                        message={globalState.responseMessage}
                        onClose={() => globalState.hideToastCard()}
                    />
                </View>
            </div>
        </div>
    );
});

export default PanelLayout;

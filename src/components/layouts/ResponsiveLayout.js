
import {bgScreen} from "../../constants/colors";
import {observer} from 'mobx-react';
import React, {useEffect, useState,useRef} from "react";
import {deviceWide, height, setScreenSize, showMassage,} from "../../utils";
import "./index.scss";
import ToastCard from "../ToastCard";
import {globalState, userStore} from "../../stores";
import {View} from "../../react-native";
import images from "../../../public/static/assets/images";
import LoadingPopUp from "../LoadingPopUp";
import persistStore from "../../stores/PersistStore";
const  maxWidth=700;


const ResponsiveLayout = observer( props => {
    const [isWide, setIsWide] = useState(false);
    const ref = useRef(null);
    const onResizeScreen=()=> {
        document.body.onresize = () => {
            setScreenSize()
            //props.onResizeScreen && props.onResizeScreen(globalState.width,global.height);
        };
    }

    useEffect(() => {
        document.title = props.title;
        onResizeScreen();

    },  []);

    return (
        <div  dir={persistStore.isRtl?'rtl':'ltr'}  style={{
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
                maxWidth:maxWidth,
                backgroundColor:bgScreen,
                flexDirection:'column',
                paddingTop:props.header?63:0,

                position:'relative'
            }}>
                <View style={[props.style,{flex:1}]}>
                    <div id={"header"} style={{position:'fixed',top:0,width:globalState.width,zIndex:4,}}>
                        {props.header}
                    </div>
                    <View id={'body'} style={{flex:1,width:globalState.width}}>
                        {props.children}
                    </View>
                    <div style={{position:'fixed',bottom:0,width:globalState.width,zIndex:4,}}>
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
            <LoadingPopUp
                visible={props.loading}
                message={props.loadingMessage || ''}
            />
        </div>
    );
});

export default ResponsiveLayout;

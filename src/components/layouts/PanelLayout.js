
import {bg4, bg6, bgScreen, bgWhite, border, primaryDark, textItem} from "../../constants/colors";
import {observer} from 'mobx-react';
import React, {useEffect, useState,useRef} from "react";
import {
    navigation,
    fetchStore, setScreenSize
} from "../../utils";
import "./index.scss";
import ToastCard from "../ToastCard";
import {globalState, userStore} from "../../stores";
import {Image, Text, View} from "../../react-native";
import images from "../../../public/static/assets/images";
import persistStore from "../../stores/PersistStore";
import {getUserProfileApi} from "../../../dataService/apiService";
import LoadingPopUp from "../LoadingPopUp";
import TouchableOpacity from "../../react-native/TouchableOpacity";
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import BaseLayout from "./BaseLayout";

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


                    <div id={"header"} style={{position22:'fixed',top:0,width:globalState.width,zIndex:4,marginBottom:50}}>
                        {props.header}
                    </div>

                    <View id={'body'} style={{flex:1,width:globalState.width,marginTop:props.header?60:0,marginBottom:props.footer?60:0}}>

                        {props.children}
                    </View>
                    <div style={{position:'fixed',bottom:0,width:globalState.width,zIndex:40,backgroundColor:bgScreen,paddingTop:10, }}>
                        {props.footer}
                    </div>


                    <ToastCard
                        visible={globalState.toastCard}
                        type={globalState.toastType}
                        title={globalState.toastTitle}
                        message={globalState.responseMessage}
                        onClose={() => globalState.hideToastCard()}
                    />
                  {/*  { loading &&(
                        <LinearProgress style={{height:55,}}  />


                    )}*/}
                    <LoadingPopUp
                        visible={props.loading}
                        message={props.loadingMessage || ''}
                    />
                </View>
            </div>
            <style jsx global>{`
                       .MuiLinearProgress-colorSecondary {
                           background-color: #CD1139;
                        }
                        .MuiLinearProgress-barColorSecondary {
                                background-color: #CDDC39;
                            }
                    `}</style>
        </div>
    );
});

export default PanelLayout;


import {bgScreen} from "../../constants/colors";
import Head from "next/head";
import persistStore from "../../stores/PersistStore";
import userStore from "../../stores/User";
import accountsStore from "../../stores/Accounts";
import {observer} from 'mobx-react';
import {permissionId} from "../../constants/values";
import React, {useEffect, useState,useRef} from "react";
import "./Layout.scss";
import "./index.scss";
import Router from "next/router";
import {getUserBalance} from "../../network/Queries";
import {fetchStore, getWidth, deviceWide, height, showMassage, setScreenSize} from "../../utils";
import NavFooterButtons from "./footerButtons";
import DrawerPanel from "./DrawerPanel";
import ToastCard from "../ToastCard";
import {globalState} from "../../stores";
import {TouchableOpacity} from "../../react-native";
import {View} from "../../react-native";
import LoadingPopUp from "../LoadingPopUp";


const BaseLayout = observer( props => {
    const [showToast, setShowToast] = useState();
    const [screenwidth, setScreenwidth] = useState(900);
    const [isWide, setIsWide] = useState(false);
    const ref = useRef(null);

    const onResizeScreen=()=> {
        document.body.onresize = () => {
            setScreenSize()
        };
    }

    useEffect(() => {
        document.title = props.title;
        onResizeScreen();
    },  []);

  return (
    <div dir={persistStore.isRtl || "rtl"}  style={{ display: 'flex',flex:1,  justifyContent:'center',  height: '100%'}}>
        <View  ref={ref} dir={"rtl"} style={[{flex:1,maxWidth:props.maxWidth || 700 ,position:'relative', backgroundColor:globalState.width<700?bgScreen:bgScreen,flexDirection:'column', },props.style]}>
            {props.children}
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
  );
});

export default BaseLayout;

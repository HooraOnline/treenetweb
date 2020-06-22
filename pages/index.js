import React, { Component } from "react";
import Router from "next/router";
import {fetchStore, getUrlParameter, navigation, setScreenSize} from "../src/utils";
import persistStore from "../src/stores/PersistStore";

export default class Index extends Component {


    async componentDidMount() {
        setScreenSize();
        await fetchStore();
        if(persistStore.apiToken){
            navigation.replace('profile');
        }else{
            const invitationCode = getUrlParameter('invitationCode');
            navigation.replace('home',{regentCode:invitationCode})
        }
    }
    render() {

        return <div style={{padding:16}} >loading...</div>;
    }


}

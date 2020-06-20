import React, { Component } from "react";
import Router from "next/router";
import {fetchStore, getUrlParameter, navigation} from "../src/utils";
import persistStore from "../src/stores/PersistStore";

export default class Index extends Component {


    async componentDidMount() {

        await fetchStore();
        if(persistStore.apiToken){
            this.initPanel()
        }else{
            const invitationCode = getUrlParameter('invitationCode');
            navigation.replace('home',{regentCode:invitationCode})
        }


    }
    initPanel=()=> {
        this.applyRTLfromUserLanguage();

    }
    applyRTLfromUserLanguage() {
        this.setState({languageIndex: persistStore.userLanguageId});
    }

    render() {
        return <div />;
    }


}

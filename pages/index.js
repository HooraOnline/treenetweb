import React, {Component} from "react";
import {fetchStore, getUrlParameter, navigation, setScreenSize} from "../src/utils";
import persistStore from "../src/stores/PersistStore";

export default class Index extends Component {


    async componentDidMount() {
        setScreenSize();
        await fetchStore();
        const invitationCode = getUrlParameter('invitationCode');
        if (persistStore.apiToken) {
            navigation.replace('profile');

        }/*else if(persistStore.userRegisterbefor){
            navigation.replace('login');
        }*/
        else if (invitationCode) {
            navigation.replace('autoRegister', {regentCode: invitationCode})
        } else {
            navigation.replace('home',)
        }
    }
    render() {

        return <div style={{padding:16}} >loading...</div>;
    }


}

import React, {Component} from "react";
import {fetchStore, getUrlParameter, navigation, setScreenSize} from "../src/utils";
import persistStore from "../src/stores/PersistStore";
import { pStore } from "../src/stores";
import { getUserProfileApi } from "../dataService/apiService";

export default class Index extends Component {


    async componentDidMount() {
        setScreenSize();
        await fetchStore();
        persistStore.userRegisterbefor=false
        const invitationCode = getUrlParameter('invitationCode');
        if (persistStore.apiToken) {
            getUserProfileApi()
            .then(res=>{
                navigation.replace(pStore.cUser.userKey);
                this.setState({loading:false});
            })
            .catch(err=>{
                this.setState({loading:false});
            });
           

        }
       else if(persistStore.userRegisterbefor){
            navigation.replace('login');
        }
        else if (invitationCode) {
            //navigation.replace('autoRegister', {regentCode: invitationCode});
            navigation.replace('register', {regentCode: invitationCode});
        } else {
            navigation.replace('home',)
        }
    }
    render() {

        return <div style={{padding:16}} >loading...</div>;
    }


}

import React, { Component } from "react";
import Router from "next/router";
import {fetchStore} from "../src/utils";
import persistStore from "../src/stores/PersistStore";

export default class Index extends Component {
    init=async()=> {
        await fetchStore();
        Router.push('/Main');

       /* if (persistStore.token) {
            Router.push('/Main');

        }else{
            Router.push("/login");
        }*/
    }

    componentDidMount() {
        this.init();
    }


    render() {
        return <div />;
    }
}

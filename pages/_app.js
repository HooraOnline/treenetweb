/*!

=========================================================
* NextJS Material Kit v1.0.0 based on Material Kit Free - v2.0.2 (Bootstrap 4.0.0 Final Edition) and Material Kit React v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nextjs-material-kit
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/nextjs-material-kit/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import App from "next/app";
import Head from "next/head";
import Router from "next/router";

//import { appWithTranslation } from '../i18n'
import {fetchStore, getCookie, navigation} from "../src/utils";

//import PageChange from "components_creative/PageChange/PageChange.js";

import "assets/scss/nextjs-material-kit.scss?v=1.0.0";
//import "assets/css/apamanGlobal.css";
import persistStore from "../src/stores/PersistStore";
import { accountsStore, userStore } from "../src/stores";
import { loginQuery } from "../src/network/Queries";
import {getUserProfileApi, postQuery} from "../dataService/apiService";
import Api from "../dataService/apiCaller";

Router.events.on("routeChangeStart", url => {
  console.log(`Loading: ${url}`);
  document.body.classList.add("body-page-transition");
  onnavigate(url);


});
const onnavigate=async (url)=>{
  /*if(url.search('adminPanel')>-1){

  }*/

  /*if (url == '/home') {
    ReactDOM.render(
        null
        /!*<PageChange path={url} />, document.getElementById("page-transition")*!/
    );
  }*/
}

Router.events.on("routeChangeComplete", () => {
  ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
  document.body.classList.remove("body-page-transition");
});
Router.events.on("routeChangeError", () => {
  ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
  document.body.classList.remove("body-page-transition");
});

class MyApp extends App {

  constructor() {
    super();

  }

  async componentDidMount() {
    this.checkToken();
    let comment = document.createComment(``);
    document.insertBefore(comment, document.documentElement);

  }
  checkToken=async ()=>{
    //await fetchStore();
    persistStore.token=await getCookie('token');
    await Api.setHeaders(persistStore.token);
    if(persistStore.token ){
      this.initPanelData();
    }
  }

  initPanelData=async ()=> {

    if(!global.slanguage){
      let lng = await getCookie('lng');
      if (lng) {
        global.slanguage = lng.key;
        global.isRtl = lng.rtl;
      }
    };
    this.getProfile();
  };

  async getProfile(){
    if(userStore.username){
      return;
    }
    this.setState({loading:true});
     getUserProfileApi()
        .then(res=>{
          console.log(res);
          this.setState({loading:false});
        })
        .catch(err=>{
          this.setState({loading:false});
        });
  }

  /*  async getInitialProps({ Component, router, ctx }) {
      let pageProps = {};
      console.warn("@@@@@@@@@@ App nextJs INIT");
      if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
      }

      return { pageProps };
    }*/



  render() {
    const { Component, pageProps } = this.props
    return <Component {...pageProps} {...this.state} />
  }
}
export default MyApp
//export default appWithTranslation(MyApp)

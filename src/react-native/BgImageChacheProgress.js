
import ImageBackground from "./ImageBackground";

import React, {PureComponent} from "react";

import {getImageBase64Query} from "../network/Queries";
import {View} from "./index";
import styled from "styled-components";

let Spiner = styled.div`
 border-radius: 50%;
  width: 5em;
  height: 5em;
  margin: 60px auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: 0.3em solid rgba(200,200,200, 0.2);
  border-right: 0.3em solid rgba(200,200,200, 0.2);
  border-bottom: 0.3em solid rgba(200,200,200, 0.2);
  border-left: 0.3em solid #A6ACAF;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
    `;

export default class BgImageChacheProgress extends PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            source: props.source,
        };

    }
     unicodeToChar(text) {
        if (text) {
            return text.replace(/\\u[\dA-F]{4}/gi, function (match) {
                return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
            });
        } else return 'مشکلی پیش آمده! با پشتیبانی تماس بگیرید.';
    }
    async downloadImage(imageName){
        if(this.state.fetched)
            return
        this.setState({loadingImage:true})
        await getImageBase64Query(imageName)
            .then(result => {
                console.log(result);
                this.setState({loadingImage: false, source: result,fetched:true});
            })
            .catch(e =>{
                this.setState({loadingImage: false,fetched:true});
            } )

    }
    setImag=()=>{

        let source=this.props.source;
        if(!source){
            this.setState({source:undefined});
            return;
        }
        if(this.props.source==this.state.source){

           // return;
        }
        if(typeof(source)==='string'){
            this.setState({source:source})
        } else if(source.imageName){
            setTimeout(()=>{
                this.downloadImage(source.imageName)
            },200)
        }

    }

    componentDidMount() {
      

    }

    render(){
        if(this.state.loadingImage){
            return <Spiner/>
        }
        //this.setImag();

        return (
            <ImageBackground   {...this.props} resizeMode={this.props.resizeMode} 
             //source={this.state.source}
            />
        )
    }

}

const styles = {
    main: {

    },
}






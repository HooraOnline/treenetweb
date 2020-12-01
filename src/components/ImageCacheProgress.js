import ImageLoader from "react-loading-image/lib";
import CircularProgress from '@material-ui/core/CircularProgress';
import {getImageBase64Query} from "../network/Queries";
import {PureComponent} from "react";
import {fa} from "../language/fa";
import {Image, View} from "../react-native";
import images from "../../public/static/assets/images";
import styled from "styled-components";
let Spiner = styled.div`
 border-radius: 50%;
  width: 7em;
  height: 7em;
  margin: 60px auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: 1.1em solid rgba(227,38,38, 0.2);
  border-right: 1.1em solid rgba(227,38,38, 0.2);
  border-bottom: 1.1em solid rgba(227,38,38, 0.2);
  border-left: 1.1em solid #e32626;
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
export default class ImageCacheProgress extends PureComponent{
    constructor(props) {
        super();
        this.state = {

            loading:false,
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
        if(this.isDownload){
            return;
        }
        this.isDownload=true;
        this.setImag({loading:true})
        await getImageBase64Query(imageName)
            .then(result => {

                this.setState({loading: false, imageData: result});
            })
            .catch(e =>{
                this.setState({loading: false});
            } );
    }
    setImag=()=>{
        if(this.state.imageData){

            return;
        }
        let source=this.props.source;
        if(source && source.uri){
            this.downloadImage(source.uri);
        }
    }

    componentDidMount() {
        //this.setImag();
    }

    render(){


        if(this.state.loading){
            return (
                <View style={{flex:1,alignItems:'center'}}>
                    <Spiner/>
                </View>
            )
        }
        if(!this.props.source){
            return (<Image style={this.props.style} source={this.props.defaltImage || images.default_ProPic}/>)
        }
        this.setImag();

        return (
            <img
                {...this.props}
                src={this.state.imageData}
            />
           /* <ImageLoader
                {...this.props}
                src={this.state.imageData}
                loading={() => <CircularProgress/>}
                error={() => <Image style={this.props.style} source={this.props.defaltImage || images.default_ProPic}/>}

            />*/
        )
    }

}

const styles = {
    main: {

    },
}



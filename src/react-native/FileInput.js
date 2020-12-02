import {Image, TouchableOpacity} from "./index";
import images from "../../public/static/assets/images";
import React, {PureComponent} from "react";

import View from "./View";

export default class FileInput extends PureComponent{

    onSelectFile=(event)=> {
     
        const files = event.target.files
        const formData = new FormData()
        formData.append('userFile', files[0]);
        var reader = new FileReader();
        let self = this;
        console.log(event.target.files);
        reader.onload = function (e) {
            self.props.onSelectFile && self.props.onSelectFile(files,formData,files[0],URL.createObjectURL(files[0]),e.target.result);
          
            event.value = ''
        }
        reader.readAsDataURL(files[0]);


    }
     componentDidMount(){

         this.props.ref && this.props.ref(this);
     }
    

     openSelector(){
        this.refs.fileUploader.click()
     }
    render() {

       return (
           <TouchableOpacity {...this.props}  onPress={(event)=> {

               this.refs.fileUploader.click()
           }}>
               {
                   this.props.children ||<Image
                       source={images.ic_gallery}
                       style={{
                           //tintColor: textItem,
                           width: 24,
                           height: 24,
                           marginH: 8,
                       }}
                   />
               }
               <input accept={this.props.accept} type="file" id="file" ref="fileUploader"  onChange={this.onSelectFile}  style={{display: "none"}}/>
           </TouchableOpacity>
       );
   }

}

